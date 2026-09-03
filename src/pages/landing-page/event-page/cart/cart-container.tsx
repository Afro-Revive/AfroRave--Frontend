import { Button } from "@/components/ui/button";
import { Plus, Minus, LoaderCircle, type LucideIcon } from "lucide-react";
import { formatNaira } from "@/lib/format-price";
import type { EventDetailData, PurchasableTicket } from "@/types";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { useCreateCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { CartSummaryFloat } from "../individual-event/_components/cart-float";
import { useCartStore } from "@/stores";
import { isResaleOnlyCart } from "@/lib/purchasable-tickets";
import {
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { TicketTab } from "../_components/ticket-tab";
import { useMemo, useState } from "react";

export default function CartContainer({
  event,
  action,
  isLoading = false,
  tickets,
  resaleListings,
}: CartContainerProps) {
  // The cart mounts when opened, so this picks the tab matching what is in it.
  const [isSales, setIsSales] = useState(() =>
    isResaleOnlyCart(useCartStore.getState().items),
  );

  const eventResaleListings = resaleListings.filter(
    (listing) => listing.ticketId.startsWith(event.eventId),
  );
  const hasResale = eventResaleListings.length > 0;
  const showResale = isSales && hasResale;


  // use memo to combine tickets and resaleListings into a single array for the CartSummaryFloat component
  const allTickets = useMemo(
    () => [...tickets, ...eventResaleListings],
    [tickets, eventResaleListings],
  );

  const isEventMultiDay = event.eventDate.startDate !== event.eventDate.endDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(event.eventDate.startDate)} - ${formatEventDate(
        event.eventDate.endDate,
      )}`
    : formatEventDate(event.eventDate.startDate);

  return (
    <section className="container flex flex-col  md:flex-row z-10">
      <div className="w-full flex flex-col gap-5 px-5 md:py-10 pb-36 md:pb-10 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
          <div className=" md:w-[300px] md:h-[400px] w-[200px] h-[300px] shrink-0">
            <RenderEventImage
              image={event.eventDetails.desktopMedia?.flyer}
              event_name={event.eventName}
              className="!w-full !h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 gap-4 md:gap-0 md:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-2xl md:text-4xl uppercase leading-normal font-sf-compact font-black">
                {event.eventName}
              </p>
              <p className="text-sm md:text-base font-sf-pro-display">
                {event.venue}
              </p>
              <p className="text-xs md:text-sm font-sf-pro-display">
                {eventDate} at {""}
                {formatTimeLong(event.eventDate.startTime)} (
                {formatTimezone(event.eventDate.timezone)})
              </p>
              <p className="text-lg md:text-xl mt-8 mb-3 font-black font-sf-pro-display">
                DESCRIPTION
              </p>
              <p className="text-sm md:text-base max-w-2xl font-sf-pro-display">
                {event.description}
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-5 mt-4">
          <TicketTab
            name="tickets"
            isActive={!showResale}
            action={() => setIsSales(false)}
          />
          {hasResale && (
            <TicketTab
              name="resale"
              isActive={showResale}
              action={() => setIsSales(true)}
            />
          )}
        </div>

        <ul className="w-full grid sm:grid-cols-2 gap-x-5 gap-y-7">
          {(showResale ? resaleListings : tickets).map((ticket) => (
            <CartTicketCard key={ticket.cartKey} ticket={ticket} />
          ))}
        </ul>

      </div>

      <CartSummaryFloat
        tickets={allTickets}
        action={action}
        isLoading={isLoading}
      />
    </section>
  );
}

function CartTicketCard({ ticket }: ICartTicketCard) {
  const { cartKey, ticketId, listingId, name, price, caption, available, source } =
    ticket;
  const localItems = useCartStore((state) => state.items);
  const ticketCount =
    localItems.find((i) => i.cartKey === cartKey)?.quantity ?? 0;
  const isSoldOut = available <= 0;
  const atLimit = ticketCount >= available;

  const createCartMutation = useCreateCart();
  const updateQuantityMutation = useUpdateCartQuantity();

  function createCart() {
    createCartMutation.mutate({ cartKey, ticketId, listingId, quantity: 1 });
  }

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate({ data: quantity, cartKey });
  }

  return (
    <li className="flex items-center justify-between h-fit rounded-md bg-gunmetal-gray pl-5 pr-2 py-2.5 text-xl font-sf-pro-display text-white">
      <div className="flex flex-col gap-1 font-sf-pro-display font-normal">
        <p className="md:text-base text-sm capitalize">
          {name}
          {source === "resale" && (
            <span className="ml-2 text-[10px] uppercase tracking-wide text-white/50">
              resale
            </span>
          )}
        </p>
        <p className="md:text-sm text-xs">{formatNaira(price, { free: price === 0 })}</p>
        <p className="md:text-xs text-[10px] text-[#ACACAC]">{caption}</p>
      </div>

      <div className="flex items-center md:gap-2 px-1 md:px-3 rounded-full h-12 bg-light-green">
        {ticketCount > 0 && (
          <>
            <TicketButton
              action={() => updateCart(ticketCount - 1)}
              Icon={Minus}
              isLoading={updateQuantityMutation.isPending}
            />

            <span className="font-sf-pro-rounded font-bold md:text-sm text-xs">
              {ticketCount}
            </span>
          </>
        )}

        <TicketButton
          action={() =>
            ticketCount > 0 ? updateCart(ticketCount + 1) : createCart()
          }
          Icon={Plus}
          disabled={isSoldOut || atLimit}
          isLoading={
            createCartMutation.isPending || updateQuantityMutation.isPending
          }
        />
      </div>
    </li>
  );
}

function TicketButton({
  action,
  Icon,
  isLoading = false,
  disabled = false,
}: ITicketButton) {
  return (
    <Button
      disabled={isLoading || disabled}
      variant="ghost"
      className="p-1 w-fit h-fit hover:bg-black/10"
      onClick={action}
    >
      {isLoading ? (
        <LoaderCircle size={16} className="animate-spin" />
      ) : (
        <Icon size={16} />
      )}
    </Button>
  );
}


interface CartContainerProps {
  event: EventDetailData;
  action: () => void;
  isLoading?: boolean;
  tickets: PurchasableTicket[];
  resaleListings: PurchasableTicket[];
}

interface ICartTicketCard {
  ticket: PurchasableTicket;
}

interface ITicketButton {
  action: () => void;
  Icon: LucideIcon;
  isLoading?: boolean;
  disabled?: boolean;
}
