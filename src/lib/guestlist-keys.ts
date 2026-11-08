// Query keys for guest-list queries
export const guestlistKeys = {
  all: ['guestlist'] as const,
  guests: () => [...guestlistKeys.all, 'guests'] as const,
  /** Keyed by the request params so a different page or category isn't
   *  served another one's cached rows. */
  guestList: (params?: Record<string, unknown>) =>
    [...guestlistKeys.guests(), params ?? {}] as const,
  categories: () => [...guestlistKeys.all, 'categories'] as const,
  /** Every event's guestlist and check-in list, for changes that can reach any of them. */
  events: () => [...guestlistKeys.all, 'event'] as const,
  eventConfig: (eventId: string) => [...guestlistKeys.events(), eventId] as const,
  /** Nested under eventConfig, so saving the event's list refreshes this too. */
  checkinList: (eventId: string, search?: string) =>
    [...guestlistKeys.eventConfig(eventId), 'checkin-list', search ?? ''] as const,
  allowance: () => [...guestlistKeys.all, 'allowance'] as const,
}
