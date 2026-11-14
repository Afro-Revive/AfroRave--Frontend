import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import type { EventDetailData } from '@/types'
import { Globe, Link2, Lock } from 'lucide-react'
import { RiShareCircleFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { formatEventDate, toVisibility } from '@/lib/helper-func'
import { useCopyEventLink } from '@/hooks/use-copy-event-link'

/**
 * Summary of the event currently being worked on, pinned above the sidebar
 * groups. Renders nothing until an event has been opened, so the sidebar keeps
 * its usual shape on the dashboard itself.
 */
export function SelectedEventCard({ eventId }: { eventId?: string }) {
  const { data: response } = useGetEvent(eventId ?? '')

  const event = response?.data as EventDetailData | undefined
  const { copied, copy } = useCopyEventLink(event?.customUrl)

  if (!eventId || !event) return null

  const isPrivate = toVisibility(event.accessType) === 'private'
  const VisibilityIcon = isPrivate ? Lock : Globe

  const eventPath = getRoutePath('individual_event', {
    eventId: event.customUrl,
  })

  return (
    // Inset from the sidebar edge, with mb-6 separating it from the EVENTS group.
    // #595959 so the white text reads (about 7:1; it was 2.3:1 on #ACACAC).
    <div className='mx-3 mt-2 mb-6 pt-6 flex flex-col gap-3 rounded-lg bg-[#595959] p-4'>
      <div className='flex flex-col gap-1'>
        <p className='font-inter-tight text-sm font-black uppercase text-white leading-snug'>
          {event.eventName}
        </p>

        <p className='font-inter-tight text-xs text-white leading-snug'>
          {formatEventDate(event.eventDate?.startDate)}
          {event.venue ? ` at ${event.venue}.` : ''}
        </p>
      </div>

      <span className='w-fit flex items-center gap-1.5 rounded-full bg-soft-gray/80 px-2.5 py-1 font-inter-tight text-xs font-bold text-white'>
        <VisibilityIcon className='size-3' />
        {isPrivate ? 'Private' : 'Public'}
      </span>

      {/* flex-1 rather than w-1/2: two halves plus the gap overflow the row. */}
      <div className='flex w-full items-center gap-2'>
        <Button
          type='button'
          onClick={copy}
          className='h-9 flex-1 min-w-0 gap-1.5 rounded-lg bg-[#232323] px-3 font-inter-tight text-xs text-white hover:bg-black'>
          <Link2 className='size-3.5 shrink-0' />
          Copy Link
        </Button>

        <Button
          asChild
          className='h-9 flex-1 min-w-0 gap-1.5 rounded-lg bg-tech-blue px-3 font-inter-tight text-xs text-white hover:bg-tech-blue/90'>
          <Link to={eventPath} target='_blank' rel='noopener noreferrer'>
            <RiShareCircleFill className='size-3.5 shrink-0' />
            View Page
          </Link>
        </Button>
      </div>

      {copied && (
        <p
          role='status'
          className='w-fit rounded-full bg-green px-2.5 py-1 font-inter-tight text-xs font-semibold text-white'>
          Link copied
        </p>
      )}
    </div>
  )
}
