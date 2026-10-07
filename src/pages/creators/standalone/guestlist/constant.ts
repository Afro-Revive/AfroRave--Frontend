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

export type GuestSort = 'newest' | 'oldest' | 'name'

export const GUEST_SORT_OPTIONS: { value: GuestSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
]

export const GUESTS_PER_PAGE = 20

