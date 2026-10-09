import { eventKeys } from '@/lib/event-keys'
import { privateEventKeys } from '@/lib/private-event-keys'
import { privateEventService } from '@/services/private-event.service'
import type { PaginatedResponse } from '@/types/api'
import type {
  AccessRequestData,
  AccessRequestResponse,
  ViewerAccessStatusData,
  ViewerAccessStatusResponse,
} from '@/types/private-event'
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

type AccessRequestParams = {
  status?: AccessRequestData['status']
  pageNumber?: number
  pageSize?: number
  search?: string
}

/**
 * The server's own message when it sent one. Access failures have specific
 * causes — applications ended or paused, already requested — that a generic
 * toast hides.
 */
function errorMessage(error: unknown, fallback: string): string {
  const message = (error as AxiosError<{ message?: string }>)?.response?.data?.message

  return typeof message === 'string' && message.trim() ? message : fallback
}

function selectAccessStatus(response: ViewerAccessStatusResponse) {
  return response?.data as ViewerAccessStatusData | undefined
}

/** An event's access requests plus the paging around them, whichever shape arrives. */
function selectAccessRequests(response: AccessRequestResponse) {
  const data = response?.data as
    | AccessRequestData[]
    | PaginatedResponse<AccessRequestData>
    | undefined

  if (Array.isArray(data)) {
    return { requests: data, totalCount: data.length, totalPages: 1, pageNumber: 1 }
  }

  return {
    requests: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 1,
    pageNumber: data?.pageNumber ?? 1,
  }
}

/**
 * The deadline, paused and ended flags show in the viewer's access status and
 * on the event itself, so every application setting refreshes both.
 */
function invalidateApplicationSettings(queryClient: QueryClient, eventId: string) {
  queryClient.invalidateQueries({ queryKey: privateEventKeys.event(eventId) })
  queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
  queryClient.invalidateQueries({ queryKey: eventKeys.organizer() })
}

/**
 * Where the signed-in viewer stands with a private event: not requested,
 * pending, approved or denied, and whether they can request or buy.
 */
export function useGetViewerAccessStatus(eventId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: privateEventKeys.accessStatus(eventId ?? ''),
    queryFn: () => privateEventService.getViewerAccessStatus(eventId ?? ''),
    select: selectAccessStatus,
    enabled: !!eventId && (options?.enabled ?? true),
  })
}

/** An event's access requests for the organizer, filtered by status and paged. */
export function useGetAccessRequests(eventId?: string, params?: AccessRequestParams) {
  return useQuery({
    queryKey: privateEventKeys.accessRequests(eventId ?? '', params),
    queryFn: () => privateEventService.getAccessRequests(eventId ?? '', params),
    select: selectAccessRequests,
    enabled: !!eventId,
  })
}

export function useRequestAccess(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => privateEventService.requestAccess(eventId),
    onSuccess: () => {
      toast.success("Your request has been sent to the organizer. You’ll be notified once it’s approved.")
      // The viewer's status moves to pending, and the organizer's list gains a row.
      queryClient.invalidateQueries({ queryKey: privateEventKeys.event(eventId) })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to request access. Please try again.'))
    },
  })
}

export function useBatchUpdateAccessRequests(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { requestIds: string[]; decision: 'Approved' | 'Deny' }) =>
      privateEventService.batchUpdateAccessRequests(eventId, data),
    onSuccess: (_, { requestIds, decision }) => {
      const count = requestIds.length
      const verb = decision === 'Approved' ? 'approved' : 'denied'

      toast.success(count === 1 ? `Request ${verb}.` : `${count} requests ${verb}.`)
      // Requests move between status filters, so every page and filter is stale.
      queryClient.invalidateQueries({ queryKey: privateEventKeys.event(eventId) })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to update the requests. Please try again.'))
    },
  })
}

export function useUpdateApplicationDeadline(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deadline: string) =>
      privateEventService.updateApplicationDeadline(eventId, { deadline }),
    onSuccess: () => {
      toast.success('Application deadline updated.')
      invalidateApplicationSettings(queryClient, eventId)
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to update the deadline. Please try again.'))
    },
  })
}

/** Pauses applications with `true` and resumes them with `false`. */
export function useUpdateApplicationStatus(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pause: boolean) =>
      privateEventService.updateApplicationStatus(eventId, { pause }),
    onSuccess: (_, pause) => {
      toast.success(pause ? 'Applications paused.' : 'Applications resumed.')
      invalidateApplicationSettings(queryClient, eventId)
    },
    onError: (error, pause) => {
      toast.error(
        errorMessage(
          error,
          `Failed to ${pause ? 'pause' : 'resume'} applications. Please try again.`,
        ),
      )
    },
  })
}

export function useEndApplication(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => privateEventService.endApplication(eventId),
    onSuccess: () => {
      toast.success('Applications ended.')
      invalidateApplicationSettings(queryClient, eventId)
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Failed to end applications. Please try again.'))
    },
  })
}
