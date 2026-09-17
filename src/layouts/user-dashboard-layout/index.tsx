import { Outlet } from 'react-router-dom'
import AccountHeader from './header'
import AccountFooter from './footer'
import { AuthProvider } from '@/contexts/auth-context'

export default function UserDashboardLayout() {

  return (
    <AuthProvider>
      <div className='min-h-screen bg-fans-radial flex flex-col'>
        <AccountHeader/>
        {/* <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /> */}
        <div className="flex flex-1 pt-[80px]">
          {/* min-w-0: without it this flex item cannot shrink below its content,
              so any wide child scrolls the whole page sideways. */}
          <main className='flex-1 min-w-0 flex flex-col'>
            <Outlet />
            <AccountFooter />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}