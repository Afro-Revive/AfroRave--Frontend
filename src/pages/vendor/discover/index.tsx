import { getRoutePath } from '@/config/get-route-path'
import { useGetVendorAvailableEvents } from '@/hooks/use-event-mutations'
import { useToggleVendorSavedEvent, useVendorSavedEvents } from '@/hooks/use-vendor'
import { cn } from '@/lib/utils'
import type { PaginatedResponse, VendorAvailableEventData } from '@/types'
import { useMemo, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import {
  SlotsCountPill,
  VendorCardGrid,
  VendorEventCard,
  VendorEventCardSkeleton,
} from '../component/vendor-event-card'
import { VendorEmptyState } from '../component/vendor-empty-state'
import { formatVendorDate } from '../lib/format-date'

const SKELETON_COUNT = 8

/** What a Discover card needs, from either the available events or the saved events list. */
interface DiscoverEvent {
  eventId: string
  name: string
  image?: string
  startDate: string
  endDate: string
  venue: string
  availableSlots?: number
}

export default function VendorDiscoverPage() {
  const [search, setSearch] = useState('')
  const [showSaved, setShowSaved] = useState(false)

  const { data: response, isPending: isLoadingAvailable } = useGetVendorAvailableEvents()
  console.log('response', response, isLoadingAvailable)
  const { data: savedEvents = [], isPending: isLoadingSaved } = useVendorSavedEvents()
  const toggleSave = useToggleVendorSavedEvent()

  const availableEvents = useMemo<DiscoverEvent[]>(() => {
    const items = (response?.data as PaginatedResponse<VendorAvailableEventData> | undefined)?.items ?? []
    return items.map((event) => ({
      eventId: event.eventId,
      name: event.eventName,
      image: event.metadata?.desktopMedia?.flyer,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      availableSlots: event.availableSlot,
    }))
  }, [response])

  const savedIds = useMemo(() => new Set(savedEvents.map((event) => event.eventId)), [savedEvents])

  const events = useMemo<DiscoverEvent[]>(() => {
    const source = showSaved
      ? savedEvents.map((event) => ({
          eventId: event.eventId,
          name: event.eventName,
          image: event.posterUrl,
          startDate: event.startDate,
          endDate: event.endDate,
          venue: event.venue,
          availableSlots: availableEvents.find((available) => available.eventId === event.eventId)?.availableSlots,
        }))
      : availableEvents
    const query = search.trim().toLowerCase()
    return query ? source.filter((event) => event.name.toLowerCase().includes(query)) : source
  }, [showSaved, savedEvents, availableEvents, search])

  const isLoading = showSaved ? isLoadingSaved : isLoadingAvailable

  return (
    <section className='flex w-full flex-col gap-7 px-4 py-5 md:px-7'>
      <div className='flex items-center gap-3 rounded-full bg-[#1F1F1F] p-3 md:gap-4 md:p-[18px]'>
        <label className='flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#3D3D3D] px-4'>
          <RiSearchLine className='size-4 shrink-0 text-white' />
          <span className='sr-only'>Search event name</span>
          <input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search event name'
            className='h-full w-full min-w-0 bg-transparent font-sf-pro-text text-sm text-white outline-none placeholder:text-xs placeholder:text-[#9A9A9A]'
          />
        </label>

        <button
          type='button'
          aria-pressed={showSaved}
          onClick={() => setShowSaved((prev) => !prev)}
          className={cn(
            'h-9 shrink-0 rounded-full border border-white px-4 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors md:px-[18px]',
            showSaved ? 'bg-white text-black' : 'text-white hover:bg-white/10',
          )}>
          Saved Events
        </button>
      </div>

      {isLoading ? (
        <VendorCardGrid>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <VendorEventCardSkeleton key={index} />
          ))}
        </VendorCardGrid>
      ) : events.length > 0 ? (
        <VendorCardGrid>
          {events.map((event) => {
            const isSaved = savedIds.has(event.eventId)
            return (
              <VendorEventCard
                key={event.eventId}
                to={getRoutePath('vendor_event_details', { eventId: event.eventId })}
                image={event.image}
                name={event.name}
                date={formatVendorDate(event.startDate)}
                venue={event.venue}
                isEnded={!!event.endDate && new Date(event.endDate) < new Date()}
                isSaved={isSaved}
                onToggleSave={() => toggleSave.mutate({ eventId: event.eventId, isSaved })}
                footer={event.availableSlots !== undefined && <SlotsCountPill available={event.availableSlots} />}
              />
            )
          })}
        </VendorCardGrid>
      ) : (
        <VendorEmptyState
          className='py-32'
          title={search ? 'No Events Found' : showSaved ? 'No Saved Events' : 'No Slots Available'}
          description={
            search
              ? `Nothing matches “${search.trim()}”.`
              : showSaved
                ? 'Tap the bookmark on an event to save it for later.'
                : undefined
          }
        />
      )}
    </section>
  )
}
