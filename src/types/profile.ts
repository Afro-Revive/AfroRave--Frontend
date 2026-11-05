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
  ticketType?: 'Single' | 'Group' | 'MultiDay'
  accessType?: 'Free' | 'Paid' | 'Invite'
  groupSize?: number
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
  /** yyyy-MM-dd */
  dateOfBirth?: string | null
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

// PATCH /api/Profile/vendor
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
  /** Same as category. Sent only; the app reads category. */
  services?: string
  vendorType?: string
  /** Same as businessData.portfolio.webUrl. Sent only; the app reads webUrl. */
  website?: string
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
  userId: string
  firstName: string
  lastName: string
  companyName: string
  telphone: string
  gender: string
  businessName: string
  description: string
  contactEmail: string
  email: string
  contactPhone: string
  phoneNumber: string
  telephone: string
  dateOfBirth: string
  birthday: string
  dob: string
  website: string
  businessCategory: string
  services: string
  location: string
  state?: string | null
  country?: string | null
  bankName?: string | null
  bankCode?: string | null
  accountNumber?: string | null
  accountName?: string | null
  balance: number
  walletBalance: number
  amountInWallet: number
  totalRevenue: number
  accountType: string
  userType: string
  createdDate: string
}

export interface WithdrawFundsRequest {
  amount: number
  accountNumber: string
  bankCode: string
  accountName: string
}

export interface PayoutHistoryData {
  id: string
  amount: number
  transactionType: string
  status: string
  description: string
  reference: string
  accountNumber: string
  bankCode: string
  accountName: string
  quantity: number
  currency: string
  createdDate: string
  ticketName: string
  eventName: string
  eventId: string
  ticketId: string
}

export type PayoutHistoryResponse = ApiResponse<PayoutHistoryData>

export interface NotificationData {
  id: string
  subject: string
  message: string
  viewed: boolean
  createdDate: string
}

export interface BankDetailsRequest{
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
}

export type BankDetailsResponse = ApiResponse<BankDetailsRequest>

/** GET /api/Profile/organizer/wallet: what the organizer has earned and can be paid. */
export interface OrganizerWalletData {
  balance: number
  walletBalance: number
  /** What can be paid out now. */
  amountInWallet: number
  /** Everything earned from tickets and vendor slots. */
  totalRevenue: number
}

export type OrganizerWalletResponse = ApiResponse<OrganizerWalletData>
// ApiResponse already wraps the payload (and may paginate it) — the element type
// goes in, not an array of them.
export type NotificationResponse = ApiResponse<NotificationData>

export type OrganizerProfileResponse = ApiResponse<OrganizerProfileData>
