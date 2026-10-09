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

export function ImportGuestlistCard({
  guests,
  categories,
  totalGuests,
  selectedIds,
  onToggleGuest,
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
  addedCount,
  removedCount,
  onAddToEvent,
  onSaveGuests,
}: {
  guests: GuestListData[]
  categories: CategoryData[]
  /** Account-wide count, for the All pill. */
  totalGuests: number
  selectedIds: string[]
  onToggleGuest: (guestId: string) => void
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
  /** Ticked but not yet on the event. */
  addedCount: number
  /** On the event but since unticked — saving removes them. */
  removedCount: number
  onAddToEvent: () => void
  /** Saves anything pending, then switches to the event's guestlist. */
  onSaveGuests: () => void
}) {
  const firstRow = totalCount === 0 ? 0 : (page - 1) * IMPORT_PAGE_SIZE + 1
  const lastRow = Math.min(page * IMPORT_PAGE_SIZE, totalCount)

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
            disabled={isSaving || addedCount + removedCount === 0}
            className='h-9 rounded-md bg-deep-red px-4 font-inter-tight text-sm font-semibold text-white hover:bg-deep-red/90'>
            {saveLabel(addedCount, removedCount, isSaving)}
          </Button>

          <Button
            type='button'
            onClick={onSaveGuests}
            disabled={isSaving}
            className='h-9 rounded-md bg-[#1A1A1A] px-4 font-inter-tight text-sm font-semibold text-white hover:bg-[#1A1A1A]/90'>
            Save Guests
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
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>

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
          triggerClassName='h-11 w-auto min-w-[150px] shrink-0 rounded-lg border border-[#595959]/50 !bg-white px-3 font-inter-tight text-sm text-black'
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
                const isSelected = selectedIds.includes(guest.id)

                return (
                  <TableRow
                    key={guest.id}
                    onClick={() => onToggleGuest(guest.id)}
                    className={cn(
                      'cursor-pointer font-inter-tight text-sm',
                      // Unpicked rows recede so the selection reads at a glance.
                      isSelected ? 'text-black' : 'text-black/40',
                    )}>
                    <TableCell>
                      <SelectCircle
                        isSelected={isSelected}
                        label={`Select ${guest.name}`}
                        onToggle={() => onToggleGuest(guest.id)}
                      />
                    </TableCell>

                    <TableCell className='flex flex-col'>
                      <span>{guest.name}</span>
                      <span className='text-xs text-inherit opacity-70'>{guest.email}</span>
                    </TableCell>

                    <TableCell>{formatCategories(guest.categoryNames)}</TableCell>
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

/**
 * Names what saving will actually do. One button covers adding and removing,
 * since configure replaces the event's list — so a fixed "Add To Event" would
 * be wrong whenever a saved guest has been unticked.
 */
function saveLabel(added: number, removed: number, isSaving: boolean): string {
  if (added > 0 && removed > 0) return isSaving ? 'Updating...' : 'Update Guestlist'
  if (removed > 0) return isSaving ? 'Removing...' : `Remove ${removed} From Event`
  if (added > 0) return isSaving ? 'Adding...' : `Add ${added} To Event`

  // Nothing to save: the button is disabled, so it keeps the resting label.
  return 'Add To Event'
}

function CategoryPill({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 font-inter-tight text-sm transition-colors',
        isActive
          ? 'border-deep-red text-deep-red'
          : 'border-black/20 text-black hover:border-black/40',
      )}>
      {label} {count}
    </button>
  )
}

export function SelectCircle({
  isSelected,
  label,
  onToggle,
}: {
  isSelected: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={isSelected}
      aria-label={label}
      onClick={(event) => {
        // The row toggles too, so without this the click would undo itself.
        event.stopPropagation()
        onToggle()
      }}
      className={cn(
        'flex size-5 items-center justify-center rounded-full border transition-colors',
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
