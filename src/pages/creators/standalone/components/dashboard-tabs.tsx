import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { CalendarRange, Plus, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export type DashboardTab = 'events' | 'guestlist'

export const DASHBOARD_TABS: { value: DashboardTab; label: string; icon: LucideIcon }[] = [
  { value: 'events', label: 'Events', icon: CalendarRange },
  { value: 'guestlist', label: 'Guestlist', icon: Users },
]

/**
 * The dashboard's top bar: the two views on the left, Create Event on the
 * right. Replaces the per-event select that used to sit here — every event is
 * on a card now, so there is nothing left for a dropdown to narrow.
 */
export function DashboardTabs({
  activeTab,
  onTabChange,
  actions,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  /** Replaces Create Event — the guestlist tab has its own two actions. */
  actions?: React.ReactNode
}) {
  return (
    // Stacked on mobile: the guestlist tab's two actions don't fit beside the
    // tabs on a phone. Every tab stacks, not just that one, so the bar keeps
    // one height and the page doesn't jump when switching between them.
    <div className='w-full flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:h-14 md:py-0 bg-white px-5 lg:px-8 border-l border-light-gray'>
      <div className='flex items-center gap-5 md:gap-7 min-w-0 overflow-x-auto scrollbar-none'>
        {DASHBOARD_TABS.map(({ value, label, icon: Icon }) => {
          const isActive = value === activeTab

          return (
            <button
              key={value}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => onTabChange(value)}
              className={cn(
                'flex shrink-0 items-center gap-2 transition-colors',
                isActive ? 'text-deep-red' : 'text-black/40 hover:text-black/70',
              )}>
              <Icon className='size-6 max-sm:size-5 shrink-0' strokeWidth={2} />
              <span className='font-inter-tight xl:text-2xl text-xl max-sm:text-base font-bold'>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Full width on mobile, so whatever sits here stretches under the tabs. */}
      <div className='flex max-md:w-full'>
      {actions ?? (
        <Button variant='destructive' className='h-9 px-3 rounded-[6px] gap-1.5 shrink-0 max-md:flex-1 justify-center' asChild>
          <Link to={getRoutePath('add_event')}>
            <Plus color='#ffffff' size={13} />
            <span className='font-inter-tight text-xs font-bold whitespace-nowrap'>
              Create Event
            </span>
          </Link>
        </Button>
      )}
      </div>
    </div>
  )
}
