import { RiQuestionLine } from 'react-icons/ri'
import { Button } from '@/components/ui/button'

/**
 * Signed in, but not as the address an invite went to. Used by invite-only
 * tickets and crew invites, which only the invited email can accept.
 */
export function EmailMismatch({
  message,
  invitedEmail,
  signedInEmail,
  isLoggingOut,
  onStaySignedIn,
  onLogOut,
}: {
  /** What only the invited email can do, and what to do about it. */
  message: string
  invitedEmail: string
  signedInEmail: string
  isLoggingOut: boolean
  onStaySignedIn: () => void
  onLogOut: () => void
}) {
  return (
    <section className='mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-24 font-inter-tight'>
      <div className='flex flex-col gap-3 rounded-2xl bg-white p-5'>
        <h1 className='flex items-center gap-2 text-2xl font-bold text-black'>
          <RiQuestionLine className='size-6 shrink-0 text-deep-red' aria-hidden />
          Email Mismatch
        </h1>

        <p className='text-sm text-black'>{message}</p>

        <dl className='mt-2 flex flex-col rounded-xl bg-[#4A4747] text-sm'>
          <div className='flex flex-col gap-1 px-3 py-3'>
            <dt className='text-white/60'>Invite Sent To</dt>
            <dd className='break-all text-white'>{invitedEmail}</dd>
          </div>
          <div className='flex flex-col gap-1 border-t border-white/10 px-3 py-3'>
            <dt className='text-white/60'>You're signed in as</dt>
            <dd className='break-all text-red-400'>{signedInEmail}</dd>
          </div>
        </dl>
      </div>

      <div className='flex gap-3'>
        <Button
          type='button'
          onClick={onStaySignedIn}
          className='h-11 flex-1 rounded-full font-inter-tight border border-white/20 bg-system-black text-white hover:bg-black'>
          Stay signed in
        </Button>
        <Button
          type='button'
          onClick={onLogOut}
          disabled={isLoggingOut}
          className='h-11 flex-1 rounded-full font-inter-tight bg-deep-red text-white hover:bg-deep-red/90'>
          {isLoggingOut ? 'Logging out...' : 'Log out and continue'}
        </Button>
      </div>
    </section>
  )
}
