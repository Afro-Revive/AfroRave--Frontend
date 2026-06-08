import { eventKeys } from '@/lib/event-keys'
import { eventService } from '@/services/event.service'
import { vendorService } from '@/services/vendor.service'
import type {
  CreateEventRequest,
  CreatePromoCodeRequest,
  CreateThemeRequest,
  CreateTicketRequest,
  CreateVendorRequest,
} from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Event mutations
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    onSuccess: (data) => {
      toast.success('Event created successfully!')
      console.log('Event created:', data)
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to create event:', error)
      toast.error('Failed to create event. Please try again.')
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: CreateEventRequest }) =>
      eventService.updateEvent(eventId, data),
    onSuccess: (data, variables) => {
      toast.success('Event updated successfully!')
      console.log('Event updated:', data)
      // Invalidate and refetch specific event and events list
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update event:', error)
      toast.error('Failed to update event. Please try again.')
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: (data) => {
      toast.success('Event deleted successfully!')
      console.log('Event deleted:', data)
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete event:', error)
      toast.error('Failed to delete event. Please try again.')
    },
  })
}

export function usePublishEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => eventService.publishEvent(eventId),
    onSuccess: (data, eventId) => {
      toast.success('Event published successfully!')
      console.log('Event published:', data)
      // Invalidate and refetch specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to publish event:', error)
      toast.error('Failed to publish event. Please try again.')
    },
  })
}

// Ticket mutations
export function useCreateTicket(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => eventService.createTicket(data),
    onSuccess: () => {
      toast.success('Ticket created successfully!')
      console.log('Ticket created successfully')
      // Invalidate and refetch tickets for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.tickets(eventId) })
      // Also invalidate event details since tickets are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error)
      toast.error('Failed to create ticket. Please try again.')
    },
  })
}

export function useUpdateTicket(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateTicketRequest }) =>
      eventService.updateTicket(ticketId, data),
    onSuccess: () => {
      toast.success('Ticket updated successfully!')
      console.log('Ticket updated successfully')
      // Invalidate and refetch tickets for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.tickets(eventId) })
      // Also invalidate event details since tickets are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to update ticket:', error)
      toast.error('Failed to update ticket. Please try again.')
    },
  })
}

export function useDeleteTicket(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketId: string) => eventService.deleteTicket(ticketId),
    onSuccess: () => {
      toast.success('Ticket deleted successfully!')
      console.log('Ticket deleted successfully')
      // Invalidate and refetch tickets for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.tickets(eventId) })
      // Also invalidate event details since tickets are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to delete ticket:', error)
      toast.error('Failed to delete ticket. Please try again.')
    },
  })
}

// Promo code mutations
export function useCreatePromoCode(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePromoCodeRequest & { eventId: string }) =>
      eventService.createPromoCode(data),
    onSuccess: () => {
      toast.success('Promo code created successfully!')
      console.log('Promo code created successfully')
      // Invalidate and refetch promo codes for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.promoCodes(eventId) })
      // Also invalidate event details since promo codes are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to create promo code:', error)
      toast.error('Failed to create promo code. Please try again.')
    },
  })
}

export function useUpdatePromoCode(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ promoId, data }: { promoId: string; data: CreatePromoCodeRequest }) =>
      eventService.updatePromoCode(promoId, data),
    onSuccess: () => {
      toast.success('Promo code updated successfully!')
      console.log('Promo code updated successfully')
      // Invalidate and refetch promo codes for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.promoCodes(eventId) })
      // Also invalidate event details since promo codes are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to update promo code:', error)
      toast.error('Failed to update promo code. Please try again.')
    },
  })
}

export function useDeletePromoCode(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promoId: string) => eventService.deletePromoCode(promoId),
    onSuccess: () => {
      toast.success('Promo code deleted successfully!')
      console.log('Promo code deleted successfully')
      // Invalidate and refetch promo codes for the specific event
      queryClient.invalidateQueries({ queryKey: eventKeys.promoCodes(eventId) })
      // Also invalidate event details since promo codes are part of event data
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      console.error('Failed to delete promo code:', error)
      toast.error('Failed to delete promo code. Please try again.')
    },
  })
}

