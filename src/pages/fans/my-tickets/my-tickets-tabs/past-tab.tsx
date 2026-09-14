import { EmptyState } from '../components/empty-state'
import { getRoutePath } from '@/config/get-route-path'
import { Tickets } from '../components/tickets'
import { LoadingFallback } from '@/components/loading-fallback'
import { totalTicketsPurchased } from '@/lib/helper-func'
import type { UserTicketData } from '@/types'

export default function PastTicketsTab({
  data,
  isLoading = false,
}: { data: UserTicketData[]; isLoading?: boolean }) {
  const isEmpty = data.length === 0

  if (isLoading) {
    return <LoadingFallback className='mb-[160px] h-[250px]' />
  }

  return (
    <>
      {isEmpty ? (
        <EmptyState type='past' btn_name='Discover Events' path={getRoutePath('events')} />
      ) : (
        <PastTickets data={data} />
      )}
    </>
  )
}

function PastTickets({ data }: { data: UserTicketData[] }) {
  return (
    <div className='w-full min-w-0 flex items-center gap-7 px-5 md:px-[50px] lg:px-[100px] mb-[100px] max-md:overflow-x-auto max-md:scrollbar-none md:flex-wrap md:justify-center'>
      {data.map((item) => (
        <Tickets
          key={item.eventId}
          id={item.eventId}
          event_name={item.eventName}
          image={item.desktopMedia?.flyer}
          event_date={item.eventStartDate}
          event_location={item.eventVenue}
          ticketQuantity={totalTicketsPurchased(item.ticketDetails)}
          disabled
        />
      ))}
    </div>
  )
}
