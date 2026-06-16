import { X } from 'lucide-react'
import { formatNaira } from '@/lib/format-price'
import { useGetAllCart, useCheckoutCart, useClearCart } from '@/hooks/use-cart'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { useAfroStore, useCartStore } from '@/stores'
import type { CartData } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'
import PromoCode from '@/pages/fans/account/components/promo-code'

export default function CartSummary({
  name,
  location,
  isFanAccount = false,
  eventId,
}: {
  name: string
  location: string
  isFanAccount?: boolean
  eventId?: string
}) {
  const navigate = useNavigate()

  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const localItems = useCartStore((state) => state.items)
  const { data: ticketsResponse } = useGetEventTickets(eventId ?? '')
  const { data: serverCart } = useGetAllCart()

  const cartItems = isAuthenticated
    ? ((serverCart?.data ?? []) as unknown as CartData[]).map((item) => ({
        cartId: String(item.cartId),
        ticketId: item.ticketId,
        eventId: item.eventId,
        name: item.ticketName,
        price: item.price,
        quantity: item.quantity,
      }))
    : localItems.map((item) => {
        const ticket = ticketsResponse?.data?.find((t) => t.ticketId === item.ticketId)
        return {
          cartId: item.ticketId,
          ticketId: item.ticketId,
          eventId: eventId ?? '',
          name: ticket?.ticketName ?? 'Ticket',
          price: ticket?.price ?? 0,
          quantity: item.quantity,
        }
      })

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const checkoutMutation = useCheckoutCart()
  const clearCartMutation = useClearCart()

  function handleCheckout() {
    checkoutMutation.mutate(
      {
        data: {
          paymentMethod: '',
          promoCode: '',
          promoCodeId: '',
          transactionReference: '',
          paymentReference: '',
        },
      },
      {
        onSuccess: () => {
          clearCartMutation.mutate()
          navigate(getRoutePath('account'))
        },
      },
    )
  }

  return (
    <div className='max-w-3xl w-full flex flex-col items-center gap-[67px]'>
      <div className='flex flex-col items-center text-white'>
        <p className='text-3xl md:text-4xl font-bold font-sf-compact leading-[100%] tracking-[-0.25px] capitalize text-center mb-4'>
          {name}
        </p>
        <p className='font-sf-pro-display text-base md:text-xl leading-[100%]'>{location}</p>
      </div>

      <div className='w-full flex flex-col '>
        {cartItems.map((item) => (
          <CartTicket
            key={item.cartId}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}

        <PromoCode
          cartItems={cartItems}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
        />

        <div className='w-full flex items-center justify-between'>
          <p className='font-sf-pro-display md:text-xl text-white leading-[100%]'>TOTAL:</p>
          <p className='text-white font-sf-pro-text md:text-xl leading-[100%]'>{formatNaira(totalPrice)}</p>
        </div>

        {isFanAccount && (
          <Button
            onClick={handleCheckout}
            className='w-[140px] flex items-center h-8 rounded-[6px] bg-deep-red uppercase text-sm font-sf-pro-display leading-[100%] self-center mx-auto'>
            checkout
          </Button>
        )}
      </div>
    </div>
  )
}

function CartTicket({ name, price, quantity }: InitialTickets) {
  return (
    <div className='w-full flex items-center justify-between'>
      <div className='flex flex-col gap-1 text-white'>
        <p className='font-sf-pro-display uppercase md:text-xl leading-[100%]'>{name}</p>
        <div className='flex flex-col gap-0.5'>
          <p className='text-sm md:text-base font-sf-pro-text leading-[100%]'>{formatNaira(price)}</p>
          <p className='text-xs md:text-sm font-sf-pro-display leading-[100%] text-[#ACACAC]'>
            +{formatNaira(1500)} fee
          </p>
        </div>
      </div>

      <div className='h-[60px] w-14 flex items-center justify-end gap-2'>
        <X color='#ffffff' size={20} />
        <p className='text-xl md:text-2xl font-sf-pro-text leading-[100px]'>{quantity}</p>
      </div>
    </div>
  )
}

interface InitialTickets {
  name: string
  price: number
  quantity: number
}
