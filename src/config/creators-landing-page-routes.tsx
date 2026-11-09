import { LoadingFallback } from '@/components/loading-fallback'
import { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

const CreatorsHomePage = lazy(() => import('../pages/creators/home'))
// About Us and Blog are the one page of each for fans and creators alike.
const AboutUsPage = lazy(() => import('../pages/creators/about-us'))
const ContactUsPage = lazy(() => import('../pages/creators/contact-us'))
const CreatorsBlogPage = lazy(() => import('../pages/creators/blog'))
// const CreatorsLandingPage = lazy(() => import('../pages/landing-page/creators'))

export const creator_landing_page_routes: RouteObject[] = [
  {
    path: getRoutePath('creators'),
    element: <Navigate to={getRoutePath('creators_home')} replace />,
  },
  {
    path: getRoutePath('creators_home'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CreatorsHomePage />
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
    path: getRoutePath('creators_contact'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContactUsPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('blog'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CreatorsBlogPage />
      </Suspense>
    ),
  },
]
