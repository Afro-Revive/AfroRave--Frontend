import { useCallback, useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { AiFillApple, AiOutlineUser } from 'react-icons/ai'
import { BiLogoPlayStore } from 'react-icons/bi'
import { BsInfoCircle } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ForgotPasswordView } from '@/components/auth/forgot-password-modal'
import { LoadingFallback } from '@/components/loading-fallback'
import BaseModal from '@/components/reusable/base-modal'
import { EmailMismatch } from '@/components/shared/email-mismatch'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { useLogout } from '@/hooks/use-auth'
import { useAcceptCrewInvite, useGetCrewInvite } from '@/hooks/use-crew'
import { app_store_links } from '@/layouts/root-layout/footer'
import { isSameEmail } from '@/lib/helper-func'
import { useAfroStore } from '@/stores'
import type { User } from '@/types/auth'
import type { CrewInviteDetails } from '@/types/crew'

const LOGIN_NOTICE = 'Log In to join the crew'
const SIGNUP_NOTICE = 'Only the invited email can join the crew. Sign up with the invited email.'

/** The app's names for account types, which the API calls User, Organizer and Vendor. */
const ACCOUNT_TYPE_LABEL: Record<User['accountType'], string> = {
  User: 'Fan',
  Organizer: 'Organizer',
  Vendor: 'Vendor',
  Admin: 'Admin',
}

/**
 * Where a crew invite email's link lands (/crew/invite/:inviteCode). The
 * organizer adds crew from the mobile app; this page only accepts.
 *
 * Two outcomes: "Welcome to the Crew!", or "This invite is no longer valid"
 * (not found, removed by the organizer, or the event has ended).
 */
export default function CrewInvitePage() {
  const { inviteCode = '' } = useParams<{ inviteCode: string }>()
  const navigate = useNavigate()
  const { openAuthModal } = useAuth()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const user = useAfroStore((state) => state.user)
  const signedInEmail = user?.email ?? ''

  const { data: response, isPending, isError } = useGetCrewInvite(inviteCode)
  const invite = response?.data as CrewInviteDetails | undefined
  const acceptInvite = useAcceptCrewInvite()
  // Stays here, so the login can reopen over this page for the invited email.
  const logout = useLogout({ stayOnPage: true })

  // Removed, expired or unknown links can't be joined, so they never ask for a login.
  const isJoinable = !!invite && (invite.status === 'Invited' || invite.status === 'Active')
  const isInvitee = isAuthenticated && !!invite && isSameEmail(invite.inviteeEmail, signedInEmail)

  const openLogin = useCallback(
    () =>
      openAuthModal('login', 'guest', {
        notice: LOGIN_NOTICE,
        signupNotice: SIGNUP_NOTICE,
        // Back to this page, code and all, rather than a dashboard.
        stayOnPage: true,
      }),
    [openAuthModal],
  )

  // Signed out, the login opens on arrival, and again after leaving the wrong
  // account. Keyed on sign-in alone, as on the ticket invite page, so it doesn't
  // snap back to login when the guest switches to signup.
  const openLoginRef = useRef(openLogin)
  openLoginRef.current = openLogin
  useEffect(() => {
    if (isJoinable && !isAuthenticated) openLoginRef.current()
  }, [isJoinable, isAuthenticated])

  // Signed in as the invitee: accept straight away. Once per code, so
  // re-renders (and StrictMode) don't send it twice.
  const acceptedCode = useRef('')
  const { mutate: accept } = acceptInvite
  useEffect(() => {
    if (!isInvitee || invite?.status !== 'Invited' || acceptedCode.current === inviteCode) return
    acceptedCode.current = inviteCode
    accept(inviteCode)
  }, [isInvitee, invite?.status, inviteCode, accept])

  if (isPending) return <LoadingFallback />

  // The server refused a link it doesn't know, or one that can't be used any more.
  if (isError || !invite || !isJoinable || acceptInvite.isError) return <InviteNoLongerValid />

  if (!isAuthenticated) return <LogInToJoin invite={invite} onLogIn={openLogin} />

  if (!isInvitee) {
    return (
      <EmailMismatch
        message='Only the invited email can join the crew. Log out, then sign in with the invited email.'
        invitedEmail={invite.inviteeEmail}
        signedInEmail={signedInEmail}
        isLoggingOut={logout.isPending}
        onStaySignedIn={() => navigate(getRoutePath('home'))}
        onLogOut={() => logout.mutate()}
      />
    )
  }

  // Already Active covers a refresh after joining, and opening the email again.
  if (invite.status === 'Active' || acceptInvite.isSuccess) {
    return <WelcomeToTheCrew eventName={invite.eventName} accountType={user?.accountType} />
  }

  return <LoadingFallback />
}

