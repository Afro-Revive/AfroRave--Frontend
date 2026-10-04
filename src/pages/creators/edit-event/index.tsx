import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EventDetailsTab from './tabs/event-details-tab'
import { LoadingFallback } from '@/components/loading-fallback'
import { EventDetailData} from '@/types'

export default function EditEventPage() {
  const { eventId } = useParams()

  const navigate = useNavigate()

  const { data: eventResponse, isPending: isLoading } = useGetEvent(eventId || '')

  const event = eventResponse?.data as EventDetailData | undefined

  // Event details is the only tab left here. Tickets lives on its own page, so
  // picking it in the selector — or saving, which used to advance to it — is a
  // navigation rather than a tab switch.
  const goToTab = (nextTab: string) => {
    if (nextTab === 'tickets') navigate(getRoutePath('tickets'))
  }

  if (!eventId) {
    return (
      <div className='w-full flex flex-col items-center justify-center gap-4 py-8'>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-black mb-2'>No Event Found</h2>
          <p className='text-gray-600 mb-4'>Please select an event to edit tickets.</p>
          <Button
            onClick={() => navigate(getRoutePath('standalone'))}
            className='bg-black text-white hover:bg-gray-800'>
            Go to Event Details
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!event) {
    return (
      <div className='w-full h-screen flex flex-col gap-5 items-center justify-center bg-white'>
        <p className='text-charcoal text-4xl font-semibold'>No Event Found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-white overflow-x-hidden'>
      <div className='w-full max-w-screen overflow-x-hidden bg-[#f8f8f8]'>
        <EventDetailsTab
          event={event}
          setActiveTab={goToTab}
          handleBackClick={() => navigate(getRoutePath('standalone'))}
        />
      </div>
    </div>
  )
}
