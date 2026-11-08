import { BaseSelect } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { CategoryData, GuestListData } from '@/types/guestlist'
import { Check, ChevronLeft, ChevronRight, LoaderCircle, Search } from 'lucide-react'
import {
  GUEST_SORT_OPTIONS,
  type GuestSort,
} from '../../standalone/guestlist/constant'
import { ALL_CATEGORIES_ID, IMPORT_PAGE_SIZE } from '../constant'

/**
 * Adding guests to the event from the account guestlist: tick guests, or a whole
 * category, then Add To Event. Guests and categories already on the event show
 * ticked and locked; they're removed from the event's guestlist, not here.
 */
export function ImportGuestlistCard({
  guests,
  categories,
  totalGuests,
  pickedIds,
  onToggleGuest,
  pickedCategoryIds,
  onToggleCategory,
  savedIds,
  savedCategoryIds,
  activeCategoryId,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  isFetching = false,
  isSaving = false,
  onAddToEvent,
  onViewGuestlist,
}: {
  guests: GuestListData[]
  categories: CategoryData[]
  /** Account-wide count, for the All pill. */
  totalGuests: number
  /** Guests ticked to add. */
  pickedIds: string[]
  onToggleGuest: (guestId: string) => void
  /** Whole categories ticked to add, which bring all their guests with them. */
  pickedCategoryIds: string[]
  onToggleCategory: (categoryId: string) => void
  /** What the event has now. */
  savedIds: string[]
  savedCategoryIds: string[]
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  search: string
  onSearchChange: (search: string) => void
  sort: GuestSort
  onSortChange: (sort: GuestSort) => void
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  isFetching?: boolean
  isSaving?: boolean
  /** Saves the ticks, clears them and opens the event's guestlist. */
  onAddToEvent: () => void
  /** Back to the event's guestlist without saving. */
  onViewGuestlist: () => void
}) {
  const firstRow = totalCount === 0 ? 0 : (page - 1) * IMPORT_PAGE_SIZE + 1
  const lastRow = Math.min(page * IMPORT_PAGE_SIZE, totalCount)
  const activeCategory = categories.find((category) => category.id === activeCategoryId)
  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name
  const isActiveCategorySaved = !!activeCategory && savedCategoryIds.includes(activeCategory.id)

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl xl:text-2xl font-semibold text-black'>
            Import From Guestlist
          </p>
          <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
            Choose from your categories or individual guests to add to this event.
          </p>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          <Button
            type='button'
            onClick={onAddToEvent}
            disabled={isSaving || pickedIds.length + pickedCategoryIds.length === 0}
            className='h-9 rounded-md bg-deep-red px-4 font-inter-tight text-sm font-semibold text-white hover:bg-deep-red/90'>
            {isSaving ? 'Adding...' : addLabel(pickedIds.length, pickedCategoryIds.length)}
          </Button>

          <Button
            type='button'
            onClick={onViewGuestlist}
            disabled={isSaving}
            className='h-9 rounded-md bg-[#1A1A1A] px-4 font-inter-tight text-sm font-semibold text-white hover:bg-[#1A1A1A]/90'>
            View Guestlist
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-2 flex-wrap'>
        <CategoryPill
          label='All'
          count={totalGuests}
          isActive={activeCategoryId === ALL_CATEGORIES_ID}
          onClick={() => onCategoryChange(ALL_CATEGORIES_ID)}
        />

        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            label={category.name}
            count={category.guestCount}
            isActive={activeCategoryId === category.id}
            isIncluded={
              savedCategoryIds.includes(category.id) || pickedCategoryIds.includes(category.id)
            }
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>

      {/* Inside a category, the option to bring the whole of it. */}
      {activeCategory && (
        <div
          role='button'
          tabIndex={-1}
          onClick={isActiveCategorySaved ? undefined : () => onToggleCategory(activeCategory.id)}
          className={cn(
            'flex items-center gap-3 rounded-lg bg-[#F4F4F4] px-4 py-3',
            !isActiveCategorySaved && 'cursor-pointer',
          )}>
          <SelectCircle
            isSelected={isActiveCategorySaved || pickedCategoryIds.includes(activeCategory.id)}
            disabled={isActiveCategorySaved}
            label={`Add the whole ${activeCategory.name} category`}
            onToggle={() => onToggleCategory(activeCategory.id)}
          />
          <div className='flex flex-col font-inter-tight'>
            {isActiveCategorySaved ? (
              <>
                <p className='text-sm font-semibold text-black'>
                  The whole {activeCategory.name} category is on this event
                </p>
                <p className='text-xs text-mid-dark-gray'>
                  Anyone you add to {activeCategory.name} joins it. Remove it from the guestlist.
                </p>
              </>
            ) : (
              <>
                <p className='text-sm font-semibold text-black'>
                  Add the whole {activeCategory.name} category
                </p>
                <p className='text-xs text-mid-dark-gray'>
                  All {activeCategory.guestCount}{' '}
                  {activeCategory.guestCount === 1 ? 'guest' : 'guests'}, and anyone you add to{' '}
                  {activeCategory.name} later.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className='flex items-center gap-3 flex-wrap'>
        <div className='relative min-w-0 flex-1'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray' />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search by name or email'
            aria-label='Search guests'
            className='h-11 rounded-lg border border-[#595959]/50 pl-9 pr-9 font-inter-tight'
          />

          {isFetching && (
            <LoaderCircle className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-mid-dark-gray' />
          )}
        </div>

        <BaseSelect
          type='auth'
          items={GUEST_SORT_OPTIONS}
          value={sort}
          onChange={(value) => onSortChange(value as GuestSort)}
          placeholder='Newest first'
          triggerClassName='h-11 w-auto min-w-[150px] shrink-0 items-center rounded-lg border border-[#595959]/50 !bg-white px-3 py-0 font-inter-tight text-sm text-black'
        />
      </div>

      {guests.length === 0 ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          {search ? `No guests match “${search}”.` : 'No guests to import yet.'}
        </p>
      ) : (
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableCaption className='sr-only'>Guests you can add to this event</TableCaption>

            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-10'>
                  <span className='sr-only'>Select</span>
                </TableHead>
                <TableHead className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                  Name
                </TableHead>
                <TableHead className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                  Category
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {guests.map((guest) => {
                // Already on the event, or coming with a ticked category: either
                // way it can't be ticked or unticked on its own here.
                const isOnEvent =
                  savedIds.includes(guest.id) ||
                  !!guest.categoryIds?.some((id) => savedCategoryIds.includes(id))
                const viaCategoryId = isOnEvent
                  ? undefined
                  : guest.categoryIds?.find((id) => pickedCategoryIds.includes(id))
                const isLocked = isOnEvent || !!viaCategoryId
                const isSelected = isLocked || pickedIds.includes(guest.id)

                return (
                  <TableRow
                    key={guest.id}
                    onClick={isLocked ? undefined : () => onToggleGuest(guest.id)}
                    className={cn(
                      'font-inter-tight text-sm',
                      !isLocked && 'cursor-pointer',
                      // Unpicked rows recede so the selection reads at a glance.
                      isSelected ? 'text-black' : 'text-black/40',
                    )}>
                    <TableCell>
                      <SelectCircle
                        isSelected={isSelected}
                        disabled={isLocked}
                        label={`Select ${guest.name}`}
                        onToggle={() => onToggleGuest(guest.id)}
                      />
                    </TableCell>

                    <TableCell className='flex flex-col'>
                      <span>{guest.name}</span>
                      <span className='text-xs text-inherit opacity-70'>{guest.email}</span>
                    </TableCell>

                    <TableCell>
                      <span className='flex flex-col'>
                        {formatCategories(guest.categoryNames)}
                        {isOnEvent && (
                          <span className='text-xs text-mid-dark-gray'>On this event</span>
                        )}
                        {viaCategoryId && (
                          <span className='text-xs text-deep-red'>
                            Added with {categoryName(viaCategoryId) ?? 'its category'}
                          </span>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className='flex items-center justify-between gap-4'>
        <p className='font-inter-tight text-xs xl:text-sm text-mid-dark-gray'>
          Showing {firstRow}-{lastRow} of {totalCount} {totalCount === 1 ? 'guest' : 'guests'}
        </p>

        <div className='flex items-center gap-2'>
          <PageArrow
            label='Previous page'
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className='size-4' />
          </PageArrow>

          <PageArrow
            label='Next page'
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}>
            <ChevronRight className='size-4' />
          </PageArrow>
        </div>
      </div>
    </div>
  )
}

/** Names what Add will put on the event: guests, categories, or both. */
function addLabel(guests: number, categories: number): string {
  const parts = [
    guests > 0 && `${guests} ${guests === 1 ? 'Guest' : 'Guests'}`,
    categories > 0 && `${categories} ${categories === 1 ? 'Category' : 'Categories'}`,
  ].filter(Boolean)

  // Nothing ticked: the button is disabled, so it keeps the resting label.
  return parts.length ? `Add ${parts.join(' & ')}` : 'Add To Event'
}

function CategoryPill({
  label,
  count,
  isActive,
  isIncluded = false,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  /** The whole category is on the event. */
  isIncluded?: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-inter-tight text-sm transition-colors',
        isActive
          ? 'border-deep-red text-deep-red'
          : 'border-black/20 text-black hover:border-black/40',
      )}>
      {isIncluded && (
        <Check aria-label='On this event' className='size-3.5 text-deep-red' strokeWidth={3} />
      )}
      {label} {count}
    </button>
  )
}

export function SelectCircle({
  isSelected,
  label,
  onToggle,
  disabled = false,
}: {
  isSelected: boolean
  label: string
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={isSelected}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        // The row toggles too, so without this the click would undo itself.
        event.stopPropagation()
        onToggle()
      }}
      className={cn(
        'flex size-5 items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-60',
        isSelected ? 'border-deep-red bg-deep-red text-white' : 'border-deep-red bg-transparent',
      )}>
      {isSelected && <Check className='size-3' strokeWidth={3} />}
    </button>
  )
}

export function PageArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className='flex size-8 items-center justify-center rounded-md text-black transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30'>
      {children}
    </button>
  )
}

function formatCategories(categoryNames?: string[]): string {
  return categoryNames?.length ? categoryNames.join(', ') : 'No Category'
}
