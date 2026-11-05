// Query keys for invite-only ticket queries
export const inviteTicketKeys = {
  all: ['invite-ticket'] as const,
  ticketInvites: (ticketId: string) => [...inviteTicketKeys.all, 'ticket', ticketId] as const,
  byToken: (token: string) => [...inviteTicketKeys.all, 'token', token] as const,
  /** Prefix for every event's audience, so one invalidation can cover them all. */
  audiences: () => [...inviteTicketKeys.all, 'audience'] as const,
  audience: (eventId: string) => [...inviteTicketKeys.audiences(), eventId] as const,
  /** Keyed by paging params so one page's cache isn't served for another's. */
  orders: (eventId: string, params?: Record<string, unknown>) =>
    [...inviteTicketKeys.all, 'orders', eventId, params ?? {}] as const,
}
