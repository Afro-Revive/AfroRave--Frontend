import type { VendorAvailableEventsResponse } from '@/types'
import api from './http.service'
import { VendorSlotRequest } from '@/types/vendor'

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
   * Get all received vendor applications for a specific event
   */
  


  /**
   * Create a new vendor listing for a specific event
   */
  async createVendorListing(data: VendorSlotRequest): Promise<void> {
    const response = await api.post('/api/Event/vendor', data)
    return response.data
  }
}

// Export service instance
export const vendorService = new VendorService()
