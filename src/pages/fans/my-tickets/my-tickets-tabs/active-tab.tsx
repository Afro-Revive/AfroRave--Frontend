import { getRoutePath } from '@/config/get-route-path'
import { EmptyState } from '../components/empty-state'
import { Tickets } from '../components/tickets'
import type { UserTicketData } from '@/types'
import { LoadingFallback } from '@/components/loading-fallback'
import { totalTicketsPurchased } from '@/lib/helper-func'

export default function ActiveTicketsTab({
  data,
  isLoading = false,
}: { data: UserTicketData[]; isLoading?: boolean }) {
  const isEmpty = data.length === 0

  if (isLoading) {
    return <LoadingFallback className='mb-[160px] h-[250px]' />
  }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      {isEmpty ? (
        <EmptyState type='active' btn_name='Discover Events' path={getRoutePath('events')} />
      ) : (
        <ActiveTickets data={data} />
      )}
    </div>
  )
}

function ActiveTickets({ data }: { data: UserTicketData[] }) {
  return (
    <div className='w-full min-w-0 flex gap-7 mb-[100px] max-md:overflow-x-auto max-md:scrollbar-none md:flex-wrap'>
      {data.map((item) => (
        <Tickets
          key={item.eventId}
          id={item.eventId}
          event_name={item.eventName}
          image={item.desktopMedia?.flyer}
          event_date={item.eventStartDate}
          event_location={item.eventVenue}
          ticketQuantity={totalTicketsPurchased(item.ticketDetails)}
        />
      ))}
    </div>
  )
}
