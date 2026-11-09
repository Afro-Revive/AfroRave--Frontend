import { profileService } from '@/services/profile.service'
import { apiErrorMessage } from '@/lib/api-error'
import type { BankDetailsRequest, UpdateUserProfileRequest, WithdrawFundsRequest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook for fetching user profile data
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => profileService.getUserProfile(),
  })
}

/**
 * Hook for updating user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => profileService.updateUserProfile(data),
    onSuccess: () => {
      // Invalidate and refetch user profile data
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error) => {
      toast.error('Failed to update profile. Please try again.')
      console.error('Profile update error:', error)
    },
  })
}

/**
 * Hook for fetching users wallet details
 */

export function useWalletDetails() {
  return useQuery({
    queryKey: ['wallet-details'],
    queryFn: () => profileService.getWalletDetails(),
  })
}

/**
 * Hook for withdrawing funds from wallet
 */
export function useWithdrawFunds() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WithdrawFundsRequest) => profileService.withdrawFunds(data),
    onSuccess: () => {
      toast.success('Withdrawal request submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['wallet-details'] })
    },
    onError: (error) => {
      toast.error('Failed to submit withdrawal request. Please try again.')
      console.error('Withdrawal request error:', error)
    },
  })
}

/**
 * Hook for fetching user active tickets
 */
export function useUserActiveTickets() {
  return useQuery({
    queryKey: ['user-active-tickets'],
    queryFn: () => profileService.getUserActiveTickets(),
  })
}

/**
 * Hook for fetching user past tickets
 */
export function useUserPastTickets() {
  return useQuery({
    queryKey: ['user-past-tickets'],
    queryFn: () => profileService.getUserPastTickets(),
  })
}

/**
 * Hook for fetching vendor profile
 */
export function useVendorProfile() {
  return useQuery({
    queryKey: ['vendor-profile'],
    queryFn: () => profileService.getVendorProfile(),
  })
}

/**
 * Hook for fetching organizer profile
 */
export function useOrganizerProfile() {
  return useQuery({
    queryKey: ['organizer-profile'],
    queryFn: () => profileService.getOrganizerProfile(),
  })
}

/**
 * Hook for updating organizer profile
 */
export function useUpdateOrganizerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof profileService.updateOrganizerProfile>[0]) =>
      profileService.updateOrganizerProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['organizer-profile'] })
    },
    onError: (error) => {
      toast.error('Failed to update profile. Please try again.')
      console.error('Organizer profile update error:', error)
    },
  })
}


/**
 * Changes an organizer's password, on the organizer endpoint.
 */
export function useChangeOrganizerPassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) =>
      profileService.changeOrganizerPassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error) => {
      // The server says why: a wrong current password, most often.
      toast.error(apiErrorMessage(error, 'Failed to change password. Please try again.'))
    },
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) =>
      profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error) => {
      toast.error('Failed to change password. Please try again.')
      console.error('Change password error:', error)
    },
  })
}

export function usePayoutHistory() {
  return useQuery({
    queryKey: ['payout-history'],
    queryFn: () => profileService.getPayoutHistory(),
  })
}

/**
 * Hook for fetching organizer notifications
 */
export function useOrganizerNotifications() {
  return useQuery({
    queryKey: ['organizer-notifications'],
    queryFn: () => profileService.getOrganizerNotifications(),
  })
}

/**
 * Hook for marking a notification as viewed
 */

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => profileService.markOrganizerNotificationsAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-notifications'] })
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read. Please try again.')
      console.error('Mark notification as read error:', error)
    },
  })
}
/** Query keys for the organizer's payouts, so saving and withdrawing refresh the right ones. */
export const organizerPayoutKeys = {
  wallet: ['organizer-wallet'] as const,
  bankAccount: ['organizer-bank-account'] as const,
  history: (params?: { pageNumber?: number; pageSize?: number }) =>
    ['organizer-payout-history', params ?? {}] as const,
  allHistory: ['organizer-payout-history'] as const,
}

/**
 * The organizer's wallet: total revenue, and what can be paid out now.
 */
export function useOrganizerWallet() {
  return useQuery({
    queryKey: organizerPayoutKeys.wallet,
    queryFn: () => profileService.getOrganizerWallet(),
  })
}

/**
 * The organizer's saved payout bank account. An organizer without one gets an
 * error or empty data back, so it isn't retried.
 */
export function useOrganizerBankAccount() {
  return useQuery({
    queryKey: organizerPayoutKeys.bankAccount,
    queryFn: () => profileService.getPayout(),
    retry: false,
  })
}

/**
 * Saves the organizer's payout bank account. The endpoint saves or updates,
 * so the same call covers both.
 */
export function useSaveOrganizerBankAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BankDetailsRequest) => profileService.savePayout(data),
    onSuccess: () => {
      toast.success('Bank account saved. Payouts will go here.')
      queryClient.invalidateQueries({ queryKey: organizerPayoutKeys.bankAccount })
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, 'Failed to save your bank account. Please try again.'))
    },
  })
}

/**
 * The organizer's payouts and withdrawals, newest first, paged by the server.
 */
export function useOrganizerPayoutHistory(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: organizerPayoutKeys.history(params),
    queryFn: () => profileService.getOrganizerPayoutHistory(params),
  })
}

/**
 * Requests an early payout of an amount the organizer chooses, to their saved
 * bank account.
 */
export function useOrganizerEarlyPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WithdrawFundsRequest) => profileService.withdrawOrganizerFunds(data),
    onSuccess: () => {
      toast.success('Early payout requested. It will show in your payout history.')
      queryClient.invalidateQueries({ queryKey: organizerPayoutKeys.wallet })
      queryClient.invalidateQueries({ queryKey: organizerPayoutKeys.allHistory })
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, 'Failed to request the payout. Please try again.'))
    },
  })
}
