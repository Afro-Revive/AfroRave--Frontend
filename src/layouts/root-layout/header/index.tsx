import { account_links } from '@/components/constants'
import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { UserMenuButton } from '@/components/reusable/user-menu-button'
import LoginButton from '@/layouts/components/login-button'
import NavSheet from '@/layouts/components/nav-sheet'
import { useScroll } from '@/lib/useScroll'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { Search } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { NavLogo } from './nav-logo'
import { useState, useEffect } from 'react'

import { AnimatedSearchBar } from './animated-search-bar'

export default function Header() {
  const { hasScrolled } = useScroll()
  const { user, isAuthenticated, isCreator, isFan, isVendor } = useAfroStore()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isFansPage = location.pathname === '/fans'
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Show minimal header (no nav links) on home and fans pages
  const showMinimalHeader = isLandingPage || isFansPage

  return (
    <header className='w-full fixed top-0 flex justify-center z-50 h-[90px]'>
      <div
        className={`absolute inset-0 transition-all duration-300 ${hasScrolled ? 'h-full bg-black/25 backdrop-blur-sm' : 'h-0'
          }`}
      />

      <nav className='relative px-4 md:px-8 w-full flex items-center justify-between py-4'>
        <NavLogo />

        {isLandingPage ? (
          <CountdownTimer />
        ) : (
          <div className='flex items-center gap-5'>
            <Search
              size={20}
              color='var(--foreground)'
              className='cursor-pointer min-w-[26px] hover:opacity-80 transition-opacity'
              onClick={() => setIsSearchOpen(true)}
            />

            {isAuthenticated && isFan && (
              <>
                {!showMinimalHeader && <NavigationLinks />}
                <UserMenuButton user={user} />
              </>
            )}

            {isAuthenticated && (isCreator || isVendor) && (
              <>
                <CreatorMenuButton user={user} variant='dark' />
              </>
            )}

            {!isAuthenticated && !isLandingPage && (
              <>
                <LoginButton />
                <NavSheet />
              </>
            )}
          </div>
        )}
      </nav>

      <AnimatedSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  )
}

function NavigationLinks() {
  return (
    <div className='hidden md:flex items-center gap-14'>
      {account_links.map((item) => (
        <NavLink
          key={item.name}
          to={item.link}
          className={({ isActive }) =>
            cn('flex items-center gap-2 border-b-2 transition-all pb-1', {
              'opacity-100 border-deep-red': isActive,
              'opacity-60 border-transparent hover:border-deep-red': !isActive,
            })
          }>
          <img src={item.icon} alt={item.name} className='size-[19px]' />
          <span className='text-base font-input-mono'>{item.name}</span>
        </NavLink>
      ))}
    </div>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Target date: March 29, 2026 (30 days from Feb 27, 2026)
    const targetDate = new Date(2026, 2, 29, 0, 0, 0, 0).getTime()

    function updateCountdown() {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1 text-white font-mono text-sm md:text-base">
      <span>{String(timeLeft.days).padStart(2, '0')}</span>
      <span>:</span>
      <span>{String(timeLeft.hours).padStart(2, '0')}</span>
      <span>:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span className="hidden sm:inline">:</span>
      <span className="hidden sm:inline">{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  )
}
