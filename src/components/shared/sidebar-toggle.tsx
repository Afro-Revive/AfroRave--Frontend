import { useEffect } from 'react'
import { create } from 'zustand'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

/**
 * How many SidebarToggles are on screen. A page without one (the vendor pages,
 * for now) still needs a way to bring a collapsed sidebar back, so the sidebar
 * shows its own floating button only when this is 0.
 */
export const useSidebarToggleCount = create<{
  count: number
  change: (by: 1 | -1) => void
}>()((set) => ({
  count: 0,
  change: (by) => set((state) => ({ count: state.count + by })),
}))

/**
 * Collapses and brings back the creator sidebar, from beside a page's title
 * (the designer's call, rather than a button inside the sidebar). Desktop
 * only: on phones the header's menu button opens the sidebar.
 */
export function SidebarToggle({ className }: { className?: string }) {
  const { open, toggleSidebar } = useSidebar()
  const change = useSidebarToggleCount((state) => state.change)

  useEffect(() => {
    change(1)
    return () => change(-1)
  }, [change])

  const label = open ? 'Collapse sidebar' : 'Expand sidebar'
  const Icon = open ? LuPanelLeftClose : LuPanelLeftOpen

  return (
    <button
      type='button'
      onClick={toggleSidebar}
      aria-label={label}
      aria-expanded={open}
      title={label}
      className={cn(
        'hidden md:inline-flex size-9 shrink-0 items-center justify-center rounded-md text-black transition-colors hover:bg-deep-red/10 hover:text-deep-red',
        className,
      )}>
      <Icon className='size-6' />
    </button>
  )
}
