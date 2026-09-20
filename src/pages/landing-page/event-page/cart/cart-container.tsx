import type { EventDetailData, PurchasableTicket } from "@/types";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { CartSummaryFloat } from "../individual-event/_components/cart-float";
import { useCartStore } from "@/stores";
import { isResaleOnlyCart } from "@/lib/purchasable-tickets";
import {
  formatDateLong,
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { TicketTab } from "../_components/ticket-tab";
import { TicketCard } from "../individual-event/sections/tickets";
import { useMemo, useState } from "react";
import { ShowMoreText } from "@/components/reusable/show-more-text";

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

  // Already scoped to this event — useGetEventResaleListings(event.eventId).
  const hasResale = resaleListings.length > 0;
  // Never leave the resale tab mounted once its listings are gone.
  const showResale = isSales && hasResale;

  // use memo to combine tickets and resaleListings into a single array for the CartSummaryFloat component
  const allTickets = useMemo(
    () => [...tickets, ...resaleListings],
    [tickets, resaleListings],
  );

  const isEventMultiDay = event.eventDate.startDate !== event.eventDate.endDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(event.eventDate.startDate)} - ${formatEventDate(
        event.eventDate.endDate,
      )}`
    : formatEventDate(event.eventDate.startDate);

  return (
    // Natural height — the modal body is the scroll container.
    <section className="w-full flex flex-col z-10">
      <div className="shrink-0 flex flex-col gap-1 border-b border-mid-dark-gray pb-4 w-full px-8 md:px-24">
        <p className="text-xl md:text-3xl uppercase leading-normal font-work-sans font-black">
          {event.eventName}
        </p>
        <p className="text-sm md:text-base font-inter-tight">{event.venue}</p>
        <p className="text-xs md:text-sm font-inter-tight">
          {eventDate} at {""}
          {formatTimeLong(event.eventDate.startTime)} (
          {formatTimezone(event.eventDate.timezone)})
        </p>
      </div>
      <div className="md:w-2/3 w-full flex flex-col gap-5 px-8 md:px-24 md:py-10 pb-36 md:pb-10">
        <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
          <div className=" md:w-[300px] md:h-[400px] w-[200px] h-[300px] mt-4 md:mt-0 shrink-0">
            <RenderEventImage
              image={event.eventDetails.desktopMedia?.flyer}
              event_name={event.eventName}
              className="!w-full !h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 gap-2 md:gap-0 ">
            <p className="font-inter-tight md:text-2xl text-lg font-bold md:mb-4">
              About Event
            </p>
            <div className="flex flex-col  gap-1">
              <p className="font-inter-tight text-lg font-bold uppercase">
                {event.eventName}
              </p>

              <p className="font-inter-tight text-sm md:text-base ">
                {formatDateLong(event.eventDate.startDate)} | {event.venue}
              </p>

              <p className="font-inter-tight text-sm md:text-base ">
                Doors open: {formatTimeLong(event.eventDate.startTime)} -{" "}
                {formatTimeLong(event.eventDate.endTime)}
              </p>
            </div>

            <div className="flex flex-col gap-1 font-inter-tight text-sm">
              <ShowMoreText
                text={event.description}
                limit={200}
                className="text-sm font-inter-tight"
              />
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

        {/* One card, like the event detail page: the container owns the surface
            and rounding, divide-y draws the separators. */}
        <div className="w-full flex flex-col overflow-hidden rounded-md bg-gunmetal-gray divide-y divide-mid-dark-gray">
          {(showResale ? resaleListings : tickets).map((ticket) => (
            <TicketCard key={ticket.cartKey} ticket={ticket} />
          ))}
        </div>
      </div>

      <CartSummaryFloat
        tickets={allTickets}
        action={action}
        isLoading={isLoading}
      />
    </section>
  );
}

interface CartContainerProps {
  event: EventDetailData;
  action: () => void;
  isLoading?: boolean;
  tickets: PurchasableTicket[];
  resaleListings: PurchasableTicket[];
}
