import { TicketResaleRequest, TicketTransferRequest, UsersResaleTicketsResponse, VerifyTransferRecipientResponse } from "@/types/ticket";
import api from "./http.service";
import { ApiResponse } from "@/types";

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

    /**
     * Verify Transfer Recepient Identifier
     */

    async verifyTransferRecipient(recipientIdentifier: string): Promise<VerifyTransferRecipientResponse> {
        const response = await api.get('/api/Profile/user/ticket/transfer/verify-recipient', {
            params: { recipientIdentifier },
        });
        return response.data;
    }

    /**
     * Transfer Tickets Ownership
     */

    async transferTickets(data: TicketTransferRequest[]): Promise<ApiResponse<null>> {
        const response = await api.post('/api/Profile/user/ticket/transfer', data);
        return response.data;
    }

}

export const ticketService = new TicketService();