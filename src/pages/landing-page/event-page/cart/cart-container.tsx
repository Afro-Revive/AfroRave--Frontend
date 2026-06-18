import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { formatNaira } from "@/lib/format-price";
import { useState } from "react";
import type { EventDetailData } from "@/types";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { useUpdateCartQuantity, useGetAllCart } from "@/hooks/use-cart";
import { useGetEventTickets } from "@/hooks/use-event-mutations";
import { useAfroStore, useCartStore } from "@/stores";
import {
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import type { CartData } from "@/types/cart";
import PromoCode from "@/pages/fans/account/components/promo-code";
import TotalAccordion from "@/pages/fans/account/components/totalPrice-accordion";


export default function CartContainer({ event, action }: CartContainerProps) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const localItems = useCartStore((state) => state.items);
  const { data: ticketsResponse } = useGetEventTickets(event.eventId);
  const { data: serverCart } = useGetAllCart();

  // If the user is authenticated, we use the cart data from the server. If not, we use the cart data from local storage. We also need to map the cart data to include the ticket name and price, which are not included in the cart data from local storage.
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
        // Find the ticket details from the tickets response using the ticketId from the cart item. This is necessary because the local cart items only have the ticketId and quantity, and we need to get the ticket name and price to display in the cart.
        const ticket = ticketsResponse?.data?.find(
          (t) => t.ticketId === item.ticketId,
        );
        return {
          cartId: String(item.ticketId),
          ticketId: item.ticketId,
          eventId: event.eventId,
          name: ticket?.ticketName ?? "Unknown Ticket",
          price: ticket?.price ?? 0,
          quantity: item.quantity,
        };
      });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="container flex flex-col md:justify-center md:flex-row z-10">
      <div className="w-full  md:w-1/2 flex flex-col gap-5 px-5 md:py-10 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex flex-col flex-1 gap-4 md:gap-0 md:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-2xl md:text-4xl uppercase leading-normal font-inter font-black">
                {event.eventName}
              </p>
              <p className="text-sm md:text-base font-sf-pro-display">
                {event.venue}
              </p>
              <p className="text-xs md:text-sm font-sf-pro-display">
                {formatEventDate(event.eventDate.startDate)} -{" "}
                {formatEventDate(event.eventDate.endDate)} at{" "}
                {formatTimeLong(event.eventDate.startTime)} (
                {formatTimezone(event.eventDate.timezone)})
              </p>
            </div>

            <div className="md:hidden w-fit ">
              <RenderEventImage
                image={event.eventDetails.desktopMedia?.flyer}
                event_name={event.eventName}
              />
            </div>

            <div>
              <p className="text-xl md:text-2xl uppercase leading-normal font-inter font-black">
                Order Summary
              </p>
              <p className="text-sm md:text-base font-sf-pro-display">
                Complete payment to secure your ticket!
              </p>
            </div>
          </div>

          <div className="hidden md:block w-[200px] shrink-0">
            <RenderEventImage
              image={event.eventDetails.desktopMedia?.flyer}
              event_name={event.eventName}
            />
          </div>
        </div>

        <ul className="w-full flex flex-col gap-2 ">
          {cartItems.map((item) => (
            <CartTicketCard
              key={item.cartId}
              id={item.ticketId}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </ul>
        <PromoCode
          cartItems={cartItems}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
        />
        <TotalAccordion totalPrice={totalPrice} />
         <Button onClick={action} className='bg-white font-sf-pro-display text-black hover:bg-white/90'>
          CONTINUE
        </Button>
       
      </div>
    </section>
  );
}

function CartTicketCard({ id, name, price, quantity }: ICartTicketCard) {
  return (
    <li className="list-disc bg-white border rounded-lg text-black md:py-4 py-3 md:px-6 px-3 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-base font-sf-pro-display">{name}</p>
        <div className="flex flex-col gap-1 font-sf-pro-display">
          <p className="text-sm">{formatNaira(price, { free: price === 0 })}</p>
        </div>
      </div>

      <TicketQuantityControl cartId={id} quantity={quantity} />
    </li>
  );
}

function TicketQuantityControl({
  quantity,
  cartId,
}: {
  quantity: number;
  cartId: string;
}) {
  const [ticketCount, setTicketCount] = useState<number>(quantity);

  const updateQuantityMutation = useUpdateCartQuantity();
  // const extendReservationMutation = useExtendReservation()

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate(
      { data: quantity, cartId: cartId },
      {
        onSuccess: () => {
          setTicketCount(quantity);
          // extendReservationMutation.mutate({ cartId: cartId })
        },
      },
    );
  }

  return (
    <div className="flex items-center border bg-[#34C759] rounded-4xl py-1">
      <Button
        variant="ghost"
        className="hover:bg-white/10"
        onClick={() => updateCart(ticketCount - 1)}
        disabled={ticketCount <= 0}
      >
        <Minus color="white" size={25} />
      </Button>

      <span className="font-sf-pro-rounded text-white text-sm">
        {ticketCount}
      </span>

      <Button
        variant="ghost"
        className="hover:bg-white/10"
        onClick={() => updateCart(ticketCount + 1)}
      >
        <Plus color="white" size={25} />
      </Button>
    </div>
  );
}

interface CartContainerProps {
  event: EventDetailData;
  action: () => void;
}

interface ICartTicketCard {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
