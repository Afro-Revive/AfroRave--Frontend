import type { ApiResponse } from '@/types/api'
import type {
  AdminActionResponse,
  AdminAnalyticsResponse,
  AdminEvent,
  AdminEventDetailsResponse,
  AdminEventsParams,
  AdminListParams,
  AdminOrder,
  AdminPage,
  AdminSuspensionResponse,
  AdminTransaction,
  AdminTransactionsParams,
  AdminUser,
  AdminUserRemovalResponse,
  AdminUsersParams,
  FeeAuditResponse,
  FeeConfigurationsResponse,
  UpdateFeeRequest,
} from '@/types/admin'
import type { LoginData, LoginResponse } from '@/types/auth'
import { feesService } from './fees.service'
import api from './http.service'

/** Drops empty filters, so the API doesn't get searchQuery= or role=. */
function cleanParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  ) as Partial<T>
}

/**
 * The admin portal's calls: /api/Admin/* (Admin accounts only) and the fee
 * settings under /api/Configuration.
 */
class AdminService {
  /** The normal login. The caller checks the account is an Admin before saving it. */
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/Auth/login', data)
    return response.data
  }

  async getUsers(params: AdminUsersParams): Promise<AdminPage<AdminUser>> {
    const response = await api.get('/api/Admin/users', { params: cleanParams(params) })
    return response.data
  }

  async getEvents(params: AdminEventsParams): Promise<AdminPage<AdminEvent>> {
    const response = await api.get('/api/Admin/events', { params: cleanParams(params) })
    return response.data
  }

  /** Searches the order code and the buyer's email. */
  async getOrders(params: AdminListParams): Promise<AdminPage<AdminOrder>> {
    const response = await api.get('/api/Admin/orders', { params: cleanParams(params) })
    return response.data
  }

  /** Everything the dashboard counts, all time. */
  async getAnalytics(): Promise<AdminAnalyticsResponse> {
    const response = await api.get('/api/Admin/analytics')
    return response.data
  }

  /** Drafts and suspended events too. 404 for an unknown id. */
  async getEventDetails(eventId: string): Promise<AdminEventDetailsResponse> {
    const response = await api.get(`/api/Admin/events/${eventId}`)
    return response.data
  }

  /** Searches the description and the user's email. Page size 1 to 100. */
  async getTransactions(params: AdminTransactionsParams): Promise<AdminPage<AdminTransaction>> {
    const response = await api.get('/api/Admin/transactions', { params: cleanParams(params) })
    return response.data
  }

  /**
   * Sets the state rather than toggling it, so a retry or a second click can't
   * undo the first. Returns the saved state. Admin accounts are refused.
   */
  async setUserSuspension(userId: string, isSuspended: boolean): Promise<AdminSuspensionResponse> {
    const response = await api.patch(`/api/Admin/users/${userId}/suspension`, { isSuspended })
    return response.data
  }

  /**
   * Suspending also unpublishes; unsuspending doesn't republish, so the event
   * stays a draft until the organizer publishes it again.
   */
  async setEventSuspension(eventId: string, isSuspended: boolean): Promise<AdminSuspensionResponse> {
    const response = await api.patch(`/api/Admin/events/${eventId}/suspension`, { isSuspended })
    return response.data
  }

  /**
   * Completed orders only. Credits the buyer's wallet, voids the tickets and
   * puts them back on sale. Refuses resale, transferred and checked-in tickets.
   */
  async refundOrder(orderId: string): Promise<AdminActionResponse> {
    const response = await api.post(`/api/Admin/orders/${orderId}/refund`)
    return response.data
  }

  /**
   * Deletes the account. If records it depends on can't go, the backend
   * deactivates it instead; data.outcome says which. Refuses Admin accounts.
   */
  async deleteUser(userId: string): Promise<AdminUserRemovalResponse> {
    const response = await api.delete(`/api/Admin/users/${userId}`)
    return response.data
  }

  /** Public: the same list the fan and vendor screens read. */
  getFees(): Promise<FeeConfigurationsResponse> {
    return feesService.getFees()
  }

  async updateFee(data: UpdateFeeRequest): Promise<ApiResponse<null>> {
    const response = await api.put('/api/Configuration/fees', data)
    return response.data
  }

  async getFeeAudit(feeType: string): Promise<FeeAuditResponse> {
    const response = await api.get(`/api/Configuration/fees/audit/${encodeURIComponent(feeType)}`)
    return response.data
  }
}

export const adminService = new AdminService()
