import type { VendorAvailableEventsResponse } from "@/types";
import api from "./http.service";
import { VendorSlotRequest, VendorSlotsResponse } from "@/types/vendor";

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
}

// Export service instance
export const vendorService = new VendorService();
