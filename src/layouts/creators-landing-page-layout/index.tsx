import { AuthModal } from '@/components/auth/auth-modal'
import { getRoutePath } from '@/config/get-route-path'
import { AuthProvider } from '@/contexts/auth-context'
import { Outlet, useLocation } from 'react-router-dom'
import CreatorsHeader from './sections/creators-header'
import Header from './sections/header'

/** The pages on the new design, which get its header. Blog and the waitlist keep the old one. */
const REDESIGNED_PAGES = [
  getRoutePath('creators_home'),
  getRoutePath('creators_about'),
  getRoutePath('creators_contact'),
]

export default function CreatorsLandingPageLayout() {
  const { pathname } = useLocation()

  return (
    <>
      <AuthProvider>
        {REDESIGNED_PAGES.includes(pathname) ? <CreatorsHeader /> : <Header />}
        <AuthModal />

        <Outlet />
      </AuthProvider>
    </>
  )
}
