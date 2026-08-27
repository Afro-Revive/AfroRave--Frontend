/**
 * Route-level coverage for the public half of /fans — everything served by IndexLayout
 * plus the support pages. Each case mounts the app's real route table at a URL, so a
 * broken path, a missing provider or a crashing page all fail here.
 */
import { screen, waitFor } from '@testing-library/react'
import { mockApi } from '@/test/api-mock'
import { apiResponse } from '@/test/fixtures'
import { renderRoute } from '@/test/test-utils'

/** `text` is copy unique enough to prove the right page rendered. */
const publicRoutes: { path: string; text: RegExp }[] = [
  { path: '/fans', text: /find tickets/i },
  { path: '/fans/events', text: /select category/i },
  { path: '/fans/events/afro-nation-lagos', text: /afro nation lagos/i },
  { path: '/fans/resell', text: /resell with ease/i },
  { path: '/fans/about-us', text: /coming soon/i },
  { path: '/fans/blog', text: /coming soon/i },
  { path: '/fans/refund-policy', text: /coming soon/i },
  { path: '/fans/work-with-us', text: /coming soon/i },
  { path: '/fans/sell', text: /coming soon/i },
  { path: '/fans/terms-and-conditions', text: /coming soon/i },
  { path: '/fans/privacy-policy', text: /coming soon/i },
  { path: '/fans/support', text: /how can we help you/i },
  { path: '/fans/support/faq', text: /how can we help you/i },
]

describe('public /fans routes', () => {
  it.each(publicRoutes)('$path renders its page', async ({ path, text }) => {
    renderRoute(path)

    expect(await screen.findByText(text)).toBeInTheDocument()
    expect(screen.queryByText(/oops! page not found/i)).not.toBeInTheDocument()
  })

  it('falls through to the not-found page for an unknown /fans path', async () => {
    renderRoute('/fans/this-page-does-not-exist')

    expect(await screen.findByText(/oops! page not found/i)).toBeInTheDocument()
  })

  it('shows the site footer on public pages', async () => {
    renderRoute('/fans/about-us')

    expect(await screen.findByText(/privacy policy/i)).toBeInTheDocument()
    expect(screen.getByText(/refund policy/i)).toBeInTheDocument()
  })
})

describe('individual event page', () => {
  it('renders the event, its details and its tickets', async () => {
    renderRoute('/fans/events/afro-nation-lagos')

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

    renderRoute('/fans/events/missing-event')

    await waitFor(() => expect(screen.getByText(/no events found/i)).toBeInTheDocument())
  })
})

describe('events listing page', () => {
  it('offers the category and date filters', async () => {
    renderRoute('/fans/events')

    expect(await screen.findByText(/select category/i)).toBeInTheDocument()
    expect(screen.getByText(/select date/i)).toBeInTheDocument()
    expect(screen.getByText(/trending/i)).toBeInTheDocument()
  })
})
