import { SidebarToggle } from '@/components/shared/sidebar-toggle'
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
import { DEFAULT_GUEST_SORT, type GuestSort } from '../standalone/guestlist/constant'
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
  const [sort, setSort] = useState<GuestSort>(DEFAULT_GUEST_SORT)
  const [page, setPage] = useState(1)
  // Guests and whole categories ticked to add. Only new ones: what's already on
  // the event shows as locked in the table, and is removed from the guestlist.
  const [pickedIds, setPickedIds] = useState<string[]>([])
  const [pickedCategoryIds, setPickedCategoryIds] = useState<string[]>([])
  // 'saved' lists who's on the event; 'import' is the table for adding to it.
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
  const savedCategoryIds = useMemo(() => config?.categoryIds ?? [], [config])

  // Land on the guestlist when the event already has guests, and straight on
  // the import table when there's nobody to show yet. Only once, on first load.
  const hasChosenView = useRef(false)

  useEffect(() => {
    if (hasChosenView.current || !config) return

    const hasGuests =
      (config.individualGuestIds?.length ?? 0) > 0 || (config.categoryIds?.length ?? 0) > 0
    setView(hasGuests ? 'saved' : 'import')
    hasChosenView.current = true
  }, [config])

  // Configure replaces the event's whole list, so every save sends what's
  // already there along with the change.
  function addPickedToEvent() {
    configureGuestList.mutate(
      {
        categoryIds: Array.from(new Set([...savedCategoryIds, ...pickedCategoryIds])),
        individualGuestIds: Array.from(new Set([...savedIds, ...pickedIds])),
      },
      {
        onSuccess: () => {
          setPickedIds([])
          setPickedCategoryIds([])
          setView('saved')
        },
      },
    )
  }

  function removeGuestFromEvent(guestId: string) {
    configureGuestList.mutate({
      categoryIds: savedCategoryIds,
      individualGuestIds: savedIds.filter((id) => id !== guestId),
    })
  }

  function removeCategoryFromEvent(categoryId: string) {
    configureGuestList.mutate({
      categoryIds: savedCategoryIds.filter((id) => id !== categoryId),
      individualGuestIds: savedIds,
    })
  }

  function togglePickedCategory(categoryId: string) {
    setPickedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    )
  }

  function togglePickedGuest(guestId: string) {
    setPickedIds((current) =>
      current.includes(guestId) ? current.filter((id) => id !== guestId) : [...current, guestId],
    )
  }

  return (
    <CreatorPageContainer>
      <div className='w-full bg-white flex items-start gap-4 px-5 md:px-8 py-6'>
        <SidebarToggle />

        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-2xl font-bold text-black'>Guestlist</p>
          <p className='font-inter-tight text-sm text-black'>
            Guests on this list are admitted by name at the door. No ticket is required.
          </p>
        </div>
      </div>

      <div className='w-full flex flex-col gap-6 px-5 md:px-8 py-6 md:py-8'>
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
            individualGuestIds={savedIds}
            eventCategories={savedCategoryIds.map((id) => ({
              id,
              // A category deleted since it was added has no name left.
              name: categories.find((category) => category.id === id)?.name ?? 'Removed category',
              guestCount: categories.find((category) => category.id === id)?.guestCount ?? 0,
            }))}
            onRemoveGuest={removeGuestFromEvent}
            onRemoveCategory={removeCategoryFromEvent}
            isSaving={configureGuestList.isPending}
          />
        ) : (
          <ImportGuestlistCard
            guests={guests}
            categories={categories}
            totalGuests={totalGuests}
            pickedIds={pickedIds}
            onToggleGuest={togglePickedGuest}
            pickedCategoryIds={pickedCategoryIds}
            onToggleCategory={togglePickedCategory}
            savedIds={savedIds}
            savedCategoryIds={savedCategoryIds}
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
            onAddToEvent={addPickedToEvent}
            onViewGuestlist={() => setView('saved')}
          />
        )}
      </div>
    </CreatorPageContainer>
  )
}
