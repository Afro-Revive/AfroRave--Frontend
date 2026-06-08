import { LoadingFallback } from '@/components/loading-fallback'
import { BasePopover } from '@/components/reusable'
import { DashboardCardSkeleton, DashboardCards } from '@/components/shared/dashboard-cards'
import VendorSelect from '@/components/shared/vendor-select'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent, useGetOrganizerEvents } from '@/hooks/use-event-mutations'
import { formatNaira } from '@/lib/format-price'
import type { EventDetailData } from '@/types'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { AddFilterBUtton, type EventFilter } from './components/add-filter-btn'
import StandAloneModal from './components/standalone-modal'
import { useGuideStore, useEventSelectorStore } from '@/stores'

function formatEventDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const day = date.getDate()
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th'
  return date.toLocaleDateString('en-GB', { weekday: 'short' }) + ', ' + day + suffix + ' ' + date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function StandalonePage() {
  const { data: response, isPending: isLoading } = useGetOrganizerEvents()
  const [activeFilter, setActiveFilter] = useState<EventFilter>('all')
  const { startGuide } = useGuideStore()
  const { selectedEventId } = useEventSelectorStore()

  const allEvents = response?.data
  // If a specific event is selected in the dropdown, show only that one; otherwise show all
  const events = selectedEventId
    ? allEvents?.filter((e) => e.eventId === selectedEventId)
    : allEvents

  if (isLoading) {
    return <LoadingFallback />
  }

  return (
    <section className='w-full h-full flex flex-col items-start mb-[75px]'>
      <StandAloneHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className='w-full px-16 lg:px-20 pt-14'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-[1040px]'>
          {events && events.length > 0 ? (
            <>
              {events.map((item) => (
                <StandAloneEvents key={item.eventId} id={item.eventId} activeFilter={activeFilter} />
              ))}
            </>
          ) : (
            <EmptyState onStartGuide={startGuide} />
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyState({ onStartGuide }: { onStartGuide: () => void }) {
  return (
    <div className='col-span-full w-full py-20 flex flex-col items-center gap-4'>
      <p className='text-2xl font-bold text-charcoal font-sf-pro-display'>No events yet</p>
      <p className='text-sm text-gray-400 max-w-xs font-sf-pro-text leading-relaxed text-center'>
        Tap the + to start a quick tutorial on creating your first event.
      </p>
      <button
        onClick={onStartGuide}
        className='w-16 h-16 rounded-full bg-deep-red/10 flex items-center justify-center mt-2 hover:bg-deep-red/20 transition-colors'>
        <Plus color='#8B0000' size={28} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function StandAloneHeader({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: EventFilter
  onFilterChange: (filter: EventFilter) => void
}) {
  return (
    <div className='w-full flex items-center justify-between bg-white h-14 px-5 lg:px-8 border-l border-light-gray'>
      <AddFilterBUtton activeFilter={activeFilter} onFilterChange={onFilterChange} />

      <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
        <VendorSelect className='!w-fit sm:!w-[155px] md:!w-fit' />

        <Button variant='destructive' className='h-9 px-3 rounded-[6px] gap-1.5' asChild>
          <Link to={getRoutePath('add_event')}>
            <Plus color='#ffffff' size={13} />
            <span className='font-sf-pro-text text-xs font-semibold'>Create</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

function getEventStatus(event: EventDetailData): 'drafts' | 'upcoming' | 'ongoing' | 'sold_out' | 'ended' {
  if (!event.isPublished) return 'drafts'

  const now = new Date()
  const startDate = new Date(event.eventDate.startDate)
  const endDate = new Date(event.eventDate.endDate)

  if (now > endDate) return 'ended'

  const { ticketSold, totalTicket } = event.eventStat
  if (totalTicket > 0 && ticketSold >= totalTicket) return 'sold_out'

  if (now >= startDate && now <= endDate) return 'ongoing'

  return 'upcoming'
}

function StandAloneEvents({ id, activeFilter }: { id: string; activeFilter: EventFilter }) {
  const { data: response, isPending: isLoading } = useGetEvent(id)

  const event = response?.data

  if (isLoading) {
    return <DashboardCardSkeleton />
  }

  if (!event) {
    return null
  }

  const status = getEventStatus(event)

  if (activeFilter !== 'all' && status !== activeFilter) {
    return null
  }

  return (
    <DashboardCards
      image={event.eventDetails.desktopMedia?.flyer}
      name={event.eventName}
      startDate={formatEventDate(event.eventDate.startDate)}
      status={status}
      cardInfo={[
        <StatParagraph
          key='sold_tickets'
          name='Sold'
          stats={{ value: event.eventStat.ticketSold, totalValue: event.eventStat.totalTicket }}
        />,
        <StatParagraph
          key='profit'
          name='Net Profit'
          stats={{ totalValue: formatNaira(event.eventStat.netProfit) }}
        />,
      ]}
      cardButtons={event_buttons}
      customButton={[
        <BasePopover
          key='popover_trigger'
          className='p-0 bg-transparent shadow-none border-none'
          trigger={
            <Button
              variant='ghost'
              className='flex items-center justify-center h-10 hover:bg-gray-50 rounded-none border-l border-gray-100'>
              <img
                src='/assets/dashboard/creator/ellipses.png'
                alt='Ellipses'
                width={14}
                height={12}
                className='opacity-50'
              />
            </Button>
          }
          content={<PopoverContent event={event} />}
        />,
      ]}
    />
  )
}

function PopoverContent({ event }: { event: EventDetailData }) {
  const eventLink = getRoutePath('individual_event', { eventId: event.eventId })

  return (
    <div className='w-[160px] flex flex-col bg-white rounded-[6px] shadow-lg border border-gray-100 overflow-hidden text-xs font-sf-pro-text'>
      {[
        { href: getRoutePath('edit_event', { eventId: event.eventId }), name: 'Edit Event' },
        { href: eventLink, name: 'View Event Page' },
      ].map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className='text-black/80 border-b border-gray-100 h-9 flex items-center px-3 hover:bg-gray-50 transition-colors'>
          {item.name}
        </Link>
      ))}

      <StandAloneModal event={event} />

      <Button
        onClick={() => copyToClipboard(eventLink)}
        variant='ghost'
        className='flex h-9 items-center bg-transparent rounded-none text-xs text-black/80 font-sf-pro-text px-3 justify-start hover:bg-gray-50 border-t border-gray-100'>
        Copy Link
      </Button>
    </div>
  )
}

function StatParagraph({ key, name, stats }: IStatParagraph) {
  return (
    <p key={key} className='font-sf-pro-text text-[10px] text-gray-400 whitespace-nowrap'>
      {name}:{' '}
      <span className='text-black font-semibold text-[10px]'>
        {typeof stats.value === 'number' ? `${stats.value} / ${stats.totalValue}` : stats.totalValue}
      </span>
    </p>
  )
}

function copyToClipboard(text: string) {
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const event_buttons: { src: string; alt: string }[] = [
  { src: '/assets/dashboard/creator/chart2.png', alt: 'Chart' },
  {
    src: '/assets/dashboard/creator/group-user.png',
    alt: 'Group User',
  },
]

interface IStatParagraph {
  key: string
  name: string
  stats: { value?: number; totalValue: number | string }
}
