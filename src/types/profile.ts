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
  gender: string
  state: string
  country: string
  dateOfBirth: string
  profilePicture: string
  bio: string
  createdDate: string
  userType: string
}

export type UserProfileResponse = ApiResponse<UserProfileData>

// User Ticket Data for GET /api/Profile/user/ticket/active and /api/Profile/user/ticket/past
export interface UserTicketData {
  eventId: string
  eventName: string
  eventVenue: string
  eventStartDate: string
  eventEndDate: string
  theme: {
    themeName: string
  }
  desktopMedia: {
    flyer: string
    background: string
  }
  ticketDetails: UserTicketTicketDetails[]
}

export interface UserTicketTicketDetails {
  ticketId: string
  ticketName: string
  price: number
  totalQuantity: number
  purchaseHistory: {
    orderId: string
    purchaseDate: string
    quantity: number
  }[]
}

export interface WalletDetailsData {
  balance: number
  transactions:{
    id: string
    amount: number
    transactionType: string
    description: string
    createdDate: string
  }
}

export type WalletDetailsResponse = ApiResponse<WalletDetailsData>

export type UserTicketsResponse = ApiResponse<UserTicketData>

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

export interface WithdrawFundsRequest {
  amount: number
  accountNumber: string
  bankCode: string
  accountName: string
}

export type OrganizerProfileResponse = ApiResponse<OrganizerProfileData>
