import { feeKeys } from '@/lib/fee-keys'
import { feesService } from '@/services/fees.service'
import type { FeeConfigurationsResponse } from '@/types/admin'
import { useQuery } from '@tanstack/react-query'

/**
 * The fees an admin sets in the portal, as fractions (0.08 is 8%). Undefined
 * while they load, or when the fee isn't active.
 */
export interface PlatformFees {
  /** Added to new tickets at checkout, paid by the buyer. */
  ticketCheckout?: number
  /** Added to resale tickets at checkout, paid by the buyer. The seller gets the full price. */
  ticketResale?: number
  /** Added to a paid vendor slot, paid by the vendor. */
  vendorSlot?: number
  /** How far above the original price a resale may go: 0.3 means up to 130%. */
  resalePriceCap?: number
}

function activeRate(response: FeeConfigurationsResponse, feeType: string): number | undefined {
  const fee = response.data?.find((item) => item.feeType === feeType && item.isActive)
  return typeof fee?.percentageValue === 'number' ? fee.percentageValue : undefined
}

export function toPlatformFees(response: FeeConfigurationsResponse): PlatformFees {
  return {
    ticketCheckout: activeRate(response, 'TicketCheckoutTax'),
    ticketResale: activeRate(response, 'TicketResaleTax'),
    vendorSlot: activeRate(response, 'VendorSlotTax'),
    resalePriceCap: activeRate(response, 'ResalePriceCap'),
  }
}

export function usePlatformFees() {
  const query = useQuery({
    queryKey: feeKeys.all,
    queryFn: () => feesService.getFees(),
    select: toPlatformFees,
    // Fees change rarely; an admin's change shows within a few minutes.
    staleTime: 5 * 60 * 1000,
  })
  return { fees: query.data ?? {}, isLoading: query.isLoading, isError: query.isError }
}

/** The resale cap as the most a ticket may be listed for, matching the backend's check. */
export function maxResalePrice(originalPrice: number, cap: number): number {
  // The backend reads values of 1 or more as the multiplier itself (1.3), and less as the markup (0.3).
  const multiplier = cap >= 1 ? cap : 1 + cap
  return originalPrice * multiplier
}

/** 0.08 → "8%", 0.075 → "7.5%". */
export function formatFeePercent(rate: number): string {
  return `${Number((rate * 100).toFixed(2))}%`
}
