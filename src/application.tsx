import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, lazy } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { OrganizerAuthGuard } from './components/auth/organizer-auth-guard'
import { LoadingFallback } from './components/loading-fallback'
import { creator_dashboard_routes } from './config/creator-dashboard-routes'
import { getRoutePath } from './config/get-route-path'
import { routes } from './config/routes'
import { support_routes } from './config/support-routes'
import { user_dashboard_routes } from './config/user-dashboard-routes'
import { useScrollToTop } from './hooks/use-scroll-to-top'
import { useTokenRefresh } from './hooks/use-token-refresh'
import CreatorGuideOverlay from './components/shared/creator-guide-overlay'
import CreatorDashboardLayout from './layouts/creator-dashboard-layout'
import IndexLayout from './layouts/root-layout'
import SupportLayout from './layouts/support-layout'
import UserDashboardLayout from './layouts/user-dashboard-layout'
import CreatorsLandingPageLayout from './layouts/creators-landing-page-layout'
import { creator_landing_page_routes } from './config/creators-landing-page-routes'
import { vendor_dashboard_routes } from './config/vendor-dashboard-routes'
import VendorDashboardLayout from './layouts/vendor-dashboard-layout'

const AddEventPage = lazy(() => import('./pages/creators/add-event'))
const SlotDetailsPage = lazy(() => import('./pages/vendor/slots/slot-details'))
const CompleteProfilePage = lazy(() => import('./pages/fans/complete-profile'))

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function AppRoutes() {
  useScrollToTop()
  useTokenRefresh()

  return (
    <>
    <Routes>
      <Route element={<IndexLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<UserDashboardLayout />}>
        {user_dashboard_routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<CreatorDashboardLayout />}>
        {creator_dashboard_routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<SupportLayout />}>
        {support_routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<CreatorsLandingPageLayout />}>
        {creator_landing_page_routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route
        path={getRoutePath('vendor_slot_details', { eventId: ':eventId' })}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SlotDetailsPage />
          </Suspense>
        }
      />

      <Route element={<VendorDashboardLayout />}>
        {vendor_dashboard_routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route
        path={getRoutePath('add_event')}
        element={
          <OrganizerAuthGuard>
            <Suspense fallback={<LoadingFallback />}>
              <AddEventPage />
            </Suspense>
          </OrganizerAuthGuard>
        }
      />

      <Route
        path={getRoutePath('complete_profile')}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <CompleteProfilePage />
          </Suspense>
        }
      />
    </Routes>
    <CreatorGuideOverlay />
    </>
  )
}

export default function Application() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position='top-right' richColors closeButton duration={4000} />
    </QueryClientProvider>
  )
}
