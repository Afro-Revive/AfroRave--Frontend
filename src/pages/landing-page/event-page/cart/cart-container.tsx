import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { formatNaira } from '@/lib/format-price'
import { useState } from 'react'
import type { EventDetailData } from '@/types'
import { RenderEventImage } from '@/components/shared/render-event-flyer'
import { useUpdateCartQuantity, useGetAllCart } from '@/hooks/use-cart'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { useAfroStore, useCartStore } from '@/stores'
import type { CartData } from '@/types/cart'

export default function CartContainer({ event }: CartContainerProps) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const localItems = useCartStore((state) => state.items)
  const { data: ticketsResponse } = useGetEventTickets(event.eventId)
  const { data: serverCart } = useGetAllCart()

// If the user is authenticated, we use the cart data from the server. If not, we use the cart data from local storage. We also need to map the cart data to include the ticket name and price, which are not included in the cart data from local storage.
  const cartItems = isAuthenticated
    ? ((serverCart?.data ?? []) as unknown as CartData[]).map((item) => ({
        id: String(item.cartId),
        name: item.ticketName,
        price: item.price,
        quantity: item.quantity,
      }))
    : localItems.map((item) => {
      // Find the ticket details from the tickets response using the ticketId from the cart item. This is necessary because the local cart items only have the ticketId and quantity, and we need to get the ticket name and price to display in the cart.
        const ticket = ticketsResponse?.data?.find((t) => t.ticketId === item.ticketId)
        return {
          id: item.ticketId,
          name: ticket?.ticketName ?? 'Unknown Ticket',
          price: ticket?.price ?? 0,
          quantity: item.quantity,
        }
      })

  return (
    <section className='container flex items-center justify-center gap-[192px] z-10 min-h-[calc(100vh-210px)]'>
      <RenderEventImage
        image={event.eventDetails.desktopMedia?.flyer}
        event_name={event.eventName}
      />

      <div className='max-w-[703px] w-1/2 flex flex-col gap-[67px] px-5 py-[71px]'>
        <div className='flex flex-col items-center gap-1'>
          <p className='text-5xl uppercase text-center leading-normal font-phosphate'>
            {event.eventName}
          </p>
          <p className='font-extralight text-2xl font-sf-pro-display text-center'>{event.venue}</p>
        </div>

        <ul className='flex flex-col gap-[72px]'>
          {cartItems.map((item) => (
            <CartTicketCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

function CartTicketCard({ id, name, price, quantity }: ICartTicketCard) {
  return (
    <li className='list-disc flex items-center justify-between'>
      <div className='flex flex-col gap-1'>
        <p className='text-2xl font-sf-pro-display'>{name}</p>
        <div className='flex flex-col gap-1 font-input-mono opacity-70'>
          <p>{formatNaira(price)}</p>
          <p className='text-[13px]'>{formatNaira(1350)} fee/ticket</p>
        </div>
      </div>

      <TicketQuantityControl cartId={id} quantity={quantity} />
    </li>
  )
}

function TicketQuantityControl({ quantity, cartId }: { quantity: number; cartId: string }) {
  const [ticketCount, setTicketCount] = useState<number>(quantity)

  const updateQuantityMutation = useUpdateCartQuantity()
  // const extendReservationMutation = useExtendReservation()

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate(
      { data: quantity, cartId: cartId },
      {
        onSuccess: () => {
          setTicketCount(quantity)
          // extendReservationMutation.mutate({ cartId: cartId })
        },
      },
    )
  }

  return (
    <div className='flex items-center gap-3.5'>
      <Button
        variant='ghost'
        className='hover:bg-white/10'
        onClick={() => updateCart(ticketCount - 1)}
        disabled={ticketCount <= 0}>
        <Minus color='var(--foreground)' size={15} />
      </Button>

      <span className='font-input-mono text-xl'>{ticketCount}</span>

      <Button
        variant='ghost'
        className='hover:bg-white/10'
        onClick={() => updateCart(ticketCount + 1)}>
        <Plus color='var(--foreground)' size={15} />
      </Button>
    </div>
  )
}

interface CartContainerProps {
  event: EventDetailData
}

interface ICartTicketCard {
  id: string
  name: string
  price: number
  quantity: number
}