function WelcomeToTheCrew({
  eventName,
  accountType,
}: {
  eventName: string
  accountType?: User['accountType']
}) {
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const googlePlay = app_store_links.find(({ alt }) => alt.includes('Google Play'))
  const appStore = app_store_links.find(({ alt }) => alt.includes('App Store'))

  return (
    <section className='flex w-full max-w-[374px] flex-col px-5 py-[100px] font-inter-tight text-white'>
      <div className='flex w-full flex-col gap-5 rounded-xl bg-system-black p-5'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <img src='/assets/crew/joined.svg' alt='' width={64} height={64} className='size-16' />
          <h1 className='text-2xl font-black'>Welcome to the Crew!</h1>
          <p className='text-sm'>
            You&rsquo;ve successfully joined the crew for
            <br />
            <strong className='font-bold'>{eventName}</strong>
          </p>
        </div>

        {/* The crew log in to the app with the account that just joined. */}
        <div className='flex w-full flex-col gap-2 rounded-lg bg-white/10 p-2'>
          <div className='flex items-center gap-1 border-b-[0.5px] border-[#D9D9D9]/40 py-2'>
            <span className='flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white/20'>
              <AiOutlineUser className='size-4' aria-hidden />
            </span>
            <div className='flex flex-col gap-0.5'>
              <p className='font-work-sans text-[10px] font-medium uppercase text-soft-gray'>
                Account type
              </p>
              <p className='text-sm font-semibold'>
                {accountType ? ACCOUNT_TYPE_LABEL[accountType] : 'Afrorevive'}
              </p>
            </div>
          </div>

          <div className='flex flex-col items-start gap-1'>
            <p className='text-xs text-soft-gray'>Use your existing login details</p>
            <button
              type='button'
              onClick={() => setForgotPasswordOpen(true)}
              className='text-[10px] text-tech-blue underline hover:opacity-80'>
              Forgot Password?
            </button>
          </div>
        </div>

        <div className='flex w-full flex-col gap-3 rounded-[10px] border border-mid-dark-gray/50 p-3'>
          <p className='text-sm font-bold leading-[1.2]'>
            Download the Afrorevive app to start checking in guests
          </p>

          <ol className='flex flex-col gap-1.5 text-xs font-medium'>
            <Step number={1}>Download the App</Step>
            <Step number={2}>
              Choose <strong className='font-bold'>Crew</strong> on the login screen
            </Step>
            <Step number={3}>Log in with your Account details</Step>
          </ol>

          <div className='flex items-center gap-5'>
            <StoreButton
              href={googlePlay?.href}
              label={googlePlay?.alt ?? 'Get it on Google Play'}
              icon={BiLogoPlayStore}
              smallText='GET IT ON'
              bigText='Google Play'
            />
            <StoreButton
              href={appStore?.href}
              label={appStore?.alt ?? 'Download on the App Store'}
              icon={AiFillApple}
              smallText='Download on the'
              bigText='APP STORE'
            />
          </div>
        </div>

        <p className='flex items-center gap-2 rounded-lg bg-[#ACACAC]/20 p-3 text-[13px] leading-[1.2] text-[#ACACAC]'>
          <BsInfoCircle className='size-5 shrink-0' aria-hidden />
          This invite is tied to your Afrorevive account. Log in to the app with the same details.
        </p>
      </div>

      <BaseModal open={isForgotPasswordOpen} onClose={setForgotPasswordOpen} size='small'>
        <ForgotPasswordView onBack={() => setForgotPasswordOpen(false)} />
      </BaseModal>
    </section>
  )
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <li className='flex items-center gap-1.5'>
      <span className='flex size-[15px] shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold'>
        {number}
      </span>
      <span>{children}</span>
    </li>
  )
}

function StoreButton({
  href,
  label,
  icon: Icon,
  smallText,
  bigText,
}: {
  href?: string
  label: string
  icon: IconType
  smallText: string
  bigText: string
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={label}
      className='flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-soft-gray py-1.5 pl-1 pr-2 hover:bg-white/5'>
      <Icon className='size-7 shrink-0' aria-hidden />
      <span className='flex flex-col font-bold leading-none' aria-hidden>
        <span className='text-[8px]'>{smallText}</span>
        <span className='text-[11px]'>{bigText}</span>
      </span>
    </a>
  )
}

/** Not found, removed by the organizer, or the event has ended. */
function InviteNoLongerValid() {
  return (
    <section className='flex w-full max-w-[236px] flex-col items-center gap-5 py-[159px] font-inter-tight text-center text-white'>
      <div className='flex flex-col items-center gap-3'>
        <span className='flex size-[60px] items-center justify-center rounded-full bg-[#FFFBFB]/20'>
          <img src='/assets/crew/invite-invalid.svg' alt='' width={40} height={40} className='size-10' />
        </span>
        <h1 className='text-2xl font-black'>This invite is no longer valid.</h1>
        <p className='text-base'>Contact the event organizer for a new invite.</p>
      </div>

      <Button
        asChild
        className='h-10 w-full rounded-lg bg-white font-inter-tight text-sm font-semibold text-system-black hover:bg-white/90'>
        <Link to={getRoutePath('events')}>Discover Events</Link>
      </Button>
    </section>
  )
}

/**
 * Behind the login modal while signed out, so closing it doesn't leave an
 * empty page.
 */
function LogInToJoin({ invite, onLogIn }: { invite: CrewInviteDetails; onLogIn: () => void }) {
  return (
    <section className='flex w-full max-w-[236px] flex-col items-center gap-5 py-[159px] font-inter-tight text-center text-white'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='text-2xl font-black'>Join the crew for {invite.eventName}</h1>
        <p className='text-base'>Log in or sign up with {invite.inviteeEmail} to accept.</p>
      </div>

      <Button
        type='button'
        onClick={onLogIn}
        className='h-10 w-full rounded-lg bg-white font-inter-tight text-sm font-semibold text-system-black hover:bg-white/90'>
        Log In
      </Button>
    </section>
  )
}
