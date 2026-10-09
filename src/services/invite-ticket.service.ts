import { InviteTicketResponse, InviteTicketRequest, InviteTicketByTokenResponse, InviteOnlyTicketAudienceResponse, EventOrdersResponse} from "@/types/invite-tickets";
import api from "./http.service";

class InviteTicketService {

    // Send Ticket Invite
    async sendTicketInvite(eventId: string, ticketId: string, data:InviteTicketRequest): Promise<void> {
        const response = await api.post(`/api/InviteTicket/${eventId}/ticket/${ticketId}/invites`, data);
        return response.data;
    }

    // Get Tickets Invites
    async getTicketInvites(ticketId: string): Promise<InviteTicketResponse> {
        const response = await api.get(`/api/InviteTicket/ticket/${ticketId}/invites`);
        return response.data;
    }

    // Get Invite Ticket by Token
    async getInviteTicketByToken(token: string): Promise<InviteTicketByTokenResponse> {
        const response = await api.get('/api/InviteTicket/details', { params: { token } });
        return response.data;
    }

    // Accept Invite Ticket
    async acceptInviteTicket(token: string): Promise<void> {
        const response = await api.post('/api/InviteTicket/accept', { token });
        return response.data;
    }

    // Update Invite email
    async updateInviteEmail(ticketId: string, inviteId: string, body: { email: string }): Promise<void> {
        const response = await api.patch(`/api/InviteTicket/ticket/${ticketId}/invites/${inviteId}/email`, body);
        return response.data;
    }

    // Get Invite-only Ticket audience
    async getInviteOnlyTicketAudience(eventId: string): Promise<InviteOnlyTicketAudienceResponse> {
        const response = await api.get(`/api/InviteTicket/${eventId}/audience`);
        return response.data;
    }

    // Get all event orders
    async getEventOrders(
        eventId: string,
        params?: { pageNumber?: number; pageSize?: number },
    ): Promise<EventOrdersResponse> {
        const response = await api.get(`/api/InviteTicket/${eventId}/orders`, { params });
        return response.data;
    }
}

export const inviteTicketService = new InviteTicketService();