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
    <div className='w-full flex items-center justify-between gap-4 bg-white h-14 px-5 lg:px-8 border-l border-light-gray'>
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
              <Icon className='size-6 shrink-0' strokeWidth={2} />
              <span className='font-inter-tight xl:text-2xl text-xl font-bold'>{label}</span>
            </button>
          )
        })}
      </div>

      {actions ?? (
        <Button variant='destructive' className='h-9 px-3 rounded-[6px] gap-1.5 shrink-0' asChild>
          <Link to={getRoutePath('add_event')}>
            <Plus color='#ffffff' size={13} />
            <span className='font-sf-pro-text text-xs font-bold whitespace-nowrap'>
              Create Event
            </span>
          </Link>
        </Button>
      )}
    </div>
  )
}
