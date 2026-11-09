import { getRoutePath } from '@/config/get-route-path'
import { useScroll } from '@/lib/useScroll'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { useAfroStore } from '@/stores'
import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const { hasScrolled } = useScroll()
  const { openAuthModal } = useAuth()
  const { user, isAuthenticated } = useAfroStore()
  const navigate = useNavigate()
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowLoginDropdown(false)
  }, [location.pathname])

  return (
    <header className='w-full fixed top-0 z-50'>
      {/* Backdrop — covers entire header including mobile menu when open */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          hasScrolled || mobileMenuOpen ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
        }`}
      />

      {/* Top bar */}
      <div className='relative flex items-center justify-between px-5 md:px-[60px] h-[64px] md:h-[80px]'>
        {/* Logo */}
        <NavLink to={getRoutePath('creators_home')}>
          <img
            src='/assets/landing-page/AR.png'
            alt='AR'
            className='w-14 h-7 md:w-20 md:h-10 cursor-pointer'
          />
        </NavLink>

        {/* Desktop center nav links (hidden on mobile) */}
        <div className='hidden md:flex items-center gap-8 lg:gap-10'>
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'font-input-mono font-light text-[14px] leading-none uppercase tracking-[0] px-[12px] py-[4px] text-white transition-all',
                    {
                      'shadow-[0_2px_0_var(--color-deep-red)]': isActive,
                      'hover:shadow-[0_2px_0_var(--color-deep-red)]': !isActive,
                    },
                  )
                }>
                {item.name}
              </NavLink>
            ))}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          {/* Desktop right action */}
          <div className='relative hidden md:block'>
              {isAuthenticated ? (
                <CreatorMenuButton
                  user={user}
                  variant='dark'
                  onSettingsClick={() => {
                    const dashboardPath = user?.accountType === 'Vendor'
                      ? getRoutePath('vendor_profile')
                      : getRoutePath('standalone')
                    navigate(dashboardPath, { state: { openSettings: true } })
                  }}
                />
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className='flex items-center gap-2 bg-transparent uppercase text-white h-[35px] px-[12px] py-[4px] hover:bg-black/20 text-[14px] font-light font-input-mono leading-none tracking-[0] transition-colors'>
                    LOG IN
                  </button>
                  {showLoginDropdown && (
                    <div className='absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden min-w-[150px] border border-white/10'>
                      <button
                        onClick={() => {
                          setShowLoginDropdown(false)
                          openAuthModal('login', 'creator')
                        }}
                        className='w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors uppercase text-sm font-input-mono border-b border-white/10'>
                        ORGANIZER
                      </button>
                      <button
                        onClick={() => {
                          setShowLoginDropdown(false)
                          openAuthModal('login', 'vendor')
                        }}
                        className='w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors uppercase text-sm font-input-mono'>
                        VENDOR
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden text-white p-1'
            aria-label='Toggle menu'>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className='md:hidden relative z-50 border-t border-white/10 flex flex-col px-6 py-5 gap-1'>
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'font-input-mono font-light text-[14px] uppercase text-white py-3 border-b border-white/10 transition-colors',
                  { 'text-deep-red': isActive },
                )
              }>
              {item.name}
            </NavLink>
          ))}

          {/* Auth section */}
          <div className='flex flex-col gap-2 pt-4'>
              {isAuthenticated ? (
                <>
                  <p className='text-white/50 text-xs font-input-mono uppercase mb-1'>
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <Link
                    to={getRoutePath('standalone')}
                    onClick={() => setMobileMenuOpen(false)}
                    className='w-full py-3 text-center text-white uppercase text-sm font-input-mono border border-white/20 rounded hover:bg-white/10 transition-colors'>
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <p className='text-white/50 text-xs font-input-mono uppercase mb-1'>Log In As</p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal('login', 'creator')
                    }}
                    className='w-full py-3 text-center text-white uppercase text-sm font-input-mono border border-white/20 rounded hover:bg-white/10 transition-colors'>
                    ORGANIZER
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal('login', 'vendor')
                    }}
                    className='w-full py-3 text-center text-white uppercase text-sm font-input-mono border border-white/20 rounded hover:bg-white/10 transition-colors'>
                    VENDOR
                  </button>
                </>
              )}
          </div>
        </div>
      )}
    </header>
  )
}

const links: ILinks[] = [
  { href: getRoutePath('about_us'), name: 'About Us' },
  { href: getRoutePath('creators_contact'), name: 'Contact Us' },
  { href: getRoutePath('blog'), name: 'Blog' },
]

interface ILinks {
  href: string
  name: string
}
