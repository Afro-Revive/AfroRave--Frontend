import { getRoutePath } from '@/config/get-route-path'
import { events } from '@/data/events'
import { EmptyState } from '@/pages/fans/my-tickets/components/empty-state'
import { Tickets } from '@/pages/fans/my-tickets/components/tickets'

export default function ActiveListedTicketsTab() {
  const isEmpty = false

  return (
    <>
      {isEmpty ? (
        <EmptyState type='active' btn_name='Sell a Ticket' path={getRoutePath('resale')} />
      ) : (
        <ActiveTickets />
      )}
    </>
  )
}

function ActiveTickets() {
  return (
    <div className='flex flex-wrap items-center gap-7 '>
      {events.map(({ event_name, image, id }) => (
        <Tickets key={id} id='1' event_name={event_name} image={image} quantity={0} />
      ))}
    </div>
  )
}
