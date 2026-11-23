import { cn } from '@/lib/utils'
import type { PaginatedResponse } from '@/types/api'
import { RiArrowLeftSLine, RiArrowRightSLine, RiErrorWarningLine, RiInboxLine } from 'react-icons/ri'

export interface Column<T> {
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

/**
 * A page of an admin list: header row, rows, and Prev/Next underneath. While a
 * new page loads, the last one stays on screen, dimmed.
 */
export function DataTable<T>({
  columns,
  page,
  rowKey,
  isLoading,
  isFetching,
  isError,
  emptyMessage,
  onPageChange,
}: {
  columns: Column<T>[]
  page?: PaginatedResponse<T>
  rowKey: (row: T) => string
  isLoading: boolean
  isFetching?: boolean
  isError: boolean
  emptyMessage: string
  onPageChange: (page: number) => void
}) {
  const rows = page?.items ?? []

  return (
    <div className='flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]'>
      <div className='overflow-x-auto'>
        <table className={cn('w-full text-left text-sm', isFetching && !isLoading && 'opacity-60')}>
          <thead>
            <tr className='border-b border-white/10 text-xs uppercase tracking-wide text-white/50'>
              {columns.map((column) => (
                <th key={column.header} className={cn('whitespace-nowrap px-4 py-3 font-medium', column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }, (_, index) => (
                  <tr key={index} className='border-b border-white/5'>
                    {columns.map((column) => (
                      <td key={column.header} className='px-4 py-3'>
                        <div className='h-4 w-full max-w-[140px] animate-pulse rounded bg-white/10' />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={rowKey(row)} className='border-b border-white/5 text-white/90 last:border-0 hover:bg-white/[0.03]'>
                    {columns.map((column) => (
                      <td key={column.header} className={cn('px-4 py-3 align-middle', column.className)}>
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && (isError || rows.length === 0) && (
        <div className='flex flex-col items-center gap-2 px-4 py-14 text-center text-sm text-white/60'>
          {isError ? (
            <>
              <RiErrorWarningLine className='size-6 text-red-300' aria-hidden />
              Couldn&rsquo;t load this list. Try again in a moment.
            </>
          ) : (
            <>
              <RiInboxLine className='size-6' aria-hidden />
              {emptyMessage}
            </>
          )}
        </div>
      )}

      {page && page.totalCount > 0 && (
        <div className='flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-white/60'>
          <span>
            Page {page.pageNumber} of {Math.max(page.totalPages, 1)} · {page.totalCount.toLocaleString()} total
          </span>
          <div className='flex gap-1'>
            <PageButton
              label='Previous page'
              disabled={!page.hasPrevious || isFetching}
              onClick={() => onPageChange(page.pageNumber - 1)}>
              <RiArrowLeftSLine className='size-4' aria-hidden />
            </PageButton>
            <PageButton
              label='Next page'
              disabled={!page.hasNext || isFetching}
              onClick={() => onPageChange(page.pageNumber + 1)}>
              <RiArrowRightSLine className='size-4' aria-hidden />
            </PageButton>
          </div>
        </div>
      )}
    </div>
  )
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className='flex size-8 items-center justify-center rounded-md border border-white/10 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'>
      {children}
    </button>
  )
}
