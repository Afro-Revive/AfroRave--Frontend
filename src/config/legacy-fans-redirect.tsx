import { Navigate, useLocation } from 'react-router-dom'
import { getRoutePath } from './get-route-path'
import { LEGACY_FANS_PATH } from './route-map'

/**
 * Sends an old /fans/... link to the same page at the root, keeping the query
 * string and hash (an invite email's ?token=, Paystack's ?reference=).
 *
 * vercel.json does the same before the app loads; this covers in-app
 * navigation and local development. /fans/support was the fan contact form,
 * which now lives at /contact-support, as /support is the public Support page.
 */
export function LegacyFansRedirect() {
  const { pathname, search, hash } = useLocation()

  const path = pathname.slice(LEGACY_FANS_PATH.length).replace(/\/+$/, '') || getRoutePath('home')
  const to = path === getRoutePath('help_center') ? getRoutePath('contact_support') : path

  return <Navigate to={`${to}${search}${hash}`} replace />
}
