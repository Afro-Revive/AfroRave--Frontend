import { X } from "lucide-react";
import { formatNaira } from "@/lib/format-price";
import { useCheckoutCart, useClearCart } from "@/hooks/use-cart";
import { useGetEventTickets } from "@/hooks/use-event-mutations";
import { useAfroStore, useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import PromoCode from "@/pages/fans/account/components/promo-code";
import type { EventDetailData, PaginatedResponse, TicketData } from "@/types";
import {
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { useEffect, useState } from "react";
import TotalAccordion from "@/pages/fans/account/components/totalPrice-accordion";

export default function CartSummary({
  event,
  isFanAccount = false,
  eventId,
}: {
  event: EventDetailData;
  isFanAccount?: boolean;
  eventId?: string;
}) {
  const navigate = useNavigate();

  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const localItems = useCartStore((state) => state.items);
  const { data: ticketsResponse } = useGetEventTickets(eventId ?? "");

   const ticketInformation = ticketsResponse?.data as PaginatedResponse<TicketData> | undefined

  const cartItems = localItems.map((item) => {
    const ticket = ticketInformation?.items.find((t) => t.ticketId === item.ticketId);
    return {
      cartId: item.ticketId,
      ticketId: item.ticketId,
      eventId: eventId ?? "",
      name: ticket?.ticketName ?? "Ticket",
      price: ticket?.price ?? 0,
      quantity: item.quantity,
    };
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutMutation = useCheckoutCart();
  const clearCartMutation = useClearCart();

  function handleCheckout() {
    checkoutMutation.mutate(
      {
        data: {
          paymentMethod: "",
          promoCode: "",
          promoCodeId: "",
          transactionReference: "",
          paymentReference: "",
        },
      },
      {
        onSuccess: () => {
          clearCartMutation.mutate();
          navigate(getRoutePath("account"));
        },
      },
    );
  }
  function useCountdown(seconds: number) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
      if (remaining <= 0) return;
      const id = setInterval(() => setRemaining((s) => s - 1), 1000);
      return () => clearInterval(id);
    }, [remaining]);

    const m = String(Math.floor(remaining / 60)).padStart(2, "0");
    const s = String(remaining % 60).padStart(2, "0");
    return { display: `${m}:${s}`, expired: remaining <= 0 };
  }
  // Countdown timer for 15 minutes
  const { display, expired } = useCountdown(15 * 60);

  return (
    <div className="max-w-3xl w-full flex flex-col gap-5 md:gap-10">
      {isAuthenticated && (
        <p className="text-xs text-center font-input-mono text-white">
          {expired
            ? "Your session has expired"
            : `Please checkout within ${display} minutes`}
        </p>
      )}
      <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
        <div className="flex flex-col flex-1 gap-4 md:gap-0 md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xl md:text-3xl uppercase leading-normal font-inter font-black">
              {event.eventName}
            </p>
            <p className="text-xs md:text-sm font-sf-pro-display">
              {event.venue}
            </p>
            <p className="text-xs md:text-sm font-sf-pro-display">
              {formatEventDate(event.eventDate.startDate)} -{" "}
              {formatEventDate(event.eventDate.endDate)} at{" "}
              {formatTimeLong(event.eventDate.startTime)} (
              {formatTimezone(event.eventDate.timezone)})
            </p>
          </div>

          <div className="md:hidden">
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

      <div className="w-full flex gap-4 flex-col ">
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

        <TotalAccordion totalPrice={totalPrice} />

        {isFanAccount && (
          <Button
            onClick={handleCheckout}
            className="bg-white font-sf-pro-display text-black hover:bg-white/90"
          >
            CHECKOUT
          </Button>
        )}
      </div>
    </div>
  );
}

function CartTicket({ name, price, quantity }: InitialTickets) {
  return (
    <div className="w-full flex border rounded-lg bg-white text-black py-1 md:px-4 px-3 items-center justify-between">
      <div className="flex flex-col gap-1 ">
        <p className="font-sf-pro-display uppercase md:text-base leading-[100%]">
          {name}
        </p>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs md:text-sm font-sf-pro-display leading-[100%]">
            {formatNaira(price, { free: price === 0 })}
          </p>
        </div>
      </div>

      <div className="h-[60px] w-14 flex items-center justify-end gap-2">
        <X color="black" size={16} />
        <p className="text-base md:text-xl font-sf-pro-text leading-[100px]">
          {quantity}
        </p>
      </div>
    </div>
  );
}

interface InitialTickets {
  name: string;
  price: number;
  quantity: number;
}