// Vendor mutations
export function useCreateVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVendorRequest) => eventService.createVendor(data),
    onSuccess: () => {
      toast.success('Vendor created successfully!')
      console.log('Vendor created successfully')
      // Invalidate and refetch vendors list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to create vendor:', error)
      toast.error('Failed to create vendor. Please try again.')
    },
  })
}

export function useUpdateVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vendorId, data }: { vendorId: string; data: CreateVendorRequest }) =>
      eventService.updateVendor(vendorId, data),
    onSuccess: () => {
      toast.success('Vendor updated successfully!')
      console.log('Vendor updated successfully')
      // Invalidate and refetch vendors list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update vendor:', error)
      toast.error('Failed to update vendor. Please try again.')
    },
  })
}

export function useDeleteVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vendorId: string) => eventService.deleteVendor(vendorId),
    onSuccess: () => {
      toast.success('Vendor deleted successfully!')
      console.log('Vendor deleted successfully')
      // Invalidate and refetch vendors list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete vendor:', error)
      toast.error('Failed to delete vendor. Please try again.')
    },
  })
}

// Theme mutations
export function useCreateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateThemeRequest) => eventService.createTheme(data),
    onSuccess: () => {
      toast.success('Theme created successfully!')
      console.log('Theme created successfully')
      // Invalidate and refetch themes list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to create theme:', error)
      toast.error('Failed to create theme. Please try again.')
    },
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: CreateThemeRequest }) =>
      eventService.updateTheme(eventId, data),
    onSuccess: () => {
      toast.success('Theme updated successfully!')
      console.log('Theme updated successfully')
      // Invalidate and refetch themes list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update theme:', error)
      toast.error('Failed to update theme. Please try again.')
    },
  })
}

// Queries
export function useGetEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
  })
}

export function useGetEventByCustomUrl(customUrl:string){
  return useQuery({
    queryKey: eventKeys.detailUrl(customUrl),
    queryFn: () => eventService.getEventByCustomUrl(customUrl),
    enabled: !!customUrl
  })
}

export function useGetTicket(ticketId?: string) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => {
      if (!ticketId) throw new Error('Ticket ID is required')
      return eventService.getTicket(ticketId)
    },
    enabled: !!ticketId,
  })
}

export function useGetEventTickets(eventId?: string) {
  return useQuery({
    queryKey: eventKeys.tickets(eventId || ''),
    queryFn: () => {
      if (!eventId) throw new Error('Event ID is required')
      return eventService.getEventTickets(eventId)
    },
    enabled: !!eventId,
  })
}

export function useGetEventPromoCodes(eventId?: string) {
  return useQuery({
    queryKey: eventKeys.promoCodes(eventId || ''),
    queryFn: () => {
      if (!eventId) throw new Error('Event ID is required')
      return eventService.getEventPromoCodes(eventId)
    },
    enabled: !!eventId,
  })
}

export function useGetPromoCode(promocodeId?: string) {
  return useQuery({
    queryKey: eventKeys.promoCodes(promocodeId || ''),
    queryFn: () => {
      if (!promocodeId) throw new Error('Promocode ID is required')
      return eventService.getPromoCode(promocodeId)
    },
    enabled: !!promocodeId,
  })
}

export function useGetEventVendors(eventId?: string) {
  return useQuery({
    queryKey: eventKeys.vendors(eventId || ''),
    queryFn: () => {
      if (!eventId) throw new Error('Event ID is required')
      return eventService.getEventVendors(eventId)
    },
    enabled: !!eventId,
  })
}

export function useGetAllEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => eventService.getAllEvents(),
  })
}

export function useGetOrganizerEvents() {
  return useQuery({
    queryKey: eventKeys.organizer(),
    queryFn: () => eventService.getOrganizerEvents(),
  })
}

export function useGetTrendingEvents() {
  return useQuery({
    queryKey: eventKeys.trending(),
    queryFn: () => eventService.getTrendingEvents(),
  })
}

export function useGetVendorAvailableEvents() {
  return useQuery({
    queryKey: eventKeys.vendorAvailable(),
    queryFn: () => vendorService.getAvailableEvents(),
  })
}
