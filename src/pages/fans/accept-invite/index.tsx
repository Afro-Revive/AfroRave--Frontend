import { useCallback, useEffect, useRef, useState } from 'react'
import { FaApple, FaGooglePlay } from 'react-icons/fa6'
import { LuTicket } from 'react-icons/lu'
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiLoader4Line,
  RiQuestionLine,
} from 'react-icons/ri'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LoadingFallback } from '@/components/loading-fallback'
import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { useGetEvent } from '@/hooks/use-event-mutations'
import {
  useAcceptInviteTicket,
  useGetInviteTicketByToken,
  useVerifyInviteTicketPayment,
} from '@/hooks/use-invite-ticket-mutations'
import { useLogout } from '@/hooks/use-auth'
import { formatNaira } from '@/lib/format-price'
import { formatDateLong } from '@/lib/helper-func'
import { app_store_links } from '@/layouts/root-layout/footer'
import { useAfroStore } from '@/stores'
import type { EventDetailData } from '@/types'
import type { AcceptInviteTicketData, InviteTicketByTokenData } from '@/types/invite-tickets'
import type { AxiosError } from 'axios'

const LOGIN_NOTICE = 'Log In to claim ticket'
const SIGNUP_NOTICE = 'Only the invited email can accept this ticket, Sign up with the invited email.'

/**
 * The ticket is the guest's. A free invite is issued on accept; a paid one
 * only once paid, so Accepted counts only when it's free.
 */
function isClaimed(invite: InviteTicketByTokenData) {
  return invite.status === 'Issued' || (invite.status === 'Accepted' && invite.isFree)
}

const PAYMENT_PENDING_MESSAGE =
  'Payment required to issue your ticket. You have 5 days to complete checkout.'

const PAYMENT_CHECK_FAILED = 'We couldn’t confirm your payment yet.'

/**
 * Where an invite-only ticket's email link lands (?token=). The invite itself
 * is public, so a signed-out guest sees what they've been sent; claiming it
 * needs the invited account, so the login opens on arrival and they stay here
 * with the token once they're in.
 */
export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  if (!token) return <InviteMessage title='This invite link is incomplete' />

  return <InviteFlow token={token} />
}

