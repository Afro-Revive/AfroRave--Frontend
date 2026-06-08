import type { ApiResponse } from './api'

// Event creation interfaces
export interface EventContact {
  email: string
  website: string
}

export interface EventSocials {
  instagram: string
  x: string
  tiktok: string
  facebook: string
}

export interface EventDetails {
  termsOfRefund: string
  eventContact: EventContact
  socials: EventSocials
}

export interface EventDate {
  timezone: string
  startDate: string
  endDate: string
  frequency: 'Daily' | 'Weekly' | 'Monthly' | undefined
  startTime: string
  endTime: string
  occurance: number | undefined
}

export interface CreateEventRequest {
  eventName: string
  ageRating: 'PG' | '16+' | '18+'
  category: string
  venue: string
  description: string
  customUrl: string
  eventDate: EventDate
  eventDetails: EventDetails
}

// Event Data Types
export interface EventData {
  eventId: string
  eventName: string
  venue: string
  startDate: string
  startTime: string
  endDate: string
  isPublished: boolean
  customUrl: string
  metadata: {
    termsOfRefund: string
    eventContact: {
      email: string
      website: string
    }
    socials: {
      instagram: string
      x: string
      tiktok: string
      facebook: string
    }
    desktopMedia: {
      flyer: string
      background: string
    }
    theme: {
      themeName: 'default' | 'standard-carousel' | 'with-flyer'
    }
  }
}

export type EventsResponse = ApiResponse<EventData[]>

// Detailed Event Data for GET /api/Event/{eventId}
export interface EventDetailData {
  eventId: string
  eventName: string
  venue: string
  description: string
  ageRating: 'PG' | '16+' | '18+'
  customUrl: string
  category: string
  isPublished: boolean
  eventDate: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    timezone: string
    frequency: string
    occurance: number
  }
  eventDetails: {
    termsOfRefund: string
    eventContact: { email: string; website: string }
    socials: {
      instagram: 'string'
      x: 'string'
      tiktok: 'string'
      facebook: 'string'
    }

    desktopMedia: { flyer: string; background: string } | null
    theme: { themeName: 'default' | 'standard-carousel' | 'with-flyer' }
  }
  eventStat: {
    netProfit: number
    ticketSold: number
    totalTicket: number
    activePromoCodes: number
  }
}

export type EventDetailResponse = ApiResponse<EventDetailData>

// Ticket Data for GET /api/Event/ticket/{ticketId}
export interface TicketData {
  ticketId: string
  ticketName: string
  price: number
  quantity: number
  availableQuantity: number
  eventId: string
  eventName: string
  ticketType?: 'Single' | 'Group' | 'MultiDay'
  accessType?: 'Free' | 'Paid' | 'Invite'
  salesType?: 'Online' | 'Door'
  description?: string
  ticketDetails?: {
    description?: string
    benefits?: string
    restrictions?: string
    allowResell?: boolean
    saleImmediately?: boolean
    saleBegins?: string
  }
}

export type TicketResponse = ApiResponse<TicketData>

// Vendor Data for GET /api/Event/vendor/{vendorId}
export interface VendorData {
  vendorId: string
  vendorName: string
  description: string
  contactEmail: string
  contactPhone: string
  eventId: string
  eventName: string
  vendorDetails: {
    website: string
    socialMedia: string
    services: string
    location: string
  }
}

export type VendorResponse = ApiResponse<VendorData>

// Promo Code Data for GET /api/Event/promocode
export interface PromoCodeData {
  promocodeId: string
  promoCode: string
  discountType: string
  discountValue: number
  discountUsage: number
  startDate: string
  endDate: string
  eventId: string
  eventName: string
  promoDetails: {
    description: string
    terms: string
    restrictions: string
  }
}

export type PromoCodeResponse = ApiResponse<PromoCodeData>

// Promo Code Data for GET /api/Event/promocode/{promoId}
export interface PromoCodeWithDetailsResponse {
  promocodeId: string
  promoCode: string
  discountType: string
  discountValue: number
  discountUsage: number
  startDate: string
  endDate: string
  promoDetails: {
    tickets: { id: string }[]
  }
  isMinimunSpend: boolean
  minimumSpend: number
  isMinimunTickets: boolean
  minimumTickets: number
  note: string
  isPrivate: boolean
  isPartnership: boolean
  partnerName: string
  comissionType: string
  comission: number
}

