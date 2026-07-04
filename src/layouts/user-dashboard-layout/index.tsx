import { Outlet } from 'react-router-dom'
import AccountHeader from './header'
import AccountFooter from './footer'
import { AuthProvider } from '@/contexts/auth-context'
import { useState } from 'react'
import MobileSidebar from './mobile-sidebar'

export default function UserDashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <AuthProvider>
      <div className='min-h-screen bg-[#1A1A1A] flex flex-col'>
        <AccountHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
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