import { profileService } from '@/services/profile.service'
import type { UpdateUserProfileRequest, WithdrawFundsRequest } from '@/types'
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