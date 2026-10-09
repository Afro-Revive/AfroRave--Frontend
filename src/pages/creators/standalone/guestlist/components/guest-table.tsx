import { BaseSelect } from '@/components/reusable'
import { Pagination } from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import type { GuestListData } from '@/types/guestlist'
import { EllipsisVertical, FolderMinus, LoaderCircle, Search, Trash2 } from 'lucide-react'
import {
  ALL_GUESTS_CATEGORY_ID,
  GUEST_COLUMNS,
  GUEST_SORT_OPTIONS,
  type GuestSort,
} from '../constant'

/**
 * Presentational: rows, page and totals are all the server's. Sorting across
 * pages can only be done there, so the select reports the choice and the
 * request carries it — nothing is reordered here.
 *
 * Built on the table primitives rather than BaseTable, which stringifies every
 * cell and so can't hold the per-row menu.
 */
export function GuestTable({
  guests,
  categoryName,
  activeCategoryId,
  search,
  onSearchChange,
  sort,
  onSortChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  isFetching = false,
  onRemoveFromCategory,
  onDeleteGuest,
}: {
  guests: GuestListData[]
  /** Heads the card, so it names the category you're looking at. */
  categoryName: string
  /** Removing from a category only makes sense inside one. */
  activeCategoryId: string
  search: string
  onSearchChange: (search: string) => void
  sort: GuestSort
  onSortChange: (sort: GuestSort) => void
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  /** Refetching an already-rendered page, as opposed to the first load. */
  isFetching?: boolean
  onRemoveFromCategory: (guest: GuestListData) => void
  onDeleteGuest: (guest: GuestListData) => void
}) {
  const isInCategory = activeCategoryId !== ALL_GUESTS_CATEGORY_ID

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex flex-col gap-1'>
        <p className='font-inter-tight text-xl xl:text-2xl font-semibold text-black'>
          {categoryName}
        </p>
        <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
          A real-time record of ticket holders and their order details.
        </p>
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
          {search ? `No guests match “${search}”.` : 'No guests to show.'}
        </p>
      ) : (
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableCaption className='sr-only'>Your guests</TableCaption>

            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {GUEST_COLUMNS.map((label) => (
                  <TableHead
                    key={label}
                    className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                    {label}
                  </TableHead>
                ))}
                <TableHead className='w-10'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {guests.map((guest) => (
                <TableRow
                  key={guest.id}
                  className='font-inter-tight text-sm xl:text-base text-black'>
                  <TableCell className='flex flex-col'>
                    <span>{guest.name}</span>
                    <span className='text-xs xl:text-sm text-mid-dark-gray'>{guest.email}</span>
                  </TableCell>

                  <TableCell>{formatCategories(guest.categoryNames)}</TableCell>
                  {/* The guest endpoint carries no events, so this stays a dash
                      until one exposes them. */}
                  <TableCell>—</TableCell>
                  <TableCell>{formatDateAdded(guest.createdDate)}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-fit w-fit p-1 hover:bg-black/10'>
                          <EllipsisVertical className='size-4' color='#000000' />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end'>
                        {/* focus:bg-transparent overrides DropdownMenuItem's own
                            focus:bg-secondary, which paints a solid block on hover. */}
                        {isInCategory && (
                          <DropdownMenuItem
                            onClick={() => onRemoveFromCategory(guest)}
                            className='focus:bg-transparent focus:text-black'>
                            <FolderMinus size={16} className='mr-2' />
                            Remove from category
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => onDeleteGuest(guest)}
                          className='text-deep-red focus:bg-transparent focus:text-deep-red'>
                          <Trash2 size={16} className='mr-2' />
                          Delete guest
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        itemLabel={{ one: 'guest', other: 'guests' }}
        isLoading={isFetching}
      />
    </div>
  )
}

/**
 * "No category" rather than a dash: an ungrouped guest is a real state the
 * organizer can act on, not missing data.
 */
function formatCategories(categoryNames?: string[]): string {
  return categoryNames?.length ? categoryNames.join(', ') : 'No category'
}

function formatDateAdded(dateAdded: string): string {
  const date = new Date(dateAdded)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
