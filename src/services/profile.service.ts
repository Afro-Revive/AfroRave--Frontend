import type {
  BankDetailsRequest,
  BankDetailsResponse,
  NotificationResponse,
  OrganizerProfileResponse,
  OrganizerWalletResponse,
  PayoutHistoryResponse,
  UpdateUserProfileRequest,
  UserProfileResponse,
  UserTicketsResponse,
  VendorProfileResponse,
  WalletDetailsResponse,
  WithdrawFundsRequest,
} from '@/types'
import api from './http.service'

// Profile service class
class ProfileService {
  /**
   * Get user profile
   */
  async getUserProfile(): Promise<UserProfileResponse> {
    const response = await api.get('/api/profile/user')
    return response.data
  }

  /**
   * Update user profile
   */
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfileResponse> {
    const response = await api.patch('/api/profile/user', data)
    return response.data
  }

  /**
   * Get user active tickets
   */
  async getUserActiveTickets(): Promise<UserTicketsResponse> {
    const response = await api.get('/api/profile/user/ticket/active')
    return response.data
  }

  /**
   * Get Wallet Details
   */
  async getWalletDetails(): Promise<WalletDetailsResponse> {
    const response = await api.get('/api/profile/user/wallet')
    return response.data
  }

  /**
   * Withdraw Funds from Wallet
   */
  async withdrawFunds(data: WithdrawFundsRequest): Promise<void> {
    const response = await api.post('/api/profile/user/wallet/withdraw', data)
    return response.data
  }

  /**
   * Get user past tickets
   */
  async getUserPastTickets(): Promise<UserTicketsResponse> {
    const response = await api.get('/api/profile/user/ticket/past')
    return response.data
  }

  /**
   * Get vendor profile
   */
  async getVendorProfile(): Promise<VendorProfileResponse> {
    const response = await api.get('/api/profile/vendor')
    return response.data
  }

  /**
   * Get organizer profile
   */
  async getOrganizerProfile(): Promise<OrganizerProfileResponse> {
    const response = await api.get('/api/profile/organizer')
    return response.data
  }

  /**
   * Update organizer profile
   */
  async updateOrganizerProfile(data: Partial<{
    firstName: string
    lastName: string
    companyName: string
    telphone: string
    gender: string
    website: string
    /** YYYY-MM-DD, as the user profile takes it. */
    dateOfBirth: string
    country: string
    state: string
  }>): Promise<OrganizerProfileResponse> {
    const response = await api.patch('/api/profile/organizer', data)
    return response.data
  }

  /**
   * Get Organizers Notifications
   */
  async getOrganizerNotifications(): Promise<NotificationResponse> {
    const response = await api.get('/api/profile/organizer/notifications')
    return response.data
  }

  /**
   * Mark Organizers Notifications as Read
   */

  async markOrganizerNotificationsAsRead(notificationId: string): Promise<void> {
    const response = await api.patch(`/api/profile/organizer/notifications/${notificationId}/read`)
    return response.data
  }

  /**
   * Change Account Password
   */
  async changePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Promise<void> {
    const response = await api.patch('/api/Profile/change-password', data)
    return response.data
  }

  /**
   * Change Organizer Password
   */
  async changeOrganizerPassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Promise<void> {
    const response = await api.patch('/api/profile/organizer/change-password', data)
    return response.data
  }

  /**
   * Get User Payout History
   */
  async getPayoutHistory(): Promise<PayoutHistoryResponse> {
    const response = await api.get('/api/profile/user/payout-history')
    return response.data
  }

  /**
   * Save Organizer Payout Bank Account`
   */
  async savePayout(data: BankDetailsRequest): Promise<void> {
    const response = await api.post('/api/profile/organizer/bank-account', data)
    return response.data
  }

  /**
   * Get Organizer Payout Bank Account
   */
  async getPayout(): Promise<BankDetailsResponse> {
    const response = await api.get('/api/profile/organizer/bank-account')
    return response.data
  }

  /**
   * Update Organizer Payout Bank Account
   */
  async updatePayout(data: BankDetailsRequest): Promise<void> {
    const response = await api.put('/api/profile/organizer/bank-account', data)
    return response.data
  }

  /**
   * Get Organizer Wallet (total revenue, and what can be paid out now)
   */
  async getOrganizerWallet(): Promise<OrganizerWalletResponse> {
    const response = await api.get('/api/profile/organizer/wallet')
    return response.data
  }

  /**
   * Get Organizer Payout History (paginated)
   */
  async getOrganizerPayoutHistory(params?: {
    pageNumber?: number
    pageSize?: number
  }): Promise<PayoutHistoryResponse> {
    const response = await api.get('/api/profile/organizer/payout-history', { params })
    return response.data
  }

  /**
   * Request an early payout from the organizer's wallet
   */
  async withdrawOrganizerFunds(data: WithdrawFundsRequest): Promise<void> {
    const response = await api.post('/api/profile/organizer/wallet/withdraw', data)
    return response.data
  }
   
}
// Export service instance
export const profileService = new ProfileService()
