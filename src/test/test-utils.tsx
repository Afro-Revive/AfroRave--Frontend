/**
 * Shared helpers for route-level tests.
 *
 * `renderRoute` mounts the app's real route tree (`AppRoutes` from application.tsx) inside a
 * MemoryRouter, so tests exercise the same route table the app ships rather than a copy.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/application'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { useAfroStore } from '@/stores'
import type { User } from '@/types/auth'

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    userId: 'user-1',
    email: 'fan@example.com',
    accountType: 'User',
    profile: {
      firstName: 'Ada',
      lastName: 'Fan',
      ...overrides.profile,
    },
    ...overrides,
  } as User
}

/** Puts a signed-in fan in the store. Token expiry stays null so no refresh timer is scheduled. */
export function signIn(user: User = makeUser()) {
  useAfroStore.setState({
    user,
    token: 'test-token',
    refreshToken: 'test-refresh-token',
    tokenExpiry: null,
    isAuthenticated: true,
  })

  return user
}

export function signOut() {
  useAfroStore.setState({
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
    isAuthenticated: false,
  })
}

export function renderRoute(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })

  // Mirrors the provider stack in main.tsx — pages call Helmet and the wishlist context.
  const view = render(
    <HelmetProvider>
      <WishlistProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </WishlistProvider>
    </HelmetProvider>,
  )

  return { ...view, queryClient }
}
