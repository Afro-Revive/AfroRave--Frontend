/** 2026-11-03T10:20:46 → 3 Nov 2026, 10:20 */
export function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 2026-11-03 (or a full timestamp) → 3 Nov 2026 */
export function formatDay(value?: string | null): string {
  if (!value) return '—'
  // A bare yyyy-MM-dd is read as UTC midnight; pin it to local midnight instead.
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** 0.08 → 8%, 0.065 → 6.5% */
export function formatPercent(fraction?: number | null): string {
  if (fraction === null || fraction === undefined) return '—'
  return `${Math.round(fraction * 10000) / 100}%`
}

/** The API sends both paystack and Paystack. */
export function paymentMethodLabel(method?: string | null): string {
  if (!method) return '—'
  const lower = method.toLowerCase()
  if (lower === 'paystack') return 'Paystack'
  if (lower === 'free') return 'Free'
  if (lower === 'invite') return 'Invite'
  if (lower === 'wallet') return 'Wallet'
  return method
}

/** TicketCheckoutTax → Ticket Checkout Tax */
export function feeTypeLabel(feeType: string): string {
  return feeType.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function fullName(firstName?: string | null, lastName?: string | null): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim()
}