function InviteFlow({ token }: { token: string }) {
  const navigate = useNavigate()
  const { openAuthModal } = useAuth()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const signedInEmail = useAfroStore((state) => state.user?.email) ?? ''
  const [searchParams, setSearchParams] = useSearchParams()
  // Paystack sends the guest back here with the payment's reference.
  const paymentReference = searchParams.get('reference') || searchParams.get('trxref') || ''

  const { data: response, isPending, error } = useGetInviteTicketByToken(token)
  const invite = response?.data as InviteTicketByTokenData | undefined
  // The flyer, venue and date aren't on the invite.
  const { data: eventResponse } = useGetEvent(invite?.eventId ?? '')
  const event = eventResponse?.data as EventDetailData | undefined

  const acceptInvite = useAcceptInviteTicket()
  // Stays here, so the login can reopen over this page for the invited email.
  const logout = useLogout({ stayOnPage: true })
  // What accepting returned: whether the ticket is issued or waiting on payment.
  const [acceptResult, setAcceptResult] = useState<AcceptInviteTicketData | null>(null)

  const openLogin = useCallback(
    () =>
      openAuthModal('login', 'guest', {
        notice: LOGIN_NOTICE,
        signupNotice: SIGNUP_NOTICE,
        // Back to this page, token and all, rather than the dashboard.
        stayOnPage: true,
      }),
    [openAuthModal],
  )

  // Signed out, the login opens on arrival, and again after leaving the wrong
  // account. Keyed on sign-in alone: openLogin changes with the URL, and
  // re-running on that snapped the modal back to login whenever the guest
  // switched to signup.
  const openLoginRef = useRef(openLogin)
  openLoginRef.current = openLogin
  useEffect(() => {
    if (!isAuthenticated) openLoginRef.current()
  }, [isAuthenticated])

  // Back from Paystack, the webhook has usually issued the ticket already, and
  // the invite read on arrival shows it. If it hasn't, the payment is verified
  // from here as the backup.
  const paymentCheck = useVerifyInviteTicketPayment()
  const { mutate: verifyPayment } = paymentCheck
  const checkPayment = useCallback(
    () =>
      verifyPayment(
        { reference: paymentReference, token },
        {
          onSuccess: (result) => {
            if ((result?.data as AcceptInviteTicketData | undefined)?.status !== 'Issued') return
            // Done with the reference, so a refresh doesn't verify it again.
            setSearchParams(
              (params) => {
                params.delete('reference')
                params.delete('trxref')
                return params
              },
              { replace: true },
            )
          },
        },
      ),
    [verifyPayment, paymentReference, token, setSearchParams],
  )

  // Only as the invited email, and only while the ticket isn't issued yet — a
  // signed-out guest is confirmed once they log in.
  const canConfirmPayment =
    !!paymentReference &&
    isAuthenticated &&
    !!invite &&
    !isClaimed(invite) &&
    isSameEmail(invite.invitedEmail, signedInEmail)

  // Once per reference: re-renders (and StrictMode) shouldn't verify it twice.
  const checkedReference = useRef('')
  useEffect(() => {
    if (!canConfirmPayment || checkedReference.current === paymentReference) return
    checkedReference.current = paymentReference
    checkPayment()
  }, [canConfirmPayment, paymentReference, checkPayment])

  const verified = paymentCheck.data?.data as AcceptInviteTicketData | undefined
  const isPaymentIssued = verified?.status === 'Issued'
  // Idle counts as confirming, so the Pay button never flashes before the check starts.
  const isConfirmingPayment = canConfirmPayment && (paymentCheck.isIdle || paymentCheck.isPending)
  // A check that errored, or answered but didn't issue the ticket.
  const paymentCheckError = paymentCheck.isError
    ? (paymentCheck.error as AxiosError<{ message?: string }> | null)?.response?.data?.message ||
      PAYMENT_CHECK_FAILED
    : paymentCheck.isSuccess && !isPaymentIssued
      ? verified?.message || paymentCheck.data?.message || PAYMENT_CHECK_FAILED
      : null

  if (isPending) return <LoadingFallback />

  if (error || !invite) {
    // The server says why: expired, already used, not found.
    const message = (error as AxiosError<{ message?: string }> | null)?.response?.data?.message
    return <InviteMessage title={message || 'This invite is no longer available'} />
  }

  if (invite.isExpired || invite.status === 'Expired') {
    return <InviteMessage title='This invite has expired' />
  }
  if (invite.status === 'Cancelled') {
    return <InviteMessage title='This invite was cancelled by the organizer' />
  }

  // Only the invited address can accept, so another account is told why,
  // rather than offered an Accept that the server will refuse.
  if (isAuthenticated && !isSameEmail(invite.invitedEmail, signedInEmail)) {
    return (
      <EmailMismatch
        invitedEmail={invite.maskedEmail}
        signedInEmail={signedInEmail}
        isLoggingOut={logout.isPending}
        onStaySignedIn={() => navigate(getRoutePath('home'))}
        // Signed out, the login reopens over this page for the invited email.
        onLogOut={() => logout.mutate()}
      />
    )
  }

  // Only an issued ticket is "in": a paid invite that's been accepted still
  // needs paying, until its payment is verified.
  if ((acceptResult && !acceptResult.requiresPayment) || isPaymentIssued || isClaimed(invite)) {
    return (
      <YoureIn
        invite={invite}
        event={event}
        onViewTicket={() => navigate(getRoutePath('active_tickets', { eventId: invite.eventId }))}
      />
    )
  }

  if (isConfirmingPayment) return <ConfirmingPayment invite={invite} event={event} />

  // Accepted but not paid for yet: the Pay step. The checkout link comes back from
  // accepting A failed check lands here too, with the reason.
  if (acceptResult?.requiresPayment || invite.status === 'PaymentPending' || paymentCheckError) {
    return (
      <PaymentPending
        invite={invite}
        event={event}
        message={acceptResult?.message || PAYMENT_PENDING_MESSAGE}
        price={acceptResult?.price ?? invite.price}
        paymentUrl={acceptResult?.authorizationUrl || invite.authorizationUrl || null}
        paymentCheckError={paymentCheckError}
        onCheckAgain={paymentCheckError ? checkPayment : undefined}
      />
    )
  }

  const handleClaim = () => {
    if (!isAuthenticated) {
      openLogin()
      return
    }
    // Accept, then pay (paid invites only), then You're In: what comes back
    // decides which of the last two is next.
    acceptInvite.mutate(token, {
      onSuccess: (result) => {
        const accepted = result?.data as AcceptInviteTicketData | undefined
        if (accepted) setAcceptResult(accepted)
      },
    })
  }

  // Accepting comes first even for a paid ticket; paying is the next step.
  const claimLabel = !isAuthenticated
    ? 'Log In to accept'
    : acceptInvite.isPending
      ? 'Accepting...'
      : 'Accept Ticket'

  // The invite says who sent it; older invites may not.
  const sender = invite.companyName || invite.organizerName || 'The organizer'

  return (
    <section className='mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-20 font-inter-tight text-white'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-4xl md:text-5xl font-black leading-tight'>
          You&rsquo;re invited to {invite.eventName}
        </h1>
        <p className='text-base md:text-lg'>
          {sender} sent you an invite-only ticket.
          {!isAuthenticated && ' Log In to accept it.'}
        </p>
      </div>

      <InviteEventCard invite={invite} event={event} />
      <TiedToEmailNotice />

      <Button
        type='button'
        onClick={handleClaim}
        disabled={acceptInvite.isPending}
        className='h-12 w-full rounded-lg  bg-deep-red font-inter-tight text-white hover:bg-black/80'>
        {claimLabel}
      </Button>
    </section>
  )
}

