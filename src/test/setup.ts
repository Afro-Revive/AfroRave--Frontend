import '@testing-library/jest-dom'
import { resetApiMocks } from './api-mock'
import { useAfroStore } from '@/stores'

/**
 * No test may reach the network. Every service goes through this axios instance, so one
 * mock covers them all; individual tests spy on the service methods they care about.
 */
jest.mock('@/services/http.service', () => {
  // jest.mock factories are hoisted above the imports, so this one has to be lazy.
  const respond = (method: string) => (url: string) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { resolveApiMock } = require('./api-mock')
    return Promise.resolve({ data: resolveApiMock(method, url), status: 200 })
  }

  return {
    __esModule: true,
    default: {
      get: jest.fn(respond('get')),
      post: jest.fn(respond('post')),
      put: jest.fn(respond('put')),
      patch: jest.fn(respond('patch')),
      delete: jest.fn(respond('delete')),
      defaults: { headers: { common: {} } },
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    },
    multipartHeaders: { headers: { 'Content-Type': 'multipart/form-data' } },
  }
})

beforeEach(() => {
  resetApiMocks()
  localStorage.clear()
  useAfroStore.setState({
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
    isAuthenticated: false,
  })
})

// Vite env vars the app reads at module scope.
process.env.VITE_TICKET_SALES_PERCENTAGE = process.env.VITE_TICKET_SALES_PERCENTAGE ?? '0.05'
process.env.VITE_TICKET_RESALE_PERCENTAGE = process.env.VITE_TICKET_RESALE_PERCENTAGE ?? '0.05'

// jsdom ships none of these, and the layouts/carousels call them on mount.
window.matchMedia =
  window.matchMedia ||
  ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))

window.scrollTo = jest.fn()

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = class {
  root = null
  rootMargin = ''
  thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver

// Radix and embla measure elements; jsdom reports every box as zero-sized.
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.hasPointerCapture = jest.fn()
Element.prototype.setPointerCapture = jest.fn()
Element.prototype.releasePointerCapture = jest.fn()

// Recharts renders nothing at 0×0, so give its ResponsiveContainer a real box.
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 800,
})
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 600,
})
