import type {
    AccessRequestData,
    AccessRequestResponse,
    ViewerAccessStatusResponse,
} from "@/types/private-event";
import api from "./http.service";

class PrivateEventService {


    // Request access to a private event
    async requestAccess(eventId: string): Promise<void> {
        const response = await api.post(`/api/PrivateEvent/${eventId}/request-access`);
        return response.data;
    }

    // Get Viewer Access Status for a private event
    async getViewerAccessStatus(eventId: string): Promise<ViewerAccessStatusResponse> {
        const response = await api.get(`/api/PrivateEvent/${eventId}/access-status`);
        return response.data;
    }

    // Get Access Requests (Organizer only)
    async getAccessRequests(
        eventId: string,
        params?: {
            status?: AccessRequestData["status"];
            pageNumber?: number;
            pageSize?: number;
            search?: string;
        },
    ): Promise<AccessRequestResponse> {
        const response = await api.get(`/api/PrivateEvent/${eventId}/access-requests`, { params });
        return response.data;
    }

    // Batch Approve or Deny Access Requests (Organizer only)
    async batchUpdateAccessRequests(
        eventId: string,
        data: {
            requestIds: string[];
            decision: "Approved" | "Deny";
        },
    ): Promise<void> {
        const response = await api.patch(`/api/PrivateEvent/${eventId}/access-requests`, data);
        return response.data;
    }

    // Update Application Deadline (Organizer only)
    async updateApplicationDeadline(
        eventId: string,
        data: { deadline: string},
    ): Promise<void> {
        const response = await api.patch(`/api/PrivateEvent/${eventId}/application-deadline`, data);
        return response.data;
    }

    // Pause or Resume Application (Organizer only)
    async updateApplicationStatus(
        eventId: string,
        data: { pause: boolean },
    ): Promise<void> {
        // pause is a query param that defaults to true server-side, so sending
        // it in the body meant every call paused and resume never landed.
        const response = await api.patch(`/api/PrivateEvent/${eventId}/pause-applications`, null, {
            params: { pause: data.pause },
        });
        return response.data;
    }

    // End Application (Organizer only)
    async endApplication(eventId: string): Promise<void> {
        const response = await api.patch(`/api/PrivateEvent/${eventId}/end-applications`);
        return response.data;
    }
    
}

export const privateEventService = new PrivateEventService();