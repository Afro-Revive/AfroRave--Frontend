// Query keys for event-related queries
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  detailUrl: (customUrl: string) => [...eventKeys.details(), customUrl] as const,
  organizer: () => [...eventKeys.all, 'organizer'] as const,
  /** The create-event mutation, so a button outside its form can tell it's running. */
  create: () => [...eventKeys.all, 'create'] as const,
  trending: () => [...eventKeys.all, 'trending'] as const,
  tickets: (eventId: string) => [...eventKeys.detail(eventId), 'tickets'] as const,
  promoCodes: (eventId: string) => [...eventKeys.detail(eventId), 'promocodes'] as const,
  vendors: (eventId: string) => [...eventKeys.detail(eventId), 'vendors'] as const,
  vendorAvailable: () => [...eventKeys.all, 'vendor', 'available'] as const,
  resaleListings: (eventId: string) => [...eventKeys.detail(eventId), 'resale-listings'] as const,
  vendorSlots: (eventId: string) => [...eventKeys.detail(eventId), 'vendor-slots'] as const,
  vendorApplications: (eventId: string) => [...eventKeys.detail(eventId), 'vendor-applications'] as const,
  vendorSlotById: (vendorId: string) => [...eventKeys.all, 'vendor', 'slot', vendorId] as const,
  organizerVendorListings: (eventVendorId: string) => [...eventKeys.all, 'vendor', 'slot', eventVendorId, 'applications'] as const,
  analytics: (eventId: string) => [...eventKeys.detail(eventId), 'analytics'] as const,
  attendees: (eventId: string, params?: Record<string, unknown>) =>
    [...eventKeys.detail(eventId), 'attendees', params ?? {}] as const,
  // The logged-in vendor's own requests, across every event.
  myVendorApplications: () => [...eventKeys.all, 'vendor', 'application'] as const,
  myVendorApplication: (applicationId: string) => [...eventKeys.myVendorApplications(), applicationId] as const,
  vendorSummary: () => [...eventKeys.all, 'vendor', 'summary'] as const,
  vendorSaved: () => [...eventKeys.all, 'vendor', 'saved'] as const,
}
