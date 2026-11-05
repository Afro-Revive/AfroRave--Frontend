import type { UseFormReturn } from 'react-hook-form'
import { defaultPromoCodeValues, type TPromoCodeSchema } from '../../schemas/promo-code-schema'
import type { CreatePromoCodeRequest, PromoCodeData } from '@/types'
import { fromApiDateTime, toApiDateTime } from '@/lib/helper-func'

/** A saved promo code as form values, to edit it. The reverse of populatePromoCodeJson. */
export function promoCodeToFormValues(promocode: PromoCodeData): TPromoCodeSchema {
  const details = promocode.promoDetails

  return {
    ...defaultPromoCodeValues,
    code: promocode.promoCode,
    discount: String(promocode.discountValue ?? ''),
    usageLimit: String(promocode.discountUsage ?? ''),
    // Saved in UTC; the form shows the organizer's local date and time.
    startDate: fromApiDateTime(promocode.startDate) ?? defaultPromoCodeValues.startDate,
    endDate: fromApiDateTime(promocode.endDate) ?? defaultPromoCodeValues.endDate,
    tickets: details?.tickets?.map((ticket) => ({ id: ticket.id })) ?? [],
    conditions: {
      spend: {
        minimum: details?.isMinimumSpend ?? false,
        amount: details?.isMinimumSpend ? String(details.minimumSpend) : '',
      },
      tickets: {
        minimum: details?.isMinimumTicket ?? false,
        quantity: details?.isMinimumTicket ? String(details.minimumTicket) : '',
      },
    },
    notes: details?.note ?? '',
    partnership: {
      partnershipCode: details?.isPartnership ?? false,
      name: details?.partnerName ?? '',
      comission: (details?.commission ?? 0) > 0,
      comissionRate: details?.commission ? String(details.commission) : '',
    },
  }
}

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
