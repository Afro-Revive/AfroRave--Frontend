import { TicketResaleRequest, UsersResaleTicketsResponse } from "@/types/ticket";
import api from "./http.service";

class TicketService {

    /**
     * Resell tickets
     */
    async resellTickets(data: TicketResaleRequest[]): Promise<void> {
        const response = await api.post('/api/Profile/user/ticket/resale/list', data);
        return response.data;
    }

    /**
     * Get User's own Resale Listing
     */

    async getUsersResaleTickets(): Promise<UsersResaleTicketsResponse>{
        const response = await api.get('/api/Profile/user/ticket/resale/my');
        return response.data;

    }

}

export const ticketService = new TicketService();