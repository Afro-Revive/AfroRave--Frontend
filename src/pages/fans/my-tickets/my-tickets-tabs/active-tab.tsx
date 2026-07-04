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

  if (isLoading) {
    return <LoadingFallback className='mb-[160px] h-[250px]' />
  }

  return (
    <>
      {isEmpty ? (
        <EmptyState type='active' btn_name='Discover Events' path={getRoutePath('events')} />
      ) : (
        <ActiveTickets data={data} />
      )}
    </>
  )
}

function ActiveTickets({ data }: { data: UserTicketData[] }) {
  return (
    <div className='flex flex-wrap overflow-y-auto items-center justify-center gap-7 px-5 md:px-[50px] lg:px-[100px] mb-[100px]'>
      {data.map((item) => (
        <Tickets
          key={item.eventId}
          id={item.eventId}
          event_name={item.eventName}
          image={item.desktopMedia?.flyer}
          quantity={item.quantity}
        />
      ))}
    </div>
  )
}
