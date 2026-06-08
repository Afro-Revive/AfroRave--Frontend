// Query keys for event-related queries
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  detailUrl: (customUrl: string) => [...eventKeys.details(), customUrl] as const,
  organizer: () => [...eventKeys.all, 'organizer'] as const,
  trending: () => [...eventKeys.all, 'trending'] as const,
  tickets: (eventId: string) => [...eventKeys.detail(eventId), 'tickets'] as const,
  promoCodes: (eventId: string) => [...eventKeys.detail(eventId), 'promocodes'] as const,
  vendors: (eventId: string) => [...eventKeys.detail(eventId), 'vendors'] as const,
  vendorAvailable: () => [...eventKeys.all, 'vendor', 'available'] as const,
}
