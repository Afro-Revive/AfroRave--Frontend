import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { LoadingFallback } from '../components/loading-fallback'
import { PRIVACY_SECTION_ID } from '../pages/help/terms/content'
import { getRoutePath } from './get-route-path'

const LandingPage = lazy(() => import('../pages/landing-page/home'))
const EventsPage = lazy(() => import('../pages/landing-page/event-page'))
const IndividualEventPage = lazy(() => import('../pages/landing-page/event-page/individual-event'))
const ResellPage = lazy(() => import('../pages/landing-page/resell-page'))
const NotFoundPage = lazy(() => import('../pages/landing-page/not-found'))
const RefundPolicyPage = lazy(() => import('../pages/landing-page/refund-policy'))
const WorkWithUsPage = lazy(() => import('../pages/landing-page/work-with-us'))
// const ResaleMarketPlacePage = lazy(() => import('../pages/landing-page/resale-marketplace'))
// const IndividualResaleTicket = lazy(
//   () => import('../pages/landing-page/resale-marketplace/individual-resale-event'),
// )
const SellPage = lazy(() => import('../pages/landing-page/sell'))
const AcceptInvitePage = lazy(() => import('../pages/fans/accept-invite'))

export const routes: RouteObject[] = [
  {
    // Signs the guest in itself, so it sits with the public pages, where the
    // login modal lives.
    path: getRoutePath('accept_invite'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AcceptInvitePage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('home'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('events'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <EventsPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('individual_event', { eventId: ':eventId' }),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <IndividualEventPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('resell'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResellPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('refund_policy'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RefundPolicyPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('work_with_us'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkWithUsPage />
      </Suspense>
    ),
  },
  // {
  //   path: getRoutePath('resale'),
  //   element: (
  //     <Suspense fallback={<LoadingFallback />}>
  //       <ResaleMarketPlacePage />
  //     </Suspense>
  //   ),
  // },
  // {
  //   path: getRoutePath('individual_resale', { eventId: ':eventId' }),
  //   element: (
  //     <Suspense fallback={<LoadingFallback />}>
  //       <IndividualResaleTicket />
  //     </Suspense>
  //   ),
  // },
  {
    path: getRoutePath('sell'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SellPage />
      </Suspense>
    ),
  },
  {
    // The privacy terms are a section of the Terms page.
    path: getRoutePath('privacy_policy'),
    element: <Navigate to={`${getRoutePath('terms_and_conditions')}#${PRIVACY_SECTION_ID}`} replace />,
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]
