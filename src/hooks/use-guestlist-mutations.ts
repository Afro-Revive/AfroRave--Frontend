import { guestlistKeys } from '@/lib/guestlist-keys'
import { guestListService } from '@/services/guestlist.service'
import type {
  CreateGuestRequest,
  EventGuestlistCongigData,
  GuestListData,
} from '@/types/guestlist'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'


/** One page of guests. Paging, category, search and sort are the server's. */
export function useGetOrganizerGuestList(params?: {
  categoryId?: string
  pageNumber?: number
  pageSize?: number
  search?: string
  sort?: string
}) {
  return useQuery({
    // params in the key so a different page size isn't served the cached set.
    queryKey: guestlistKeys.guestList(params),
    queryFn: () => guestListService.getOrganizerGuestList(params),
  })
}

export function useGetOrganizerCategories() {
  return useQuery({
    queryKey: guestlistKeys.categories(),
    queryFn: () => guestListService.getOrganizerCategories(),
  })
}

// Get the list of guests on an event, with their checkin status
export function useGetEventCheckinList(eventId?: string, search?: string) {
  return useQuery({
    queryKey: guestlistKeys.checkinList(eventId ?? '', search),
    queryFn: () => guestListService.getEventCheckinList(eventId ?? '', search),
    enabled: !!eventId,
  })
}

/** Which categories and individual guests an event draws its guest list from. */
export function useGetEventGuestListConfig(eventId?: string) {
  return useQuery({
    queryKey: guestlistKeys.eventConfig(eventId ?? ''),
    queryFn: () => guestListService.getEventGuestListConfig(eventId ?? ''),
    enabled: !!eventId,
  })
}



export function useAddGuest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGuestRequest) => guestListService.addGuestList(data),
    onSuccess: () => {
      toast.success('Guest added successfully!')
      // Categories too: every tile shows a guest count.
      queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
    },
    onError: () => {
      toast.error('Failed to add guest. Please try again.')
    },
  })
}

export function useDeleteGuest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (guestId: string) => guestListService.deleteGuestList(guestId),
    onSuccess: () => {
      toast.success('Guest removed successfully!')
      queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
    },
    onError: () => {
      toast.error('Failed to remove guest. Please try again.')
    },
  })
}

export function useAddCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string }) => guestListService.addCategory(data),
    onSuccess: () => {
      toast.success('Category created successfully!')
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
    },
    onError: () => {
      toast.error('Failed to create category. Please try again.')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => guestListService.deleteCategory(categoryId),
    onSuccess: () => {
      toast.success('Category deleted successfully!')
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
      // Guests carry category names, so their rows go stale with the category.
      queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
    },
    onError: () => {
      toast.error('Failed to delete category. Please try again.')
    },
  })
}

export function useBulkUploadGuests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return guestListService.bulkUploadGuests(formData)
    },
    onSuccess: () => {
      toast.success('Guests uploaded successfully!')
      queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
    },
    onError: () => {
      toast.error('Failed to upload guests. Check the file and try again.')
    },
  })
}

/**
 * Fetches the CSV template and hands it to the browser as a download. A
 * mutation rather than a query: it's an action the organizer takes, and caching
 * a Blob would serve a revoked object URL on the second click.
 */
export function useDownloadCSVTemplate() {
  return useMutation({
    mutationFn: () => guestListService.downloadCSVTemplate(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = 'afrorevive-guestlist-template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    onError: () => {
      toast.error('Failed to download the template. Please try again.')
    },
  })
}

/** Thrown when the guest was created but couldn't be put on the event. */
class AddedToAccountOnlyError extends Error {}

/**
 * Creates a guest and puts them on this event in one action.
 *
 * Sequential: the configure call needs the id the create returns. Configure
 * replaces the event's whole list rather than appending — sending only the new
 * guest leaves the event with just them — so the event's saved list is passed
 * in and the new guest is added to it.
 */
export function useAddGuestToEvent(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      guest,
      saved,
    }: {
      guest: CreateGuestRequest
      /** What the event holds now, which the new guest is added to. */
      saved: EventGuestlistCongigData
    }) => {
      const created = await guestListService.addGuestList(guest)

      // data.id, not created.id — the envelope's own id is the zero GUID.
      const guestId = (created?.data as GuestListData | undefined)?.id
      if (!guestId) throw new AddedToAccountOnlyError()

      try {
        await guestListService.configureEventGuestList(eventId, {
          // Resent as-is: leaving these out would drop whole categories.
          categoryIds: saved.categoryIds,
          // A Set so a guest already on the event isn't listed twice.
          individualGuestIds: Array.from(new Set([...saved.individualGuestIds, guestId])),
        })
      } catch {
        throw new AddedToAccountOnlyError()
      }

      return guestId
    },
    onSuccess: () => {
      toast.success('Guest added to this event!')
    },
    onError: (error) => {
      // The two halves can fail separately, and the message should say which
      if (error instanceof AddedToAccountOnlyError) {
        toast.error('Guest saved, but couldn’t be added to this event. Select them below.')
      } else {
        toast.error('Failed to add guest. Please try again.')
      }
    },
    // Settled rather than success: a partial failure still created a guest, so
    // the lists are stale either way.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: guestlistKeys.guests() })
      queryClient.invalidateQueries({ queryKey: guestlistKeys.categories() })
      queryClient.invalidateQueries({ queryKey: guestlistKeys.eventConfig(eventId) })
    },
  })
}

export function useConfigureEventGuestList(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { categoryIds: string[]; individualGuestIds: string[] }) =>
      guestListService.configureEventGuestList(eventId, data),
    onSuccess: () => {
      toast.success('Guest list updated successfully!')
      queryClient.invalidateQueries({ queryKey: guestlistKeys.eventConfig(eventId) })
    },
    onError: () => {
      toast.error('Failed to update the guest list. Please try again.')
    },
  })
}
