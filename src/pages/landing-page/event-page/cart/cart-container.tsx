import { Button } from "@/components/ui/button";
import { Plus, Minus, LoaderCircle, ShoppingCart, type LucideIcon } from "lucide-react";
import { formatNaira } from "@/lib/format-price";
import type { EventDetailData, PaginatedResponse, TicketData } from "@/types";
import { RenderEventImage } from "@/components/shared/render-event-flyer";
import { useCreateCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { useCartStore } from "@/stores";
import {
  formatEventDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { BlockName } from "../_components/block-name";

export default function CartContainer({
  event,
  action,
  isLoading = false,
  eventTickets,
}: CartContainerProps) {
  const localItems = useCartStore((state) => state.items);

  const totalPrice = localItems.reduce((sum, item) => {
    const ticket = eventTickets?.items.find((t) => t.ticketId === item.ticketId);
    return sum + (ticket?.price ?? 0) * item.quantity;
  }, 0);

  const totalTickets = localItems.reduce((sum, item) => sum + item.quantity, 0);

  const isEventMultiDay = event.eventDate.startDate !== event.eventDate.endDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(event.eventDate.startDate)} - ${formatEventDate(
        event.eventDate.endDate,
      )}`
    : formatEventDate(event.eventDate.startDate);

  return (
    <section className="container flex flex-col  md:flex-row z-10">
      <div className="w-full  flex flex-col gap-5 px-5 md:py-10 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
          <div className="hidden md:block w-[300px] h-[400px] shrink-0">
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

            <div className="md:hidden w-fit ">
              <RenderEventImage
                image={event.eventDetails.desktopMedia?.flyer}
                event_name={event.eventName}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-4">
          <BlockName name="tickets" />

          {/* <p className='font-sf-pro-display text-xl font-extrabold text-white/60'>SALE</p> */}
        </div>

        <ul className="w-full grid sm:grid-cols-2 gap-x-5 gap-y-7">
          {eventTickets?.items.map((ticket) => (
            <CartTicketCard
              key={ticket.ticketId}
              ticketId={ticket.ticketId}
              name={ticket.ticketName}
              price={ticket.price}
            />
          ))}
        </ul>

      </div>
    </section>
  );
}

function CartTicketCard({ ticketId, name, price }: ICartTicketCard) {
  const localItems = useCartStore((state) => state.items);
  const ticketCount =
    localItems.find((i) => i.ticketId === ticketId)?.quantity ?? 0;

  const createCartMutation = useCreateCart();
  const updateQuantityMutation = useUpdateCartQuantity();

  function createCart() {
    createCartMutation.mutate({ ticketId, quantity: 1 });
  }

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate({ data: quantity, cartId: ticketId });
  }

  return (
    <li className="flex items-center justify-between h-fit rounded-md bg-gunmetal-gray pl-5 pr-2 py-2.5 text-xl font-sf-pro-display text-white">
      <div className="flex flex-col gap-1 font-sf-pro-display font-normal">
        <p className="font-base">{name}</p>
        <p className="text-sm">{formatNaira(price, { free: price === 0 })}</p>
        <p className="text-xs text-[#ACACAC]">(includes fees)</p>
      </div>

      <div className="flex items-center gap-2 px-3 rounded-full h-12 bg-light-green">
        {ticketCount > 0 && (
          <>
            <TicketButton
              action={() => updateCart(ticketCount - 1)}
              Icon={Minus}
              isLoading={updateQuantityMutation.isPending}
            />

            <span className="font-sf-pro-rounded font-bold text-sm">
              {ticketCount}
            </span>
          </>
        )}

        <TicketButton
          action={() =>
            ticketCount > 0 ? updateCart(ticketCount + 1) : createCart()
          }
          Icon={Plus}
          isLoading={
            createCartMutation.isPending || updateQuantityMutation.isPending
          }
        />
      </div>
    </li>
  );
}

function TicketButton({ action, Icon, isLoading = false }: ITicketButton) {
  return (
    <Button
      disabled={isLoading}
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
  eventTickets: PaginatedResponse<TicketData> | undefined;
}

interface ICartTicketCard {
  ticketId: string;
  name: string;
  price: number;
}

interface ITicketButton {
  action: () => void;
  Icon: LucideIcon;
  isLoading?: boolean;
}
