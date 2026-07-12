import { getRoutePath } from '@/config/get-route-path'
import { EmptyState } from '@/pages/fans/my-tickets/components/empty-state'
import { Tickets } from '@/pages/fans/my-tickets/components/tickets'
import { UserTicketData } from '@/types'

export default function ActiveListedTicketsTab({ data }: { data: UserTicketData[] }) {
  const isEmpty = data.length === 0

  return (
    <>
      {isEmpty ? (
        <EmptyState type='active' btn_name='Sell a Ticket' path={getRoutePath('resale')} />
      ) : (
        <ActiveTickets data={data} />
      )}
    </>
  )
}

function ActiveTickets({ data }: { data: UserTicketData[] }) {
  return (
    <div className='flex flex-wrap items-center gap-7 '>
      {data.map((item) => (
        <Tickets
          key={item.eventId}
          id={item.eventId}
          event_name={item.eventName}
          image={item.desktopMedia?.flyer}
          quantity={item.ticketDetails.reduce((sum, t) => sum + t.totalQuantity, 0)}
          ticketName={item.ticketDetails[0]?.ticketName ?? ''}
        />
      ))}
    </div>
  )
}
