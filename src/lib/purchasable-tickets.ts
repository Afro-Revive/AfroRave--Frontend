import type {
  PaginatedResponse,
  PurchasableTicket,
  ResaleListingData,
  TicketData,
} from '@/types'
import type { CartLineItem } from '@/types/cart'

const PRIMARY_CAPTION = '(includes fees)'

/** Flatten a primary-sale ticket page into cart-ready rows. */
export function toPurchasableTickets(
  tickets: PaginatedResponse<TicketData> | undefined,
): PurchasableTicket[] {
  return (tickets?.items ?? []).map((ticket) => ({
    cartKey: ticket.ticketId,
    ticketId: ticket.ticketId,
    name: ticket.ticketName,
    price: ticket.price,
    available: ticket.availableQuantity,
    caption: PRIMARY_CAPTION,
    source: 'primary',
  }))
}

/**
 * Flatten a resale listing page into cart-ready rows. Sold and cancelled
 * listings are dropped — only live offers are purchasable.
 */
export function toPurchasableResaleListings(
  listings: PaginatedResponse<ResaleListingData> | undefined,
): PurchasableTicket[] {
  return (listings?.items ?? [])
    .filter((listing) => listing.status === 'Active')
    .map((listing) => ({
      cartKey: listing.id,
      ticketId: listing.ticketId,
      listingId: listing.id,
      name: listing.ticketName,
      price: listing.price,
      available: listing.quantity,
      caption: `${listing.quantity} available · sold by ${listing.sellerName}`,
      source: 'resale',
    }))
}

/**
 * True when the cart holds something and all of it is resale. `listingId` is only
 * set on resale lines.
 */
export function isResaleOnlyCart(items: CartLineItem[]): boolean {
  return items.length > 0 && items.every((item) => Boolean(item.listingId))
}

/** Index rows by `cartKey` so cart lookups are one map hit instead of a scan per field. */
export function indexByCartKey(
  tickets: PurchasableTicket[],
): Map<string, PurchasableTicket> {
  return new Map(tickets.map((ticket) => [ticket.cartKey, ticket]))
}
