import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * The page numbers to draw, where `null` is a gap. Always keeps the first and
 * last page plus a window around the current one, so the row stays a fixed
 * width whether there are three pages or three hundred.
 */
function getPageItems(
  page: number,
  totalPages: number,
  siblings = 1,
): (number | null)[] {
  // first + last + current + both siblings + both gaps
  const maxSlots = siblings * 2 + 5

  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const left = Math.max(page - siblings, 1)
  const right = Math.min(page + siblings, totalPages)

  const items: (number | null)[] = [1]

  if (left > 2) items.push(null)

  for (let number = Math.max(left, 2); number <= Math.min(right, totalPages - 1); number++) {
    items.push(number)
  }

  if (right < totalPages - 1) items.push(null)

  items.push(totalPages)

  return items
}

/**
 * Renders nothing for a single page — a pager that can't go anywhere is noise.
 *
 * Works for both client-side slicing and server-side paging: it only takes
 * numbers and a callback. Server-paged callers should pass `isLoading` while
 * the next page is in flight, so a double click can't queue two requests.
 */
export function Pagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
  itemLabel = { one: 'item', other: 'items' },
  isLoading = false,
  className,
}: {
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  /** Named per caller so the summary doesn't read "13 events" on a ticket list. */
  itemLabel?: { one: string; other: string }
  isLoading?: boolean
  className?: string
}) {
  if (totalPages <= 1) return null

  return (
    <div
      className={cn(
        'w-full flex flex-wrap items-center justify-between gap-4',
        className,
      )}>
      <p className='font-sf-pro-text text-xs text-black/50'>
        Page {page} of {totalPages} · {totalCount}{' '}
        {totalCount === 1 ? itemLabel.one : itemLabel.other}
      </p>

      <div className='flex items-center gap-2'>
        <PagerButton
          label='Previous page'
          disabled={isLoading || page <= 1}
          onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className='size-4' />
        </PagerButton>

        {getPageItems(page, totalPages).map((number, index) =>
          number === null ? (
            // Index-keyed deliberately: a gap has no identity of its own, and
            // there are only ever two of them.
            <span
              key={`gap-${index}`}
              aria-hidden
              className='size-8 flex items-center justify-center font-sf-pro-text text-xs text-black/40'>
              …
            </span>
          ) : (
            <Button
              key={number}
              type='button'
              variant='ghost'
              disabled={isLoading}
              aria-label={`Page ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onPageChange(number)}
              className={cn(
                'size-8 p-0 rounded-md font-sf-pro-text text-xs',
                number === page
                  ? 'bg-deep-red text-white hover:bg-deep-red/90 hover:text-white'
                  : 'text-black/60 hover:bg-black/5',
              )}>
              {number}
            </Button>
          ),
        )}

        <PagerButton
          label='Next page'
          disabled={isLoading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}>
          <ChevronRight className='size-4' />
        </PagerButton>
      </div>
    </div>
  )
}

function PagerButton({
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
    <Button
      type='button'
      variant='ghost'
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className='size-8 p-0 rounded-md text-black/60 hover:bg-black/5 disabled:opacity-40'>
      {children}
    </Button>
  )
}
