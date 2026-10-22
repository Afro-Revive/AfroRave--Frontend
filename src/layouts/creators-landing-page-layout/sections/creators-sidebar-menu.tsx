import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { app_store_links } from '@/layouts/root-layout/footer'
import { useAfroStore } from '@/stores'
import { ChevronRight } from 'lucide-react'
import { FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { IoLogoInstagram } from 'react-icons/io5'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'

/**
 * The creators website's slide-out menu, laid out like the fans one: a way in
 * (log in as an organizer or vendor, or the dashboard once signed in), the
 * site's pages, then the app and socials.
 */
export default function CreatorsSidebarMenu({ onClose }: { onClose: () => void }) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)

  return (
    <div className='flex h-full flex-col overflow-y-auto scrollbar-none px-6'>
      {isAuthenticated ? <DashboardLink onClose={onClose} /> : <LoginButtons onClose={onClose} />}

      <Separator className='mt-4 mb-6 bg-white/20' />

      <nav className='flex flex-col gap-3'>
        {LINKS.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={onClose}
            className='font-work-sans text-xl text-white transition-colors hover:underline'>
            {link.name}
          </Link>
        ))}
      </nav>

      <div className='py-6'>
        <Separator className='mb-6 bg-white/20' />
        <p className='mb-4 text-right font-inter-tight text-base font-bold text-white'>
          Get The Afrorevive App
        </p>

        <div className='mb-6 flex items-center justify-end gap-3 md:mb-8'>
          {app_store_links.map((store) => (
            <a
              key={store.alt}
              href={store.href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={store.alt}
              className='transition-opacity hover:opacity-80'>
              <img src={store.src} alt={store.alt} className='h-9 w-auto object-contain md:h-10' />
            </a>
          ))}
        </div>

        <div className='flex items-center justify-end gap-2'>
          {SOCIALS.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className='text-white transition-opacity hover:opacity-80'>
              <Icon className='size-7' />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Each takes you to that account type's login. The sheet closes first so the modal isn't under it. */
function LoginButtons({ onClose }: { onClose: () => void }) {
  const { openAuthModal } = useAuth()

  function logInAs(type: 'creator' | 'vendor') {
    onClose()
    openAuthModal('login', type)
  }

  return (
    <div className='flex flex-col gap-4 py-6'>
      <Button
        className='h-12 w-full text-sm bg-transparent border border-[#464444] uppercase text-white hover:bg-white/10'
        onClick={() => logInAs('creator')}>
        Organizer
      </Button>
      <Button
        variant='secondary'
        className='h-12 w-full text-sm bg-transparent border border-[#464444] uppercase text-white hover:bg-white/10'
        onClick={() => logInAs('vendor')}>
        Vendor
      </Button>
    </div>
  )
}

/** Signed in: straight to the organizer or vendor dashboard. */
function DashboardLink({ onClose }: { onClose: () => void }) {
  const accountType = useAfroStore((state) => state.user?.accountType)
  const dashboardPath =
    accountType === 'Vendor' ? getRoutePath('vendor_profile') : getRoutePath('standalone')

  return (
    <div className='py-6'>
      <Link
        to={dashboardPath}
        onClick={onClose}
        className='flex w-full items-center justify-between rounded-[8px] bg-charcoal py-4 pl-[22px] pr-[11px] text-white'>
        <span className='flex items-center gap-[5px]'>
          <MdOutlineSpaceDashboard className='size-[19px]' />
          <span className='font-work-sans text-sm font-bold'>DASHBOARD</span>
        </span>
        <ChevronRight className='size-4' strokeWidth={2} />
      </Link>
    </div>
  )
}

const LINKS = [
  { href: getRoutePath('creators_home'), name: 'Home' },
  { href: getRoutePath('creators_about'), name: 'About Us' },
  { href: getRoutePath('creators_contact'), name: 'Contact Us' },
]

const SOCIALS = [
  {
    href: 'https://www.instagram.com/afrorevive_?igsh=ZThudm8zODkyZTJv&utm_source=qr',
    Icon: IoLogoInstagram,
    label: 'Instagram',
  },
  { href: 'https://x.com/afrorevive?s=21', Icon: FaXTwitter, label: 'X' },
  // The same placeholder the footers use until there's a channel to link.
  { href: '/', Icon: FaYoutube, label: 'YouTube' },
]
