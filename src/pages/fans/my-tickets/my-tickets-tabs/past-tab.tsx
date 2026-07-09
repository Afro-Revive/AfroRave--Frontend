import { EmptyState } from '../components/empty-state'
import { getRoutePath } from '@/config/get-route-path'
import { Tickets } from '../components/tickets'
import { LoadingFallback } from '@/components/loading-fallback'
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
    <div className='flex flex-wrap items-center justify-center gap-7 px-5 md:px-[50px] lg:px-[100px] mb-[100px]'>
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
