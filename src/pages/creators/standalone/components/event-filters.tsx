import { cn } from '@/lib/utils'
import type { EventData } from '@/types'

/**
 * The statuses the list payload can actually prove. EventData carries no ticket
 * stats, so `sold_out` isn't derivable here the way it is from the per-event
 * detail fetch — which is fine, the filters don't offer it.
 */
export type ListEventStatus = 'drafts' | 'upcoming' | 'ongoing' | 'ended'
export type EventListFilter = 'all' | ListEventStatus

export const EVENT_LIST_FILTERS: { value: EventListFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'ended', label: 'Ended' },
]

export function getListEventStatus(event: EventData): ListEventStatus {
  if (!event.isPublished) return 'drafts'

  const now = new Date()
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)

  if (!isNaN(end.getTime()) && now > end) return 'ended'
  if (!isNaN(start.getTime()) && now >= start && (isNaN(end.getTime()) || now <= end)) {
    return 'ongoing'
  }

  return 'upcoming'
}

export type EventFilterCounts = Record<EventListFilter, number>

export function countEventsByStatus(events: EventData[]): EventFilterCounts {
  const counts: EventFilterCounts = {
    all: events.length,
    drafts: 0,
    upcoming: 0,
    ongoing: 0,
    ended: 0,
  }

  for (const event of events) {
    counts[getListEventStatus(event)] += 1
  }

  return counts
}

export function EventFilters({
  counts,
  activeFilter,
  onFilterChange,
}: {
  counts: EventFilterCounts
  activeFilter: EventListFilter
  onFilterChange: (filter: EventListFilter) => void
}) {
  return (
    <div className='w-fit max-w-full flex flex-col gap-3 rounded-[10px] bg-white px-4 py-3 shadow-sm'>
      <p className='font-inter-tight text-sm text-system-black'>
        All in one hub for creators. Manage your events
      </p>

      <div className='flex flex-wrap items-center gap-2'>
        {EVENT_LIST_FILTERS.map(({ value, label }) => {
          const isActive = value === activeFilter
          const count = counts[value]

          return (
            <button
              key={value}
              type='button'
              aria-pressed={isActive}
              onClick={() => onFilterChange(value)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 font-inter-tight text-sm transition-colors',
                isActive
                  ? 'border-deep-red text-deep-red'
                  : 'border-black/15 text-black/60 hover:border-black/40 hover:text-black',
              )}>
              {label}
              {count > 0 && <span className=''>{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
