import { getRoutePath } from '@/config/get-route-path'
import { EmptyState } from '../components/empty-state'
import { Tickets } from '../components/tickets'
import type { UserTicketData } from '@/types'
import { LoadingFallback } from '@/components/loading-fallback'

export default function ActiveTicketsTab({
  data,
  isLoading = false,
}: { data: UserTicketData[]; isLoading?: boolean }) {
  const isEmpty = data.length === 0
  console.log('ActiveTicketsTab data:', data)

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
    <div className='grid w-full h-screen grid-cols-2 md:grid-cols-4 lg:grid-cols-6 '>
      {data.map((item) => (
        <Tickets
          key={item.eventId}
          id={item.eventId}
          event_name={item.eventName}
          image={item.desktopMedia?.flyer}
          quantity={item.purchaseHistory?.length || 0}
          ticketName={item.ticketName}
        />
      ))}
    </div>
  )
}
