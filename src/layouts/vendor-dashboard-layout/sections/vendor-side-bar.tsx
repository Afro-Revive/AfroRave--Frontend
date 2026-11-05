import { getRoutePath } from '@/config/get-route-path'
import { useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { RiArchiveLine, RiArrowLeftLine, RiCalendarLine } from 'react-icons/ri'
import { NavLink } from 'react-router-dom'
import { VendorProfileCard } from './vendor-profile-card'

const links = [
  { Icon: RiCalendarLine, text: 'DISCOVER', href: getRoutePath('vendor_discover') },
  { Icon: RiArchiveLine, text: 'MY SLOTS', href: getRoutePath('vendor_slots') },
]

export default function VendorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const logoutMutation = useLogout()

  return (
    <div className='flex min-h-full w-full flex-col gap-5 px-[18px] pt-5 pb-6 max-lg:min-h-0 max-lg:flex-1 max-lg:gap-3 max-lg:pt-1 max-lg:pb-4 short:gap-2 short:pt-0 short:pb-3'>
      <VendorProfileCard />

      <nav className='flex flex-col gap-5 max-lg:gap-3 short:gap-2'>
        {links.map(({ Icon, text, href }) => (
          <NavLink
            key={text}
            to={href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-[57px] max-lg:h-12 short:h-10 items-center gap-2 rounded-xl border px-5 font-inter-tight text-sm text-white transition-colors',
                isActive ? 'border-[#C62828]' : 'border-[#2E2E2E] hover:border-[#4A4A4A]',
              )
            }>
            {({ isActive }) => (
              <>
                <Icon className={cn('size-4', isActive ? 'text-[#E53935]' : 'text-white')} />
                {text}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className='mt-auto shrink-0 pt-6 max-lg:pt-3 short:pt-2'>
        <button
          type='button'
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className='flex h-10 w-full items-center gap-4 rounded-full bg-[#721414] px-5 font-sf-pro-text text-sm font-medium text-white transition-colors hover:bg-[#8A1818] disabled:opacity-60'>
          <RiArrowLeftLine className='size-4' />
          Log Out
        </button>
      </div>
    </div>
  )
}
