import type { VendorAvailableEventsResponse } from '@/types'
import api from './http.service'
import { VendorAvailableEvents } from '@/types/vendor'

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
}

// Export service instance
export const vendorService = new VendorService()
