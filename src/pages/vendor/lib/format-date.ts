import { format, isValid, parseISO } from 'date-fns'

function toDate(value?: string): Date | null {
  if (!value) return null
  const date = parseISO(value)
  return isValid(date) ? date : null
}

/** '2025-05-20T00:00:00' -> 'May 20th 2025', as on the vendor cards. */
export function formatVendorDate(value?: string): string {
  const date = toDate(value)
  return date ? format(date, 'MMMM do yyyy') : ''
}

/** '2025-04-28T10:00:00' -> 'Apr 28, 2025', for sentences and receipts. */
export function formatShortDate(value?: string): string {
  const date = toDate(value)
  return date ? format(date, 'MMM d, yyyy') : ''
}

/**
 * A timestamp from the API, like an application deadline. They're stored as UTC but sent
 * without a zone, so '2025-04-28T10:00:00' is read as 10:00 UTC (11:00 AM in Lagos).
 * Date-only values and ones with a zone are read as they are. Same rule as prod's parseApiDate.
 */
export function parseApiTimestamp(value?: string): Date | null {
  const hasZone = !!value && /(z|[+-]\d{2}:?\d{2})$/i.test(value)
  return toDate(value?.includes('T') && !hasZone ? `${value}Z` : value)
}

/** A deadline as 'Apr 28, 2025, 11:00 AM' in the vendor's own time. */
export function formatShortDateTime(value?: string): string {
  const date = parseApiTimestamp(value)
  return date ? format(date, 'MMM d, yyyy, h:mm a') : ''
}

/** Whether an API timestamp, like an application deadline, has passed. */
export function isPast(value?: string): boolean {
  const date = parseApiTimestamp(value)
  return !!date && date < new Date()
}
