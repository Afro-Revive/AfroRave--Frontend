import type {
  OrganizerProfileResponse,
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
  }>): Promise<OrganizerProfileResponse> {
    const response = await api.patch('/api/profile/organizer', data)
    return response.data
  }
}

// Export service instance
export const profileService = new ProfileService()
