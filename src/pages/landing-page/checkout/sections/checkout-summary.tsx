import { X } from "lucide-react";
import { formatNaira } from "@/lib/format-price";
import { useCheckoutCart } from "@/hooks/use-cart";
import {
  useGetEventResaleListings,
  useGetEventTickets,
} from "@/hooks/use-event-mutations";
import {
  indexByCartKey,
  toPurchasableResaleListings,
  toPurchasableTickets,
} from "@/lib/purchasable-tickets";
import { useAfroStore, useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import PromoCode, {
  type PromoDiscount,
} from "@/pages/landing-page/_component/promo-code";
import type {
  EventDetailData,
  PaginatedResponse,
  ResaleListingData,
  TicketData,
} from "@/types";
import {
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { useEffect, useMemo, useState } from "react";
import TotalAccordion from "@/pages/landing-page/_component/totalPrice-accordion";
import { InitializePaymentResponse } from "@/types/cart";

export default function CheckoutSummary({
  event,
  isFanAccount = false,
  eventId,
}: {
  event: EventDetailData;
  isFanAccount?: boolean;
  eventId?: string;
}) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const { items: localItems, promoCodeId } = useCartStore();
  const { data: ticketsResponse } = useGetEventTickets(eventId ?? "");
  const { data: resaleListingsResponse } = useGetEventResaleListings(
    eventId ?? "",
    isAuthenticated,
  );
  const [promoDiscount, setPromoDiscount] = useState<PromoDiscount | null>(
    null,
  );

  const purchasables = useMemo(
    () =>
      // Index all purchasable tickets(resale and primary) by cartKey (ticketId for primary, listingId for resale)
      indexByCartKey([
        // Convert normal tickets response to cart-ready rows
        ...toPurchasableTickets(
          ticketsResponse?.data as PaginatedResponse<TicketData> | undefined,
        ),
        // Convert resale listings response to cart-ready rows
        ...toPurchasableResaleListings(
          resaleListingsResponse?.data as
            | PaginatedResponse<ResaleListingData>
            | undefined,
        ),
      ]),
    [ticketsResponse, resaleListingsResponse],
  );

  const cartItems = localItems.map((item) => {
    const ticket = purchasables.get(item.cartKey);
    return {
      cartId: item.cartKey,
      ticketId: item.ticketId,
      eventId: eventId ?? "",
      name: ticket?.name ?? "Ticket",
      price: ticket?.price ?? 0,
      quantity: item.quantity,
      resale: ticket?.source === "resale",
    };
  });

  console.log("cartItems", cartItems);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const {mutate: checkoutMutation, isPending} = useCheckoutCart();

  function handleCheckout() {
    checkoutMutation(
      {
        promoCodeId: promoCodeId || "",
        callbackUrl: `${window.location.origin}/fans/payment-confirmation`,
      },
      {
        onSuccess: (data: InitializePaymentResponse) => {
          const response = data as InitializePaymentResponse;
          window.location.href = response.data.authorizationUrl;
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
    <div className="max-w-3xl w-full flex flex-col overflow-auto gap-5 md:gap-10 pb-6">
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

          <div className="md:hidden w-[200px] h-[300px]  ">
            <RenderEventImage
              image={event.eventDetails.desktopMedia?.flyer}
              event_name={event.eventName}
              className="!w-full !h-full object-cover"
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
            resale={item.resale}
          />
        ))}

        <PromoCode
          cartItems={cartItems}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
          onApply={setPromoDiscount}
        />

        <TotalAccordion totalPrice={totalPrice} discount={promoDiscount} />

        {isFanAccount && (
          <Button
            onClick={handleCheckout}
            className="bg-white uppercase font-sf-pro-display text-black hover:bg-white/90"
          >
           {isPending ? "Processing..." : "CHECKOUT"}
          </Button>
        )}
      </div>
    </div>
  );
}

function CartTicket({ name, price, quantity, resale }: InitialTickets) {
  return (
    <div className="w-full flex border rounded-lg bg-white text-black py-1 md:px-4 px-3 items-center justify-between">
      <div className="flex flex-col gap-1 ">
        <p className="font-sf-pro-display uppercase md:text-base leading-[100%]">
          {name}
        </p>
        {resale && (
          <span className="text-xs uppercase tracking-wide text-black/50">
            resale
          </span>
        )}
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
  resale?: boolean;
}
