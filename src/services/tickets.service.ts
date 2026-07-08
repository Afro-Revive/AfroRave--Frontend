import { TicketResaleRequest } from "@/types/ticket";
import api from "./http.service";

class TicketService {

    /**
     * Resell tickets
     */
    async resellTickets(data: TicketResaleRequest[]): Promise<void> {
        await api.post('/api/profile/user/ticket/resale/list', data);
    }

}

export const ticketService = new TicketService();