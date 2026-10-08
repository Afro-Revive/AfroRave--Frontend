import type { VendorAvailableEventsResponse } from "@/types";
import api from "./http.service";
import { VendorSlotApplicationsResponse, VendorSlotRequest, VendorSlotsResponse } from "@/types/vendor";

// Vendor service class
class VendorService {
  /**
   * Get available events for vendors
   */
  async getAvailableEvents(): Promise<VendorAvailableEventsResponse> {
    const response = await api.get("/api/Event/vendor/available-events");
    return response.data;
  }
  /**
   * Get all received vendor applications for a specific event
   */

  /**
   * Get all vendor slots for a specific event
   */

  async getAllVendorSlots(eventId: string): Promise<VendorSlotsResponse> {
    const response = await api.get(`/api/Event/${eventId}/vendor-slots`);
    return response.data;
  }

  /**
   * Create a new vendor listing for a specific event
   */
  async createVendorListing(data: VendorSlotRequest): Promise<void> {
    const response = await api.post("/api/Event/vendor", data);
    return response.data;
  }

  /**
   * Get all vendor applications for a specific event
   */

  async getAllVendorApplications(eventId: string): Promise<VendorSlotApplicationsResponse> {
    const response = await api.get(`/api/Event/${eventId}/vendor-applications`);
    return response.data;
  }

  /**
   * Get a specific event's vendor slot by its ID
   */
  async getVendorSlotById(vendorId: string): Promise<VendorSlotsResponse> {
    const response = await api.get(`/api/Event/vendor/${vendorId}`);
    return response.data;
  }

  /**
   * Get organizer vendor listings for a specific event
   */
  async getOrganizerVendorListings(eventVendorId: string): Promise<VendorSlotApplicationsResponse> {
    const response = await api.get(`/api/Event/vendor-slot/${eventVendorId}/applications`);
    return response.data;
  }

  /**
   * Accept Vendor Application
   */
  async acceptVendorListings (applicationId: number, reason?: string): Promise<void> {
    const response = await api.post (`/api/Event/vendor/accept`, { applicationId, reason })
    return response.data
  }

  /**
   * Reject Vendor Application
   */
  async rejectVendorListings(applicationId: number, reason?: string): Promise<void> {
    const response = await api.post(`/api/Event/vendor/reject`, { applicationId, reason })
    return response.data
  }

}

// Export service instance
export const vendorService = new VendorService();
