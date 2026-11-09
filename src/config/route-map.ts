/**
 * A constant map of all available routes in the application.
 * Each key represents a route identifier in snake_case format,
 * and each value represents the actual URL path.
 *
 * @example
 * ```ts
 * ROUTE_PATHS.home // '/'
 * ROUTE_PATHS.individual_event // '/events/:eventId'
 * ```
 */
export const ROUTE_PATHS = {
  // Fan pages sit at the root. They used to live under /fans; LEGACY_FANS_PATH
  // below redirects those old links.
  home: '/',
  events: '/events',
  individual_event: '/events/:eventId',
  // Buying: the cart, then checkout, each a full-screen page of its own.
  event_cart: '/events/:eventId/cart',
  event_checkout: '/events/:eventId/checkout',
  resell: '/resell',
  /** One About Us for fans and creators (the creators site's page). */
  about_us: '/about-us',
  /** One Blog for fans and creators. */
  blog: '/blog',
  creators: '/creators',
  /** The old FAQ address; it redirects to the Support page. */
  faq: '/support/faq',
  refund_policy: '/refund-policy',
  work_with_us: '/work-with-us',
  /** The fan dashboard's contact form. */
  contact_support: '/contact-support',
  /** The public Support page, for fans and creators alike. */
  help_center: '/support',
  resale: '/resale',
  individual_resale: '/resale/:eventId',
  sell: '/sell',
  terms_and_conditions: '/terms-and-conditions',
  privacy_policy: '/privacy-policy',
  not_found: '*',
  payment_confirmation: '/payment-confirmation',

  // User dashboard routes
  account: '/account',
  settings: '/settings',
  my_tickets: '/my-tickets',
  /** The invite email's link lands here with ?token=. */
  accept_invite: '/invite/accept',
  active_tickets: '/my-tickets/:eventId',
  listed_tickets: '/listed-tickets',

  // Creator dashboard routes
  creators_home: '/home',
  creators_contact: '/contact-us',
  standalone: '/creators/events',
  season: '/creators/season',
  reports: '/creators/reports',
  realtime: '/creators/realtime',
  tickets: '/creators/tickets',
  guest_list: '/creators/guest-list',
  promo_codes: '/creators/promo-codes',
  edit_event: '/creators/edit/:eventId',
  audience: '/creators/audience/:eventId',
  add_event: '/creators/add-event',
  access_control: '/creators/access-control',
  revenue_vendor: '/creators/revenue-vendor',
  creator_not_found: '/creators/*',
  revenue_vendor_slot: '/creators/revenue-vendor/:slotId',
  revenue_vendor_application: '/creators/revenue-vendor/:slotId/applications/:applicationId',
  service_vendor: '/creators/service-vendor',
  service_vendor_slot: '/creators/service-vendor/:slotId',
  service_vendor_application: '/creators/service-vendor/:slotId/applications/:applicationId',
  individual_service_vendor: '/creators/service-vendor/:serviceId',
  seating_maps: '/creators/seating-maps',

  // Vendor dashboard routes
  vendor_not_found: '/vendor/*',
  vendor_profile: '/vendor/profile',
  vendor_discover: '/vendor/discover',
  vendor_event_details: '/vendor/discover/:eventId',
  vendor_slot_details: '/vendor/slots/:applicationId',
  vendor_slots: '/vendor/slots',

  // Email-token routes — public, reached from a link in an email
  complete_profile: '/complete-profile',
  reset_password: '/reset-password',
} as const

/**
 * Where fan pages used to live. Old links (shared event links, invite emails,
 * bookmarks) are redirected to the same path without the prefix, here and in
 * vercel.json.
 */
export const LEGACY_FANS_PATH = '/fans'

/**
 * Type representing all valid route keys from ROUTE_PATHS.
 * Used for type-safe route access throughout the application.
 */
export type RouteKey = keyof typeof ROUTE_PATHS

/**
 * Interface defining the required parameters for each route.
 * Routes that don't require parameters are marked with `never`.
 * Routes with dynamic segments (like :eventId) require corresponding parameters.
 *
 * @example
 * ```ts
 * // No parameters needed
 * RouteParams.home // never
 *
 * // Parameters required
 * RouteParams.individual_event // { eventId: string | number }
 * ```
 */
export interface RouteParams {
  home: never
  events: never
  individual_event: { eventId: string | number }
  event_cart: { eventId: string | number }
  event_checkout: { eventId: string | number }
  resell: never
  about_us: never
  blog: never
  creators: never
  faq: never
  refund_policy: never
  work_with_us: never
  contact_support: never
  help_center: never
  resale: never
  individual_resale: { eventId: string | number }
  sell: never
  terms_and_conditions: never
  privacy_policy: never
  not_found: never
  payment_confirmation: never

  // User dashboard routes
  account: never
  settings: never
  my_tickets: never
  accept_invite: never
  active_tickets: { eventId: string | number }
  listed_tickets: never

  // Creator dashboard routes
  creators_home: never
  creators_contact: never
  standalone: never
  season: never
  reports: never
  charts: never
  realtime: never
  tickets: never
  guest_list: never
  promo_codes: never
  edit_event: { eventId: string | number }
  audience: { eventId: string | number }
  add_event: never
  access_control: never
  seating_maps: never
  creator_not_found: never

  // Vendor dashboard routes
  service_vendor: never
  revenue_vendor: never
  individual_service_vendor: { serviceId: string | number }
  revenue_vendor_slot: { slotId: string | number }
  service_vendor_slot: { slotId: string | number }
  revenue_vendor_application: { slotId: string | number; applicationId: string | number }
  service_vendor_application: { slotId: string | number; applicationId: string | number }
  vendor_not_found: never
  vendor_profile: never
  vendor_discover: never
  vendor_event_details: { eventId: string | number }
  vendor_slots: never
  vendor_slot_details: { applicationId: string | number }

  // Email-token routes
  complete_profile: never
  reset_password: never
}
