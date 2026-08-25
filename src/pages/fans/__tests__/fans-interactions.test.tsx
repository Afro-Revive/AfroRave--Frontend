/**
 * The behaviour a fan actually drives: moving between dashboard sections and tabs,
 * following links out of empty states, and the post-payment confirmation flow.
 */
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockApi } from '@/test/api-mock'
import { apiResponse, makeUserTicket, paginated } from '@/test/fixtures'
import { renderRoute, signIn } from '@/test/test-utils'

describe('fan dashboard navigation', () => {
  beforeEach(() => {
    signIn()
  })

  it('moves from the account page to my tickets', async () => {
    const user = userEvent.setup()
    renderRoute('/fans/account')

    await screen.findByText(/user information/i)
    await user.click(screen.getByRole('link', { name: /my tickets/i }))

    expect(await screen.findByText(/no past tickets/i)).toBeInTheDocument()
    expect(screen.queryByText(/user information/i)).not.toBeInTheDocument()
  })

  it('shows the wallet section when the account query param asks for it', async () => {
    renderRoute('/fans/account?account=wallet')

    expect(await screen.findByText(/available balance/i)).toBeInTheDocument()
    expect(screen.queryByText(/user information/i)).not.toBeInTheDocument()
  })

  it('defaults the account page to the profile section', async () => {
    renderRoute('/fans/account')

    expect(await screen.findByText(/user information/i)).toBeInTheDocument()
    expect(screen.queryByText(/available balance/i)).not.toBeInTheDocument()
  })
})

describe('my tickets tabs', () => {
  beforeEach(() => {
    signIn()
  })

  it('shows active tickets first and past tickets after switching', async () => {
    const user = userEvent.setup()

    mockApi(
      'get',
      '/api/profile/user/ticket/active',
      apiResponse(paginated([makeUserTicket({ eventName: 'Asake Live' })])),
    )
    mockApi(
      'get',
      '/api/profile/user/ticket/past',
      apiResponse(paginated([makeUserTicket({ eventId: 'evt-2', eventName: 'Wizkid 2019' })])),
    )

    renderRoute('/fans/my-tickets')

    expect(await screen.findByText(/asake live/i)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /past/i }))

    expect(await screen.findByText(/wizkid 2019/i)).toBeInTheDocument()
  })

  it('sends a fan with no tickets to the events page', async () => {
    const user = userEvent.setup()
    mockApi('get', '/api/profile/user/ticket/active', apiResponse(paginated([])))

    renderRoute('/fans/my-tickets')

    const discover = await screen.findAllByRole('link', { name: /discover events/i })
    await user.click(discover[0])

    expect(await screen.findByText(/select category/i)).toBeInTheDocument()
  })
})

describe('payment confirmation', () => {
  it('confirms the order when Paystack sends back a reference', async () => {
    mockApi('post', '/api/Cart/checkout', apiResponse({ orderId: 'ord-1' }))

    renderRoute('/fans/payment-confirmation?reference=ref_123')

    expect(await screen.findByText(/thank you for your purchase/i)).toBeInTheDocument()
  })

  it('reports a failed confirmation', async () => {
    const { default: api } = await import('@/services/http.service')
    ;(api.post as jest.Mock).mockRejectedValueOnce(new Error('checkout failed'))

    renderRoute('/fans/payment-confirmation?reference=ref_456')

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument()
  })

  it('stays idle when there is no payment reference to confirm', async () => {
    renderRoute('/fans/payment-confirmation')

    await waitFor(() =>
      expect(screen.queryByText(/processing payment/i)).not.toBeInTheDocument(),
    )
    expect(screen.queryByText(/thank you for your purchase/i)).not.toBeInTheDocument()
  })
})
