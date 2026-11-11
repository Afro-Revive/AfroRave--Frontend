import { BaseSelect } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RiFilter3Line } from 'react-icons/ri'
import { GUEST_SORT_OPTIONS, type GuestSort } from '../constant'

/**
 * The guest list's sort, beside its search. Below lg it's a filter icon that
 * opens the options, so the search can take the whole row; from lg there's room
 * for the full select.
 */
export function GuestSortControl({
  sort,
  onSortChange,
}: {
  sort: GuestSort
  onSortChange: (sort: GuestSort) => void
}) {
  const current = GUEST_SORT_OPTIONS.find((option) => option.value === sort)?.label

  return (
    <>
      <div className='shrink-0 lg:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type='button'
              variant='outline'
              aria-label={current ? `Sort guests: ${current}` : 'Sort guests'}
              className='size-11 rounded-lg border border-[#595959]/50 bg-white p-0 text-black shadow-none hover:bg-black/5'>
              <RiFilter3Line className='size-5' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='font-inter-tight'>
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => onSortChange(value as GuestSort)}>
              {GUEST_SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className='focus:bg-black/5 focus:text-black'>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='hidden shrink-0 lg:block'>
        <BaseSelect
          type='auth'
          items={GUEST_SORT_OPTIONS}
          value={sort}
          onChange={(value) => onSortChange(value as GuestSort)}
          placeholder='Newest first'
          triggerClassName='h-11 w-auto min-w-[150px] shrink-0 items-center rounded-lg border border-[#595959]/50 !bg-white px-3 py-0 font-inter-tight text-sm text-black'
        />
      </div>
    </>
  )
}
