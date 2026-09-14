import { Link } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'
import { RenderEventImage } from '@/components/shared/render-event-flyer'
import { formatEventDate } from '@/lib/helper-func'
import { cn } from '@/lib/utils'

export function Tickets({ id, image, event_name, ticketQuantity, event_date, event_location, disabled = false }: ITickets) {
  const card_class = cn(
    // max-md:shrink-0 so cards keep their width in the mobile scroller
    // instead of being squeezed to fit one row.
    'relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 aspect-[5/7] w-55 md:w-60 lg:w-62.25 max-md:shrink-0',
    // Without `group` the hover states below have nothing to key off
    disabled ? 'opacity-50' : 'group'
  )

  const card_content = (
    <>
      <RenderEventImage
        image={image}
        event_name={event_name}
        className='absolute inset-0 w-full! h-full! md:h-full! object-cover transition-transform duration-500 group-hover:scale-105'
      />

      <div className='absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent' />

      <div className='absolute inset-x-0 bottom-[5%] flex flex-col gap-1.5 p-4'>
        <p className='font-inter-tight text-base md:text-xl uppercase font-black text-white leading-tight'>
          {event_name}
        </p>

        <p className='font-inter-tight text-sm md:text-base text-white leading-snug'>
          {formatEventDate(event_date)}
          { event_location ? ` at ${event_location }.` : ''}
        </p>
        <span className=' w-fit items-center gap-6 rounded-2xl bg-white px-4 py-2 text-xs font-inter-tight uppercase tracking-wide text-black transition-colors'>
          {ticketQuantity} Tickets
        </span>
      </div>
    </>
  )

  if (disabled) {
    return (
      <div className={card_class} aria-disabled='true'>
        {card_content}
      </div>
    )
  }

  return (
    <Link to={getRoutePath('active_tickets', { eventId: id })} className={card_class}>
      {card_content}
    </Link>
  )
}

interface ITickets {
  id: string
  event_name: string
  event_date: string
  event_location: string
  image: string
  ticketQuantity: number
  /** Renders a non-navigable, dimmed card — used for events that have passed. */
  disabled?: boolean
}
