import BaseModal from '@/components/reusable/base-modal'
import { Button } from '@/components/ui/button'
import { useGetAllCart } from '@/hooks/use-cart'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { formatNaira } from '@/lib/format-price'
import { getCartTotals } from '@/lib/utils'
import type { EventDetailData } from '@/types'
import type { CartData } from '@/types/cart'
import { useAfroStore, useCartStore } from '@/stores'
import { LoaderCircle } from 'lucide-react'
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
  const isSyncingCart = useCartStore((state) => state.isSyncingCart)
  const { data: ticketsResponse } = useGetEventTickets(event.eventId)
  const { data, isLoading } = useGetAllCart()


  const totalPrice = isAuthenticated
    ? getCartTotals((data?.data ?? []) as unknown as CartData[]).totalPrice
    : localItems.reduce((sum, item) => {
        const ticket = ticketsResponse?.data?.find((t) => t.ticketId === item.ticketId)
        return sum + (ticket?.price ?? 0) * item.quantity
      }, 0)

  const hasCartItems = isAuthenticated
    ? ((data?.data ?? []) as CartData[]).length > 0
    : localItems.length > 0

  return (
    <>
      <Button
        className=' w-full h-14 flex items-center justify-between bg-deep-red px-3 rounded-[8px] gap-[50px] md:gap-[107px] font-sf-pro-display hover:bg-deep-red/80'
        onClick={() => setIsOpen(true)}>
        <span className='text-sm'>Checkout</span>
        <span className='text-2xl'>
          {(isAuthenticated && isLoading) || isSyncingCart ? (
            <LoaderCircle color='#ffffff' size={24} className='animate-spin' />
          ) : (
            formatNaira(totalPrice, { free: totalPrice === 0 && hasCartItems })
          )}
        </span>
      </Button>

      <BaseModal
        size='full'
        className='bg-black !w-full'
        floatingCancel
        onClose={() => setIsOpen(false)}
        open={isOpen}
        confirmClose
        confirmCloseTitle='Exit Cart?'
        confirmCloseMessage='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
        hasFooter>
        <div className='flex flex-col h-fit w-full justify-center items-center md:mt-24 mt-16'>
          <CartContainer event={event}  action={() => {
              setIsOpen(false)
              setCheckoutOpen(true)
            }} />
        </div>
      </BaseModal>

      <BaseModal
        size='full'
        className='bg-black !w-screen !h-screen !max-w-screen '
        floatingCancel
        confirmClose
        confirmCloseTitle='Exit Checkout?'
        confirmCloseMessage='Your cart will be cleared if you leave this page. Are you sure you want to go back?'
        confirmCloseCancelText='Return to checkout'
        removeCancel
        onClose={() => setCheckoutOpen(false)}
        open={checkoutOpen}>
        <CheckoutPage event={event} event_id={event.eventId} />
      </BaseModal>
    </>
  )
}

// function FooterContent({
//   totalPrice,
//   action,
// }: {
//   totalPrice: number
//   action: () => void
// }) {
//   return (
//     <footer className='w-full md:w-84 flex flex-col items-center gap-2 px-5  py-4 rounded-t-xl md:self-end md:ml-auto bg-secondary'>
//       <div className='w-full flex items-center justify-between max-md:gap-10 font-sf-pro-display'>
//         <span className='font-light text-2xl'>{formatNaira(totalPrice)}</span>
//         <Button onClick={action} className='bg-white text-black hover:bg-white/90'>
//           Continue
//         </Button>
//       </div>
//     </footer>
//   )
// }
