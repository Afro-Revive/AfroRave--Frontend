import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  useAddGuestToEvent,
  useConfigureEventGuestList,
  useGetEventCheckinList,
  useGetEventGuestListConfig,
  useGetOrganizerCategories,
  useGetOrganizerGuestList,
} from '@/hooks/use-guestlist-mutations'
import type { PaginatedResponse } from '@/types'
import type {
  CategoryData,
  EventCheckinGuest,
  EventGuestlistCongigData,
  GuestListData,
} from '@/types/guestlist'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CreatorPageContainer, SelectedEventGate } from '../_components/selected-event-page'
import type { GuestSort } from '../standalone/guestlist/constant'
import { AddGuestCard } from './components/add-guest-card'
import { EventGuestlistCard } from './components/event-guestlist-card'
import { ImportGuestlistCard } from './components/import-guestlist-card'
import { ALL_CATEGORIES_ID, IMPORT_PAGE_SIZE } from './constant'

export default function GuestListPage() {
  return (
    <SelectedEventGate>{(event) => <EventGuestlist eventId={event.eventId} />}</SelectedEventGate>
  )
}

function EventGuestlist({ eventId }: { eventId: string }) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_CATEGORIES_ID)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<GuestSort>('newest')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // 'saved' lists who's on the event; 'import' is the table for changing that.
  const [view, setView] = useState<'saved' | 'import'>('import')
  const [savedSearch, setSavedSearch] = useState('')

  const debouncedSearch = useDebouncedValue(search)
  const debouncedSavedSearch = useDebouncedValue(savedSearch)

  // Each of these changes the result set, so the old page number is meaningless.
  useEffect(() => setPage(1), [activeCategoryId, debouncedSearch, sort])

  const { data, isFetching } = useGetOrganizerGuestList({
    categoryId: activeCategoryId === ALL_CATEGORIES_ID ? undefined : activeCategoryId,
    pageNumber: page,
    pageSize: IMPORT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    sort,
  })

  // One row fetched purely for its totalCount, which the All pill needs and a
  // filtered page can't know.
  const { data: totalsResponse } = useGetOrganizerGuestList({
    pageNumber: 1,
    pageSize: 1,
  })

  const { data: categoriesResponse } = useGetOrganizerCategories()
  const { data: configResponse } = useGetEventGuestListConfig(eventId)
  const {
    data: checkinResponse,
    isPending: isLoadingCheckin,
    isFetching: isFetchingCheckin,
  } = useGetEventCheckinList(eventId, debouncedSavedSearch || undefined)

  const addGuestToEvent = useAddGuestToEvent(eventId)
  const configureGuestList = useConfigureEventGuestList(eventId)

  // Two unwraps: the envelope's data is a page, the guests are its items.
  const guestPage = data?.data as PaginatedResponse<GuestListData> | undefined
  const guests = guestPage?.items ?? []

  const totalsPage = totalsResponse?.data as PaginatedResponse<GuestListData> | undefined
  const totalGuests = totalsPage?.totalCount ?? 0

  const categories = (categoriesResponse?.data as CategoryData[] | undefined) ?? []
  const config = configResponse?.data as EventGuestlistCongigData | undefined
  const eventGuests = (checkinResponse?.data as EventCheckinGuest[] | undefined) ?? []

  const savedIds = useMemo(() => config?.individualGuestIds ?? [], [config])
  const savedCategoryIds = config?.categoryIds ?? []

  // Seeded once, from the event's saved list, so guests already on it come back
  // ticked. Only once: re-seeding on every refetch would wipe ticks made since,
  // which Add Guest's refetch would otherwise do mid-selection.
  const hasSeeded = useRef(false)

  useEffect(() => {
    if (hasSeeded.current || !config) return

    setSelectedIds(config.individualGuestIds ?? [])
    // Land on the guestlist when the event already has guests, and straight on
    // the import table when there's nobody to show yet.
    const hasGuests =
      (config.individualGuestIds?.length ?? 0) > 0 || (config.categoryIds?.length ?? 0) > 0
    setView(hasGuests ? 'saved' : 'import')
    hasSeeded.current = true
  }, [config])

  // Configure replaces the event's list, so saving sends the whole selection —
  // which also makes unticking a saved guest a removal. Counted both ways so
  // the button can say which of the two a save will do.
  const addedCount = selectedIds.filter((id) => !savedIds.includes(id)).length
  const removedCount = savedIds.filter((id) => !selectedIds.includes(id)).length

  function saveSelection(options?: { onSuccess?: () => void }) {
    configureGuestList.mutate(
      {
        // Resent as-is: under replace, sending [] would wipe the event's
        // categories. TODO: whole-category selection isn't wired — the pills
        // filter the list rather than selecting a category.
        categoryIds: savedCategoryIds,
        individualGuestIds: selectedIds,
      },
      options,
    )
  }

  /** Saves anything pending first, so leaving the table never drops ticks. */
  function saveAndShowGuestlist() {
    if (addedCount + removedCount === 0) {
      setView('saved')
      return
    }

    saveSelection({ onSuccess: () => setView('saved') })
  }

  function toggleGuest(guestId: string) {
    setSelectedIds((current) =>
      current.includes(guestId) ? current.filter((id) => id !== guestId) : [...current, guestId],
    )
  }

  return (
    <CreatorPageContainer>
      <div className='w-full bg-white flex flex-col gap-1 px-5 md:px-14 py-6'>
        <p className='font-inter-tight text-2xl font-bold text-black'>Guestlist</p>
        <p className='font-inter-tight text-sm text-black'>
          Guests on this list are admitted by name at the door. No ticket is required.
        </p>
      </div>

      <div className='w-full flex flex-col gap-6 px-5 md:px-14 py-6 md:py-8'>
        <AddGuestCard
          isSubmitting={addGuestToEvent.isPending}
          onSubmit={(values) =>
            addGuestToEvent.mutate(
              {
                guest: values,
                saved: {
                  categoryIds: savedCategoryIds,
                  individualGuestIds: savedIds,
                },
              },
              {
                // Ticked locally rather than re-seeded, so it joins whatever
                // else is ticked instead of replacing it.
                onSuccess: (guestId) =>
                  setSelectedIds((current) =>
                    current.includes(guestId) ? current : [...current, guestId],
                  ),
              },
            )
          }
        />

        {view === 'saved' ? (
          <EventGuestlistCard
            guests={eventGuests}
            search={savedSearch}
            onSearchChange={setSavedSearch}
            isLoading={isLoadingCheckin}
            isFetching={isFetchingCheckin}
            onImportGuests={() => setView('import')}
          />
        ) : (
          <ImportGuestlistCard
            guests={guests}
            categories={categories}
            totalGuests={totalGuests}
            selectedIds={selectedIds}
            onToggleGuest={toggleGuest}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            page={guestPage?.pageNumber ?? page}
            totalPages={guestPage?.totalPages ?? 1}
            totalCount={guestPage?.totalCount ?? guests.length}
            onPageChange={setPage}
            isFetching={isFetching}
            isSaving={configureGuestList.isPending}
            addedCount={addedCount}
            removedCount={removedCount}
            onAddToEvent={() => saveSelection()}
            onSaveGuests={saveAndShowGuestlist}
          />
        )}
      </div>
    </CreatorPageContainer>
  )
}
