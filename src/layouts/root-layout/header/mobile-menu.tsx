import { account_links } from '@/components/constants'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { isAuthenticated } = useAfroStore()

  return (
    <div className='flex flex-col h-full z-[10] overflow-y-auto scrollbar-none px-6'>
      {isAuthenticated ? <AccountLinks onClose={onClose} /> : <AuthButtons />}

      {isAuthenticated && <LogOutButton />}

      <Separator
        className={cn('bg-white/20 mb-6', {
          'mt-[19px]': isAuthenticated,
          'mt-16': !isAuthenticated,
        })}
      />

      <div className='flex flex-col gap-4'>
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={onClose}
            className='text-white hover:text-white/80 transition-colors font-input-mono text-xl font-light hover:decoration-deep-red hover:underline'>
            {link.name}
          </Link>
        ))}
      </div>

      <div className=' py-6'>
        <Separator className='bg-white/20 mb-6' />
        <div className='flex items-center gap-4 justify-end'>
          {socials.map((social) => (
            <Link
              key={social.alt}
              to={social.href}
              onClick={onClose}
              className='cursor-pointer hover:opacity-80'>
              <img src={social.icon} alt={social.alt} className='w-8 h-auto' />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuthButtons() {
  const { openAuthModal } = useAuth()

  return (
    <div className='flex flex-col gap-4 py-6'>
      <Button
        className='w-full h-12 bg-white text-black hover:bg-white/90'
        onClick={() => openAuthModal('login', 'guest')}>
        Log In
      </Button>
      <Button
        variant='secondary'
        onClick={() => openAuthModal('signup')}
        className='w-full h-12  border-white text-white hover:bg-white/10'>
        Sign Up
      </Button>
    </div>
  )
}

function AccountLinks({ onClose }: { onClose: () => void }) {
  return (
    <div className='flex flex-col items-center gap-[19px]'>
      {account_links.map((item) => (
        <Link
          key={item.name}
          to={item.link}
          onClick={onClose}
          className='w-full py-4 pl-[22px] pr-[11px] bg-charcoal rounded-[8px] flex items-center justify-between'>
          <div className='flex items-center gap-[5px]'>
            <img src={item.icon} alt={item.name} width={19} height={19} />
            <p className='font-input-mono text-[15px]'>{item.name}</p>
          </div>

          <ChevronRight color='#ffffff' strokeWidth={2} className='!min-w-1.5 !min-h-3.5' />
        </Link>
      ))}
    </div>
  )
}

function LogOutButton() {
  const { clearAuth, user } = useAfroStore()

  const handleLogout = () => {
    const accountType = user?.accountType
    if (accountType === 'User') {
      window.location.href = getRoutePath('home')
    } else {
      window.location.href = getRoutePath('creators_home')
    }
    clearAuth()
  }

  return (
    <Button
      onClick={handleLogout}
      className='w-full min-h-fit border-t !border-neutral-gray px-[11px] bg-transparent hover:bg-transparent hover:text-white rounded-none mt-[42px]'>
      <div className='w-full flex items-center gap-[5px] pt-4'>
        <img
          src='/assets/harmburger/logout.png'
          alt='Log Out'
          className='!min-w-4 !min-h-4 h-4 w-4'
        />
        <p className='font-input-mono text-[15px]'>Log Out</p>
      </div>
    </Button>
  )
}

const menuLinks = [
  { href: getRoutePath('home'), name: 'Discover' },
  // { href: getRoutePath("resale"), name: "Resale" },
  { href: getRoutePath('blog'), name: 'Blog' },
  { href: getRoutePath('creators'), name: 'Creators' },
  { href: getRoutePath('support'), name: 'Support' },
  { href: getRoutePath('faq'), name: 'FAQ' },
]

const socials = [
  { href: '/', icon: '/assets/landing-page/insta.png', alt: 'Instagram' },
  { href: '/', icon: '/assets/landing-page/X.png', alt: 'X' },
  { href: '/', icon: '/assets/landing-page/tiktok.png', alt: 'TikTok' },
  { href: '/', icon: '/assets/landing-page/yt.png', alt: 'Youtube' },
]
