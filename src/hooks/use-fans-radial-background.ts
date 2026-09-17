import { useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '@/config/route-map'

/**
 * Whether the current fans page uses the radial page backdrop.
 *
 * Event discovery and the individual event page are excluded — they render
 * their own backdrop, so the layout leaves the background alone there.
 */
export function useFansRadialBackground(): boolean {
  const { pathname } = useLocation()

  // Covers both /fans/events and /fans/events/:eventId.
  return !pathname.startsWith(ROUTE_PATHS.events)
}
