import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { CategoryData } from '@/types/guestlist'
import { ALL_GUESTS_CATEGORY_ID } from '../constant'

/** The category tiles, with the always-present All guests tile leading. */
export function GuestCategories({
  categories,
  totalGuests,
  activeCategoryId,
  onCategoryChange,
  onNewCategory,
}: {
  categories: CategoryData[]
  totalGuests: number
  activeCategoryId: string
  onCategoryChange: (categoryId: string) => void
  onNewCategory: () => void
}) {
  return (
    <div className='w-full flex flex-col gap-4 rounded-xl bg-white p-5'>
      <div className='flex flex-col gap-1'>
        <p className='font-inter-tight text-xl xl:text-2xl font-semibold text-black'>Categories</p>
        <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
          Group guests into collections
        </p>
      </div>

      <div className='flex items-stretch gap-3 flex-wrap'>
        <CategoryTile
          name='All guests'
          guestCount={totalGuests}
          isActive={activeCategoryId === ALL_GUESTS_CATEGORY_ID}
          onClick={() => onCategoryChange(ALL_GUESTS_CATEGORY_ID)}
        />

        {categories.map((category) => (
          <CategoryTile
            key={category.id}
            name={category.name}
            guestCount={category.guestCount}
            isActive={activeCategoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}

        <button
          type='button'
          onClick={onNewCategory}
          className={cn(
            'flex w-[120px] flex-col items-center justify-center gap-1.5 rounded-lg p-5',
            'border border-dashed border-deep-red bg-deep-red/5 transition-colors hover:bg-deep-red/10',
          )}>
          <span className='flex size-8 items-center justify-center rounded-full border border-deep-red text-deep-red'>
            <Plus className='size-5' />
          </span>
          <span className='font-inter text-xs font-bold text-deep-red'>New category</span>
        </button>
      </div>
    </div>
  )
}

function CategoryTile({
  name,
  guestCount,
  isActive,
  onClick,
}: {
  name: string
  guestCount: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-[150px] flex-col items-start justify-end gap-1 rounded-lg border p-3 text-left transition-colors',
        isActive ? 'border-deep-red bg-deep-red/5' : 'border-black/15 hover:border-black/30',
      )}>
      <span className='font-inter-tight text-xs xl:text-sm font-bold text-black'>{name}</span>
      <span className='font-inter-tight text-xs xl:text-sm text-mid-dark-gray'>
        {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
      </span>
    </button>
  )
}
