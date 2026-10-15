import type { UseFormReturn } from 'react-hook-form'
import type { TPromoCodeSchema } from '../../schemas/promo-code-schema'
import type { CreatePromoCodeRequest, PromoCodeWithDetailsResponse } from '@/types'
import type {
  useCreatePromoCode,
  useDeletePromoCode,
  useUpdatePromoCode,
} from '@/hooks/use-event-mutations'
import { defaultPromoCodeValues } from '../../schemas/promo-code-schema'
import { fromApiDateTime, toApiDateTime } from '@/lib/helper-func'

interface IHelperFunctionProps {
  form: UseFormReturn<{ promoCodes: TPromoCodeSchema }>
  setCurrentPromoCode: (value: boolean) => void
  setEditingPromoId: (id: string | null) => void
}

export function populatePromoCodeJson(form: IHelperFunctionProps['form']) {
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

export function createPromoCode(
  form: IHelperFunctionProps['form'],
  setCurrentPromoCode: IHelperFunctionProps['setCurrentPromoCode'],
  setEditingPromoId: IHelperFunctionProps['setEditingPromoId'],
  eventId: string | null,
  createPromoCodeMutation: ReturnType<typeof useCreatePromoCode>,
) {
  const newPromoCode: CreatePromoCodeRequest = populatePromoCodeJson(form)

  createPromoCodeMutation.mutate(
    { ...newPromoCode, eventId: eventId || '' },
    {
      onSuccess: () => {
        form.reset({ promoCodes: defaultPromoCodeValues })
        setCurrentPromoCode(false)
        setEditingPromoId(null)
      },
    },
  )
}

export function updatePromoCode(
  form: IHelperFunctionProps['form'],
  editingPromoId: string | null,
  setCurrentPromoCode: IHelperFunctionProps['setCurrentPromoCode'],
  setEditingPromoId: IHelperFunctionProps['setEditingPromoId'],
  updatePromoCode: ReturnType<typeof useUpdatePromoCode>,
) {
  const updatedPromoCode: CreatePromoCodeRequest = populatePromoCodeJson(form)
  console.log('Updating promo code:', updatedPromoCode)

  updatePromoCode.mutate(
    { promoId: editingPromoId || '', data: updatedPromoCode },
    {
      onSuccess: () => {
        form.reset({ promoCodes: defaultPromoCodeValues })
        setCurrentPromoCode(false)
        setEditingPromoId(null)
      },
    },
  )
}

export function addPromoCode(
  form: IHelperFunctionProps['form'],
  setEditingPromoId: IHelperFunctionProps['setEditingPromoId'],
  setCurrentPromoCode: IHelperFunctionProps['setCurrentPromoCode'],
) {
  form.reset({ promoCodes: defaultPromoCodeValues })
  setEditingPromoId(null)
  setCurrentPromoCode(true)
}

export function handleEditPromoCode(
  promoCode: PromoCodeWithDetailsResponse,
  form: IHelperFunctionProps['form'],
  setEditingPromoId: IHelperFunctionProps['setEditingPromoId'],
  setCurrentPromoCode: IHelperFunctionProps['setCurrentPromoCode'],
) {
  if (!promoCode) return

  console.log('PromoCode object structure:', promoCode)

  const formPromoCode = {
    code: promoCode.promoCode,
    discount: String(promoCode.discountValue),
    usageLimit: String(promoCode.discountUsage),
    tickets: promoCode.promoDetails.tickets,
    // Stored in UTC; the form shows the organizer's local time.
    startDate: fromApiDateTime(promoCode.startDate) ?? defaultPromoCodeValues.startDate,
    endDate: fromApiDateTime(promoCode.endDate) ?? defaultPromoCodeValues.endDate,
    conditions: {
      spend: { minimum: promoCode.isMinimunSpend, amount: String(promoCode.minimumSpend) },
      tickets: {
        minimum: promoCode.isMinimunTickets,
        quantity: String(promoCode.minimumTickets),
      },
    },
    notes: promoCode.note,
    partnership: {
      partnershipCode: promoCode.isPartnership,
      name: promoCode.partnerName,
      comission: !!promoCode.comission,
      comissionRate: String(promoCode.comission),
    },
  }

  form.reset({ promoCodes: formPromoCode })
  setEditingPromoId(promoCode.promocodeId)
  setCurrentPromoCode(true)
}

export function handleDeletePromoCode(
  promoId: string,
  deletePromoCode: ReturnType<typeof useDeletePromoCode>,
) {
  deletePromoCode.mutate(promoId)
}

export function handleCancelEdit(
  form: IHelperFunctionProps['form'],
  setEditingPromoId: IHelperFunctionProps['setEditingPromoId'],
  setCurrentPromoCode: IHelperFunctionProps['setCurrentPromoCode'],
) {
  form.reset({ promoCodes: defaultPromoCodeValues })
  setEditingPromoId(null)
  setCurrentPromoCode(false)
}

export function onSubmit(handleFormChange: (form: string) => void) {
  handleFormChange('upgrades')
}
