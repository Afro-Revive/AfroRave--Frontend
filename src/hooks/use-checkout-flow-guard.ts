import { getRoutePath } from '@/config/get-route-path'
import { useCartStore } from '@/stores'
import { useBlocker } from 'react-router-dom'

/**
 * Holds the fan on the cart and checkout pages while they have tickets for
 * this event. Any way out — the ✕, a link, the browser's Back — is blocked
 * until the page's "are you sure?" step is answered. Moving between this
 * event's cart and checkout, or changing only the query string (logging in
 * does), passes through. So does the redirect to Paystack, which leaves the
 * app entirely.
 *
 * Returns the blocker: when `state` is 'blocked', show the confirm and call
 * `proceed()` or `reset()`.
 */
export function useCheckoutFlowGuard(eventSlug: string) {
  const items = useCartStore((state) => state.items)
  const cartSlug = useCartStore((state) => state.eventSlug)
  // Nothing to lose once the cart is empty or belongs to another event.
  const hasCart = items.length > 0 && cartSlug === eventSlug

  const flowPaths = [
    getRoutePath('event_cart', { eventId: eventSlug }),
    getRoutePath('event_checkout', { eventId: eventSlug }),
  ].map(normalisePath)

  return useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasCart &&
      currentLocation.pathname !== nextLocation.pathname &&
      !flowPaths.includes(normalisePath(nextLocation.pathname)),
  )
}

/** Compares paths regardless of percent-encoding or a trailing slash. */
function normalisePath(path: string): string {
  return decodeURI(path).replace(/\/+$/, '')
}
