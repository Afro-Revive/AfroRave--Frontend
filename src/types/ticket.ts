import { ApiResponse } from "./api";
export interface TicketResaleRequest {
    ticketId: string
    quantity: number
    price: number
}

export interface UsersResaleTickets{
    id: string;
    ticketId: string;
    ticketName: string;
    price: number;
    quantity: number;
    sellersUserId: string;
    sellerName: string;
    createdDate: string;
}

export interface VerifyTransferRecipient {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export type VerifyTransferRecipientResponse = ApiResponse<VerifyTransferRecipient>

export type UsersResaleTicketsResponse = ApiResponse<UsersResaleTickets>

export interface TicketTransferRequest {
    ticketId: string
    quantity: number
    recipientIdentifier: string
}