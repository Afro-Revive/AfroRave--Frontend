import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import type { EventDetailData } from '@/types'
import { Globe, Link2, Lock } from 'lucide-react'
import { RiShareCircleFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { copyToClipboard, formatEventDate, toVisibility } from '@/lib/helper-func'

/**
 * Summary of the event currently being worked on, pinned above the sidebar
 * groups. Renders nothing until an event has been opened, so the sidebar keeps
 * its usual shape on the dashboard itself.
 */
export function SelectedEventCard({ eventId }: { eventId?: string }) {
  const { data: response } = useGetEvent(eventId ?? '')

  const event = response?.data as EventDetailData | undefined

  if (!eventId || !event) return null

  const isPrivate = toVisibility(event.accessType) === 'private'
  const VisibilityIcon = isPrivate ? Lock : Globe

  const eventPath = getRoutePath('individual_event', {
    eventId: event.customUrl,
  })

  return (
    // Inset from the sidebar edge, with mb-6 separating it from the EVENTS group.
    <div className='mx-3 mt-2 mb-6 pt-6 flex flex-col gap-3 rounded-lg bg-[#ACACAC] p-4'>
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
          onClick={() => copyToClipboard(`${window.location.origin}${eventPath}`)}
          className='h-9 flex-1 min-w-0 gap-1.5 rounded-lg bg-[#464444] px-3 font-inter-tight text-xs text-white hover:bg-[#232323]/90'>
          <Link2 className='size-3.5 shrink-0' />
          copy link
        </Button>

        <Button
          asChild
          className='h-9 flex-1 min-w-0 gap-1.5 rounded-lg bg-tech-blue px-3 font-inter-tight text-xs text-white hover:bg-tech-blue/90'>
          <Link to={eventPath} target='_blank' rel='noopener noreferrer'>
            <RiShareCircleFill className='size-3.5 shrink-0' />
            view page
          </Link>
        </Button>
      </div>
    </div>
  )
}
