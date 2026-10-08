import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { getRoutePath } from '@/config/get-route-path'
import { useAfroStore } from '@/stores'
import { Link } from 'react-router-dom'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export default function CreatorDashboardHeader() {
  const { user } = useAfroStore()
  const { openMobile } = useSidebar()

  return (
    <header className='w-full flex justify-center bg-white border-b border-b-light-gray'>
      <nav className='relative px-4 md:px-8 w-full flex items-center justify-between py-4'>
        <Link to={getRoutePath('creators_home')}>
          <img src='/assets/dashboard/creator/ar2.png' alt='Logo' width={60} height={32} />
        </Link>

        <div className='flex items-center gap-8'>
          <img src='/assets/dashboard/creator/bell-icon.png' alt='Bell' width={17} height={20} />

          <div className='flex md:hidden'>
            {openMobile ? (
              <CreatorMenuButton user={user} variant='light' />
            ) : (
              <SidebarTrigger className='text-black w-10 h-10' />
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
