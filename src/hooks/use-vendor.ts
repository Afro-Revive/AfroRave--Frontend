import { eventKeys } from '@/lib/event-keys'
import { eventService } from '@/services/event.service'
import { profileService } from '@/services/profile.service'
import { vendorService } from '@/services/vendor.service'
import { useAfroStore } from '@/stores'
import type { EventDetailData, PaginatedResponse } from '@/types'
import type { ChangePasswordRequest, UpdateVendorProfileRequest, VendorProfileData } from '@/types/profile'
import type {
  PayVendorSlotRequest,
  VendorApplicationRequest,
  VendorApplications,
  VendorSavedEvent,
  VendorSummary,
} from '@/types/vendor'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useVendorProfile } from './use-profile-mutations'

export function useVendorSummary() {
  return useQuery({
    queryKey: eventKeys.vendorSummary(),
    queryFn: () => vendorService.getSummary(),
    select: (response) => response.data as VendorSummary,
  })
}

export function useVendorApplication(applicationId: string) {
  return useQuery({
    queryKey: eventKeys.myVendorApplication(applicationId),
    queryFn: () => vendorService.getVendorApplication(applicationId),
    select: (response) => response.data as VendorApplications | undefined,
    enabled: !!applicationId,
    // A withdrawn request is gone for good, so there's nothing to retry.
    retry: false,
  })
}

export function useVendorSavedEvents() {
  return useQuery({
    queryKey: eventKeys.vendorSaved(),
    queryFn: () => vendorService.getSavedEvents(),
    select: (response) => (response.data as PaginatedResponse<VendorSavedEvent> | undefined)?.items ?? [],
  })
}

/** Saves an event, or removes it when `isSaved` is true. */
export function useToggleVendorSavedEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, isSaved }: { eventId: string; isSaved: boolean }) =>
      isSaved ? vendorService.unsaveEventVendor(eventId) : vendorService.saveEventVendor(eventId),
    onSuccess: (_, { isSaved }) => {
      toast.success(isSaved ? 'Removed from saved events' : 'Event saved')
      queryClient.invalidateQueries({ queryKey: eventKeys.vendorSaved() })
      queryClient.invalidateQueries({ queryKey: eventKeys.vendorSummary() })
    },
    onError: () => {
      toast.error('Could not update saved events. Please try again.')
    },
  })
}

/**
 * Sends one application per slot (the API takes them one at a time). Resolves with the
 * indexes that failed, so the caller can keep those and drop the rest.
 */
export function useRequestVendorSlots() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requests: VendorApplicationRequest[]) => {
      const results = await Promise.allSettled(requests.map((request) => vendorService.applyVendorSlot(request)))
      return results.flatMap((result, index) => (result.status === 'rejected' ? [index] : []))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.myVendorApplications() })
    },
  })
}

export function useWithdrawVendorApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: number) => vendorService.withdrawApplication(applicationId),
    onSuccess: () => {
      toast.success('Request withdrawn')
      queryClient.invalidateQueries({ queryKey: eventKeys.myVendorApplications() })
    },
    onError: () => {
      toast.error('Could not withdraw the request. Please try again.')
    },
  })
}

/** Toasts and refetching are left to the caller: the response may be a Paystack link, not a secured slot. */
export function useInitializeVendorSlotPayment() {
  return useMutation({
    mutationFn: (data: PayVendorSlotRequest) => vendorService.initializeSlotPayment(data),
  })
}

export function usePayVendorSlot() {
  return useMutation({
    mutationFn: (data: PayVendorSlotRequest) => vendorService.payVendorSlot(data),
  })
}

/**
 * Event details for a list of event ids, keyed by id. Shares the cache with useGetEvent.
 */
export function useVendorEventsById(eventIds: string[]) {
  const uniqueIds = Array.from(new Set(eventIds))
  const results = useQueries({
    queries: uniqueIds.map((eventId) => ({
      queryKey: eventKeys.detail(eventId),
      queryFn: () => eventService.getEvent(eventId),
    })),
  })

  const eventsById = new Map<string, EventDetailData>()
  results.forEach((result, index) => {
    const event = result.data?.data as EventDetailData | undefined
    if (event) eventsById.set(uniqueIds[index], event)
  })

  return { eventsById, isPending: results.some((result) => result.isPending) }
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateVendorProfileRequest) => profileService.updateVendorProfile(data),
    onSuccess: () => {
      toast.success('Profile saved')
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] })
    },
    onError: () => {
      toast.error('Could not save your profile. Please try again.')
    },
  })
}

export function useChangeVendorPassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changeVendorPassword(data),
    onSuccess: () => {
      toast.success('Password updated')
    },
    onError: () => {
      toast.error('Could not update your password. Check your current password and try again.')
    },
  })
}

/**
 * The fields a vendor needs filled in before their profile counts as set up. Reads the
 * vendor profile first and falls back to the logged-in user, the same order as the modal,
 * since the user from login can be missing the picture, about text or socials.
 */
export function useVendorProfileComplete() {
  const { user } = useAfroStore()
  const { data: profileResponse } = useVendorProfile()
  if (!user) return false
  const vendor = profileResponse?.data as VendorProfileData | undefined
  const { profile } = user
  const socials = vendor?.businessData?.socials || profile.businessData?.socials
  return [
    profile.firstName,
    vendor?.businessName || profile.businessName || profile.companyName,
    vendor?.contactPhone || profile.phoneNumber,
    vendor?.contactEmail || user.email,
    vendor?.businessData?.aboutBusiness ||
      vendor?.description ||
      profile.description ||
      profile.businessData?.aboutBusiness ||
      profile.aboutBusiness,
    vendor?.businessData?.profilePicture || vendor?.profilePicture || profile.businessData?.profilePicture,
    socials && Object.values(socials).some((link) => !!link),
  ].every(Boolean)
}
