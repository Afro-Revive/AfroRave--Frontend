import { guestlistKeys } from '@/lib/guestlist-keys'
import { inviteTicketKeys } from '@/lib/invite-ticket-keys'
import { inviteTicketService } from '@/services/invite-ticket.service'
import type { PaginatedResponse } from '@/types/api'
import type {
  EventOrdersData,
  EventOrdersResponse,
  InviteTicketData,
  InviteTicketRequest,
  InviteTicketResponse,
} from '@/types/invite-tickets'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

/**
 * The server's own message when it sent one. Invite failures have specific
 * causes — expired, wrong email, already accepted — that a generic toast hides.
 */
function errorMessage(error: unknown, fallback: string): string {
  const message = (error as AxiosError<{ message?: string }>)?.response?.data?.message

  return typeof message === 'string' && message.trim() ? message : fallback
}

/**
 * A ticket's invites as a plain array. Normalised here, once, rather than by
 * each screen — and a paginated envelope is tolerated, so a shape change shows
 * as an empty list rather than a crash.
 */
function selectInvites(response: InviteTicketResponse): InviteTicketData[] {
  const data = response?.data as InviteTicketData[] | { items?: InviteTicketData[] } | undefined

  if (Array.isArray(data)) return data
  return data?.items ?? []
}

/** An event's orders plus the paging around them, whichever shape arrives. */
function selectOrders(response: EventOrdersResponse) {
  const data = response?.data as EventOrdersData[] | PaginatedResponse<EventOrdersData> | undefined

  if (Array.isArray(data)) {
    return { orders: data, totalCount: data.length, totalPages: 1, pageNumber: 1 }
  }

  return {
    orders: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 1,
    pageNumber: data?.pageNumber ?? 1,
  }
}


/**
 * Invites already sent for a ticket. Shared by the ticket card's count and the
 * Send Invites modal's "already invited" rows — one key, so one request.
 */
export function useGetTicketInvites(ticketId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: inviteTicketKeys.ticketInvites(ticketId ?? ''),
    queryFn: () => inviteTicketService.getTicketInvites(ticketId ?? ''),
    select: selectInvites,
    enabled: !!ticketId && (options?.enabled ?? true),
  })
}

/** The invite behind an emailed link — what the guest sees before accepting. */
export function useGetInviteTicketByToken(token?: string) {
  return useQuery({
    queryKey: inviteTicketKeys.byToken(token ?? ''),
    queryFn: () => inviteTicketService.getInviteTicketByToken(token ?? ''),
    enabled: !!token,
    // A bad or expired token won't become good on a retry.
    retry: false,
  })
}

/** Everyone invited to an event's invite-only tickets, across all of them. */
export function useGetInviteOnlyTicketAudience(eventId?: string) {
  return useQuery({
    queryKey: inviteTicketKeys.audience(eventId ?? ''),
    queryFn: () => inviteTicketService.getInviteOnlyTicketAudience(eventId ?? ''),
    enabled: !!eventId,
  })
}

export function useGetEventOrders(
  eventId?: string,
  params?: { pageNumber?: number; pageSize?: number },
) {
  return useQuery({
    queryKey: inviteTicketKeys.orders(eventId ?? '', params),
    queryFn: () => inviteTicketService.getEventOrders(eventId ?? '', params),
    select: selectOrders,
    enabled: !!eventId,
  })
}


export function useSendTicketInvites(eventId: string, ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InviteTicketRequest) =>
      inviteTicketService.sendTicketInvite(eventId, ticketId, data),
    onSuccess: (_, data) => {
      const manualCount = data.manualGuests?.length ?? 0
      const count = data.guestIds.length + manualCount

      // Manual guests are saved to the guestlist by the same request.
      if (manualCount > 0) {
        toast.success(
          count === 1
            ? 'Guest saved and invite sent!'
            : `${count} invites sent — new guests saved to your guestlist.`,
        )
      } else {
        toast.success(count === 1 ? 'Invite sent!' : `${count} invites sent!`)
      }

      // The card's count and the modal's already-invited rows share this key.
      queryClient.invalidateQueries({ queryKey: inviteTicketKeys.ticketInvites(ticketId) })
      // New invitees join the event's audience too.
      queryClient.invalidateQueries({ queryKey: inviteTicketKeys.audience(eventId) })

      // The server saves manual guests to the guestlist, so its lists and
      // category counts are stale too.
      if (manualCount > 0) {
        queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
        queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
      }
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to send invites. Please try again.'))
    },
  })
}

/**
 * Accepts the invite behind an emailed link. The guest has to be signed in
 * with the invited address, which is the most likely reason this fails — so
 * the server's message is surfaced rather than a generic one.
 */
export function useAcceptInviteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => inviteTicketService.acceptInviteTicket(token),
    onSuccess: (_, token) => {
      toast.success('Invite accepted!')
      // Its status changes, so the details page shouldn't keep showing it as pending.
      queryClient.invalidateQueries({ queryKey: inviteTicketKeys.byToken(token) })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to accept the invite. Please try again.'))
    },
  })
}

/** Points a sent invite at a different email — e.g. to fix a typo. */
export function useUpdateInviteEmail(ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ inviteId, email }: { inviteId: string; email: string }) =>
      inviteTicketService.updateInviteEmail(ticketId, inviteId, { email }),
    onSuccess: () => {
      toast.success('Invite email updated!')
      queryClient.invalidateQueries({ queryKey: inviteTicketKeys.ticketInvites(ticketId) })
      // Only the ticket id is known here, so every audience is refreshed — the
      // invite shows in whichever event's audience this ticket belongs to.
      queryClient.invalidateQueries({ queryKey: inviteTicketKeys.audiences() })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to update the email. Please try again.'))
    },
  })
}
