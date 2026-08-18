import type { VendorAvailableEventsResponse } from '@/types'
import api from './http.service'
import { VendorApplicationsResponse, VendorAvailableEvents } from '@/types/vendor'

// Vendor service class
class VendorService {
  /**
   * Get available events for vendors
   */
  async getAvailableEvents(): Promise<VendorAvailableEventsResponse> {
    const response = await api.get('/api/Event/vendor/available-events')
    return response.data
  }

  /**
   * Get all vendor slots for a specific event
   */

  async getVendorSlots(eventId: string): Promise<VendorAvailableEvents> {
    const response = await api.get(`/api/Event/${eventId}/vendors`)
    return response.data
  }

  /**
   * Save Event for vendor
   */

  async saveEventVendor (eventId: string): Promise<void> {
    const response = await api.post(`/api/Event/${eventId}/save`)
    return response.data
  }

  /**
   * Retrieve all vendor applications
   */
  async getVendorApplications (): Promise<VendorApplicationsResponse> {
    const response = await api.get(`/api/Event/vendor/applications`)
    return response.data
  }
}

// Export service instance
export const vendorService = new VendorService()
