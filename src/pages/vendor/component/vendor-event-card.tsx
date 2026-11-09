import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { RiBookmarkFill, RiBookmarkLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

/**
 * Portrait event card used by Discover and My Slots: flyer, title, when and where,
 * and a footer slot for the slots count or the application's status.
 */
export function VendorEventCard({
  to,
  image,
  name,
  date,
  venue,
  footer,
  isSaved,
  onToggleSave,
  isEnded = false,
}: IVendorEventCard) {
  return (
    <Link
      to={to}
      className='group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#2A2A2A] focus-visible:outline-2 focus-visible:outline-white'>
      {image ? (
        <img
          src={image}
          alt={name}
          className={cn(
            'absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105',
            isEnded && 'grayscale',
          )}
        />
      ) : (
        <div className='absolute inset-0 bg-[repeating-linear-gradient(45deg,#2a2a2a_0_12px,#262626_12px_24px)]' />
      )}

      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

      {onToggleSave && (
        <button
          type='button'
          aria-label={isSaved ? 'Remove from saved events' : 'Save event'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleSave()
          }}
          className='absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/40 text-white backdrop-blur-sm transition-colors hover:bg-white/60'>
          {isSaved ? <RiBookmarkFill className='size-5' /> : <RiBookmarkLine className='size-5' />}
        </button>
      )}

      <div className='absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-5'>
        <h3 className='line-clamp-2 font-inter-tight text-xl leading-tight font-black text-white uppercase'>
          {name}
        </h3>
        {(date || venue) && (
          <p className='line-clamp-2 font-inter-tight text-sm leading-snug text-white/90'>
            {[date, venue].filter(Boolean).join(' at ')}
          </p>
        )}
        {footer}
      </div>
    </Link>
  )
}

/** "SLOTS : 12 / 20" pill for Discover cards: slots left, then the total when the API sends it. */
export function SlotsCountPill({ available, total }: { available: number; total?: number }) {
  return (
    <span className='w-fit rounded-md bg-white/20 px-2 py-1 font-work-sans text-sm font-bold text-white backdrop-blur-sm'>
      SLOTS : <span className='text-[#34C759]'>{available}</span>
      {total !== undefined && <span className='font-medium'> / {total}</span>}
    </span>
  )
}

export function VendorCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-9 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {children}
    </div>
  )
}

export function VendorEventCardSkeleton() {
  return <div className='aspect-[3/4] w-full animate-pulse rounded-2xl bg-[#2A2A2A]' />
}

interface IVendorEventCard {
  to: string
  image?: string
  name: string
  date?: string
  venue?: string
  footer?: ReactNode
  isSaved?: boolean
  onToggleSave?: () => void
  isEnded?: boolean
}
