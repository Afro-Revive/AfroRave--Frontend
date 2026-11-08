export const GUEST_COLUMNS = ['Name', 'Category', 'Events', 'Date Added']

/**
 * Account-wide guest allowance. Placeholder until an endpoint exposes it — the
 * copy under the bar is derived from these rather than written out, so the
 * number and the sentence can't drift apart.
 */
export const GUEST_LIMIT = {
  used: 0,
  total: 500,
}

/** The implicit category holding every guest. Always present, never editable. */
export const ALL_GUESTS_CATEGORY_ID = 'all'

/** Sent as-is: GET /api/Guestlist only knows these two, word for word. */
export type GuestSort = 'newest to oldest' | 'oldest to newest'

export const DEFAULT_GUEST_SORT: GuestSort = 'newest to oldest'

export const GUEST_SORT_OPTIONS: { value: GuestSort; label: string }[] = [
  { value: 'newest to oldest', label: 'Newest first' },
  { value: 'oldest to newest', label: 'Oldest first' },
]

export const GUESTS_PER_PAGE = 20

