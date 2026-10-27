import { BaseSheet } from '@/components/reusable'
import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { useScroll } from '@/lib/useScroll'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import CreatorsSidebarMenu from './creators-sidebar-menu'

/**
 * The redesigned creators website header: the logo, then LOG IN and a menu
 * button. The menu is a slide-out sidebar, like the fans one, holding the
 * site's pages at every size.
 */
export default function CreatorsHeader() {
  const { hasScrolled } = useScroll()
  const { openAuthModal } = useAuth()
  const { user, isAuthenticated } = useAfroStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [showLoginMenu, setShowLoginMenu] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close both menus on route change.
  useEffect(() => {
    setMenuOpen(false)
    setShowLoginMenu(false)
  }, [location.pathname])

  function logInAs(type: 'creator' | 'vendor') {
    setShowLoginMenu(false)
    openAuthModal('login', type)
  }

  return (
    <header className='w-full fixed top-0 z-50'>
      {/* Clear over the page's top, then a dark bar once it scrolls. */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          hasScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent',
        )}
      />

      <div className='relative flex items-center justify-between px-5 md:px-[60px] h-[64px] md:h-[80px]'>
        <NavLink to={getRoutePath('creators_home')}>
          <img
            src='/assets/landing-page/AR.png'
            alt='Afrorevive'
            className='w-14 h-7 md:w-20 md:h-10 cursor-pointer'
          />
        </NavLink>

        <div className='flex items-center gap-3 md:gap-5'>
          {/* Desktop: LOG IN (or the account menu) beside the menu button.
              On mobile the sidebar has the same choices. */}
          <div className='relative hidden md:block'>
            {isAuthenticated ? (
              <CreatorMenuButton
                user={user}
                variant='dark'
                onSettingsClick={() => {
                  const dashboardPath =
                    user?.accountType === 'Vendor'
                      ? getRoutePath('vendor_profile')
                      : getRoutePath('standalone')
                  navigate(dashboardPath, { state: { openSettings: true } })
                }}
              />
            ) : (
              <>
                <button
                  type='button'
                  onClick={() => setShowLoginMenu((open) => !open)}
                  aria-expanded={showLoginMenu}
                  className='h-9 px-3 uppercase text-white text-sm font-work-sans hover:bg-white/10 rounded transition-colors'>
                  Log In
                </button>

                {showLoginMenu && (
                  <div className='absolute top-full right-0 mt-2 min-w-[150px] overflow-hidden rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm'>
                    <LoginOption onClick={() => logInAs('creator')}>Organizer</LoginOption>
                    <LoginOption onClick={() => logInAs('vendor')}>Vendor</LoginOption>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type='button'
            onClick={() => setMenuOpen(true)}
            aria-label='Open menu'
            className='p-2 rounded-lg transition-colors hover:bg-white/10'>
            <img src='/assets/landing-page/menu.svg' alt='' className='w-[22px] h-auto' />
          </button>
        </div>
      </div>

      <BaseSheet
        side='right'
        size='sm'
        title='Menu'
        circleCancel
        open={menuOpen}
        setOpen={setMenuOpen}
        contentClassName='bg-pure-black text-white px-3'>
        <CreatorsSidebarMenu onClose={() => setMenuOpen(false)} />
      </BaseSheet>
    </header>
  )
}

function LoginOption({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='w-full px-4 py-3 text-left text-white uppercase text-sm font-work-sans border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors'>
      {children}
    </button>
  )
}
