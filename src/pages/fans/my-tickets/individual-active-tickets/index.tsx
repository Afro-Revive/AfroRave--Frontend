import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Clock } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvent } from "@/hooks/use-event-mutations";
import {
  EventDetailData,
  PaginatedResponse,
  UserTicketData,
  UserTicketTicketDetails,
} from "@/types";
import OrderCard from "../components/order-card";
import { LoadingFallback } from "@/components/loading-fallback";
import {
  daysUntilEvent,
  formatEventDate,
  formatShortDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import {
  useUserActiveTickets,
  useUserPastTickets,
} from "@/hooks/use-profile-mutations";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderDetailsModal from "../components/order-details-modal";
import TicketResaleModal from "@/pages/fans/my-tickets/tickets-resale/modals/ticket-resale";
import TicketTransferModal from "@/pages/fans/my-tickets/tickets-transfer";

type OrderLineItem = {
  ticketId: string;
  ticketName: string;
  quantity: number;
};

type EnrichedOrder = {
  orderId: string;
  purchaseDate: string;
  quantity: number;
  items: OrderLineItem[];
};

export default function IndividualActiveTicketsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);
  const [resaleOpen, setResaleOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const { data: eventResponse, isLoading: isLoadingEvent } = useGetEvent(
    eventId!,
  );
  const { data: activeTicketResponse, isLoading: isLoadingActiveTickets } =
    useUserActiveTickets();
  const { data: pastTicketResponse, isLoading: isLoadingPastTickets } =
    useUserPastTickets();

  const eventDetails = eventResponse?.data as EventDetailData | undefined;
  const activeTickets =
    (activeTicketResponse?.data as unknown as PaginatedResponse<UserTicketData>)
      ?.items ?? [];
  const pastTickets =
    (pastTicketResponse?.data as unknown as PaginatedResponse<UserTicketData>)
      ?.items ?? [];

  const activeEvent = activeTickets.find((t) => t.eventId === eventId);
  const pastEvent = pastTickets.find((t) => t.eventId === eventId);
  // Fall back to the past ticket so ended events still render their details,
  // just with the ticket actions disabled.
  const ticketEvent = activeEvent ?? pastEvent;
  const isPastEvent = !activeEvent && !!pastEvent;

  const ticketDetails: UserTicketTicketDetails[] =
    ticketEvent?.ticketDetails ?? [];

    
const ordersById = new Map<string, EnrichedOrder>();
  for (const ticket of ticketDetails) {
    for (const ph of ticket.purchaseHistory) {
      const lineItem: OrderLineItem = {
        ticketId: ticket.ticketId,
        ticketName: ticket.ticketName,
        quantity: ph.quantity,
      };

      const order = ordersById.get(ph.orderId);
      if (!order) {
        ordersById.set(ph.orderId, {
          orderId: ph.orderId,
          purchaseDate: ph.purchaseDate,
          quantity: ph.quantity,
          items: [lineItem],
        });
        continue;
      }

      // Guard against the same ticket type appearing twice in one order.
      if (order.items.some((i) => i.ticketId === lineItem.ticketId)) continue;

      order.items.push(lineItem);
      order.quantity += lineItem.quantity;
    }
  }
  const orders = [...ordersById.values()];

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  const isLoading =
    isLoadingEvent || isLoadingActiveTickets || isLoadingPastTickets;

  const eventStartDate = ticketEvent?.eventStartDate ?? "";
  const eventEndDate = ticketEvent?.eventEndDate ?? "";
  const isEventMultiDay = eventStartDate !== eventEndDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(eventStartDate)} - ${formatEventDate(eventEndDate)}`
    : formatEventDate(eventStartDate);

  if (!eventId) return null;

  if (isLoading) {
    return <LoadingFallback className="mb-[160px] h-[250px]" />;
  }

  return (
    <section className="w-full flex flex-col items-center justify-center gap-[42px] md:mt-10 mt-4 ">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="ml-5 md:ml-[50px] self-start w-fit hover:bg-white/10"
      >
        <ChevronLeft color="#ffffff" className="w-[14px] h-[30px]" />
      </Button>

      <div className="container px-5 md:px-[60px] flex flex-col ">
        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="w-fit h-fit relative">
            <img
              src={ticketEvent?.desktopMedia?.flyer}
              alt={ticketEvent?.eventName}
              className="w-[200px] h-[256px] rounded-[10px]"
            />
            <span className="absolute w-6 h-[18px] top-1.5 right-1 bg-medium-gray/80 font-sf-pro-rounded text-[10px] text-center rounded-[10px]">
              {orders.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 py-3 px-1">
              <p className="uppercase text-xl font-sf-pro-display font-bold">
                {ticketEvent?.eventName}
              </p>
              <p className="text-sm font-sf-pro-display">
                {ticketEvent?.eventVenue}
              </p>
              <p className="text-sm font-sf-pro-display">
                {eventDate} at{" "}
                {formatTimeLong(eventDetails?.eventDate?.startTime ?? "")} (
                {formatTimezone(eventDetails?.eventDate?.timezone ?? "")})
              </p>
            </div>

            <p className="py-2 px-3 flex items-center gap-1 bg-mid-dark-gray/50 rounded-[10px] w-fit h-8 text-xs font-medium font-sf-pro-display whitespace-nowrap">
              <Clock size={12} />
              {isPastEvent
                ? `Ended ${formatEventDate(eventEndDate || eventStartDate)}`
                : `Starts in ${daysUntilEvent(eventStartDate)} Days`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <p className="uppercase font-sf-pro-display font-medium py-1">
            Your Orders
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {orders.map((item, index) => (
              <OrderCard
                key={item.orderId}
                orderDate={formatShortDate(item.purchaseDate)}
                orderTime={formatTimeLong(item.purchaseDate)}
                quantity={item.quantity}
                index={index}
                orderId={item.orderId}
                isSelected={selectedOrderId === item.orderId}
                onClick={() =>
                  setSelectedOrderId((prev) =>
                    prev === item.orderId ? null : item.orderId,
                  )
                }
                onViewOrder={() => setReceiptOrderId(item.orderId)}
              />
            ))}
          </div>
        </div>

        <OtherActions
          onSell={() => setResaleOpen(true)}
          onTransfer={() => setTransferOpen(true)}
          onUpgrade={() => {}}
          disabled={isPastEvent}
        />

        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 pt-1">
                <p className="md:text-base text-sm uppercase font-sf-pro-display text-white tracking-wider">
                  Tickets
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedOrder.items.flatMap((line) =>
                    Array.from({ length: line.quantity }).map((_, i) => (
                      <div
                        key={`${line.ticketId}-${i}`}
                        className="w-fit rounded-md py-4 px-10 bg-secondary-white flex items-center text-left"
                      >
                        <p className="text-sm font-sf-pro-display capitalize text-black">
                          {line.ticketName}
                        </p>
                      </div>
                    )),
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <OrderDetailsModal
          isOpen={!!receiptOrderId}
          orderId={receiptOrderId ?? ""}
          onClose={() => setReceiptOrderId(null)}
        />

        <TicketResaleModal
          isOpen={resaleOpen}
          onClose={() => setResaleOpen(false)}
          eventId={eventId!}
          ticketDetails={ticketDetails}
        />

        <TicketTransferModal
          isOpen={transferOpen}
          onClose={() => setTransferOpen(false)}
          ticketDetails={ticketDetails}
        />
      </div>
    </section>
  );
}

export interface otherActionProps {
  onSell: () => void;
  onTransfer: () => void;
  onUpgrade: () => void;
  disabled?: boolean;
}

function OtherActions({ onSell, onTransfer, disabled = false }: otherActionProps) {
  const actions = [
    {
      icon: "/assets/dashboard/sell.png",
      name: "SELL",
      description: "Sell tickets at your own price",
      action: onSell,
    },
    {
      icon: "/assets/dashboard/transfer.png",
      name: "TRANSFER",
      description: "Send tickets and items to anyone",
      action: onTransfer,
    },
    // {
    //   icon: "/assets/dashboard/upgrade.png",
    //   name: "UPGRADE",
    //   description: "View available upgrade offers",
    //   action: onUpgrade,
    // },
  ];

  return (
    <div className="flex flex-wrap gap-3 font-sf-pro-rounded mb-10">
      {actions.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={item.action}
          disabled={disabled}
          title={disabled ? "This event has already ended" : undefined}
          className={cn(
            "w-[172px] h-18 flex flex-col justify-between gap-1 p-2 bg-medium-gray rounded-[10px] text-left",
            disabled && "opacity-40 cursor-not-allowed",
          )}
        >
          <img src={item.icon} alt={item.name} className="size-3" />
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-xs">{item.name}</p>
            <p className="text-[10px]">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
