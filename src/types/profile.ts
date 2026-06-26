import type { ApiResponse } from './api'

// Profile update interfaces
export interface UpdateUserProfileRequest {
  firstName: string
  lastName: string
  email: string
  telphone: string
  gender: string
  dateOfBirth: string
  country: string
  state: string
  password: string
}

export interface CompleteProfileRequest {
  token: string
  firstName?: string
  lastName?: string
  country?: string
  dateOfBirth?: string
  gender?: string
  telephone?: string
  website?: string
  businessName?: string
  vendorType?: string
  category?: string
  portfolio?: string
  socials?: string
  companyName?: string
}

// User Profile Data for GET /api/Profile/user
export interface UserProfileData {
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profilePicture: string
  bio: string
  createdDate: string
  userType: string
}

export type UserProfileResponse = ApiResponse<UserProfileData>

// User Ticket Data for GET /api/Profile/user/ticket/active and /api/Profile/user/ticket/past
export interface UserTicketData {
  ticketId: string
  purchaseDate: string
  status: string
  eventId: string
  eventName: string
  eventVenue: string
  eventStartDate: string
  eventEndDate: string
  ticketName: string
  price: number
  quantity: number
  theme: {
    themeName: string
  }
  desktopMedia: {
    flyer: string
    background: string
  }
}

export type UserTicketsResponse = ApiResponse<UserTicketData[]>

// Vendor Profile Data for GET /api/Profile/vendor
export interface VendorProfileData {
  vendorId: string
  businessName: string
  description: string
  contactEmail: string
  contactPhone: string
  website: string
  businessCategory: string
  services: string
  location: string
  createdDate: string
}

export type VendorProfileResponse = ApiResponse<VendorProfileData>

// Organizer Profile Data for GET /api/Profile/organizer
export interface OrganizerProfileData {
  organizerId: string
  businessName: string
  description: string
  contactEmail: string
  contactPhone: string
  website: string
  businessCategory: string
  services: string
  location: string
  createdDate: string
}

export type OrganizerProfileResponse = ApiResponse<OrganizerProfileData>
