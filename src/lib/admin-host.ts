/**
 * The admin portal has a site of its own: admin.afrorevive.com (and admin-dev…
 * for staging, admin.localhost locally). There it sits at the root (/users,
 * /fees), and the fan and creator pages don't exist.
 *
 * Anywhere else (afrorevive.com, Vercel previews, localhost) it stays at /admin,
 * so it can still be reached where the subdomain isn't set up.
 */
export function isAdminHostname(hostname: string): boolean {
  return /^admin[.-]/i.test(hostname)
}

export const IS_ADMIN_HOST = typeof window !== 'undefined' && isAdminHostname(window.location.hostname)

/** Where the admin routes start: nothing on the admin site, /admin elsewhere. */
export const ADMIN_BASE = IS_ADMIN_HOST ? '' : '/admin'

type SiteLocation = Pick<Location, 'protocol' | 'hostname' | 'port' | 'origin'>

/**
 * The fan site, for links out of the admin portal (an event's public page). On
 * the admin site a relative link would stay on admin.afrorevive.com, where
 * there are no fan pages.
 *
 * VITE_MAIN_SITE_URL sets it, and staging needs that: admin-dev's fan site
 * can't be guessed from its name. Without it, admin.afrorevive.com links to
 * www.afrorevive.com, and admin.localhost:4318 to localhost:4318.
 */
export function mainSiteOrigin(
  location: SiteLocation = window.location,
  configured: string | undefined = import.meta.env.VITE_MAIN_SITE_URL,
): string {
  if (!isAdminHostname(location.hostname)) return location.origin
  if (configured?.trim()) return configured.trim().replace(/\/+$/, '')

  const host = location.hostname.replace(/^admin[.-]/i, '')
  // The bare domain only redirects to www.
  const mainHost = host === 'afrorevive.com' ? 'www.afrorevive.com' : host
  return `${location.protocol}//${mainHost}${location.port ? `:${location.port}` : ''}`
}
