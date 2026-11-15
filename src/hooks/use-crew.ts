import { crewService } from '@/services/crew.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const crewKeys = {
  all: ['crew'] as const,
  invite: (inviteCode: string) => [...crewKeys.all, 'invite', inviteCode] as const,
}

/** The invite behind a crew link, and whether it can still be accepted. */
export function useGetCrewInvite(inviteCode?: string) {
  return useQuery({
    queryKey: crewKeys.invite(inviteCode ?? ''),
    queryFn: () => crewService.getInviteDetails(inviteCode ?? ''),
    enabled: !!inviteCode,
    // A bad or used code won't become good on a retry.
    retry: false,
  })
}

/**
 * Joins the crew. No toasts: the page shows the result as a whole screen,
 * either "Welcome to the Crew!" or "no longer valid".
 */
export function useAcceptCrewInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteCode: string) => crewService.acceptInvite(inviteCode),
    onSuccess: (_, inviteCode) => {
      // Now Active, which is what keeps the welcome screen on a refresh.
      queryClient.invalidateQueries({ queryKey: crewKeys.invite(inviteCode) })
    },
  })
}
