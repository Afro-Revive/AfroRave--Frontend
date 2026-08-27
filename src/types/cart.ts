import type { UUID } from 'node:crypto'
import type { ApiResponse } from './api'

export interface CartData {
  cartId: number
  ticketId: string
  ticketName: string
  price: number
  quantity: number
  eventId: UUID
  eventName: string
  venue: string
  startDate: Date
  endDate: Date
  createdDate: Date
  reservationExpiry: Date
  reservationStatus: string
  timeUntilExpiry: string // '57828384466181221638698875611538377095590350603083566088881511713074734940.28:27:38.49551'
}

export interface CreateCartRequest {
  ticketId: string
  quantity: number
}

/**
 * A line in the local cart. Keyed by `cartKey` rather than `ticketId` because two
 * sellers can list the same ticket type on the resale market — keying by ticketId
 * would merge those listings into one line at the wrong price.
 */
export interface CartLineItem extends CreateCartRequest {
  /** Matches `PurchasableTicket.cartKey`: ticketId for primary, listing id for resale. */
  cartKey: string
  /** Set only on resale lines. */
  listingId?: string
}

/**
 * Wire format for creating a cart line on the server. The server needs to know the underlying ticketId of a resale listing, so we send that as `resellTicketId`.
 */
export type UpdatedCreateCartRequest =
  | { ticketId: string; quantity: number }
  | { quantity: number; listingId: string; resellTicketId: string }

export interface CreateCartResponse {
  message: string
  data: {
    id: number
    quantity: number
    ticketId: string
    userId: string
    createdDate: string
    updatedDate: string
    reservationExpiry: string // '2025-09-21T10:52:41.2841126'
    ticket: {
      ticketId: string
      ticketName: string
      accessType: string
      salesType: string
      ticketType: string
      quantity: number
      price: number
      purchaseLimit: number
      groupSize: number
      validDays: number
      description: string
      metadata: string
      eventId: string
      createdDate: string
      updatedDate: null | string
      usedQuantity: number
      event: null
      eventTicketUpgradeFromTicketNavigations: []
      eventTicketUpgradeToTicketNavigations: []
      resellTickets: []
      transferTickets: []
      userCarts: []
      userTickets: []
    }
    user: null
  }
}

export type GetAllCartResponse = ApiResponse<CartData[]>

export interface GetCartData {
  message: string
  data: CartData
  cursor: string
  id: UUID
  status: boolean
  statusCode: number
}

export type GetCartResponse = ApiResponse<GetCartData>

export interface CheckoutData {
  message: string
  data: {
    orderId: string
    totalAmount: number
    tax: number
    discount: number
    status: string
    createdDate: Date
    items: CartData[]
  }
  cursor: 'string'
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  status: true
  statusCode: 0
}

export type CheckoutResponse = ApiResponse<CheckoutData>

export interface ValidatePromocodeRequest {
  promoCode: string
  eventIds: string[]
  subtotal: number
  totalTickets: number
  ticketIds: string[]
}

export interface InitializePaymentResponse {
  message: string
  data:{
  authorizationUrl: string
  accessCode: string
  reference: string
}
  cursor: string
  id: UUID
  status: boolean
  statusCode: number
}

export interface CheckoutRequest {
  paymentMethod: string
  promoCodeId?: string | null
  transactionReference: string
}

export interface CheckoutResponseData {
  message: string
  data: {
    orderId: string
    totalAmount: number
    tax: number
    discount: number
    status: string
    createdDate: Date
    items: CartData[]
  }
  cursor: string
  id: UUID
  status: boolean
  statusCode: number
}

export interface PromoValidationResult {
  isValid: boolean
  message: string
  discountAmount: number
  discountType: string
  discountValue: number
  promoCodeId: UUID
  promoCodeDetails: {
    tickets: { id: UUID }[]
    isMinimumSpend: boolean
    minimumSpend: number
    isMinimumTicket: boolean
    minimumTicket: number
    note: string | null
    isPrivate: boolean
    isPartnership: boolean
    partnerName: string
    commisionType: string
    commission: number
  }
}

export interface ValidatePromocodeData {
  message: string
  data: PromoValidationResult
  cursor: string
  id: UUID
  status: boolean
  statusCode: number
}

export type ValidatePromocodeResponse = ValidatePromocodeData
