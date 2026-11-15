import type { ApiResponse } from '@/types/api'
import type { CrewInviteDetailsResponse } from '@/types/crew'
import api from './http.service'

/**
 * The web's part of crew: accepting an invite. Organizers add and remove crew
 * from the mobile app, and crew work the door there too.
 */
class CrewService {
  async getInviteDetails(inviteCode: string): Promise<CrewInviteDetailsResponse> {
    const response = await api.get(`/api/Crew/invite/${encodeURIComponent(inviteCode)}`)
    return response.data
  }

  /** Must be signed in as the invited email. */
  async acceptInvite(inviteCode: string): Promise<ApiResponse<null>> {
    const response = await api.post(`/api/Crew/invite/${encodeURIComponent(inviteCode)}/accept`)
    return response.data
  }
}

export const crewService = new CrewService()
