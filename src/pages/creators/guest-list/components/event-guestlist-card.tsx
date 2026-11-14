import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { cn } from '@/lib/utils'
import type { EventCheckinGuest } from '@/types/guestlist'
import { LoaderCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { RiArrowDownSLine, RiMore2Fill, RiUserUnfollowLine } from 'react-icons/ri'

/**
 * The guests already on this event — the saved side of the import table. Guests
 * and whole categories are taken off the event from here.
 */
export function EventGuestlistCard({
  guests,
  search,
  onSearchChange,
  isLoading = false,
  isFetching = false,
  onImportGuests,
  individualGuestIds,
  eventCategories,
  onRemoveGuest,
  onRemoveCategory,
  isSaving = false,
}: {
  guests: EventCheckinGuest[]
  search: string
  onSearchChange: (search: string) => void
  /** The first load, before there's anything to show. */
  isLoading?: boolean
  /** Refetching a list that's already on screen. */
  isFetching?: boolean
  onImportGuests: () => void
  /** Guests added one by one, who can be removed one by one. */
  individualGuestIds: string[]
  /** Whole categories on the event. */
  eventCategories: { id: string; name: string; guestCount: number }[]
  onRemoveGuest: (guestId: string) => void
  onRemoveCategory: (categoryId: string) => void
  /** A removal is saving. */
  isSaving?: boolean
}) {
  // Taking a whole category off is confirmed first: one slip shouldn't clear it.
  const [categoryToRemove, setCategoryToRemove] = useState<
    (typeof eventCategories)[number] | null
  >(null)

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl xl:text-2xl font-semibold text-black'>
            Guestlist
          </p>
          <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
            Everyone on this event's list, and whether they've arrived.
          </p>
        </div>

        <Button
          type='button'
          onClick={onImportGuests}
          className='h-9 shrink-0 rounded-md bg-deep-red px-4 font-inter-tight text-sm font-semibold text-white hover:bg-deep-red/90'>
          Import Guests
        </Button>
      </div>

      {eventCategories.length > 0 && (
        <div className='flex flex-wrap items-center gap-2 font-inter-tight text-sm'>
          <span className='text-mid-dark-gray'>Whole categories:</span>
          {eventCategories.map((category) => (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  className='flex items-center gap-1 rounded-full border border-black/20 py-1 pl-3 pr-2 text-black transition-colors hover:border-black/40'>
                  {category.name}
                  <RiArrowDownSLine className='size-4 text-mid-dark-gray' />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  disabled={isSaving}
                  onClick={() => setCategoryToRemove(category)}
                  className='text-deep-red focus:bg-transparent focus:text-deep-red'>
                  <RiUserUnfollowLine size={16} className='mr-2' />
                  Remove from event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!categoryToRemove}
        onOpenChange={(open) => !open && setCategoryToRemove(null)}>
        <AlertDialogContent className='w-[90%] max-w-[400px] rounded-xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='font-inter-tight text-xl font-bold'>
              Remove {categoryToRemove?.name} from this event?
            </AlertDialogTitle>
            <AlertDialogDescription className='font-inter-tight text-sm text-mid-dark-gray'>
              Its {categoryToRemove?.guestCount}{' '}
              {categoryToRemove?.guestCount === 1 ? 'guest comes' : 'guests come'} off this event’s
              guestlist, except anyone you also added one by one. You can add the category back
              from Import Guests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2'>
            <AlertDialogCancel className='font-inter-tight'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToRemove && onRemoveCategory(categoryToRemove.id)}
              className='bg-deep-red font-inter-tight text-white hover:bg-deep-red/90'>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray' />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search by name or email'
          aria-label='Search this event’s guests'
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
          {search
            ? `No guests on this event match “${search}”.`
            : 'No guests on this event yet. Import them from your guestlist.'}
        </p>
      ) : (
        <>
          {/* Below lg the table doesn't fit beside the sidebar, and its Status
              and actions columns ended up off-screen, so each guest is a card. */}
          <ul aria-label='Guests on this event' className='flex flex-col gap-3 lg:hidden'>
            {guests.map((guest) => (
              <li
                key={guest.guestId}
                className='flex items-start justify-between gap-3 rounded-lg shadow-sm border border-black/10 pl-2 py-4 font-inter-tight'>
                <div className='flex min-w-0 flex-col items-start gap-1'>
                  <span
                    className={cn(
                      'wrap-break-word',
                      guest.isCheckedIn ? 'text-[#00AD2E]' : 'text-black',
                    )}>
                    {guest.name}
                  </span>
                  <span className='text-xs text-mid-dark-gray break-all'>{guest.email}</span>
                  <span className='text-xs text-mid-dark-gray'>{guest.categoryName ?? 'No Category'}</span>
                </div>

                <GuestActions
                  guest={guest}
                  canRemove={individualGuestIds.includes(guest.guestId)}
                  onRemove={onRemoveGuest}
                  isSaving={isSaving}
                />
              </li>
            ))}
          </ul>

          <div className='hidden w-full overflow-x-auto lg:block'>
            <Table className='w-full'>
              <TableCaption className='sr-only'>Guests on this event</TableCaption>

              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  {['Name', 'Category', 'Status'].map((label) => (
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
                  <TableRow key={guest.guestId} className='font-inter-tight text-sm text-black'>
                    <TableCell className='flex flex-col'>
                      <span>{guest.name}</span>
                      <span className='text-xs text-mid-dark-gray'>{guest.email}</span>
                    </TableCell>

                    <TableCell>{guest.categoryName ?? 'No Category'}</TableCell>

                    <TableCell>
                      <GuestStatus isCheckedIn={guest.isCheckedIn} />
                    </TableCell>

                    <TableCell>
                      <GuestActions
                        guest={guest}
                        canRemove={individualGuestIds.includes(guest.guestId)}
                        onRemove={onRemoveGuest}
                        isSaving={isSaving}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

function GuestStatus({ isCheckedIn }: { isCheckedIn: boolean }) {
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        isCheckedIn ? 'bg-[#00AD2E]/15 text-[#00AD2E]' : 'bg-black/5 text-mid-dark-gray',
      )}>
      {isCheckedIn ? 'Checked in' : 'Not arrived'}
    </span>
  )
}

function GuestActions({
  guest,
  canRemove,
  onRemove,
  isSaving,
}: {
  guest: EventCheckinGuest
  /** Added one by one, so they can be removed one by one. */
  canRemove: boolean
  onRemove: (guestId: string) => void
  isSaving: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          aria-label={`Actions for ${guest.name}`}
          className='h-fit w-fit shrink-0 p-1 text-black hover:bg-black/10'>
          <RiMore2Fill className='size-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        {canRemove ? (
          <DropdownMenuItem
            disabled={isSaving}
            onClick={() => onRemove(guest.guestId)}
            className='text-deep-red focus:bg-transparent focus:text-deep-red'>
            <RiUserUnfollowLine size={16} className='mr-2' />
            Remove from event
          </DropdownMenuItem>
        ) : (
          // On the event through a whole category, so only removing that
          // category takes them off.
          <DropdownMenuItem disabled className='max-w-60 whitespace-normal'>
            Added with {guest.categoryName ?? 'a category'}. Remove the category above to take
            them off.
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
