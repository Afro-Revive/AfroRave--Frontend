import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { LoadingFallback } from '../components/loading-fallback'
import { getRoutePath } from './get-route-path'

const LandingPage = lazy(() => import('../pages/landing-page/home'))
const EventsPage = lazy(() => import('../pages/landing-page/event-page'))
const IndividualEventPage = lazy(() => import('../pages/landing-page/event-page/individual-event'))
const ResellPage = lazy(() => import('../pages/landing-page/resell-page'))
const NotFoundPage = lazy(() => import('../pages/landing-page/not-found'))
const AboutUsPage = lazy(() => import('../pages/landing-page/about-us'))
const BlogPage = lazy(() => import('../pages/landing-page/blog'))
const RefundPolicyPage = lazy(() => import('../pages/landing-page/refund-policy'))
const WorkWithUsPage = lazy(() => import('../pages/landing-page/work-with-us'))
// const ResaleMarketPlacePage = lazy(() => import('../pages/landing-page/resale-marketplace'))
// const IndividualResaleTicket = lazy(
//   () => import('../pages/landing-page/resale-marketplace/individual-resale-event'),
// )
const SellPage = lazy(() => import('../pages/landing-page/sell'))
const TermsAndConditionPage = lazy(() => import('../pages/landing-page/terms-and-condition'))
const PrivacyPolicyPage = lazy(() => import('../pages/landing-page/privacy-policy'))

export const routes: RouteObject[] = [
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
    path: getRoutePath('about_us'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AboutUsPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('blog'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <BlogPage />
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
    path: getRoutePath('terms_and_conditions'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsAndConditionPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('privacy_policy'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrivacyPolicyPage />
      </Suspense>
    ),
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
