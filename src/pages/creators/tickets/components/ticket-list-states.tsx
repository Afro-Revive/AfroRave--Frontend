import { Button } from '@/components/ui/button'
import type { TicketFilter } from '../constant'

export function LoadingState() {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red mx-auto mb-2' />
        <p className='text-sm text-gray-600'>Loading tickets...</p>
      </div>
    </div>
  )
}

export function ErrorState({ onClick }: { onClick: () => void }) {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-sm text-red-600 mb-2'>Failed to load tickets. Please try again.</p>
        <Button variant='outline' size='sm' onClick={onClick} className='text-xs'>
          Try Again
        </Button>
      </div>
    </div>
  )
}

/** Only the filtered views use this — see the comment at its call site. */
export function NoMatchesState({ filter }: { filter: TicketFilter }) {
  const label = filter === 'invite_only' ? 'invite-only' : 'door'

  return (
    <div className='w-full py-12 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
      <p className='font-work-sans text-sm text-mid-dark-gray'>
        No {label} tickets for this event yet.
      </p>
    </div>
  )
}
