import { Outlet } from 'react-router-dom'
import AccountHeader from './header'
import AccountFooter from './footer'
import { AuthProvider } from '@/contexts/auth-context'

export default function UserDashboardLayout() {

  return (
    <AuthProvider>
      <div className='min-h-screen bg-[#1A1A1A] flex flex-col'>
        <AccountHeader/>
        {/* <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /> */}
        <div className="flex flex-1 pt-[80px]">
          <main className='flex-1 flex flex-col'>
            <Outlet />
            <AccountFooter />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}