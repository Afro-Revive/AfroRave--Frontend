import { OrganizerAuthGuard } from '@/components/auth/organizer-auth-guard'
import { LoadingFallback } from '@/components/loading-fallback'
import { Suspense, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

// Creator routes
const StandalonePage = lazy(() => import('../pages/creators/standalone'))
const SeasonPage = lazy(() => import('../pages/creators/season'))
const AccessControlPage = lazy(() => import('../pages/creators/access-control'))
const PromoCodesPage = lazy(() => import('../pages/creators/promo-codes'))
const ReportsPage = lazy(() => import('../pages/creators/reports'))
const RealtimePage = lazy(() => import('../pages/creators/realtime'))
const EditEventPage = lazy(() => import('../pages/creators/edit-event'))

// Vendor routes
const RevenueVendorPage = lazy(() => import('../pages/vendor/revenue-vendor'))
const IndividualSlotsPage = lazy(() => import('../pages/vendor/revenue-vendor/individual-slot'))
const ServiceVendorPage = lazy(() => import('../pages/vendor/service-vendors'))
const IndividualServicePage = lazy(
  () => import('../pages/vendor/service-vendors/individual-service'),
)
const SeatingMapsPage = lazy(() => import('../pages/vendor/seating-maps'))

export const creator_dashboard_routes: RouteObject[] = [
  // Organizer routes (Organizer account type)
  {
    path: getRoutePath('standalone'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <StandalonePage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('season'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <SeasonPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('edit_event', { eventId: ':eventId' }),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <EditEventPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('access_control'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AccessControlPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('promo_codes'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <PromoCodesPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('reports'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <ReportsPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('realtime'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <RealtimePage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },

  // Vendor routes (Vendor account type) - Temporarily using OrganizerAuthGuard
  {
    path: getRoutePath('revenue_vendor'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <RevenueVendorPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('revenue_vendor_slot', { slotId: ':slotId' }),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <IndividualSlotsPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('service_vendor'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <ServiceVendorPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('individual_service_vendor', {
      serviceId: ':serviceId',
    }),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <IndividualServicePage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
  {
    path: getRoutePath('seating_maps'),
    element: (
      <OrganizerAuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <SeatingMapsPage />
        </Suspense>
      </OrganizerAuthGuard>
    ),
  },
]
