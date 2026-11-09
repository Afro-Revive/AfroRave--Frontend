import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { UserMenuButton } from '@/components/reusable/user-menu-button'
import LoginButton from '@/layouts/components/login-button'
import NavSheet from '@/layouts/components/nav-sheet'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { useScroll } from '@/lib/useScroll'
import { useAfroStore } from '@/stores'
import { Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { NavLogo } from './nav-logo'
import { useState } from 'react'

import { AnimatedSearchBar } from './animated-search-bar'

export default function Header() {
  const { hasScrolled } = useScroll()
  const { user, isAuthenticated, isCreator, isFan, isVendor } = useAfroStore()
  const location = useLocation()
  // The events page paints its own flat backdrop, so the bar gets a solid tone
  // instead of the transparent-until-scrolled treatment.
  const isEventsPage = location.pathname === getRoutePath('events')
  const [isSearchOpen, setIsSearchOpen] = useState(false)


  return (
    <header className='w-full fixed top-0 flex justify-center z-50 h-[90px]'>
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          isEventsPage
            ? 'h-full bg-[#1A1A1A]'
            : hasScrolled
              ? 'h-full bg-black/25 backdrop-blur-sm'
              : 'h-0',
        )}
      />

      <nav className='relative px-4 xl:px-15 md:px-10 tablet:px-12 w-full flex items-center justify-between py-4'>
        <NavLogo />

        <div className='flex items-center gap-5'>
            <Search
              size={20}
              color='var(--foreground)'
              className='cursor-pointer min-w-[26px] hover:opacity-80 transition-opacity'
              onClick={() => setIsSearchOpen(true)}
            />

            {isAuthenticated && isFan && (
              <>
                <UserMenuButton user={user} />
              </>
            )}

            {isAuthenticated && (isCreator || isVendor) && (
              <>
                <CreatorMenuButton user={user} variant='dark' />
              </>
            )}

            {!isAuthenticated && <LoginButton />}
            { !isAuthenticated && <NavSheet /> }
          </div>
      </nav>

      <AnimatedSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  )
}
