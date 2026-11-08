import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CategoryData } from '@/types/guestlist'
import { LoaderCircle } from 'lucide-react'
import { RiArrowDownSLine, RiFolderAddLine } from 'react-icons/ri'

/**
 * Shown above the table once guests are ticked: how many, a link to tick every
 * guest in the view (not just this page), and Add to category for all of them.
 */
export function GuestSelectionBar({
  selectedCount,
  totalCount,
  categories,
  onSelectAll,
  isSelectingAll,
  onClear,
  onAddToCategory,
  isAdding,
}: {
  selectedCount: number
  /** Every guest in the current view, across pages. */
  totalCount: number
  categories: CategoryData[]
  onSelectAll: () => void
  isSelectingAll: boolean
  onClear: () => void
  onAddToCategory: (categoryId: string) => void
  isAdding: boolean
}) {
  return (
    <div className='flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-[#F4F4F4] px-4 py-2.5 font-inter-tight text-sm text-black'>
      <span className='font-semibold'>
        {selectedCount} {selectedCount === 1 ? 'guest' : 'guests'} selected
      </span>

      {selectedCount < totalCount && (
        <button
          type='button'
          onClick={onSelectAll}
          disabled={isSelectingAll}
          className='flex items-center gap-1.5 font-medium text-tech-blue hover:underline disabled:opacity-60'>
          {isSelectingAll && <LoaderCircle className='size-3.5 animate-spin' />}
          Select all {totalCount}
        </button>
      )}

      <div className='ml-auto flex items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          onClick={onClear}
          disabled={isAdding}
          className='h-8 px-3 font-inter-tight text-sm text-mid-dark-gray hover:bg-black/5'>
          Clear
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type='button'
              disabled={isAdding || isSelectingAll}
              className='h-8 gap-1.5 rounded-full bg-black px-4 font-inter-tight text-xs font-semibold text-white hover:bg-black/80'>
              {isAdding ? (
                <LoaderCircle className='size-4 animate-spin' />
              ) : (
                <RiFolderAddLine className='size-4' />
              )}
              {isAdding ? 'Adding…' : 'Add to category'}
              {!isAdding && <RiArrowDownSLine className='size-4' />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='max-h-64 overflow-y-auto'>
            {categories.length === 0 ? (
              <DropdownMenuItem disabled>No categories yet</DropdownMenuItem>
            ) : (
              categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => onAddToCategory(category.id)}
                  className='focus:bg-black/5 focus:text-black'>
                  {category.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
