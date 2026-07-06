import { ApiResponse } from "./api"

export interface OrderReceiptDetailsData {
    customerName: string
    customerEmail: string
    eventName: string
    items: {
        ticketId: string
        ticketName: string
        quantity: number
        price: number
    }[]
    orderId: string
    orderCode: string
    ticketCount: number
    status: string
    paymentMethod: string
    cost: number
    tax: number
    totalPaid: number
    purchaseDate: string
}

export type OrderReceiptDetailsResponse = ApiResponse<OrderReceiptDetailsData>