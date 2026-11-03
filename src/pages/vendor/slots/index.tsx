import { getRoutePath } from '@/config/get-route-path'
import { useGetVendorApplications } from '@/hooks/use-event-mutations'
import { useToggleVendorSavedEvent, useVendorEventsById, useVendorSavedEvents } from '@/hooks/use-vendor'
import { cn } from '@/lib/utils'
import type { PaginatedResponse } from '@/types'
import type { VendorApplications } from '@/types/vendor'
import { useMemo, useState } from 'react'
import { RiTimeLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { SlotStatusPill } from '../component/slot-status-pill'
import { VendorCardGrid, VendorEventCard, VendorEventCardSkeleton } from '../component/vendor-event-card'
import { VendorEmptyState } from '../component/vendor-empty-state'
import { VendorPageHeader } from '../component/vendor-page-header'
import { formatVendorDate } from '../lib/format-date'
import { getSlotStatus, hasEventEnded, needsPayment } from './slot-status'

const SKELETON_COUNT = 4

type SlotFilter = 'all' | 'approved' | 'ended'

export default function VendorSlotsPage() {
  const [filter, setFilter] = useState<SlotFilter>('all')
  const { data, isPending: isLoadingApplications } = useGetVendorApplications()
  const { data: savedEvents = [] } = useVendorSavedEvents()
  const toggleSave = useToggleVendorSavedEvent()

  const applications = useMemo(() => {
    const items = (data?.data as PaginatedResponse<VendorApplications> | undefined)?.items ?? []
    return [...items].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
  }, [data])

  const { eventsById, isPending: isLoadingEvents } = useVendorEventsById(applications.map((app) => app.eventId))
  const savedIds = new Set(savedEvents.map((event) => event.eventId))

  const rows = applications.map((application) => {
    const event = eventsById.get(application.eventId)
    return { application, event, status: getSlotStatus(application, event), ended: hasEventEnded(application, event) }
  })

  const approvedRows = rows.filter((row) => row.status === 'approved' || row.status === 'secured')
  const endedRows = rows.filter((row) => row.ended)
  const visibleRows = filter === 'approved' ? approvedRows : filter === 'ended' ? endedRows : rows
  const paymentCount = rows.filter((row) => needsPayment(row.application, row.event)).length

  const isLoading = isLoadingApplications || (applications.length > 0 && isLoadingEvents)

  return (
    <section className='flex w-full flex-col'>
      <VendorPageHeader
        title='MY SLOTS'
        subtitle='Track every slot you’ve requested.'
        aside={
          paymentCount > 0 && (
            <span className='inline-flex items-center gap-1.5 rounded-md bg-[#5C3A00] px-2.5 py-1 font-sf-pro-text text-xs text-orange-peel'>
              <RiTimeLine className='size-3.5' />
              {paymentCount} {paymentCount === 1 ? 'slot needs' : 'slots need'} payment
            </span>
          )
        }
      />

      {isLoading ? (
        <div className='px-4 py-6 md:px-7'>
          <VendorCardGrid>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <VendorEventCardSkeleton key={index} />
            ))}
          </VendorCardGrid>
        </div>
      ) : rows.length === 0 ? (
        <VendorEmptyState
          className='py-32'
          title='No Slots Yet'
          description='Browse upcoming events, request a slot and manage every booking from one place.'
          action={
            <Link
              to={getRoutePath('vendor_discover')}
              className='inline-flex h-9 items-center rounded-md bg-light-red px-2 font-sf-pro-text text-sm font-medium text-white transition-colors hover:bg-light-red/85'>
              Discover Events
            </Link>
          }
        />
      ) : (
        <div className='flex flex-col gap-6 px-4 py-6 md:px-7'>
          <div className='flex flex-wrap gap-2'>
            <FilterChip label='All' count={rows.length} active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterChip
              label='Approved'
              count={approvedRows.length}
              active={filter === 'approved'}
              onClick={() => setFilter('approved')}
            />
            <FilterChip label='Ended' count={endedRows.length} active={filter === 'ended'} onClick={() => setFilter('ended')} />
          </div>

          {visibleRows.length > 0 ? (
            <VendorCardGrid>
              {visibleRows.map(({ application, event, status, ended }) => {
                const isSaved = savedIds.has(application.eventId)
                return (
                  <VendorEventCard
                    key={application.id}
                    to={getRoutePath('vendor_slot_details', { applicationId: application.id })}
                    image={event?.eventDetails?.desktopMedia?.flyer}
                    name={application.eventName}
                    date={formatVendorDate(event?.eventDate?.startDate ?? application.eventStartDate)}
                    venue={application.eventVenue}
                    isEnded={ended}
                    isSaved={isSaved}
                    onToggleSave={() => toggleSave.mutate({ eventId: application.eventId, isSaved })}
                    footer={<SlotStatusPill status={status} />}
                  />
                )
              })}
            </VendorCardGrid>
          ) : (
            <VendorEmptyState title={filter === 'approved' ? 'No Approved Slots' : 'No Ended Slots'} />
          )}
        </div>
      )}
    </section>
  )
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type='button'
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'h-[27px] rounded-full border border-white px-3 font-sf-pro-text text-xs transition-colors',
        active ? 'bg-white text-black' : 'text-white hover:bg-white/10',
      )}>
      {label} {count}
    </button>
  )
}
