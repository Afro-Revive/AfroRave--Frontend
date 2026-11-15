import type { ApiResponse } from './api'

/** Where a crew member stands. The organizer adds crew from the mobile app. */
export type CrewStatus = 'Invited' | 'Active' | 'Removed' | 'Expired'

/** What GET /api/Crew/invite/{inviteCode} returns. Readable without logging in. */
export interface CrewInviteDetails {
  inviteLink: string
  eventId: string
  eventName: string
  venue: string | null
  startDate: string
  endDate: string
  organizerName: string
  inviteeName: string
  /** Only this email can accept. */
  inviteeEmail: string
  status: CrewStatus
  isExpired: boolean
  /** False once the invite is accepted, removed, or the event has ended. */
  canAccept: boolean
  statusMessage: string | null
}

export type CrewInviteDetailsResponse = ApiResponse<CrewInviteDetails>
