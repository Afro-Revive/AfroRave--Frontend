import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CategoryData, GuestListData } from '@/types/guestlist'
import { Check, ChevronLeft, ChevronRight, LoaderCircle, Search } from 'lucide-react'
import { ALL_INVITE_CATEGORIES_ID, INVITE_PAGE_SIZE } from '../constant'

export function InviteGuestlistTab({
  guests,
  categories,
  totalGuests,
  selectedIds,
  invitedIds,
  onToggleGuest,
  onToggleAll,
  activeCategoryId,
  onCategoryChange,
  search,
  onSearchChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  isLoading = false,
  isFetching = false,
}: {
  guests: GuestListData[]
  categories: CategoryData[]
  /** Account-wide count, for the All Guests pill. */
  totalGuests: number
  selectedIds: string[]
  /** Already invited to this ticket: shown, but not selectable. */
  invitedIds: string[]
  onToggleGuest: (guestId: string) => void
  /** Selects or clears every invitable guest on this page. */
  onToggleAll: (guestIds: string[], select: boolean) => void
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  search: string
  onSearchChange: (search: string) => void
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  isFetching?: boolean
}) {
  const invitable = guests.filter((guest) => !invitedIds.includes(guest.id))
  const invitedOnPage = guests.length - invitable.length

  const allSelected =
    invitable.length > 0 && invitable.every((guest) => selectedIds.includes(guest.id))

  const firstRow = totalCount === 0 ? 0 : (page - 1) * INVITE_PAGE_SIZE + 1
  const lastRow = Math.min(page * INVITE_PAGE_SIZE, totalCount)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2 flex-wrap'>
        <CategoryPill
          label='All Guests'
          count={totalGuests}
          isActive={activeCategoryId === ALL_INVITE_CATEGORIES_ID}
          onClick={() => onCategoryChange(ALL_INVITE_CATEGORIES_ID)}
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

      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray' />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search by name or email'
          aria-label='Search guests to invite'
          className='h-11 rounded-lg border border-[#595959]/50 pl-9 pr-9 font-inter-tight'
        />

        {isFetching && !isLoading && (
          <LoaderCircle className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-mid-dark-gray' />
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-10'>
          <LoaderCircle className='size-6 animate-spin text-deep-red' />
        </div>
      ) : guests.length === 0 ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          {search ? `No guests match “${search}”.` : 'No guests in your guestlist yet.'}
        </p>
      ) : (
        <div className='flex flex-col'>
          <div className='flex items-center justify-between gap-3 border-b border-black pb-3'>
            <button
              type='button'
              onClick={() =>
                onToggleAll(
                  invitable.map((guest) => guest.id),
                  !allSelected,
                )
              }
              disabled={invitable.length === 0}
              className='flex items-center gap-3 disabled:opacity-40'>
              <SelectCircle state={allSelected ? 'selected' : 'empty'} />
              <span className='font-inter-tight text-sm font-semibold text-black'>Select all</span>
            </button>

            {invitedOnPage > 0 && (
              <span className='font-inter-tight text-xs text-mid-dark-gray'>
                {invitedOnPage} already invited
              </span>
            )}
          </div>

          <ul className='max-h-[300px] overflow-y-auto'>
            {guests.map((guest) => {
              const isInvited = invitedIds.includes(guest.id)
              const isSelected = selectedIds.includes(guest.id)

              return (
                <li key={guest.id} className='border-b border-black/10 last:border-b-0'>
                  <button
                    type='button'
                    disabled={isInvited}
                    aria-pressed={isInvited ? undefined : isSelected}
                    onClick={() => onToggleGuest(guest.id)}
                    className='flex w-full items-center gap-3 py-3 text-left disabled:cursor-default'>
                    <SelectCircle
                      state={isInvited ? 'invited' : isSelected ? 'selected' : 'empty'}
                    />

                    <span
                      className={cn(
                        'flex min-w-0 flex-1 flex-col font-inter-tight',
                        isInvited ? 'text-black/40' : 'text-black',
                      )}>
                      <span className='truncate text-sm'>{guest.name}</span>
                      <span className='truncate text-xs opacity-70'>{guest.email}</span>
                    </span>

                    {isInvited && (
                      <span className='shrink-0 rounded-full bg-black/5 px-2.5 py-1 font-inter-tight text-xs text-mid-dark-gray'>
                        Already invited
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {totalPages > 1 && (
            <div className='flex items-center justify-between gap-3 pt-3'>
              <p className='font-inter-tight text-xs text-mid-dark-gray'>
                Showing {firstRow}-{lastRow} of {totalCount}
              </p>

              <div className='flex items-center gap-1'>
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
          )}
        </div>
      )}
    </div>
  )
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
        'rounded-full border px-3.5 py-1.5 font-inter-tight text-sm transition-colors',
        isActive
          ? 'border-deep-red text-deep-red'
          : 'border-black/20 text-black hover:border-black/40',
      )}>
      {label} {count}
    </button>
  )
}

/** Empty, ticked, or ticked-and-locked for a guest who's already invited. */
function SelectCircle({ state }: { state: 'empty' | 'selected' | 'invited' }) {
  return (
    <span
      aria-hidden='true'
      className={cn('flex size-5 shrink-0 items-center justify-center rounded-full border', {
        'border-deep-red bg-transparent': state === 'empty',
        'border-deep-red bg-deep-red text-white': state === 'selected',
        'border-transparent bg-deep-red/40 text-white': state === 'invited',
      })}>
      {state !== 'empty' && <Check className='size-3' strokeWidth={3} />}
    </span>
  )
}

function PageArrow({
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
      className='flex size-7 items-center justify-center rounded-md text-black transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30'>
      {children}
    </button>
  )
}
