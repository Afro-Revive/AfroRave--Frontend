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
import { formatNaira } from '@/lib/format-price'
import { formatTimeAgo } from '@/lib/helper-func'
import { cn } from '@/lib/utils'
import type { AccessRequestData } from '@/types/private-event'
import { ChevronLeft, ChevronRight, LoaderCircle, Search } from 'lucide-react'
import { PageArrow, SelectCircle } from '../../guest-list/components/import-guestlist-card'
import { ACCESS_REQUESTS_PAGE_SIZE, type AudienceTab } from '../constant'

export function AccessRequestsCard({
  tab,
  requests,
  isLoading,
  isFetching,
  selectedIds,
  onToggleRequest,
  onToggleAll,
  onApproveSelected,
  isApproving,
  search,
  onSearchChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
}: {
  tab: AudienceTab
  requests: AccessRequestData[]
  isLoading: boolean
  isFetching: boolean
  selectedIds: string[]
  onToggleRequest: (requestId: string) => void
  /** Selects or clears every request on this page. */
  onToggleAll: () => void
  onApproveSelected: () => void
  isApproving: boolean
  search: string
  onSearchChange: (search: string) => void
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}) {
  // Approved fans are final, so only pending requests can be picked.
  const isSelectable = tab === 'Pending'
  const selectedCount = selectedIds.length
  const isAllSelected =
    requests.length > 0 && requests.every((request) => selectedIds.includes(request.requestId))

  const firstRow = totalCount === 0 ? 0 : (page - 1) * ACCESS_REQUESTS_PAGE_SIZE + 1
  const lastRow = Math.min(page * ACCESS_REQUESTS_PAGE_SIZE, totalCount)

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm'>
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <p className='font-inter-tight text-lg xl:text-xl font-semibold text-black'>
              {isSelectable ? 'Access Requests' : 'Approved Fans'}
            </p>
            <p className='font-inter-tight text-xs xl:text-sm text-mid-dark-gray'>
              {isSelectable
                ? 'Review fans who have requested access to this private event.'
                : 'Fans who can purchase tickets for this private event.'}
            </p>
          </div>

          {isSelectable && requests.length > 0 && (
            <label className='flex w-fit cursor-pointer items-center gap-2 font-inter-tight text-sm font-medium text-black'>
              <SelectCircle
                isSelected={isAllSelected}
                label='Select all requests on this page'
                onToggle={onToggleAll}
              />
              Select all
            </label>
          )}
        </div>

        {isSelectable && (
          <Button
            type='button'
            onClick={onApproveSelected}
            disabled={selectedCount === 0 || isApproving}
            className='h-10 shrink-0 rounded-md bg-deep-red px-4 font-inter-tight text-sm font-semibold text-white hover:bg-deep-red/90'>
            {isApproving
              ? 'Approving...'
              : selectedCount > 0
                ? `Approve Selected (${selectedCount})`
                : 'Approve Selected'}
          </Button>
        )}
      </div>

      <div className='relative w-full'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray' />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search by name or email'
          aria-label='Search requests'
          className='h-11 rounded-lg border border-[#595959]/50 pl-9 pr-9 font-inter-tight'
        />

        {isFetching && !isLoading && (
          <LoaderCircle className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-mid-dark-gray' />
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-10'>
          <LoaderCircle className='size-6 animate-spin text-mid-dark-gray' />
        </div>
      ) : requests.length === 0 ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          {emptyMessage(tab, search)}
        </p>
      ) : (
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableCaption className='sr-only'>
              {isSelectable ? 'Fans waiting for access' : 'Fans approved for this event'}
            </TableCaption>

            <TableHeader>
              <TableRow className='border-black/80 hover:bg-transparent'>
                {(isSelectable ? PENDING_COLUMNS : APPROVED_COLUMNS).map((column) => (
                  <TableHead
                    key={column}
                    className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((request) => {
                const isSelected = selectedIds.includes(request.requestId)

                return (
                  <TableRow
                    key={request.requestId}
                    onClick={isSelectable ? () => onToggleRequest(request.requestId) : undefined}
                    className={cn('border-black/80 font-inter-tight text-sm text-black', {
                      'cursor-pointer': isSelectable,
                    })}>
                    <TableCell className='py-3'>
                      <div className='flex items-center gap-3'>
                        {isSelectable && (
                          <SelectCircle
                            isSelected={isSelected}
                            label={`Select ${request.userName}`}
                            onToggle={() => onToggleRequest(request.requestId)}
                          />
                        )}

                        <div className='flex flex-col'>
                          <span>{request.userName}</span>
                          <span className='text-xs text-mid-dark-gray'>{request.userEmail}</span>
                        </div>
                      </div>
                    </TableCell>

                    {isSelectable ? (
                      <TableCell>{formatTimeAgo(request.requestedDate)}</TableCell>
                    ) : (
                      <>
                        <TableCell>{approvedLabel(request.decidedDate)}</TableCell>

                        <TableCell>
                          {request.order ? (
                            <div className='flex flex-col'>
                              {request.order.items.map((item) => (
                                <span key={item.ticketName}>
                                  {item.ticketName} X{item.quantity}
                                </span>
                              ))}
                              <span>{request.order.orderCode}</span>
                            </div>
                          ) : (
                            <span className='text-mid-dark-gray'>No orders made</span>
                          )}
                        </TableCell>

                        <TableCell>
                          {request.order ? formatNaira(request.order.cost, { free: true }) : '-'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className='flex items-center justify-between gap-4'>
        <p className='font-inter-tight text-xs xl:text-sm text-black'>
          Showing {firstRow}-{lastRow} of {totalCount} {totalCount === 1 ? 'request' : 'requests'}
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

const PENDING_COLUMNS = ['Name', 'Requested']
const APPROVED_COLUMNS = ['Name', 'Status', 'Order', 'Amount']

/** 'Approved 2 hours ago', 'Approved yesterday', 'Approved 23 Sep 2026'. */
function approvedLabel(decidedDate: string | null): string {
  if (!decidedDate) return 'Approved'

  const timeAgo = formatTimeAgo(decidedDate)
  // Mid-sentence, so 'Yesterday' and 'Just now' lose their capital.
  return `Approved ${timeAgo.charAt(0).toLowerCase()}${timeAgo.slice(1)}`
}

function emptyMessage(tab: AudienceTab, search: string): string {
  if (search) return `No requests match “${search}”.`
  return tab === 'Pending' ? 'No pending requests.' : 'No approved fans yet.'
}
