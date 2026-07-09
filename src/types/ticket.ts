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

export type UsersResaleTicketsResponse = ApiResponse<UsersResaleTickets>