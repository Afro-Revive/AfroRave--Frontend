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
  // fans Landing page routes
  home: '/fans',
  events: '/fans/events',
  individual_event: '/fans/events/:eventId',
  resell: '/fans/resell',
  about_us: '/fans/about-us',
  blog: '/fans/blog',
  creators: '/creators',
  faq: '/fans/support/faq',
  refund_policy: '/fans/refund-policy',
  work_with_us: '/fans/work-with-us',
  support: '/fans/support',
  resale: '/fans/resale',
  individual_resale: '/fans/resale/:eventId',
  sell: '/fans/sell',
  terms_and_conditions: '/fans/terms-and-conditions',
  privacy_policy: '/fans/privacy-policy',
  not_found: '*',

  // User dashboard routes
  account: '/fans/account',
  settings: '/fans/settings', // Added settings route
  my_tickets: '/fans/my-tickets',
  active_tickets: '/fans/my-tickets/:eventId',
  listed_tickets: '/fans/listed-tickets',

  // Creator dashboard routes
  creators_home: '/home',
  creators_about: '/about-us',
  creators_contact: '/contact-us',
  creators_blog: '/blog',
  creators_wishlist: '/',
  standalone: '/creators/standalone',
  season: '/creators/season',
  reports: '/creators/reports',
  charts: '/creators/charts',
  realtime: '/creators/realtime',
  promo_codes: '/creators/promo-codes',
  edit_event: '/creators/edit/:eventId',
  add_event: '/creators/add-event',
  access_control: '/creators/access-control',
  revenue_vendor: '/creators/revenue-vendor',
  creator_not_found: '/creators/*',
  revenue_vendor_slot: '/creators/revenue-vendor/:slotId',
  service_vendor: '/creators/service-vendor',
  service_vendor_slot: '/creators/service-vendor/:slotId',
  individual_service_vendor: '/creators/service-vendor/:serviceId',
  seating_maps: '/creators/seating-maps',

  // Vendor dashboard routes
  vendor_not_found: '/vendor/*',
  vendor_profile: '/vendor/profile',
  vendor_discover: '/vendor/discover',
  vendor_wishlist: '/vendor/wishlist',
  vendor_event_details: '/vendor/discover/:eventId',
  vendor_slot_details: '/vendor/slots/:eventId',
  vendor_slots: '/vendor/slots',

  // Email-token routes
  complete_profile: '/fans/complete-profile',
} as const

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
  resell: never
  about_us: never
  blog: never
  creators: never
  faq: never
  refund_policy: never
  work_with_us: never
  support: never
  resale: never
  individual_resale: { eventId: string | number }
  sell: never
  terms_and_conditions: never
  privacy_policy: never
  not_found: never

  // User dashboard routes
  account: never
  settings: never
  my_tickets: never
  active_tickets: { eventId: string | number }
  listed_tickets: never

  // Creator dashboard routes
  creators_home: never
  creators_about: never
  creators_contact: never
  creators_blog: never
  creators_wishlist: never
  standalone: never
  season: never
  reports: never
  charts: never
  realtime: never
  promo_codes: never
  edit_event: { eventId: string | number }
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
  vendor_not_found: never
  vendor_profile: never
  vendor_discover: never
  vendor_wishlist: never
  vendor_event_details: { eventId: string | number }
  vendor_slots: never
  vendor_slot_details: { eventId: string | number }

  // Email-token routes
  complete_profile: never
}
