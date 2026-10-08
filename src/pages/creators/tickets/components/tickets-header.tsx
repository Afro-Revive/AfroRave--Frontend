import { cn } from '@/lib/utils'
import { TICKET_FILTERS, type TicketFilter } from '../constant'

/** The page's opening banner: title, blurb and the filter pills. */
export function TicketsHeader({
  filter,
  onFilterChange,
}: {
  filter: TicketFilter
  onFilterChange: (filter: TicketFilter) => void
}) {
  return (
    // This banner is the top of the page, so it carries the same horizontal
    // padding the body below uses and the two line up.
    <div className='w-full bg-white flex flex-col gap-4 px-5 md:px-14 py-6'>
      <div className='flex flex-col gap-1'>
        <p className='font-work-sans text-2xl font-bold text-black'>Your Tickets</p>
        <p className='font-work-sans text-sm text-mid-dark-gray'>
          Create and manage the tickets available for this event.
        </p>
      </div>

      <div className='flex items-center gap-2 flex-wrap'>
        {TICKET_FILTERS.map(({ value, label }) => {
          const isActive = filter === value

          return (
            <button
              key={value}
              type='button'
              onClick={() => onFilterChange(value)}
              className={cn(
                'rounded-full border px-4 py-1.5 font-work-sans text-sm transition-colors',
                isActive
                  ? 'border-deep-red text-deep-red'
                  : 'border-black/20 text-black hover:border-black/40',
              )}>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
