import { Info, Lock } from 'lucide-react'
import { INVITE_ONLY_NOTES, PRIVATE_EVENT_NOTES, type TicketFilter } from '../constant'

/**
 * Context for the current view. Invite-only always explains itself, since the
 * rules aren't obvious from the ticket list. A public event on 'all' has
 * nothing worth saying, so nothing renders.
 */
export function TicketNotice({
  filter,
  isPrivateEvent,
}: {
  filter: TicketFilter
  isPrivateEvent: boolean
}) {
  if (filter === 'invite_only') {
    return (
      <NoticeCard icon={Info} title='How invite only tickets works' notes={INVITE_ONLY_NOTES} />
    )
  }

  if (filter === 'all' && isPrivateEvent) {
    return <NoticeCard icon={Lock} title='This is a private event' notes={PRIVATE_EVENT_NOTES} />
  }

  return null
}

export function NoticeCard({
  icon: Icon,
  title,
  notes,
}: {
  icon: typeof Lock
  title: string
  notes: string[]
}) {
  return (
    <div className='w-full flex flex-col gap-1.5 rounded-xl bg-deep-red/12 px-5 py-4'>
      <p className='flex items-center gap-2 font-inter-tight text-sm font-bold text-deep-red'>
        <Icon className='size-4 shrink-0' />
        {title}
      </p>

      {notes.map((note) => (
        <p key={note} className='font-inter-tight text-sm text-black'>
          {note}
        </p>
      ))}
    </div>
  )
}
