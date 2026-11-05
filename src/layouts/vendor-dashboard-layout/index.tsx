import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import VendorDashboardHeader from './sections/header'
import VendorSidebar from './sections/vendor-side-bar'

export default function VendorDashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className='min-h-screen w-full bg-[#171717] text-white'>
      <VendorDashboardHeader onMenuClick={() => setIsMenuOpen(true)} />

      <div className='flex w-full'>
        <aside className='sticky top-[58px] hidden h-[calc(100vh-58px)] w-[344px] xl:w-[400px] shrink-0 overflow-y-auto bg-[#1E1E1E] lg:block'>
          <VendorSidebar />
        </aside>

        <main className='min-w-0 flex-1'>
          <Outlet />
        </main>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        {/* Fixed to the screen's height, no scrolling: Log Out is pinned at the bottom, and the sidebar tightens up on short screens to fit. */}
        <SheetContent side='left' className='h-dvh w-[320px] max-w-[85vw] overflow-hidden border-none bg-[#1E1E1E] p-0 text-white'>
          <SheetTitle className='sr-only'>Vendor menu</SheetTitle>
          <SheetDescription className='sr-only'>Your profile and dashboard links</SheetDescription>
          <VendorSidebar onNavigate={() => setIsMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
