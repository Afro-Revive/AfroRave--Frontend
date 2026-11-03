import { LoadingFallback } from '@/components/loading-fallback'
import { VendorAuthGuard } from '@/components/auth/vendor-auth-guard'
import { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

// Vendor routes
const DiscoverPage = lazy(() => import('../pages/vendor/discover'))
const SlotsPage = lazy(() => import('../pages/vendor/slots'))
const SlotDetailsPage = lazy(() => import('../pages/vendor/slots/slot-details'))

export const vendor_dashboard_routes: RouteObject[] = [
  {
    // The profile lives in the sidebar now. Login and the account menus still send
    // vendors here, so it forwards to Discover.
    path: getRoutePath('vendor_profile'),
    element: <Navigate to={getRoutePath('vendor_discover')} replace />,
  },
  {
    path: getRoutePath('vendor_discover'),
    element: (
      <VendorAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <DiscoverPage />
        </Suspense>
      </VendorAuthGuard>
    ),
  },
  {
    path: getRoutePath('vendor_slots'),
    element: (
      <VendorAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <SlotsPage />
        </Suspense>
      </VendorAuthGuard>
    ),
  },
  {
    path: getRoutePath('vendor_slot_details', { applicationId: ':applicationId' }),
    element: (
      <VendorAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <SlotDetailsPage />
        </Suspense>
      </VendorAuthGuard>
    ),
  },
]
