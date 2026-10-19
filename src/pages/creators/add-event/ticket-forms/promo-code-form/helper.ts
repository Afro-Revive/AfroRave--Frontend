import type { UseFormReturn } from 'react-hook-form'
import type { TPromoCodeSchema } from '../../schemas/promo-code-schema'
import type { CreatePromoCodeRequest } from '@/types'
import { toApiDateTime } from '@/lib/helper-func'

/** The promo code form as a create request, for the Promo Codes page. */
export function populatePromoCodeJson(form: UseFormReturn<{ promoCodes: TPromoCodeSchema }>) {
  const formData = form.getValues().promoCodes

  const promoCodeJson: CreatePromoCodeRequest = {
    promocode: formData.code,
    discountType: 'Percentage',
    discountValue: Number(formData.discount),
    discountUsage: Number(formData.usageLimit),
    // The organizer's local dates and times, sent as UTC.
    startDate: toApiDateTime(formData.startDate),
    endDate: toApiDateTime(formData.endDate),
    promoCodedetails: {
      tickets: Array.isArray(formData.tickets)
        ? formData.tickets.map((ticket) => ({ id: ticket.id }))
        : [],
    },
    isMinimunSpend: formData.conditions.spend.minimum || false,
    minimumSpend: Number(formData.conditions.spend.amount) || 0,
    isMinimunTickets: formData.conditions.tickets.minimum || false,
    minimumTickets: Number(formData.conditions.tickets.quantity) || 0,
    note: formData.notes || '',
    isPrivate: false,
    isPartnership: formData.partnership.partnershipCode || false,
    partnerName: formData.partnership.name || '',
    comissionType: 'Percentage',
    comission: Number(formData.partnership.comissionRate) || 0,
  }

  return promoCodeJson
}
