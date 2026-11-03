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
  profilePicture?: string
  contactEmail: string
  contactPhone: string
  website: string
  businessCategory: string
  category?: string
  vendorCategory?: string
  services: string
  vendorType?: string
  state?: string
  country?: string
  location: string
  businessData?: VendorBusinessData
  createdDate: string
}

export interface VendorBusinessData {
  aboutBusiness?: string | null
  profilePicture?: string | null
  gallery?: string[] | null
  /** Old spelling the API still sends. */
  gallary?: string[] | null
  portfolio?: { webUrl?: string; fileUrl?: string } | null
  socials?: Partial<Record<'facebook' | 'instagram' | 'x' | 'linkedIn' | 'tikTok' | 'youTube' | 'socialLink', string>> | null
}

// PATCH /api/Profile/vendor. category, country, state and dateOfBirth aren't in the API's
// schema yet; they're sent so they save once the backend accepts them.
export interface UpdateVendorProfileRequest {
  firstName?: string
  lastName?: string
  businessName?: string
  email?: string
  phoneNumber?: string
  telephone?: string
  gender?: string
  businessData?: VendorBusinessData
  category?: string
  vendorCategory?: string
  country?: string
  state?: string
  dateOfBirth?: string
}

// PATCH /api/Profile/{role}/change-password
export interface ChangePasswordRequest {
  currentPassword: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
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

export interface NotificationData {
  id: number
  subject: string
  message: string
  viewed: boolean
  createdDate: string
}

export type NotificationResponse = ApiResponse<NotificationData>

export type OrganizerProfileResponse = ApiResponse<OrganizerProfileData>
