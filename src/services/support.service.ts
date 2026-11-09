import type { ApiResponse } from '@/types/api'
import type { SupportMessageRequest } from '@/types/support'
import api from './http.service'

class SupportService {
  // Send a message to the support team (contact forms)
  async sendSupportMessage(data: SupportMessageRequest): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/Support', data)
    return response.data
  }
}

export const supportService = new SupportService()
