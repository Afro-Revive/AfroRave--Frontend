import { guestlistKeys } from '@/lib/guestlist-keys'
import { guestListService } from '@/services/guestlist.service'
import type { CreateGuestRequest } from '@/types/guestlist'
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
