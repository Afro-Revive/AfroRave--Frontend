import CheckoutSummary from './sections/checkout-summary'
import { UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { useAfroStore, useCartStore } from '@/stores'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import type { EventDetailData } from '@/types'
import { LoadingFallback } from '@/components/loading-fallback'
import { ConfirmOverlay } from '@/components/reusable/confirm-overlay'
import { AuthModal } from '@/components/auth/auth-modal'
import { getRoutePath } from '@/config/get-route-path'
import { AuthProvider } from '@/contexts/auth-context'
import { useClearCart } from '@/hooks/use-cart'
import { useCheckoutFlowGuard } from '@/hooks/use-checkout-flow-guard'
import { useGetEventByCustomUrl } from '@/hooks/use-event-mutations'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { EventNotFound } from '../event-page/cart'

export default function EventCheckoutPage() {
  const { eventId: eventSlug = '' } = useParams()
  const { data: eventResponse, isPending } = useGetEventByCustomUrl(eventSlug)
  const event = eventResponse?.data as EventDetailData | undefined

  if (isPending) return <LoadingFallback />
  if (!event) return <EventNotFound />

  // This page has no layout, but the login form and its sign-up link need the
  // auth context and modal that layouts usually provide.
  return (
    <AuthProvider>
      <EventCheckout event={event} eventSlug={eventSlug} />
      <AuthModal />
    </AuthProvider>
  )
}

function EventCheckout({ event, eventSlug }: { event: EventDetailData; eventSlug: string }) {
  const navigate = useNavigate()
  const { isAuthenticated, isFan } = useAfroStore()
  const items = useCartStore((state) => state.items)
  const cartSlug = useCartStore((state) => state.eventSlug)
  const { mutate: clearCart } = useClearCart()
  const blocker = useCheckoutFlowGuard(eventSlug)

  const isFanAccount = isAuthenticated && isFan
  const eventPath = getRoutePath('individual_event', { eventId: eventSlug })

  // Paid for, emptied, or an old link: back to the event to start again.
  if (items.length === 0 || cartSlug !== eventSlug) {
    return <Navigate to={eventPath} replace />
  }

  function confirmLeave() {
    // Leave first, then clear, as on the cart page.
    blocker.proceed?.()
    clearCart()
  }

  return (
    <div className='w-full min-h-screen bg-black'>
      <section className='relative w-full min-h-screen flex flex-col md:flex-row'>
        {/* Leaving checkout for the event, so the guard asks first. */}
        <button
          type='button'
          aria-label='Leave checkout'
          onClick={() => navigate(eventPath)}
          className='absolute top-4 right-4 bg-transparent shadow-none z-[1001] p-1'>
          <X size={18} color='white' strokeWidth={3} />
        </button>

        <div
          className={cn(
            'h-screen overflow-y-auto md:h-auto md:overflow-y-visible md:min-h-full flex items-start md:items-center justify-start md:justify-center pt-16 md:pt-0 px-10 md:px-14 bg-[#1E1E1E]',
            {
              'w-full': isFanAccount,
              'hidden md:flex md:w-1/2': !isFanAccount,
            },
          )}>
          <CheckoutSummary event={event} isFanAccount={isFanAccount} eventId={event.eventId} />
        </div>

        {!isFanAccount && (
          <div className='w-full md:w-1/2 min-h-screen md:min-h-full z-30 flex flex-col py-32 gap-10 px-8 bg-[#ECEBEB]'>
            <div className='flex flex-col items-center mb-10'>
              <p className='font-sf-pro-display leading-[100%] text-black'>
                Log in or Sign up to access and manage your order.
              </p>
              <p className='font-sf-pro-display leading-[100%] text-black'>
                {"Don't worry - it's quick and easy!"}
              </p>
            </div>

            {/* A no-op keeps the fan here instead of their dashboard. */}
            <UserLoginForm onLoginSuccess={() => {}} />
          </div>
        )}
      </section>

      {blocker.state === 'blocked' && (
        <ConfirmOverlay
          fixed
          title='Exit Checkout?'
          message='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
          cancelText='Return to checkout'
          onConfirm={confirmLeave}
          onCancel={() => blocker.reset?.()}
        />
      )}
    </div>
  )
}
