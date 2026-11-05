import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { IoIosArrowBack } from "react-icons/io";

/** Title band at the top of My Slots and a slot's page. Pass `onBack` for the circled back arrow. */
export function VendorPageHeader({
  title,
  subtitle,
  aside,
  onBack,
}: {
  title: string
  subtitle?: string
  aside?: ReactNode
  onBack?: () => void
}) {
  return (
    <header className='flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-[#232323] bg-[#1E1E1E] px-4 pt-5 pb-4 md:px-7'>
      <div className='flex min-w-0 flex-col gap-2'>
        <div className='flex items-center gap-2'>
          {onBack && (
            <button
              type='button'
              aria-label='Go back'
              onClick={onBack}
              className='flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-colors hover:bg-white/10'>
              <IoIosArrowBack className='size-4' />
            </button>
          )}
          <h1 className='truncate font-inter-tight text-xl font-black text-white uppercase md:text-2xl'>{title}</h1>
        </div>
        {subtitle && (
          <p className={cn('font-inter-tight text-sm font-bold text-white', onBack && 'pl-[30px]')}>{subtitle}</p>
        )}
      </div>
      {aside}
    </header>
  )
}
