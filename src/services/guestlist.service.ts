import type { ApiResponse } from "@/types/api";
import { CategoryResponse, CreateGuestRequest, EventCheckinListResponse, EventGuestlistConfigResponse, GuestListData, GuestListResponse } from "@/types/guestlist";
import api from "./http.service";

class GuestListService {

    // Get Organizer Guest
    // params rather than a template string: without a category this was sending
    // the literal `?categoryId=undefined`.
    async getOrganizerGuestList(params?: {
        categoryId?: string
        pageNumber?: number
        pageSize?: number
        search?: string
        /** Not yet honoured server-side — sent so it works once it is. */
        sort?: string
    }): Promise<GuestListResponse> {
        const response = await api.get('/api/GuestList', { params });
        return response.data;
    }

    // Add Guest to Organizer Guest List
    // Returns the created guest. Its id is at data.id — the envelope carries an
    // id of its own, always the zero GUID, which is not the guest's.
    async addGuestList(data: CreateGuestRequest): Promise<ApiResponse<GuestListData>>{
        const response = await api.post('/api/GuestList', data);
        return response.data;
    }

    // Delete Guest from Organizer Guest List
    async deleteGuestList(guestId: string): Promise<void>{
        const response = await api.delete(`/api/GuestList/${guestId}`);
        return response.data;
    }

    // Get Organizer Categories
    async getOrganizerCategories(): Promise<CategoryResponse> {
        const response = await api.get('/api/GuestList/categories');
        return response.data;
    }

    // Add Category to Organizer Guest List
    async addCategory(data: { name: string }): Promise<CategoryResponse> {
        const response = await api.post('/api/GuestList/categories', data);
        return response.data;
    }

    // Delete Category from Organizer Guest List
    async deleteCategory(categoryId: string): Promise<void> {
        const response = await api.delete(`/api/GuestList/categories/${categoryId}`);
        return response.data;
    }

    // Bulk Upload Guests to Organizer Guest List via CSV
    async bulkUploadGuests(data: FormData): Promise<void> {
        const response = await api.post('/api/GuestList/upload-csv', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    // Download CSV Template for Bulk Upload
    async downloadCSVTemplate(): Promise<Blob> {
        const response = await api.get('/api/GuestList/template', {
            responseType: 'blob',
        });
        return response.data;
    }

    // Get Event Gueslist Configuration
    async getEventGuestListConfig(eventId: string): Promise<EventGuestlistConfigResponse> {
        const response = await api.get(`/api/Guestlist/event/${eventId}`);
        return response.data;
    }

    // Get Event Checkin List
    async getEventCheckinList(eventId: string, search?: string): Promise<EventCheckinListResponse> {
        const response = await api.get(`/api/Guestlist/event/${eventId}/checkin-list`, {
            params: search ? { search } : undefined,
        });
        return response.data;
    }

    // Configure an event to an organizer's guest list
    async configureEventGuestList(eventId: string, data: { categoryIds: string[], individualGuestIds: string[] }): Promise<void> {
        const response = await api.post(`/api/Guestlist/event/${eventId}/configure`, data);
        return response.data;
    }
}

export const guestListService = new GuestListService();
