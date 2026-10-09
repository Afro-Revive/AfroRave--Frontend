import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import { AUDIENCE_TABS, type AudienceTab } from '../constant'

export function AudienceHeader({
  tab,
  onTabChange,
  counts,
  isPaused,
  isEnded,
  isUpdatingRequests,
  onTogglePause,
}: {
  tab: AudienceTab
  onTabChange: (tab: AudienceTab) => void
  counts: Record<AudienceTab, number>
  isPaused: boolean
  isEnded: boolean
  isUpdatingRequests: boolean
  onTogglePause: () => void
}) {
  return (
    // Same padding as the body below, so the two line up.
    <div className='w-full bg-white flex flex-col md:flex-row md:items-end md:justify-between gap-4 px-5 md:px-14 py-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-work-sans text-2xl font-bold text-black'>Audience</p>
          <p className='font-inter-tight text-sm text-black'>
            Approve fans to enable them to purchase tickets for this private event.
          </p>
        </div>

        <div className='flex items-center gap-2 flex-wrap'>
          {AUDIENCE_TABS.map((value) => {
            const isActive = tab === value

            return (
              <button
                key={value}
                type='button'
                aria-pressed={isActive}
                onClick={() => onTabChange(value)}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-inter-tight text-sm transition-colors',
                  isActive
                    ? 'border-deep-red text-deep-red'
                    : 'border-black/20 text-black hover:border-black/40',
                )}>
                {value} {counts[value]}
              </button>
            )
          })}
        </div>
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={onTogglePause}
        // Ended is final, so there's nothing left to pause or resume.
        disabled={isEnded || isUpdatingRequests}
        className='h-10 w-fit shrink-0 gap-2 rounded-full border-black/30 bg-white px-5 font-work-sans text-sm font-medium text-black hover:bg-black/5'>
        {isEnded ? (
          'Requests Ended'
        ) : isPaused ? (
          <>
            <Play className='size-3.5 fill-current' />
            Resume Requests
          </>
        ) : (
          <>
            <Pause className='size-3.5 fill-current' />
            Pause Requests
          </>
        )}
      </Button>
    </div>
  )
}
