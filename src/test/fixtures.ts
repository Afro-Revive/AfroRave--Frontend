/** Response builders and sample records shaped like the real API payloads. */
import type { EventData, EventDetailData, TicketData } from '@/types'
import type { UserProfileData, UserTicketData } from '@/types/profile'

export function apiResponse<T>(data: T) {
  return { message: 'ok', data, status: true, statusCode: 200 }
}

export function paginated<T>(items: T[]) {
  return {
    items,
    hasNext: false,
    hasPrevious: false,
    pageNumber: 1,
    pageSize: items.length || 10,
    totalCount: items.length,
    totalPages: 1,
  }
}

export function makeEvent(overrides: Partial<EventData> = {}): EventData {
  return {
    eventId: 'evt-1',
    eventName: 'Afro Nation Lagos',
    venue: 'Eko Atlantic',
    startDate: '2026-12-01',
    startTime: '18:00',
    endDate: '2026-12-02',
    isPublished: true,
    customUrl: 'afro-nation-lagos',
    metadata: {
      termsOfRefund: 'No refunds within 24 hours of the event.',
      eventContact: { email: 'hello@afronation.com', website: 'https://afronation.com' },
      socials: { instagram: '', x: '', tiktok: '', facebook: '' },
      desktopMedia: { flyer: '/flyer.png', background: '/background.png' },
      theme: { themeName: 'default' },
    },
    ...overrides,
  }
}

export function makeEventDetail(overrides: Partial<EventDetailData> = {}): EventDetailData {
  return {
    eventId: 'evt-1',
    eventName: 'Afro Nation Lagos',
    venue: 'Eko Atlantic',
    description: 'Two nights of Afrobeats on the waterfront.',
    ageRating: '18+',
    customUrl: 'afro-nation-lagos',
    category: 'Concert',
    isPublished: true,
    eventDate: {
      startDate: '2026-12-01',
      endDate: '2026-12-02',
      startTime: '18:00',
      endTime: '02:00',
      timezone: 'UTC+1',
      frequency: 'once',
      occurance: 1,
    },
    eventDetails: {
      termsOfRefund: 'No refunds within 24 hours of the event.',
      eventContact: { email: 'hello@afronation.com', website: 'https://afronation.com' },
      socials: { instagram: 'string', x: 'string', tiktok: 'string', facebook: 'string' },
      desktopMedia: { flyer: '/flyer.png', background: '/background.png' },
      theme: { themeName: 'default' },
    },
    eventStat: { netProfit: 0, ticketSold: 0, totalTicket: 100, activePromoCodes: 0 },
    isOnWatchlist: false,
    ...overrides,
  }
}

export function makeTicket(overrides: Partial<TicketData> = {}): TicketData {
  return {
    ticketId: 'tkt-1',
    ticketName: 'General Admission',
    price: 25000,
    quantity: 100,
    availableQuantity: 80,
    eventId: 'evt-1',
    eventName: 'Afro Nation Lagos',
    ticketType: 'Single',
    accessType: 'Paid',
    salesType: 'Online',
    description: 'Standing access to both nights.',
    ...overrides,
  }
}

export function makeProfile(overrides: Partial<UserProfileData> = {}): UserProfileData {
  return {
    userId: 'user-1',
    firstName: 'Ada',
    lastName: 'Fan',
    email: 'fan@example.com',
    phoneNumber: '+2348012345678',
    gender: 'Female',
    state: 'Lagos',
    country: 'Nigeria',
    dateOfBirth: '1996-04-12',
    profilePicture: '',
    bio: 'Lives for live music.',
    createdDate: '2024-01-01',
    userType: 'User',
    ...overrides,
  }
}

export function makeUserTicket(overrides: Partial<UserTicketData> = {}): UserTicketData {
  return {
    eventId: 'evt-1',
    eventName: 'Afro Nation Lagos',
    eventVenue: 'Eko Atlantic',
    eventStartDate: '2026-12-01T18:00:00Z',
    eventEndDate: '2026-12-02T02:00:00Z',
    theme: { themeName: 'default' },
    desktopMedia: { flyer: '/flyer.png', background: '/background.png' },
    ticketDetails: [
      {
        ticketId: 'tkt-1',
        ticketName: 'General Admission',
        price: 25000,
        totalQuantity: 2,
        purchaseHistory: [{ orderId: 'ord-1', purchaseDate: '2026-06-01', quantity: 2 }],
      },
    ],
    ...overrides,
  }
}

export const walletDetails = {
  balance: 50000,
  transactions: [],
}
