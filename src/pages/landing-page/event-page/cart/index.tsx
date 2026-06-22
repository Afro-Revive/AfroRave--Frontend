import BaseModal from '@/components/reusable/base-modal'
import { Button } from '@/components/ui/button'
import { useClearCart } from '@/hooks/use-cart'
import { useSyncCartToServer } from '@/hooks/use-cart'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { formatNaira } from '@/lib/format-price'
import type { EventDetailData } from '@/types'
import { useAfroStore, useCartStore } from '@/stores'
import { useState } from 'react'
import CheckoutPage from '../../checkout'
import CartContainer from './cart-container'

interface CartProps {
  event: EventDetailData
}

export default function Cart({ event }: CartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const localItems = useCartStore((state) => state.items)
  
  const { data: ticketsResponse } = useGetEventTickets(event.eventId)
  const { mutateAsync: syncCart, isPending: isSyncing } = useSyncCartToServer()
  const {mutate: clearCart} = useClearCart()

  const totalPrice = localItems.reduce((sum, item) => {
    const ticket = ticketsResponse?.data?.find((t) => t.ticketId === item.ticketId)
    return sum + (ticket?.price ?? 0) * item.quantity
  }, 0)

  const hasCartItems = localItems.length > 0

  async function handleContinue() {
    if (isAuthenticated) {
      try {
        await syncCart()
      } catch {
        return
      }
    }
    setIsOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <>
      <Button
        className='w-full h-14 flex items-center justify-between bg-deep-red px-3 rounded-[8px] gap-[50px] md:gap-[107px] font-sf-pro-display hover:bg-deep-red/80'
        onClick={() => setIsOpen(true)}>
        <span className='text-sm'>Checkout</span>
        <span className='text-2xl'>
          {formatNaira(totalPrice, { free: totalPrice === 0 && hasCartItems })}
        </span>
      </Button>

      <BaseModal
        size='full'
        className='bg-black !w-full'
        floatingCancel
        onClose={() => { clearCart(); setIsOpen(false) }}
        open={isOpen}
        confirmClose
        confirmCloseTitle='Exit Cart?'
        confirmCloseMessage='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
        hasFooter>
        <div className='flex flex-col h-fit w-full justify-center items-center md:mt-24 mt-16'>
          <CartContainer
            event={event}
            isLoading={isSyncing}
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
