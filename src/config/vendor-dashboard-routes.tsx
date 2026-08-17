import { LoadingFallback } from '@/components/loading-fallback'
import { VendorAuthGuard } from '@/components/auth/vendor-auth-guard'
import { Suspense, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

// Vendor routes
const ProfilePage = lazy(() => import('../pages/vendor/profile'))
const DiscoverPage = lazy(() => import('../pages/vendor/discover'))
const WishlistPage = lazy(() => import('../pages/vendor/wishlist'))
const SlotsPage = lazy(() => import('../pages/vendor/slots'))

export const vendor_dashboard_routes: RouteObject[] = [
  {
    path: getRoutePath('vendor_profile'),
    element: (
      <VendorAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </Suspense>
      </VendorAuthGuard>
    ),
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
    path: getRoutePath('vendor_wishlist'),
    element: (
      <VendorAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <WishlistPage />
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
  }
]
