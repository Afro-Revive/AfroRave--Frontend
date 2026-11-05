// Query keys for private event access queries
export const privateEventKeys = {
  all: ['private-event'] as const,
  /** Prefix for one event's access data, so a change can refresh all of it. */
  event: (eventId: string) => [...privateEventKeys.all, eventId] as const,
  accessStatus: (eventId: string) => [...privateEventKeys.event(eventId), 'access-status'] as const,
  /** Keyed by status and paging so one filter's page isn't served for another's. */
  accessRequests: (eventId: string, params?: Record<string, unknown>) =>
    [...privateEventKeys.event(eventId), 'access-requests', params ?? {}] as const,
}
