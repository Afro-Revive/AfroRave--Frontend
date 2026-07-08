import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvent } from "@/hooks/use-event-mutations";
import {
  EventDetailData,
  PaginatedResponse,
  UserTicketData,
  UserTicketTicketDetails,
} from "@/types";
import { cn } from "@/lib/utils";
import { LoadingFallback } from "@/components/loading-fallback";
import {
  daysUntilEvent,
  formatEventDate,
  formatShortDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { useUserActiveTickets } from "@/hooks/use-profile-mutations";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderDetailsModal from "../components/order-details-modal";
import TicketResaleModal from "@/pages/fans/tickets-resale/modals/ticket-resale";

type EnrichedPurchase = {
  orderId: string;
  purchaseDate: string;
  quantity: number;
  ticketName: string;
  ticketId: string;
};

export default function IndividualActiveTicketsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);
  const [resaleOpen, setResaleOpen] = useState(false);

  const { data: eventResponse, isLoading: isLoadingEvent } = useGetEvent(
    eventId!,
  );
  const { data: activeTicketResponse, isLoading: isLoadingTickets } =
    useUserActiveTickets();

  const eventDetails = eventResponse?.data as EventDetailData | undefined;
  const activeTickets =
    (activeTicketResponse?.data as unknown as PaginatedResponse<UserTicketData>)
      ?.items ?? [];
  const activeEvent = activeTickets.find((t) => t.eventId === eventId);
  const ticketDetails: UserTicketTicketDetails[] =
    activeEvent?.ticketDetails ?? [];

  const allPurchaseHistory: EnrichedPurchase[] = ticketDetails.flatMap((t) =>
    t.purchaseHistory.map((ph) => ({
      ...ph,
      ticketName: t.ticketName,
      ticketId: t.ticketId,
    })),
  );

  const selectedOrder = allPurchaseHistory.find(
    (ph) => ph.orderId === selectedOrderId,
  );

  const isLoading = isLoadingEvent || isLoadingTickets;

  const eventStartDate = activeEvent?.eventStartDate ?? "";
  const eventEndDate = activeEvent?.eventEndDate ?? "";
  const isEventMultiDay = eventStartDate !== eventEndDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(eventStartDate)} - ${formatEventDate(eventEndDate)}`
    : formatEventDate(eventStartDate);

  if (!eventId) return null;

  if (isLoading) {
    return <LoadingFallback className="mb-[160px] h-[250px]" />;
  }

  return (
    <section className="w-full flex flex-col items-center justify-center gap-[42px] mt-10 ">
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
              src={activeEvent?.desktopMedia?.flyer}
              alt={activeEvent?.eventName}
              className="w-[200px] h-[256px] rounded-[10px]"
            />
            <span className="absolute w-6 h-[18px] top-1.5 right-1 bg-medium-gray/80 font-sf-pro-rounded text-[10px] text-center rounded-[10px]">
              {allPurchaseHistory.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 py-3 px-1">
              <p className="uppercase text-xl font-sf-pro-display font-bold">
                {activeEvent?.eventName}
              </p>
              <p className="text-sm font-sf-pro-display">
                {activeEvent?.eventVenue}
              </p>
              <p className="text-sm font-sf-pro-display">
                {eventDate} at{" "}
                {formatTimeLong(eventDetails?.eventDate?.startTime ?? "")} (
                {formatTimezone(eventDetails?.eventDate?.timezone ?? "")})
              </p>
            </div>

            <p className="py-2 px-3 flex items-center gap-1 bg-mid-dark-gray/50 rounded-[10px] max-w-[132px] w-fit h-8 text-xs font-medium font-sf-pro-display">
              <Clock size={12} />
              Starts in {daysUntilEvent(eventStartDate)} Days
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <p className="uppercase font-sf-pro-display font-medium py-1">
            Your Orders
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allPurchaseHistory.map((item, index) => (
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

        <OtherActions onSell={() => setResaleOpen(true)} />

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
                  {Array.from({ length: selectedOrder.quantity }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="w-fit rounded-md py-4 px-10 bg-secondary-white flex items-center text-left"
                      >
                        <p className="text-sm font-sf-pro-display capitalize text-black">
                          {selectedOrder.ticketName}
                        </p>
                      </div>
                    ),
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
      </div>
    </section>
  );
}

function OrderCard({
  orderDate,
  orderTime,
  quantity,
  orderId,
  isSelected,
  onClick,
  onViewOrder,
}: {
  orderDate: string;
  orderTime: string;
  quantity: number;
  index: number;
  orderId: string;
  isSelected: boolean;
  onClick: () => void;
  onViewOrder: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full md:w-[196px] h-[120px] flex flex-col gap-1 py-5 px-3 rounded-[10px] border-white text-left transition-all",
        {
          "bg-white": isSelected,
          "bg-transparent border": !isSelected,
        },
      )}
    >
      <span
        className={cn(
          "absolute w-[21px] h-4 top-5 right-3 font-sf-pro-rounded text-[10px] text-center rounded-full",
          { "bg-[#DEDDDD] text-black": isSelected },
        )}
      >
        {quantity}
      </span>

      <div
        className={cn(
          "flex flex-col gap-0.5 font-sf-pro-rounded font-semibold",
          {
            "text-black": isSelected,
            "text-white": !isSelected,
          },
        )}
      >
        <p className="text-xs">{orderDate}</p>
        <p className="text-[10px] text-soft-gray">{orderTime}</p>
      </div>

      <p className="text-[8px] font-sf-pro-rounded font-bold text-xs text-soft-gray">
        Order ID: {orderId}
      </p>

      <button
        type="button"
        className={cn("font-sf-pro-display text-left text-[10px] underline", {
          "text-black": isSelected,
          "text-white": !isSelected,
        })}
        onClick={(e) => {
          e.stopPropagation();
          onViewOrder();
        }}
      >
        View Order
      </button>
    </button>
  );
}

function OtherActions({ onSell }: { onSell: () => void }) {
  return (
    <div className="flex flex-wrap gap-3 font-sf-pro-rounded mb-10 ">
      {actions.map((item) => {
        const isSell = item.name === "SELL";
        const className =
          "w-[172px] h-18 flex flex-col justify-between gap-1 p-2 bg-medium-gray rounded-[10px] text-left";
        const inner = (
          <>
            <img src={item.icon} alt={item.name} className="size-3" />
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-xs">{item.name}</p>
              <p className="text-[10px]">{item.description}</p>
            </div>
          </>
        );
        return isSell ? (
          <button
            key={item.name}
            type="button"
            onClick={onSell}
            className={className}
          >
            {inner}
          </button>
        ) : (
          <Link key={item.name} to="#" className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

const actions = [
  {
    icon: "/assets/dashboard/sell.png",
    name: "SELL",
    description: "Sell tickets at your own price",
  },
  {
    icon: "/assets/dashboard/transfer.png",
    name: "TRANSFER",
    description: "Send tickets and items to anyone",
  },
  {
    icon: "/assets/dashboard/upgrade.png",
    name: "UPGRADE",
    description: "View available upgrade offers",
  },
];
