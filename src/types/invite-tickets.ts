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
export type InviteTicketResponse = ApiResponse<InviteTicketData[]>