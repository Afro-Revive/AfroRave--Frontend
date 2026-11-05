/** Eight rows, matching the mock's "Showing 1-8 of 100 requests". */
export const ACCESS_REQUESTS_PAGE_SIZE = 8

/** There's no denying: a request that isn't approved stays pending. */
export type AudienceTab = 'Pending' | 'Approved'

export const AUDIENCE_TABS: AudienceTab[] = ['Pending', 'Approved']

export const AUDIENCE_NOTES = ["Approvals are final. Approved access can't be revoked."]
