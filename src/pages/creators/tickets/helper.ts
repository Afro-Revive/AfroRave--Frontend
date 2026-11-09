import { fromApiDateTime, parseApiDate } from '@/lib/helper-func'
import type { TicketData } from '@/types'
import type { UnifiedTicketForm } from '../add-event/schemas/ticket-schema'
import type { TicketType } from '../add-event/ticket-forms/create/helper'

/** The API's ticketType, as the form's discriminated union spells it. */
export function toTicketType(ticketType?: TicketData['ticketType']): TicketType {
  if (ticketType === 'Group') return 'group_ticket'
  if (ticketType === 'MultiDay') return 'multi_day'

  return 'single_ticket'
}

/** A saved ticket as form values, so the inline composer can edit it. */
export function toTicketFormValues(ticket: TicketData): UnifiedTicketForm {
  const ticketType = toTicketType(ticket.ticketType)
  const isUnlimited = ticket.quantity === 0

  const base = {
    ticketName: ticket.ticketName,
    type: ticket.price > 0 ? ('paid' as const) : ('free' as const),
    invite_only: ticket.accessType === 'Invite',
    salesType: ticket.salesType === 'Door' ? 'door' : 'online',
    quantity: {
      availability: isUnlimited ? ('unlimited' as const) : ('limited' as const),
      amount: isUnlimited ? undefined : String(ticket.quantity),
    },
    price: String(ticket.price ?? 0),
    purchase_limit: String(ticket.purchaseLimit ?? 1),
    description: ticket.description?.trim() || ticket.ticketDetails?.description?.trim() || '',
  }

  if (ticketType === 'group_ticket') {
    return {
      ...scheduling(ticket),
      ticket: { ...base, ticketType: 'group_ticket', group_size: String(ticket.groupSize ?? 2) },
    }
  }

  if (ticketType === 'multi_day') {
    return {
      ...scheduling(ticket),
      ticket: { ...base, ticketType: 'multi_day', days_valid: String(ticket.validDays ?? 1) },
    }
  }

  return { ...scheduling(ticket), ticket: { ...base, ticketType: 'single_ticket' } }
}

/**
 * saleBegins is only meaningful when the ticket isn't already on sale, so an
 * immediate ticket comes back with no scheduled date to re-confirm.
 */
function scheduling(ticket: TicketData) {
  const saleBegins = ticket.ticketDetails?.saleBegins
  const startsImmediately = ticket.ticketDetails?.saleImmediately ?? !saleBegins

  const base = {
    allow_ticket_resell: ticket.ticketDetails?.allowResell ?? false,
  }

  if (startsImmediately || !saleBegins) {
    return { ...base, whenToStart: 'immediately' as const, scheduledDate: undefined }
  }

  // Stored in UTC; the form shows the organizer's local time.
  const scheduledDate = fromApiDateTime(saleBegins)

  if (!scheduledDate) {
    return { ...base, whenToStart: 'immediately' as const, scheduledDate: undefined }
  }

  return { ...base, whenToStart: 'at-a-scheduled-date' as const, scheduledDate }
}

/** "12 Oct 2026", or a dash for a missing or unparseable date. */
export function formatShortDate(value?: string | null): string {
  if (!value) return '—'

  // API timestamps are UTC without a zone ('2026-10-14T16:56:02.8').
  const date = parseApiDate(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
