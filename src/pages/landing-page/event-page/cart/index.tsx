import { LoadingFallback } from '@/components/loading-fallback'
import { ConfirmOverlay } from '@/components/reusable/confirm-overlay'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useClearCart, useSyncCartToServer } from '@/hooks/use-cart'
import { useCheckoutFlowGuard } from '@/hooks/use-checkout-flow-guard'
import {
  useGetEventByCustomUrl,
  useGetEventResaleListings,
  useGetEventTickets,
} from '@/hooks/use-event-mutations'
import type {
  EventDetailData,
  PaginatedResponse,
  ResaleListingData,
  TicketData,
} from '@/types'
import { toPurchasableResaleListings, toPurchasableTickets } from '@/lib/purchasable-tickets'
import { useAfroStore, useCartStore } from '@/stores'
import { X } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import CartContainer from './cart-container'

/**
 * /fans/events/:eventId/cart — the first step of buying, a full-screen page
 * styled like the modal it replaced. Reached by adding a ticket on the event
 * page; leaving it asks first and clears the cart.
 */
export default function EventCartPage() {
  const { eventId: eventSlug = '' } = useParams()
  const { data: eventResponse, isPending } = useGetEventByCustomUrl(eventSlug)
  const event = eventResponse?.data as EventDetailData | undefined

  if (isPending) return <LoadingFallback />
  if (!event) return <EventNotFound />

  return <EventCart event={event} eventSlug={eventSlug} />
}

function EventCart({ event, eventSlug }: { event: EventDetailData; eventSlug: string }) {
  const navigate = useNavigate()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const items = useCartStore((state) => state.items)
  const cartSlug = useCartStore((state) => state.eventSlug)

  const { data: ticketsResponse } = useGetEventTickets(event.eventId)
  const { data: resaleListingsResponse } = useGetEventResaleListings(
    event.eventId,
    isAuthenticated,
  )
  const { mutateAsync: syncCart, isPending: isSyncing } = useSyncCartToServer()
  const { mutate: clearCart } = useClearCart()
  const blocker = useCheckoutFlowGuard(eventSlug)

  const tickets = toPurchasableTickets(
    ticketsResponse?.data as PaginatedResponse<TicketData> | undefined,
  )
  const resaleListings = toPurchasableResaleListings(
    resaleListingsResponse?.data as PaginatedResponse<ResaleListingData> | undefined,
  )

  const eventPath = getRoutePath('individual_event', { eventId: eventSlug })

  // Nothing to buy here: an empty cart, or one for another event (an old
  // link). Back to the event to start again.
  if (items.length === 0 || cartSlug !== eventSlug) {
    return <Navigate to={eventPath} replace />
  }

  async function handleContinue() {
    if (isAuthenticated) {
      try {
        await syncCart()
      } catch {
        return
      }
    }
    navigate(getRoutePath('event_checkout', { eventId: eventSlug }))
  }

  function confirmLeave() {
    // Leave first, then clear: clearing first would re-render this page with
    // an empty cart, and its own redirect would race the navigation.
    blocker.proceed?.()
    clearCart()
  }

  return (
    <div className='relative w-full min-h-screen bg-system-black text-white animate-in fade-in slide-in-from-bottom-10 duration-500'>
      {/* The ✕ the modal had. Going back to the event is leaving, so the
          guard asks first. */}
      <button
        type='button'
        aria-label='Leave cart'
        onClick={() => navigate(eventPath)}
        className='fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white opacity-90 transition-opacity hover:opacity-100'>
        <X className='h-5 w-5 md:h-6 md:w-6' />
      </button>

      <div className='flex flex-col h-fit w-full justify-center items-center mt-6'>
        <CartContainer
          event={event}
          isLoading={isSyncing}
          tickets={tickets}
          resaleListings={resaleListings}
          action={handleContinue}
        />
      </div>

      {blocker.state === 'blocked' && (
        <ConfirmOverlay
          fixed
          title='Exit Cart?'
          message='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
          cancelText='Return to Cart'
          onConfirm={confirmLeave}
          onCancel={() => blocker.reset?.()}
        />
      )}
    </div>
  )
}

/** Shared with the checkout page, for a custom URL that matches no event. */
export function EventNotFound() {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center gap-2.5 justify-center w-full h-screen bg-system-black text-white'>
      <p className='text-3xl font-semibold'>No Events Found</p>
      <Button onClick={() => navigate(getRoutePath('events'))}>Browse events</Button>
    </div>
  )
}
