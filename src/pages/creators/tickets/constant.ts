export type TicketFilter = 'all' | 'invite_only' | 'door'

export const TICKET_FILTERS: { value: TicketFilter; label: string }[] = [
  { value: 'all', label: 'All tickets' },
  { value: 'invite_only', label: 'Invite-Only' },
  { value: 'door', label: 'Door Tickets' },
]

export const INVITE_ONLY_NOTES = [
  'Invite guests by email.',
  'One invite admits one guest.',
  'Paid invites expire after 5 days.',
  'Pre-publish invites send when the event goes live.',
]

export const PRIVATE_EVENT_NOTES = [
  'Group tickets and resale are turned off.',
  'Drag tickets to change the order fans view them.',
]

/**
 * Placeholder figures — the real numbers come from the analytics work on
 * another branch, which is also where View Analytics will point.
 */
export const SUMMARY_PLACEHOLDER = {
  netSales: 2_000_000,
  ticketsIssued: 120,
  totalTickets: 400,
}

/** Rows per page in the event's order table. */
export const ORDERS_PAGE_SIZE = 10

/** Rows per page in the Send Invites guestlist. */
export const INVITE_PAGE_SIZE = 20

/** The All Guests pill — not a real category id. */
export const ALL_INVITE_CATEGORIES_ID = 'all'
