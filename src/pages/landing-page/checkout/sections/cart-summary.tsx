import { Input } from '@/components/ui/input'
import { Badge, X } from 'lucide-react'
import { formatNaira } from '@/lib/format-price'
import { useGetAllCart, useValidatePromocode, useCheckoutCart, useClearCart } from '@/hooks/use-cart'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { useAfroStore, useCartStore } from '@/stores'
import type { CartData } from '@/types/cart'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'

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
  const [message, setMessage] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

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

  const validatePromocodeMutation = useValidatePromocode()
  const checkoutMutation = useCheckoutCart()
  const clearCartMutation = useClearCart()

  function handleValidatePromocode(promocode: string) {
    validatePromocodeMutation.mutate(
      {
        data: {
          promoCode: promocode,
          eventIds: cartItems.map((item) => item.eventId),
          subtotal: totalPrice,
          totalTickets: totalQuantity,
          ticketIds: cartItems.map((item) => item.ticketId),
        },
      },
      {
        onSuccess: (data) => {
          setMessage(data.data.data.message)
          setIsValid(data.data.data.isValid)
        },
      },
    )
  }

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
    <div className='max-w-[752px] w-full flex flex-col items-center gap-[67px]'>
      <div className='flex flex-col items-center text-white'>
        <p className='text-[32px] font-bold font-sf-compact leading-[100%] tracking-[-0.25px] capitalize text-center'>
          {name}
        </p>
        <p className='font-sf-pro-display leading-[100%]'>{location}</p>
      </div>

      <div className='w-full flex flex-col gap-7'>
        {cartItems.map((item) => (
          <CartTicket
            key={item.cartId}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}

        <div className='flex flex-col gap-2'>
          <div
            className={cn(
              'max-w-[225px] w-full h-10 flex items-center gap-[5px] pl-2 rounded-[5px] border border-white',
              { 'border-[#FF9500]': !isValid, 'border-white': isValid },
            )}>
            <Badge color='#ffffff' fill='#ffffff' stroke='#ffffff' size={13} />
            <Input
              placeholder='ENTER PROMO CODE'
              className='border-none pl-none rounded-none uppercase text-xs font-input-mono text-white font-light placeholder:text-white'
              onChange={(e) => handleValidatePromocode(e.target.value)}
            />
          </div>

          {!isValid && (
            <p className='text-sm font-sf-pro-display leading-[100%] text-[#FF9500]'>{message}</p>
          )}
        </div>

        <div className='w-full flex items-center justify-between'>
          <p className='font-sf-pro-display text-xl text-white leading-[100%]'>TOTAL:</p>
          <p className='text-white font-sf-pro-text leading-[100%]'>{formatNaira(totalPrice)}</p>
        </div>

        {isFanAccount && (
          <Button
            onClick={handleCheckout}
            className='w-[140px] h-8 rounded-[6px] bg-deep-red uppercase text-sm font-sf-pro-display leading-[100%]'>
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
        <p className='font-sf-pro-display uppercase leading-[100%]'>{name}</p>
        <div className='flex flex-col gap-0.5'>
          <p className='text-sm font-sf-pro-text leading-[100%]'>{formatNaira(price)}</p>
          <p className='text-xs font-sf-pro-display leading-[100%] text-[#ACACAC]'>
            +{formatNaira(1500)} fee
          </p>
        </div>
      </div>

      <div className='h-[60px] w-14 flex items-center justify-end gap-2'>
        <X color='#ffffff' size={9} />
        <p className='text-xl font-sf-pro-text leading-[100px]'>{quantity}</p>
      </div>
    </div>
  )
}

interface InitialTickets {
  name: string
  price: number
  quantity: number
}
