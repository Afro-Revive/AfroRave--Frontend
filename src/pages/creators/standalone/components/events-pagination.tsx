import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Renders nothing for a single page — a pager that can't go anywhere is just
 * noise on a dashboard that usually holds a handful of events.
 */
export function EventsPagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
}: {
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className='w-full flex flex-wrap items-center justify-between gap-4'>
      <p className='font-sf-pro-text text-xs text-black/50'>
        Page {page} of {totalPages} · {totalCount} event{totalCount === 1 ? '' : 's'}
      </p>

      <div className='flex items-center gap-2'>
        <PagerButton
          label='Previous page'
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className='size-4' />
        </PagerButton>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <Button
            key={number}
            type='button'
            variant='ghost'
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
        ))}

        <PagerButton
          label='Next page'
          disabled={page >= totalPages}
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
