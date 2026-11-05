/**
 * The cart and checkout are pages: a refresh keeps the fan where they were,
 * an empty cart sends them back to the event, and leaving asks first and
 * clears the cart so it never holds two events' tickets.
 */
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockApi } from '@/test/api-mock'
import { apiResponse, makeTicket, paginated } from '@/test/fixtures'
import { renderRoute, signIn } from '@/test/test-utils'
import { useCartStore } from '@/stores'

const EVENT_SLUG = 'afro-nation-lagos'
const EVENT_PATH = `/fans/events/${EVENT_SLUG}`
const CHECKOUT_PATH = `${EVENT_PATH}/checkout`

/**
 * A cart for this event, as it would be after Continue synced it to the server
 * and the fan refreshed. `reservedSecondsAgo` sets how far the countdown has run.
 */
function seedCart(reservedSecondsAgo = 0) {
  useCartStore.setState({
    eventSlug: EVENT_SLUG,
    items: [{ cartKey: 'tkt-1', ticketId: 'tkt-1', quantity: 2, purchaseLimit: 10 }],
    promoCodeId: null,
    reservationStartedAt: Date.now() - reservedSecondsAgo * 1000,
  })
}

describe('checkout page', () => {
  beforeEach(() => {
    signIn()
    // Tickets now carry the price fans pay as salesPrice.
    mockApi(
      'get',
      /\/api\/Event\/[^/]+\/tickets$/,
      apiResponse(paginated([makeTicket({ salesPrice: 25000 })])),
    )
  })

  afterEach(() => {
    useCartStore.getState().clearLocal()
  })

  it('stays on checkout after a refresh', async () => {
    seedCart()
    const { router } = renderRoute(CHECKOUT_PATH)

    expect(await screen.findByText(/please checkout within/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(CHECKOUT_PATH)
  })

  it('sends a fan with an empty cart back to the event', async () => {
    const { router } = renderRoute(CHECKOUT_PATH)

    await waitFor(() => expect(router.state.location.pathname).toBe(EVENT_PATH))
  })

  it('asks before leaving, then clears the cart', async () => {
    const user = userEvent.setup()
    seedCart()
    const { router } = renderRoute(CHECKOUT_PATH)

    await user.click(await screen.findByRole('button', { name: /leave checkout/i }))

    expect(await screen.findByText(/exit checkout\?/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(CHECKOUT_PATH)

    await user.click(screen.getByRole('button', { name: /go back/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe(EVENT_PATH))
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('offers to extend in the last two minutes, and restarts the countdown', async () => {
    const user = userEvent.setup()
    // 14 minutes into the 15-minute reservation.
    seedCart(14 * 60)
    mockApi('get', '/api/Cart', apiResponse([{ cartId: 7, ticketId: 'tkt-1', quantity: 2 }]))
    mockApi('post', '/api/Cart/7/extend-reservation', apiResponse(null))
    renderRoute(CHECKOUT_PATH)

    await user.click(await screen.findByRole('button', { name: /need more time/i }))

    // Back to the full 15 minutes, give or take the second the test takes.
    expect(await screen.findByText(/please checkout within 1[45]:\d\d minutes/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /need more time/i })).not.toBeInTheDocument()
  })

  it('sends the fan back to the event once the reservation has expired', async () => {
    // The server deletes an expired cart, so checkout can't go on.
    seedCart(16 * 60)
    const { router } = renderRoute(CHECKOUT_PATH)

    await waitFor(() => expect(router.state.location.pathname).toBe(EVENT_PATH))
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(screen.queryByText(/exit checkout\?/i)).not.toBeInTheDocument()
  })
})
