import type {
  ApiResponse,
  CreateEventRequest,
  CreatePromoCodeRequest,
  CreateThemeRequest,
  CreateTicketRequest,
  CreateVendorRequest,
  EventData,
  EventDetailResponse,
  EventPromoCodesResponse,
  EventTicketsResponse,
  EventVendorsResponse,
  EventsResponse,
  PromoCodeResponseWithDetails,
  ThemeResponse,
  TicketResponse,
  TrendingEventsResponse,
  VendorResponse,
} from '@/types'
import api from './http.service'

// Event service class
class EventService {
  /**
   * Get all events
   */
  async getAllEvents(): Promise<EventsResponse> {
    const response = await api.get('/api/Event')
    return response.data
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventRequest): Promise<{ message: string; eventId: string }> {
    const response = await api.post('/api/Event', data)
    return response.data
  }

  /**
   * Create a new ticket for an event
   */
  async createTicket(data: CreateTicketRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/ticket', data)
    return response.data
  }

  /**
   * Create a new vendor for an event
   */
  async createVendor(data: CreateVendorRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/vendor', data)
    return response.data
  }

  /**
   * Create a new promo code for an event
   */
  async createPromoCode(data: CreatePromoCodeRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/promocode', data)
    return response.data
  }

  /**
   * Create a theme for an event
   */
  async createTheme(data: CreateThemeRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Event/theme', data)
    return response.data
  }

  /**
   * Publish an event
   */
  async publishEvent(eventId: string): Promise<ApiResponse<unknown>> {
    const response = await api.post(`/api/Event/publish/${eventId}`)
    return response.data
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: string, data: CreateEventRequest): Promise<ApiResponse<EventData>> {
    const response = await api.patch(`/api/Event/${eventId}`, data)
    return response.data
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<ApiResponse<unknown>> {
    const response = await api.delete(`/api/Event/${eventId}`)
    return response.data
  }

  /**
   * Get an event by ID
   */
  async getEvent(eventId: string): Promise<EventDetailResponse> {
    console.log('Fetching event with ID:', eventId)
    const response = await api.get(`/api/Event/${eventId}`)
    return response.data
  }

  /**
   * Update a ticket
   */
  async updateTicket(ticketId: string, data: CreateTicketRequest): Promise<ApiResponse<unknown>> {
    const response = await api.patch(`/api/Event/ticket/${ticketId}`, data)
    return response.data
  }

  /**
   * Delete a ticket
   */
  async deleteTicket(ticketId: string): Promise<ApiResponse<unknown>> {
    const response = await api.delete(`/api/Event/ticket/${ticketId}`)
    return response.data
  }

  /**
   * Get a ticket by ID
   */
  async getTicket(ticketId: string): Promise<TicketResponse> {
    const response = await api.get(`/api/Event/ticket/${ticketId}`)
    return response.data
  }

  /**
   * Delete a vendor
   */
  async deleteVendor(vendorId: string): Promise<ApiResponse<unknown>> {
    const response = await api.delete(`/api/Event/vendor/${vendorId}`)
    return response.data
  }

  /**
   * Get a vendor by ID
   */
  async getVendor(vendorId: string): Promise<VendorResponse> {
    const response = await api.get(`/api/Event/vendor/${vendorId}`)
    return response.data
  }

  /**
   * Update a vendor
   */
  async updateVendor(vendorId: string, data: CreateVendorRequest): Promise<ApiResponse<unknown>> {
    const response = await api.patch(`/api/Event/vendor/${vendorId}`, data)
    return response.data
  }

  /**
   * Delete a promo code
   */
  async deletePromoCode(promoId: string): Promise<ApiResponse<unknown>> {
    const response = await api.delete(`/api/Event/promocode/${promoId}`)
    return response.data
  }

  /**
   * Get a promo code by ID
   */
  async getPromoCode(promoId: string): Promise<PromoCodeResponseWithDetails> {
    const response = await api.get(`/api/Event/promocode/${promoId}`)
    return response.data
  }

  /**
   * Update a promo code
   */
  async updatePromoCode(
    promoId: string,
    data: CreatePromoCodeRequest,
  ): Promise<ApiResponse<unknown>> {
    const response = await api.patch(`/api/Event/promocode/${promoId}`, data)
    return response.data
  }

  /**
   * Update a theme
   */
  async updateTheme(eventId: string, data: CreateThemeRequest): Promise<ApiResponse<unknown>> {
    const response = await api.patch(`/api/Event/theme/${eventId}`, data)
    return response.data
  }

  /**
   * Get a theme by event ID
   */
  async getTheme(eventId: string): Promise<ThemeResponse> {
    const response = await api.get(`/api/Event/theme/${eventId}`)
    return response.data
  }

  /**
   * Get organizer events
   */
  async getOrganizerEvents(): Promise<EventsResponse> {
    const response = await api.get('/api/Event/organizer')
    return response.data
  }

  /**
   * Get trending events
   */
  async getTrendingEvents(): Promise<TrendingEventsResponse> {
    const response = await api.get('/api/Event/trending')
    return response.data
  }

  /**
   * Get tickets for an event
   */
  async getEventTickets(eventId: string): Promise<EventTicketsResponse> {
    const response = await api.get(`/api/Event/${eventId}/tickets`)
    return response.data
  }

  /**
   * Get promo codes for an event
   */
  async getEventPromoCodes(eventId: string): Promise<EventPromoCodesResponse> {
    const response = await api.get(`/api/Event/${eventId}/promocodes`)
    return response.data
  }

  /**
   * Get vendors for an event
   */
  async getEventVendors(eventId: string): Promise<EventVendorsResponse> {
    const response = await api.get(`/api/Event/${eventId}/vendors`)
    return response.data
  }
}

// Export service instance
export const eventService = new EventService()
