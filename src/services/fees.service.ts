import type { FeeConfigurationsResponse } from '@/types/admin'
import api from './http.service'

export const feesService = {
  /**
   * The platform's fees as the admin set them (public, no sign-in needed).
   * Percentages are fractions: 0.08 is 8%.
   */
  async getFees(): Promise<FeeConfigurationsResponse> {
    const response = await api.get('/api/Configuration/fees')
    return response.data
  },
}
