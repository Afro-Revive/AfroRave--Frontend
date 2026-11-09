import { LoadingFallback } from '@/components/loading-fallback'
import { Suspense, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

const SupportPage = lazy(() => import('../pages/help/support'))
const TermsPage = lazy(() => import('../pages/help/terms'))

export const help_routes: RouteObject[] = [
  {
    path: getRoutePath('help_center'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SupportPage />
      </Suspense>
    ),
  },
  {
    path: getRoutePath('terms_and_conditions'),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsPage />
      </Suspense>
    ),
  },
]
