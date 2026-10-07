// Query keys for guest-list queries
export const guestlistKeys = {
  all: ['guestlist'] as const,
  guests: () => [...guestlistKeys.all, 'guests'] as const,
  /** Keyed by the request params so a different page or category isn't
   *  served another one's cached rows. */
  guestList: (params?: Record<string, unknown>) =>
    [...guestlistKeys.guests(), params ?? {}] as const,
  categories: () => [...guestlistKeys.all, 'categories'] as const,
  eventConfig: (eventId: string) => [...guestlistKeys.all, 'event', eventId] as const,
}
