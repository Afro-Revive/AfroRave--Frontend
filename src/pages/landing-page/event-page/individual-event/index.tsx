import { LoadingFallback } from '@/components/loading-fallback'
import { SEO } from '@/components/seo'
import { Button } from '@/components/ui/button'
import { useGetEventByCustomUrl } from '@/hooks/use-event-mutations'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EventDetails from './event-details'

export default function IndividualEventPage() {
  const { eventId } = useParams()

  const { data: eventResponse, isPending: isLoading } = useGetEventByCustomUrl(eventId || '')
  console.log(eventResponse, isLoading)

  const event = eventResponse?.data

  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!event) {
    return (
      <div className='flex flex-col items-center gap-2.5 justify-center w-full h-screen'>
        <p className='text-3xl font-semibold'>No Events Found</p>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${event.eventName} - Afro Revive`}
        description={`Buy tickets for ${event.eventName} - Afro Revive`}
      />
      <EventDetails event={event} layout={event.eventDetails?.theme?.themeName} />
    </>
  )
}
