import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { getRoutePath } from '@/config/get-route-path'
import { useAfroStore } from '@/stores'
import { Link } from 'react-router-dom'
import { useSidebar } from '@/components/ui/sidebar'
import { RiCloseLine, RiMenuLine } from 'react-icons/ri'

export default function CreatorDashboardHeader({ hasSidebar }: { hasSidebar: boolean }) {
  const { user } = useAfroStore()
  const { openMobile, toggleSidebar } = useSidebar()

  return (
    // Fixed height and held at the top, so the sidebar under it always fits the
    // rest of the screen, "Your Events" included.
    <header className='sticky top-0 z-40 h-(--dashboard-header-height) w-full flex justify-center bg-white border-b border-b-light-gray'>
      <nav className='relative h-full px-4 md:px-8 w-full flex items-center justify-between'>
        <Link to={getRoutePath('creators_home')}>
          <img src='/assets/dashboard/creator/ar2.png' alt='Logo' width={60} height={32} />
        </Link>

        <div className='flex items-center gap-8'>
          {/* The notifications bell is hidden until notifications are live; it
              was a plain image with nothing behind it. The hooks are ready
              (useOrganizerNotifications, useMarkNotificationAsRead).
          <img src='/assets/dashboard/creator/bell-icon.png' alt='Bell' width={17} height={20} />
          */}

          {/* Mobile: the avatar stays put (Settings is one tap away, as on
              desktop) and the menu button turns into a close button while the
              menu is open, instead of the avatar taking its place. Pages
              without a sidebar (the events dashboard) get no menu button: it
              would have nothing to open. */}
          <div className='flex items-center gap-3 md:hidden'>
            <CreatorMenuButton user={user} variant='light' />

            {hasSidebar && (
              <button
                type='button'
                onClick={toggleSidebar}
                aria-label={openMobile ? 'Close menu' : 'Open menu'}
                aria-expanded={openMobile}
                className='flex size-10 items-center justify-center rounded-full text-black transition-colors hover:bg-black/10'>
                {openMobile ? <RiCloseLine className='size-6' /> : <RiMenuLine className='size-6' />}
              </button>
            )}
          </div>

          <div className='hidden md:flex'>
            <CreatorMenuButton user={user} variant='light' />
          </div>
        </div>
      </nav>
    </header>
  )
}
