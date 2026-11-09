/**
 * Route-level coverage for the public fan pages — everything served by IndexLayout
 * plus the shared pages fans reach from it. Each case mounts the app's real route
 * table at a URL, so a broken path, a missing provider or a crashing page all fail
 * here. Fan pages used to live under /fans; the last block checks old links follow.
 */
import { screen, waitFor } from '@testing-library/react'
import { mockApi } from '@/test/api-mock'
import { apiResponse } from '@/test/fixtures'
import { renderRoute } from '@/test/test-utils'

/** `text` is copy unique enough to prove the right page rendered. */
const publicRoutes: { path: string; text: RegExp }[] = [
  { path: '/', text: /find tickets/i },
  { path: '/events', text: /select category/i },
  { path: '/events/afro-nation-lagos', text: /afro nation lagos/i },
  { path: '/resell', text: /can’t make it to an event/i },
  { path: '/about-us', text: /afrorevive ticketing/i },
  { path: '/blog', text: /coming soon/i },
  { path: '/refund-policy', text: /coming soon/i },
  { path: '/work-with-us', text: /coming soon/i },
  { path: '/sell', text: /coming soon/i },
  { path: '/terms-and-conditions', text: /terms of use/i },
  { path: '/privacy-policy', text: /coming soon/i },
  { path: '/contact-support', text: /how can we help you/i },
  { path: '/support/faq', text: /user support/i },
  { path: '/support', text: /user support/i },
]

describe('public fan routes', () => {
  it.each(publicRoutes)('$path renders its page', async ({ path, text }) => {
    renderRoute(path)

    expect(await screen.findByText(text)).toBeInTheDocument()
    expect(screen.queryByText(/oops! page not found/i)).not.toBeInTheDocument()
  })

  it('falls through to the not-found page for an unknown path', async () => {
    renderRoute('/this-page-does-not-exist')

    expect(await screen.findByText(/oops! page not found/i)).toBeInTheDocument()
  })

  it('shows the site footer on public pages', async () => {
    renderRoute('/refund-policy')

    expect(await screen.findByText(/privacy policy/i)).toBeInTheDocument()
    expect(screen.getAllByText(/refund policy/i).length).toBeGreaterThan(0)
  })
})

describe('old /fans links', () => {
  it.each([
    ['/fans', '/', ''],
    ['/fans/', '/', ''],
    ['/fans/events/afro-nation-lagos', '/events/afro-nation-lagos', ''],
    ['/fans/invite/accept?token=abc123', '/invite/accept', '?token=abc123'],
    ['/fans/payment-confirmation?reference=ref_1', '/payment-confirmation', '?reference=ref_1'],
    ['/fans/support', '/contact-support', ''],
    ['/fans/support/faq', '/support', ''],
  ])('%s goes to %s, keeping the query string', async (from, pathname, search) => {
    const { router } = renderRoute(from)

    await waitFor(() => expect(router.state.location.pathname).toBe(pathname))
    expect(router.state.location.search).toBe(search)
  })
})

describe('individual event page', () => {
  it('renders the event, its details and its tickets', async () => {
    renderRoute('/events/afro-nation-lagos')

    expect(await screen.findByText(/afro nation lagos/i)).toBeInTheDocument()
    // The venue appears in both the hero and the location block.
    expect(screen.getAllByText(/eko atlantic/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/two nights of afrobeats/i)).toBeInTheDocument()

    // Ticket name and price come from the tickets endpoint, which resolves separately.
    expect(await screen.findByText(/general admission/i)).toBeInTheDocument()
    expect(screen.getByText(/₦25,000/)).toBeInTheDocument()
  })

  it('tells the fan when the event does not exist', async () => {
    mockApi('get', '/api/Event/url/', apiResponse(null))

    renderRoute('/events/missing-event')

    await waitFor(() => expect(screen.getByText(/no events found/i)).toBeInTheDocument())
  })
})

describe('events listing page', () => {
  it('offers the category and date filters', async () => {
    renderRoute('/events')

    expect(await screen.findByText(/select category/i)).toBeInTheDocument()
    expect(screen.getByText(/select date/i)).toBeInTheDocument()
    expect(screen.getByText(/trending/i)).toBeInTheDocument()
  })
})
