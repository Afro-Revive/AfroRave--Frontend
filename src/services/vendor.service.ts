import type { ApiResponse, VendorAvailableEventsResponse } from '@/types'
import api from './http.service'
import {
  PayVendorSlotRequest,
  VendorApplicationRequest,
  VendorApplicationsResponse,
  VendorAvailableEvents,
  VendorSavedEventsResponse,
  VendorSummaryResponse,
} from '@/types/vendor'

// The vendor dashboard lists everything on one page and filters in the browser,
// so list calls ask for a page big enough to hold it all.
const LIST_PAGE_SIZE = 100

// Vendor service class
class VendorService {
  /**
   * Get available events for vendors
   */
  async getAvailableEvents(): Promise<VendorAvailableEventsResponse> {
    const response = await api.get('/api/Event/vendor/available-events', {
      params: { pageNumber: 1, pageSize: LIST_PAGE_SIZE },
    })
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
   * Remove a saved event
   */
  async unsaveEventVendor(eventId: string): Promise<void> {
    const response = await api.delete('/api/Profile/vendor/event/watchlist/remove', { data: { id: eventId } })
    return response.data
  }

  /**
   * Get the vendor's saved events
   */
  async getSavedEvents(): Promise<VendorSavedEventsResponse> {
    const response = await api.get('/api/Profile/vendor/event/watchlist', {
      params: { pageNumber: 1, pageSize: LIST_PAGE_SIZE },
    })
    return response.data
  }

  /**
   * Get the vendor's saved events and secured slots counts
   */
  async getSummary(): Promise<VendorSummaryResponse> {
    const response = await api.get('/api/Event/vendor/summary')
    return response.data
  }

  /**
   * Retrieve all vendor applications
   */
  async getVendorApplications (): Promise<VendorApplicationsResponse> {
    const response = await api.get(`/api/Event/vendor/applications`, {
      params: { pageNumber: 1, pageSize: LIST_PAGE_SIZE },
    })
    return response.data
  }

  /**
   * Apply for Event Vendor Slot
   */

  async applyVendorSlot (data: VendorApplicationRequest): Promise<void>{
    const response = await api.post(`/api/Event/vendor/apply`, data)
    return response.data
  }

  /**
   * Withdraw (soft delete) a vendor application
   */
  async withdrawApplication(applicationId: number): Promise<void> {
    const response = await api.delete(`/api/Event/vendor/application/${applicationId}`)
    return response.data
  }

  /**
   * Start paying for an approved slot. Returns the Paystack checkout link (`authorizationUrl`).
   */
  async initializeSlotPayment(data: PayVendorSlotRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/vendor/slot/initialize-payment', data)
    return response.data
  }

  /**
   * Confirm a finished Paystack payment for a slot with its `reference`, which secures it.
   */
  async payVendorSlot(data: PayVendorSlotRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/vendor/slot/pay', data)
    return response.data
  }
}


// Export service instance
export const vendorService = new VendorService()
