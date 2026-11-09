import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  useAddCategory,
  useAddGuest,
  useDeleteGuest,
  useAddGuestToCategory,
  useAddGuestsToCategory,
  useRemoveGuestFromCategory,
  useGetOrganizerCategories,
  useGetOrganizerGuestList,
} from '@/hooks/use-guestlist-mutations'
import type { CategoryData, GuestListAllowanceData, GuestListData } from '@/types/guestlist'
import { guestListService } from '@/services/guestlist.service'
import { LoaderCircle, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AddGuestModal } from './components/add-guest-modal'
import { GuestCategories } from './components/guest-categories'
import { GuestLimitCard } from './components/guest-limit-card'
import { GuestSelectionBar } from './components/guest-selection-bar'
import { GuestTable } from './components/guest-table'
import { NewCategoryModal } from './components/new-category-modal'
import {
  ALL_GUESTS_CATEGORY_ID,
  GUESTS_PER_PAGE,
  GUEST_LIMIT,
  DEFAULT_GUEST_SORT,
  type GuestSort,
} from './constant'
import { PaginatedResponse } from '@/types'
import { useGetGuestListAllowance } from '@/hooks/use-guestlist-mutations'

export function GuestlistTab({
  isAddGuestOpen,
  onAddGuestOpenChange,
}: {
  /** Owned by the dashboard, since Add Guest lives in the tab bar. */
  isAddGuestOpen: boolean
  onAddGuestOpenChange: (open: boolean) => void
}) {
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  // Default category is the implicit "All guests" category
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_GUESTS_CATEGORY_ID)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<GuestSort>(DEFAULT_GUEST_SORT)
  const [page, setPage] = useState(1)

  // Trails the field so typing doesn't fire a request per keystroke.
  const debouncedSearch = useDebouncedValue(search)

  // Each of these changes the result set, so the old page number is meaningless.
  useEffect(() => setPage(1), [activeCategoryId, debouncedSearch, sort])

  // The ticked guests, kept across pages. A new category or search is a new
  // set of guests, so the ticks start again.
  const [selected, setSelected] = useState<Map<string, GuestListData>>(new Map())
  const [isSelectingAll, setIsSelectingAll] = useState(false)
  useEffect(() => setSelected(new Map()), [activeCategoryId, debouncedSearch])

  const categoryFilter = activeCategoryId === ALL_GUESTS_CATEGORY_ID ? undefined : activeCategoryId

  const { data, isPending, isFetching } = useGetOrganizerGuestList({
    categoryId: categoryFilter,
    pageNumber: page,
    pageSize: GUESTS_PER_PAGE,
    search: debouncedSearch || undefined,
    sort,
  })

  // One row fetched purely for its totalCount: the tiles and the limit card
  // need the account total, which the paged request above can't know.
  const { data: totalsResponse } = useGetOrganizerGuestList({ pageNumber: 1, pageSize: 1 })
  const { data: allowanceResponse } = useGetGuestListAllowance()
  const allowance = allowanceResponse?.data as GuestListAllowanceData | undefined
  const currentCategoryUsage = allowance?.categoryUsages.find((categoryUsage) => categoryUsage.categoryId === activeCategoryId)

  const { data: categoriesResponse } = useGetOrganizerCategories()

  const addGuest = useAddGuest()
  const addCategory = useAddCategory()
  const deleteGuest = useDeleteGuest()
  const addToCategory = useAddGuestToCategory()
  const addGuestsToCategory = useAddGuestsToCategory()
  const removeFromCategory = useRemoveGuestFromCategory()

  // Two unwraps: the envelope's data is a page, the guests are its items.
  const guestPage = data?.data as PaginatedResponse<GuestListData> | undefined
  const guests = guestPage?.items ?? []

  const totalsPage = totalsResponse?.data as PaginatedResponse<GuestListData> | undefined
  const totalGuests = totalsPage?.totalCount ?? 0

  const categories = (categoriesResponse?.data as CategoryData[] | undefined) ?? []

  const activeCategoryName =
    categories.find((category) => category.id === activeCategoryId)?.name ?? 'All Guests'

  function changeSelection(changed: GuestListData[], isSelected: boolean) {
    setSelected((current) => {
      const next = new Map(current)
      changed.forEach((guest) => (isSelected ? next.set(guest.id, guest) : next.delete(guest.id)))
      return next
    })
  }

  async function selectAllGuests() {
    setIsSelectingAll(true)
    try {
      const all = await guestListService.getAllOrganizerGuests({
        categoryId: categoryFilter,
        search: debouncedSearch || undefined,
        sort,
      })
      setSelected(new Map(all.map((guest) => [guest.id, guest])))
    } catch {
      toast.error('Couldn’t select every guest. Please try again.')
    } finally {
      setIsSelectingAll(false)
    }
  }

  function addSelectedToCategory(categoryId: string) {
    // Guests already in it are skipped rather than sent again.
    const guestIds = [...selected.values()]
      .filter((guest) => !guest.categoryIds?.includes(categoryId))
      .map((guest) => guest.id)

    if (guestIds.length === 0) {
      toast.info('They’re all in that category already.')
      return
    }

    addGuestsToCategory.mutate(
      { guestIds, categoryId },
      { onSuccess: () => setSelected(new Map()) },
    )
  }

  // Only the very first load blanks the card; later fetches keep the rows on
  // screen and show the spinner in the search field instead.
  const isFirstLoad = isPending && guests.length === 0
  const hasFilters = Boolean(debouncedSearch) || activeCategoryId !== ALL_GUESTS_CATEGORY_ID

  return (
    <div className='w-full flex flex-col gap-4 px-5 lg:px-10 pt-6'>
      <GuestCategories
        categories={categories}
        totalGuests={totalGuests}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
        onNewCategory={() => setIsNewCategoryOpen(true)}
      />

      {isFirstLoad ? (
        <div className='w-full flex items-center justify-center rounded-xl bg-white py-20'>
          <LoaderCircle className='size-7 animate-spin text-deep-red' />
        </div>
      ) : guests.length === 0 && !hasFilters ? (
        <EmptyState />
      ) : (
        <GuestTable
          guests={guests}
          categoryName={activeCategoryName}
          activeCategoryId={activeCategoryId}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          page={guestPage?.pageNumber ?? page}
          totalPages={guestPage?.totalPages ?? 1}
          totalCount={guestPage?.totalCount ?? guests.length}
          onPageChange={setPage}
          isFetching={isFetching}
          categories={categories}
          selectedIds={new Set(selected.keys())}
          onSelectionChange={changeSelection}
          toolbar={
            selected.size > 0 && (
              <GuestSelectionBar
                selectedCount={selected.size}
                totalCount={guestPage?.totalCount ?? guests.length}
                categories={categories}
                onSelectAll={selectAllGuests}
                isSelectingAll={isSelectingAll}
                onClear={() => setSelected(new Map())}
                onAddToCategory={addSelectedToCategory}
                isAdding={addGuestsToCategory.isPending}
              />
            )
          }
          onAddToCategory={(guest, categoryId) =>
            addToCategory.mutate({ guestId: guest.id, categoryId })
          }
          // Only offered inside a category, so activeCategoryId is a real id
          // here rather than the All-guests sentinel.
          onRemoveFromCategory={(guest) =>
            removeFromCategory.mutate({ guestId: guest.id, categoryId: activeCategoryId })
          }
          onDeleteGuest={(guest) => deleteGuest.mutate(guest.id)}
        />
      )}

      <GuestLimitCard used={allowance?.usedGuests ?? totalGuests} total={allowance?.totalGuests ?? GUEST_LIMIT.total} category={activeCategoryName} categoryUsage={currentCategoryUsage} />

      <NewCategoryModal
        open={isNewCategoryOpen}
        isSubmitting={addCategory.isPending}
        onClose={() => setIsNewCategoryOpen(false)}
        onSubmit={(values) =>
          addCategory.mutate(values, { onSuccess: () => setIsNewCategoryOpen(false) })
        }
      />

      <AddGuestModal
        open={isAddGuestOpen}
        categories={categories}
        isSubmitting={addGuest.isPending}
        onClose={() => onAddGuestOpenChange(false)}
        // Leaves Add Guest open underneath, so the new category lands in the
        // pill row and nothing typed so far is lost.
        onNewCategory={() => setIsNewCategoryOpen(true)}
        onSubmit={({ name, email, categoryIds }) =>
          addGuest.mutate(
            // categoryIds only, not the legacy single categoryId as well —
            // sending both would leave the server to decide which wins.
            { name, email, categoryIds },
            { onSuccess: () => onAddGuestOpenChange(false) },
          )
        }
      />
    </div>
  )
}

/** Only shown for a genuinely empty account — a filtered miss is the table's. */
function EmptyState() {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-6 py-20'>
      <Users className='size-7 text-deep-red' />

      <p className='font-inter-tight text-xl font-bold text-deep-red'>No Guests Yet</p>

      <p className='max-w-[380px] text-center font-inter-tight text-xs text-mid-dark-gray'>
        Add guests one at a time, or upload a CSV with name and email columns. You can then add
        them to any of your events.
      </p>
    </div>
  )
}