/**
 * A paid invite, accepted but not paid for: the Pay step. Paying goes to the
 * checkout the backend set up; the ticket is issued once that's confirmed.
 */
function PaymentPending({
  invite,
  event,
  message,
  price,
  paymentUrl,
  paymentCheckError,
  onCheckAgain,
}: {
  invite: InviteTicketByTokenData
  event?: EventDetailData
  message: string
  price: number
  /** The checkout for this invite. Null if the backend sent none. */
  paymentUrl: string | null
  /** Why a payment the guest came back from couldn't be confirmed. */
  paymentCheckError?: string | null
  /** Verifies that payment again. */
  onCheckAgain?: () => void
}) {
  return (
    <section className='mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-20 font-inter-tight text-white'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-4xl md:text-5xl font-black leading-tight'>Complete your payment</h1>
        <p className='text-base md:text-lg'>
          You&rsquo;ve accepted your invite to <strong>{invite.eventName}</strong>. {message}
        </p>
      </div>

      <InviteEventCard invite={invite} event={event} />

      {paymentCheckError ? (
        // Checking again comes first: paying twice is worse than waiting.
        <p
          role='alert'
          className='flex items-center gap-2 rounded-lg border border-deep-red/60 px-3 py-3 text-xs text-white/80'>
          <RiErrorWarningLine className='size-5 shrink-0 text-deep-red' aria-hidden />
          {paymentCheckError} If you&rsquo;ve already paid, check again before paying a second
          time.
        </p>
      ) : (
        <TiedToEmailNotice />
      )}

      <div className='flex flex-col gap-3'>
        <Button
          type='button'
          onClick={() => {
            if (paymentUrl) window.location.href = paymentUrl
          }}
          disabled={!paymentUrl}
          className='h-12 w-full rounded-lg bg-deep-red font-inter-tight text-white hover:bg-black/80'>
          Pay {formatNaira(price)}
        </Button>

        {onCheckAgain && (
          <Button
            type='button'
            onClick={onCheckAgain}
            className='h-12 w-full rounded-lg border border-white/20 bg-transparent font-inter-tight text-white hover:bg-white/10'>
            Check again
          </Button>
        )}
      </div>
    </section>
  )
}

/** Back from Paystack, while the payment is confirmed and the ticket issued. */
function ConfirmingPayment({
  invite,
  event,
}: {
  invite: InviteTicketByTokenData
  event?: EventDetailData
}) {
  return (
    <section className='mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-20 font-inter-tight text-white'>
      <div role='status' className='flex flex-col items-center gap-3 text-center'>
        <RiLoader4Line className='size-10 animate-spin text-white/80' aria-hidden />
        <h1 className='text-4xl md:text-5xl font-black'>Confirming your payment</h1>
        <p className='text-base md:text-lg'>
          This usually takes a few seconds. Please don&rsquo;t pay again.
        </p>
      </div>

      <InviteEventCard invite={invite} event={event} />
    </section>
  )
}

