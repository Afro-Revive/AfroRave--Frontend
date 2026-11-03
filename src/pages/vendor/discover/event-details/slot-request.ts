import { formatNaira } from '@/lib/format-price'
import type { VendorApplicationRequest, VendorSlot } from '@/types/vendor'
import { isPast } from '../../lib/format-date'
import { withPlatformFee } from '../../slots/slot-status'

/** A slot the vendor has added to "Your Slots", waiting to be requested. */
export interface SlotCartItem {
  slot: VendorSlot
  quantity: number
  /** Service offers only: the price the vendor proposes. */
  priceOffer?: number
}

export type SlotAvailability = 'open' | 'closed' | 'paused' | 'sold_out'

export function isRevenueSlot(slot: VendorSlot): boolean {
  return slot.vendorType === 'Revenue'
}

export function getSlotTitle(slot: VendorSlot): string {
  const details = slot.vendorDetails
  return (isRevenueSlot(slot) ? details?.slotData?.slotName : details?.serviceData?.serviceName) || slot.vendorName
}

export function getSlotDeadline(slot: VendorSlot): string | undefined {
  const details = slot.vendorDetails
  const deadline = isRevenueSlot(slot) ? details?.slotData?.applicationDeadline : details?.serviceData?.applicationDeadline
  return deadline || details?.applicationDeadline || undefined
}

/** Stalls left on a revenue slot. */
export function getSlotsLeft(slot: VendorSlot): number {
  return slot.vendorDetails?.slotData?.slotNumber ?? 0
}

export function getSlotAvailability(slot: VendorSlot, eventEnded: boolean): SlotAvailability {
  if (eventEnded) return 'closed'
  const status = (slot.vendorDetails?.status || slot.status || '').toLowerCase()
  if (status.includes('pause')) return 'paused'
  if (isPast(getSlotDeadline(slot))) return 'closed'
  if (isRevenueSlot(slot) && getSlotsLeft(slot) <= 0) return 'sold_out'
  return 'open'
}

/** What the list shows under the slot's name: the price with fees, or the organizer's budget. */
export function getSlotPriceLabel(slot: VendorSlot): string {
  if (isRevenueSlot(slot)) return formatNaira(withPlatformFee(slot.vendorDetails?.slotData?.price ?? 0))
  const service = slot.vendorDetails?.serviceData
  if (!service) return ''
  return service.hasBudgetRange
    ? `${formatNaira(service.minBudget)} - ${formatNaira(service.maxBudget)}`
    : formatNaira(service.minBudget)
}

/** A cart line's total: stalls × price with fees, or the proposed price. */
export function getCartItemTotal(item: SlotCartItem): number {
  if (isRevenueSlot(item.slot)) return withPlatformFee(item.slot.vendorDetails?.slotData?.price ?? 0) * item.quantity
  return item.priceOffer ?? 0
}

/** The body for POST /api/Event/vendor/apply. */
export function toApplicationRequest({ slot, quantity, priceOffer }: SlotCartItem): VendorApplicationRequest {
  const { slotData, serviceData, contact } = slot.vendorDetails
  return {
    eventId: slot.eventId,
    eventVendorId: slot.vendorId,
    vendorId: slot.vendorId,
    requestedSlots: quantity,
    noOfRequestedSlots: quantity,
    priceOffer: isRevenueSlot(slot) ? null : (priceOffer ?? 0),
    message: '',
    vendorType: slot.vendorType,
    category: slot.vendorCategory,
    description: slot.description,
    vendorDetails: {
      slotData: {
        slotName: slotData?.slotName ?? '',
        slotNumber: quantity,
        price: slotData?.price ?? 0,
        applicationDeadline: slotData?.applicationDeadline ?? '',
      },
      serviceData: {
        serviceName: serviceData?.serviceName ?? '',
        hasBudgetRange: serviceData?.hasBudgetRange ?? false,
        minBudget: serviceData?.minBudget ?? 0,
        maxBudget: serviceData?.maxBudget ?? 0,
        startTime: serviceData?.startTime ?? '',
        stopTime: serviceData?.stopTime ?? '',
        startDate: serviceData?.startDate ?? '',
        endDate: serviceData?.endDate ?? '',
        applicationDeadline: serviceData?.applicationDeadline ?? '',
      },
      contact: {
        useDifferentContactDetails: false,
        email: contact?.email ?? '',
        phoneNumbers: contact?.phoneNumbers ?? [],
      },
      hideSocialLinks: slot.vendorDetails.hideSocialLinks ?? false,
      status: slot.vendorDetails.status ?? '',
      applicationDeadline: slot.vendorDetails.applicationDeadline ?? '',
    },
  }
}
