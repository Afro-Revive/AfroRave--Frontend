/**
 * Route-level coverage for the signed-in fan pages — the pages behind UserAuthGuard.
 * Covers both the guard (signed out) and the pages themselves (signed in).
 */
import { screen, waitFor } from '@testing-library/react'
import { mockApi } from '@/test/api-mock'
import { apiResponse, makeProfile, makeUserTicket, paginated } from '@/test/fixtures'
import { renderRoute, signIn } from '@/test/test-utils'

const dashboardRoutes: { path: string; text: RegExp }[] = [
  { path: '/account', text: /user information/i },
  { path: '/settings', text: /danger zone/i },
  { path: '/my-tickets', text: /no past tickets/i },
  { path: '/my-tickets/evt-1', text: /your orders/i },
  { path: '/listed-tickets', text: /listed tickets/i },
]

describe('fan dashboard routes when signed in', () => {
  beforeEach(() => {
    signIn()
  })

  it.each(dashboardRoutes)('$path renders its page', async ({ path, text }) => {
    renderRoute(path)

    expect(await screen.findByText(text)).toBeInTheDocument()
  })

  it('shows the dashboard navigation on every page', async () => {
    renderRoute('/account')

    expect(await screen.findByText(/my tickets/i)).toBeInTheDocument()
    expect(screen.getByText(/wallet/i)).toBeInTheDocument()
    expect(screen.getByText(/listed tickets/i)).toBeInTheDocument()
  })

  it('fills the profile form from the profile endpoint', async () => {
    mockApi(
      'get',
      '/api/profile/user',
      apiResponse(makeProfile({ firstName: 'Chidinma', lastName: 'Okoye' })),
    )

    renderRoute('/account')

    await waitFor(() => expect(screen.getByDisplayValue('Chidinma')).toBeInTheDocument())
    expect(screen.getByDisplayValue('Okoye')).toBeInTheDocument()
  })

  it('lists the tickets the fan holds', async () => {
    mockApi(
      'get',
      '/api/profile/user/ticket/active',
      apiResponse(paginated([makeUserTicket({ eventName: 'Burna Live' })])),
    )

    renderRoute('/my-tickets')

    expect(await screen.findByText(/burna live/i)).toBeInTheDocument()
  })

  it('shows an empty state when the fan holds no tickets', async () => {
    mockApi('get', '/api/profile/user/ticket/active', apiResponse(paginated([])))

    renderRoute('/my-tickets')

    expect(await screen.findByText(/no active tickets/i)).toBeInTheDocument()
  })
})

describe('fan dashboard routes when signed out', () => {
  it.each(dashboardRoutes.map((route) => route.path))(
    'redirects %s away from the dashboard',
    async (path) => {
      renderRoute(path)

      // The guard sends unauthenticated fans to the public landing page.
      expect(await screen.findByText(/find tickets/i)).toBeInTheDocument()
      expect(screen.queryByText(/user information/i)).not.toBeInTheDocument()
    },
  )
})
