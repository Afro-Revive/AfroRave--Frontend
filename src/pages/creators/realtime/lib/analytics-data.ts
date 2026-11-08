import { parseApiDate, stripUnderscores } from '@/lib/helper-func'
import type { AnalyticsOrder, AnalyticsVendor, EventAttendee } from '@/types'
import type { VendorSlot } from '@/types/vendor'
import { addDays, differenceInCalendarDays, format, startOfDay } from 'date-fns'

/** The label the API uses when it doesn't know (no age, gender or town on file). */
const UNKNOWN = 'unknown'

export const isUnknown = (label: string) => label.trim().toLowerCase() === UNKNOWN

export interface CountItem {
  label: string
  count: number
}

/** Joining words that stay lower case mid-label: "Food and Beverage". */
const SMALL_WORDS = new Set(['and', 'of', 'the', 'for', 'in', 'on', 'at', 'to', 'or'])

/**
 * "lagos", "LAGOS" -> "Lagos". Keeps short all-caps words like "VIP" as they
 * are, and joining words lower case after the first.
 */
function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (word.length <= 3 && /[A-Z]/.test(word) && word === word.toUpperCase()) return word
      const lower = word.toLowerCase()
      if (index > 0 && SMALL_WORDS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

/**
 * Audience counts as the API sends them can repeat a label in another case
 * ("lagos" and "Lagos"). Merges those, title-cases them, biggest first, with
 * Unknown always last so it never reads as the top answer.
 */
export function mergeCounts(items: { label: string; count: number }[]): CountItem[] {
  const merged = new Map<string, CountItem>()

  for (const { label, count } of items) {
    const key = label.trim().toLowerCase()
    if (!key) continue
    const existing = merged.get(key)
    if (existing) existing.count += count
    else merged.set(key, { label: isUnknown(label) ? 'Unknown' : titleCase(label), count })
  }

  return [...merged.values()].sort((a, b) => {
    if (isUnknown(a.label) !== isUnknown(b.label)) return isUnknown(a.label) ? 1 : -1
    return b.count - a.count
  })
}

/** Age ranges in age order ("18-24" before "25-34"), Unknown last. */
export function sortAgeGroups(items: CountItem[]): CountItem[] {
  const start = (label: string) => Number.parseInt(label, 10)
  return [...items].sort((a, b) => {
    if (isUnknown(a.label) !== isUnknown(b.label)) return isUnknown(a.label) ? 1 : -1
    const byAge = (start(a.label) || 0) - (start(b.label) || 0)
    return byAge || a.label.localeCompare(b.label)
  })
}

export interface SalesDay {
  /** yyyy-MM-dd, local. */
  day: string
  tickets: number
  revenue: number
  orders: number
  /** Tickets sold up to and including this day. */
  totalTickets: number
}

/**
 * Orders by local day, from the first order to the last, with the quiet days
 * in between filled with zeroes so the line moves with time, not with orders.
 */
export function salesByDay(orders: AnalyticsOrder[]): SalesDay[] {
  if (orders.length === 0) return []

  const byDay = new Map<string, { tickets: number; revenue: number; orders: number }>()
  const dates = orders.map((order) => startOfDay(parseApiDate(order.date)))

  orders.forEach((order, index) => {
    const key = format(dates[index], 'yyyy-MM-dd')
    const day = byDay.get(key) ?? { tickets: 0, revenue: 0, orders: 0 }
    day.tickets += order.quantity
    day.revenue += order.amount
    day.orders += 1
    byDay.set(key, day)
  })

  const first = new Date(Math.min(...dates.map(Number)))
  const last = new Date(Math.max(...dates.map(Number)))
  const days: SalesDay[] = []
  let totalTickets = 0

  for (let offset = 0; offset <= differenceInCalendarDays(last, first); offset++) {
    const key = format(addDays(first, offset), 'yyyy-MM-dd')
    const day = byDay.get(key) ?? { tickets: 0, revenue: 0, orders: 0 }
    totalTickets += day.tickets
    days.push({ day: key, ...day, totalTickets })
  }

  return days
}

export interface TicketSales {
  ticketName: string
  tickets: number
  revenue: number
}

/** Order totals per ticket type, biggest first. */
export function salesByTicket(orders: AnalyticsOrder[]): TicketSales[] {
  const byTicket = new Map<string, TicketSales>()

  for (const order of orders) {
    const ticketName = order.ticketName?.trim() || 'Unnamed ticket'
    const entry = byTicket.get(ticketName) ?? { ticketName, tickets: 0, revenue: 0 }
    entry.tickets += order.quantity
    entry.revenue += order.amount
    byTicket.set(ticketName, entry)
  }

  return [...byTicket.values()].sort((a, b) => b.revenue - a.revenue)
}

/** How many people bought, counting each email once. */
export function countBuyers(orders: AnalyticsOrder[]) {
  return new Set(orders.map((order) => order.email?.toLowerCase()).filter(Boolean)).size
}

export type VendorStage = 'Requested' | 'Pending' | 'Secured' | 'Rejected'

/** The order the stages are shown in: how far an application got. */
export const VENDOR_STAGES: VendorStage[] = ['Secured', 'Pending', 'Requested', 'Rejected']

/**
 * Pending is accepted but not yet paid. The API's "Accepted" (free slots, or
 * older rows) counts as Secured, since there's nothing left to pay.
 */
export function vendorStage(status?: string | null): VendorStage {
  switch (status?.toLowerCase()) {
    case 'secured':
    case 'accepted':
    case 'paid':
      return 'Secured'
    case 'pending':
      return 'Pending'
    case 'rejected':
    case 'declined':
      return 'Rejected'
    default:
      return 'Requested'
  }
}

/**
 * Whether an application is for a stall (Revenue) or a service offer. The
 * analytics vendor list doesn't say, so it's matched by name to the event's
 * slots: a stall's slotName, or an offer's serviceName.
 */
export function vendorKind(vendor: AnalyticsVendor, slots: VendorSlot[]): VendorSlot['vendorType'] | undefined {
  const name = vendor.stallName?.trim().toLowerCase()
  if (!name) return undefined
  return slots.find((slot) => {
    const details = slot.vendorDetails
    const slotName = slot.vendorType === 'Revenue' ? details?.slotData?.slotName : details?.serviceData?.serviceName
    return slotName?.trim().toLowerCase() === name
  })?.vendorType
}

export function vendorStageCounts(vendors: AnalyticsVendor[]): Record<VendorStage, number> {
  const counts: Record<VendorStage, number> = { Requested: 0, Pending: 0, Secured: 0, Rejected: 0 }
  for (const vendor of vendors) counts[vendorStage(vendor.status)] += 1
  return counts
}

export function vendorsByCategory(vendors: AnalyticsVendor[]): CountItem[] {
  return mergeCounts(
    vendors.map((vendor) => ({ label: stripUnderscores(vendor.category ?? '') || 'Other', count: 1 })),
  )
}

/** Tickets on the event's list, and how many of them have been scanned in. */
export function attendeeCounts(attendees: EventAttendee[]) {
  const tickets = attendees.reduce((sum, attendee) => sum + (attendee.quantity || 1), 0)
  const checkedIn = attendees
    .filter((attendee) => attendee.isCheckedIn)
    .reduce((sum, attendee) => sum + (attendee.quantity || 1), 0)
  return { tickets, checkedIn }
}

/** Short dates for chart axes and tooltips: "3 Oct". */
export const formatDay = (day: string) => format(parseApiDate(day), 'd MMM')
