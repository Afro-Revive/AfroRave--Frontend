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