/** The ticket's been claimed. */
function YoureIn({
  invite,
  event,
  onViewTicket,
}: {
  invite: InviteTicketByTokenData
  event?: EventDetailData
  onViewTicket: () => void
}) {
  const appStore = app_store_links.find(({ alt }) => alt.includes('App Store'))
  const googlePlay = app_store_links.find(({ alt }) => alt.includes('Google Play'))

  return (
    <section className='mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-20 font-inter-tight text-white'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <span className='flex size-12 items-center justify-center rounded-full border-2 border-green'>
          <RiCheckLine className='size-6 text-green' aria-hidden />
        </span>
        <h1 className='text-4xl md:text-5xl font-black'>You&rsquo;re In</h1>
        <p className='text-base md:text-lg'>
          Your ticket for <strong>{invite.eventName}</strong> is now in your dashboard
        </p>
      </div>

      <InviteEventCard invite={invite} event={event} />

      <div className='flex flex-col gap-2 rounded-xl border border-white/20 p-5'>
        <p className='text-lg font-bold'>Get your QR code in the app</p>
        <p className='text-sm text-white/90'>
          Your event QR code is only available in the Afrorevive app. Download the app to view
          your QR code and <strong>scan it for check-in.</strong>
        </p>
        <div className='mt-2 flex items-center gap-5'>
          <a href={googlePlay?.href} aria-label={googlePlay?.alt} className='hover:opacity-80'>
            <FaGooglePlay className='size-7' />
          </a>
          <a href={appStore?.href} aria-label={appStore?.alt} className='hover:opacity-80'>
            <FaApple className='size-8' />
          </a>
        </div>
      </div>

      <TiedToEmailNotice />

      <Button
        type='button'
        onClick={onViewTicket}
        className='h-12 w-full rounded-lg bg-white font-inter-tight text-black hover:bg-white/90'>
        View Ticket
      </Button>
    </section>
  )
}

/** The event and the ticket being given, as on both the invite and You're In. */
function InviteEventCard({
  invite,
  event,
}: {
  invite: InviteTicketByTokenData
  event?: EventDetailData
}) {
  // posterUrl is what the detail response carries; the nested flyer is only a
  // fallback for events saved before that field existed.
  const image = event?.posterUrl || event?.eventDetails.desktopMedia?.flyer

  return (
    <div className='flex gap-4 rounded-xl border border-white/20 bg-white/[0.03] p-3'>
      <div className='h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-white/10'>
        {image && <img src={image} alt='' className='size-full object-cover' />}
      </div>

      <div className='flex min-w-0 flex-1 flex-col'>
        <p className='text-base font-bold'>{invite.eventName}</p>
        {event?.venue && <p className='mt-1 line-clamp-2 text-xs text-white/80'>{event.venue}</p>}
        {event && (
          <p className='mt-1 text-xs text-white/80'>{formatDateLong(event.eventDate.startDate)}</p>
        )}

        <div className='mt-3 flex flex-col gap-1 border-t border-white/15 pt-3'>
          <p className='text-sm text-white/50'>Ticket</p>
          <div className='flex items-center justify-between gap-2'>
            <p className='flex min-w-0 items-center gap-1.5 text-base'>
              <LuTicket className='size-4 shrink-0' aria-hidden />
              <span className='truncate'>{invite.ticketName}</span>
            </p>
            <p className='shrink-0 text-sm text-tech-blue'>
              {invite.isFree ? 'Free' : formatNaira(invite.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TiedToEmailNotice() {
  return (
    <p className='flex items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-xs text-white/50'>
      <RiInformationLine className='size-5 shrink-0' aria-hidden />
      This invite is tied to your email address and cannot be transferred or resold
    </p>
  )
}

function InviteMessage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className='mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-5 py-24 text-center text-white'>
      <p className='text-xl font-bold'>{title}</p>
      {children}
    </section>
  )
}

function isSameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

/** Signed in, but not as the address the invite went to. */
function EmailMismatch({
  invitedEmail,
  signedInEmail,
  isLoggingOut,
  onStaySignedIn,
  onLogOut,
}: {
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

        <p className='text-sm text-black'>
          Only the invited email can accept this ticket. Log out, then sign in with the invited
          email.
        </p>

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
