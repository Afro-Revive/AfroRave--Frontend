import BaseModal from '@/components/reusable/base-modal'
import { useClearCart, useSyncCartToServer } from '@/hooks/use-cart'
import { useGetEventResaleListings, useGetEventTickets } from '@/hooks/use-event-mutations'
import type {
  EventDetailData,
  PaginatedResponse,
  ResaleListingData,
  TicketData,
} from '@/types'
import { toPurchasableResaleListings, toPurchasableTickets } from '@/lib/purchasable-tickets'
import { useAfroStore, useCartStore } from '@/stores'
import { useState } from 'react'
import CheckoutPage from '../../checkout'
import CartContainer from './cart-container'

interface CartProps {
  event: EventDetailData
}

export default function Cart({ event }: CartProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const isOpen = useCartStore((state) => state.isCartOpen)
  const closeCart = useCartStore((state) => state.closeCart)

  const { data: ticketsResponse } = useGetEventTickets(event.eventId)
  const { data: resaleListingsResponse } = useGetEventResaleListings(
    event.eventId,
    isAuthenticated,
  )
  const { mutateAsync: syncCart, isPending: isSyncing } = useSyncCartToServer()
  const { mutate: clearCart } = useClearCart()

  const tickets = toPurchasableTickets(
    ticketsResponse?.data as PaginatedResponse<TicketData> | undefined,
  )
  const resaleListings = toPurchasableResaleListings(
    resaleListingsResponse?.data as PaginatedResponse<ResaleListingData> | undefined,
  )

  async function handleContinue() {
    if (isAuthenticated) {
      try {
        await syncCart()
      } catch {
        return
      }
    }
    closeCart()
    setCheckoutOpen(true)
  }

  return (
    <>
      <BaseModal
        size='full'
        className='bg-system-black !w-full'
        floatingCancel
        slideFromBottom
        onClose={() => { clearCart(); closeCart() }}
        open={isOpen}
        confirmClose
        confirmCloseTitle='Exit Cart?'
        confirmCloseMessage='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
        hasFooter>
        <div className='flex flex-col h-fit w-full justify-center items-center md:mt-24 mt-16'>
          <CartContainer
            event={event}
            isLoading={isSyncing}
            tickets={tickets}
            resaleListings={resaleListings}
            action={handleContinue}
          />
        </div>
      </BaseModal>

      <BaseModal
        size='full'
        className='bg-black !w-screen !h-screen !max-w-screen'
        floatingCancel
        confirmClose
        confirmCloseTitle='Exit Checkout?'
        confirmCloseMessage='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
        confirmCloseCancelText='Return to checkout'
        removeCancel
        onClose={() => {clearCart(); setCheckoutOpen(false) }}
        open={checkoutOpen}>
        <CheckoutPage event={event} event_id={event.eventId} />
      </BaseModal>
    </>
  )
}
