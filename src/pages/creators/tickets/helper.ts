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

  const date = new Date(saleBegins)

  if (Number.isNaN(date.getTime())) {
    return { ...base, whenToStart: 'immediately' as const, scheduledDate: undefined }
  }

  const hours = date.getHours()

  return {
    ...base,
    whenToStart: 'at-a-scheduled-date' as const,
    scheduledDate: {
      date,
      hour: String(hours % 12 || 12).padStart(2, '0'),
      minute: String(date.getMinutes()).padStart(2, '0'),
      period: (hours >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    },
  }
}
