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
import type { EventCheckinGuest } from '@/types/guestlist'
import { LoaderCircle, Search } from 'lucide-react'

/** The guests already on this event — the saved side of the import table. */
export function EventGuestlistCard({
  guests,
  search,
  onSearchChange,
  isLoading = false,
  isFetching = false,
  onImportGuests,
}: {
  guests: EventCheckinGuest[]
  search: string
  onSearchChange: (search: string) => void
  /** The first load, before there's anything to show. */
  isLoading?: boolean
  /** Refetching a list that's already on screen. */
  isFetching?: boolean
  onImportGuests: () => void
}) {
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
        <div className='w-full overflow-x-auto'>
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
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        guest.isCheckedIn
                          ? 'bg-[#00AD2E]/15 text-[#00AD2E]'
                          : 'bg-black/5 text-mid-dark-gray',
                      )}>
                      {guest.isCheckedIn ? 'Checked in' : 'Not arrived'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
