import { ApiResponse } from "./api"

export interface InviteTicketRequest{
    ticketId: string
    categoryIds: string[]
    guestIds: string[]
    manualGuests?: {
        name: string
        email: string
        categoryId?: string
        categoryIds?: string[]
    }[]
}

export interface InviteTicketData{
    inviteId: string
    ticketId: string
    ticketName: string
    eventId: string
    eventName: string
    name: string
    email: string
    status: string
    token: string
    price: number
    sentAt: string
    acceptedAt: string
    expiredAt: string
}

export interface InviteTicketByTokenData{
    inviteId: string
    token: string
    invitedEmail: string
    maskedEmail: string
    guestName: string
    eventName: string
    eventId: string
    ticketName: string
    price: number
    isFree: boolean
    status: string
    isExpired: boolean
    organizerName: string
    companyName: string
    authorizationUrl: string
    reference: string
}

export interface InviteOnlyTicketAudienceData{
    inviteId: string
    guestName: string
    email: string
    status: string
    ticketName: string
    ticketId: string
    acceptedAt: string
    sentAt: string
    userTicketId: number
}

export interface EventOrdersData{
    orderId: string
    orderCode: string
    ticketCount: number
    status: string
    paymentMethod: string
    cost: number
    tax: number
    customerName: string
    customerEmail: string
    items: {
        ticketId: string
        ticketName: string
        quantity: number
        price: number
        isResale: boolean
        sellerName: string
    }[]
    purchaseDate: string
}

export type EventOrdersResponse = ApiResponse<EventOrdersData[]>
export type InviteOnlyTicketAudienceResponse = ApiResponse<InviteOnlyTicketAudienceData[]>
export type InviteTicketByTokenResponse = ApiResponse<InviteTicketByTokenData>
/**
 * What accepting an invite returns. A free invite is issued there and then
 * (requiresPayment false). A paid one becomes PaymentPending with 5 days to
 * pay, and comes with its Paystack checkout (authorizationUrl, reference).
 * Verifying that payment answers in the same shape.
 */
export interface AcceptInviteTicketData {
  requiresPayment: boolean
  price: number
  /** The invite's new status: 'Issued' when free, 'PaymentPending' when paid. */
  status: string
  /** Why, for the guest: "Payment required to issue ticket. You have 5 days…". */
  message: string
  userTicketId: string | null
  reference: string | null
  authorizationUrl: string | null
}

export type AcceptInviteTicketResponse = ApiResponse<AcceptInviteTicketData>
export type InviteTicketResponse = ApiResponse<InviteTicketData[]>