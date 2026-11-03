import type { EventDetailData } from '@/types'
import type { VendorApplications } from '@/types/vendor'

/**
 * Where a vendor's application stands, as the dashboard shows it. The API only sends
 * Pending, Approved, Rejected and Secured; expired and completed are worked out here
 * from the payment deadline and the event's end date.
 */
export type SlotStatus = 'in_review' | 'approved' | 'secured' | 'rejected' | 'expired' | 'completed'

export function isRevenueApplication(application: VendorApplications): boolean {
  return application.vendorType === 'Revenue'
}

export function getSlotName(application: VendorApplications): string {
  const details = application.vendorDetails
  return (
    (isRevenueApplication(application) ? details?.slotData?.slotName : details?.serviceData?.serviceName) ??
    application.category
  )
}

export function getApplicationDeadline(application: VendorApplications): string | undefined {
  const details = application.vendorDetails
  const deadline = isRevenueApplication(application)
    ? details?.slotData?.applicationDeadline
    : details?.serviceData?.applicationDeadline
  return deadline || details?.applicationDeadline || undefined
}

/** Falls back to the start date when the full event hasn't loaded. */
export function hasEventEnded(application: VendorApplications, event?: EventDetailData): boolean {
  const end = event?.eventDate?.endDate ?? application.eventStartDate
  if (!end) return false
  const endDate = new Date(end)
  if (!event) endDate.setHours(23, 59, 59, 999)
  return endDate < new Date()
}

function isPastDeadline(application: VendorApplications): boolean {
  const deadline = getApplicationDeadline(application)
  return !!deadline && new Date(deadline) < new Date()
}

export function getSlotStatus(application: VendorApplications, event?: EventDetailData): SlotStatus {
  const ended = hasEventEnded(application, event)
  switch (application.status?.toLowerCase()) {
    case 'rejected':
      return 'rejected'
    case 'expired':
      return 'expired'
    case 'secured':
    case 'completed':
      return ended ? 'completed' : 'secured'
    case 'approved':
    case 'accepted':
      // Revenue vendors must pay before the deadline; service vendors are paid by the organizer.
      if (ended) return isRevenueApplication(application) ? 'expired' : 'completed'
      return isRevenueApplication(application) && isPastDeadline(application) ? 'expired' : 'approved'
    default:
      return 'in_review'
  }
}

/** Approved revenue slots waiting on the vendor's payment. */
export function needsPayment(application: VendorApplications, event?: EventDetailData): boolean {
  return isRevenueApplication(application) && getSlotStatus(application, event) === 'approved'
}

/** Platform fee added on top of the organizer's slot price, e.g. 0.08 for 8%. */
const PLATFORM_FEE = Number(import.meta.env.VITE_VENDOR_APPLICATIONS_PERCENTAGE) || 0

/** Slot price × slots requested. */
export function getSlotFee(application: VendorApplications): number {
  return (application.vendorDetails?.slotData?.price ?? 0) * Math.max(application.requestedSlots ?? 1, 1)
}

/** A revenue price with the platform fee added: what vendors are shown and pay. */
export function withPlatformFee(price: number): number {
  return Math.round(price * (1 + PLATFORM_FEE))
}

/** What the vendor pays: the slot fee plus the platform fee. */
export function getAmountDue(application: VendorApplications): number {
  return withPlatformFee(getSlotFee(application))
}
