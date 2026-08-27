/**
 * A tiny stand-in for the backend.
 *
 * `src/test/setup.ts` replaces the axios instance in `@/services/http.service` with one that
 * asks `resolveApiMock` what to return, so every service in `src/services` is covered by a
 * single mock. Tests override individual endpoints with `mockApi` and get the defaults back
 * automatically between tests.
 */
import {
  apiResponse,
  makeEvent,
  makeEventDetail,
  makeProfile,
  makeTicket,
  makeUserTicket,
  paginated,
  walletDetails,
} from './fixtures'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

/** Matched against the request URL in order; first hit wins. */
interface Route {
  method: Method
  match: string | RegExp
  body: unknown
}

const defaultRoutes = (): Route[] => [
  {
    method: 'get',
    match: '/api/profile/user/ticket/active',
    body: apiResponse(paginated([makeUserTicket()])),
  },
  { method: 'get', match: '/api/profile/user/ticket/past', body: apiResponse(paginated([])) },
  { method: 'get', match: '/api/profile/user/wallet', body: apiResponse(walletDetails) },
  { method: 'get', match: '/api/profile/user', body: apiResponse(makeProfile()) },
  { method: 'get', match: '/api/Event/trending', body: apiResponse(paginated([makeEvent()])) },
  // The public event page looks events up by custom URL, not id.
  { method: 'get', match: '/api/Event/url/', body: apiResponse(makeEventDetail()) },
  { method: 'get', match: /\/api\/Event\/[^/]+\/tickets$/, body: apiResponse(paginated([makeTicket()])) },
  { method: 'get', match: /\/api\/Event\/[^/]+\/promocodes$/, body: apiResponse(paginated([])) },
  { method: 'get', match: /\/api\/Event\/[^/]+\/vendors$/, body: apiResponse(paginated([])) },
  {
    method: 'get',
    match: /\/api\/Event\/[^/]+$/,
    body: apiResponse(makeEventDetail()),
  },
  { method: 'get', match: '/api/Event', body: apiResponse(paginated([makeEvent()])) },
  {
    method: 'get',
    match: '/api/Profile/user/ticket/resale/my',
    body: apiResponse(paginated([])),
  },
  {
    method: 'get',
    match: '/api/Profile/user/ticket/resale/list',
    body: apiResponse(paginated([])),
  },
  { method: 'get', match: '/api/Cart', body: apiResponse([]) },
]

let routes = defaultRoutes()

export function resetApiMocks() {
  routes = defaultRoutes()
}

/** Registers a response for one endpoint, taking precedence over the defaults. */
export function mockApi(method: Method, match: string | RegExp, body: unknown) {
  routes.unshift({ method, match, body })
}

export function resolveApiMock(method: Method, url: string) {
  const route = routes.find(
    (candidate) =>
      candidate.method === method &&
      (typeof candidate.match === 'string'
        ? url.includes(candidate.match)
        : candidate.match.test(url)),
  )

  return route ? route.body : apiResponse(null)
}