export type PromoCodeResponseWithDetails = ApiResponse<PromoCodeWithDetailsResponse>

// Theme Data for GET /api/Event/theme/{eventId}
export interface ThemeData {
  termsOfRefund: string
  eventContact: string
  socials: string
  mobileMedia: string
  desktopMedia: string
  theme: string
}

export type ThemeResponse = ApiResponse<ThemeData>

// Trending Event Data for GET /api/Event/trending
export interface TrendingEventData {
  eventId: string
  eventName: string
  venue: string
  startDate: string
  startTime: string
  endDate: string
  desktopMedia: { flyer: string; banner: string }
  views: number
  theme: string
  ticketsSold: number
  customUrl: string
}

export type TrendingEventsResponse = ApiResponse<TrendingEventData[]>

// List Response Types
export type EventTicketsResponse = ApiResponse<TicketData[]>
export type EventPromoCodesResponse = ApiResponse<PromoCodeData[]>
export type EventVendorsResponse = ApiResponse<VendorData[]>

// Ticket creation interfaces
export interface TicketMail {
  body: string
}

export interface TicketDetails {
  saleImmediately: boolean
  saleBegins: string
  allowResell: boolean
  mail: TicketMail
}

export interface CreateTicketRequest {
  ticketName: string
  accessType: 'Free' | 'Paid' | 'Invite'
  salesType: 'Online' | 'Door'
  ticketType: 'Single' | 'Group' | 'MultiDay'
  quantity: number
  price: number
  purchaseLimit: number
  groupSize: number
  validDays: number
  description: string
  eventId: string
  ticketDetails: TicketDetails
}

// Vendor creation interfaces
export interface VendorSlotData {
  slotName: string | null
  slotNumber: number | null
  price: number | null
}

export interface VendorServiceData {
  serviceName: string | null
  minBudget: number | null
  maxBudget: number | null
  startDate: string | null
  endDate: string | null
}

export interface VendorContact {
  email: string | null
  phoneNumbers: string[] | null
}

export interface VendorDetails {
  slotData: VendorSlotData
  serviceData: VendorServiceData
  contact: VendorContact
}

export interface CreateVendorRequest {
  vendorType: 'Revenue' | 'Service'
  category: string
  description: string
  eventId: string
  vendorDetails: VendorDetails
}

// Promo code creation interfaces
export interface PromoTicket {
  id: string
}

export interface PromoCodeDetails {
  tickets: PromoTicket[]
  isMinimumSpend: boolean
  minimumSpend: number
  isMinimumTicket: boolean
  minimumTicket: number
  note: string
  isPrivate: boolean
  isPartnership: boolean
  partnerName: string
  commisionType: string
  commission: number
}

export interface CreatePromoCodeRequest {
  promocode: string
  discountType: string
  discountValue: number
  discountUsage: number
  startDate: string
  endDate: string
  promoCodedetails: {
    tickets: { id: string }[]
  }
  isMinimunSpend: boolean
  minimumSpend: number
  isMinimunTickets: boolean
  minimumTickets: number
  note: string
  isPrivate: boolean
  isPartnership: boolean
  partnerName: string
  comissionType: string
  comission: number
}

// Theme creation interfaces
export interface MediaAssets {
  flyer: string
  background: string
}

export interface EventTheme {
  themeName: string
}

export interface CreateThemeRequest {
  desktopMedia: MediaAssets
  theme: EventTheme
  eventId: string
}

// Vendor Available Events
export interface VendorAvailableEventData {
  eventId: string
  eventName: string
  venue: string
  category: string
  vendorType: string
  startDate: string
  startTime: string
  endDate: string
  isPublished: boolean
  customUrl: string
  stage: string
  totalTicket: number
  ticketSold: number
  metadata: {
    termsOfRefund: string
    eventContact: {
      email: string
      website: string
    }
    socials: {
      instagram: string
      x: string
      tiktok: string
      facebook: string
    }
    desktopMedia: {
      flyer: string
      background: string
    }
    theme: {
      themeName: string
    }
  }
}

export type VendorAvailableEventsResponse = ApiResponse<VendorAvailableEventData[]>
