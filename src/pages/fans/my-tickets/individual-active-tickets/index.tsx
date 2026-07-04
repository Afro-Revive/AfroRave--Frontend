import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetEvent } from "@/hooks/use-event-mutations";
import { useGetEventTickets } from "@/hooks/use-event-mutations";
import { EventDetailData, PaginatedResponse, TicketData, UserTicketData } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { LoadingFallback } from "@/components/loading-fallback";
import {
  daysUntilEvent,
  formatEventDate,
  formatShortDate,
  formatTimeLong,
  formatTimezone,
} from "@/lib/helper-func";
import { useUserActiveTickets } from "@/hooks/use-profile-mutations";

export default function IndividualActiveTicketsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading } = useGetEvent(eventId!);
  const { data: tickets } = useGetEventTickets(eventId!);
  const {data: activeTickets} = useUserActiveTickets()
  const eventData = event?.data as EventDetailData | undefined;
  const ticketData = tickets?.data as PaginatedResponse<TicketData> | undefined;
  const activeTicketData = activeTickets?.data as PaginatedResponse<UserTicketData> | undefined;
  const purchaseHistory = activeTicketData?.items.find(ticket => ticket.eventId === eventId)?.purchaseHistory || [];

  const isEventMultiDay =
    eventData?.eventDate.startDate !== eventData?.eventDate.endDate;
  const eventDate = isEventMultiDay
    ? `${formatEventDate(eventData?.eventDate.startDate ?? "")} - ${formatEventDate(
        eventData?.eventDate.endDate ?? "",
      )}`
    : formatEventDate(eventData?.eventDate.startDate ?? "");

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
              src={eventData?.eventDetails.desktopMedia?.flyer}
              alt={eventData?.eventName}
              className="w-[200px] h-[256px] rounded-[10px]"
            />

            <span className="absolute w-6 h-[18px] top-1.5 right-1 bg-medium-gray/80 font-sf-pro-rounded text-[10px] text-center rounded-[10px]">
              {/* 3 */}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 py-3 px-1">
              <p className="uppercase text-xl font-sf-pro-display font-bold">
                {eventData?.eventName}
              </p>
              <p className="text-sm font-sf-pro-display">{eventData?.venue}</p>
              <p className="text-sm font-sf-pro-display">
                {eventDate} at {""}
                {formatTimeLong(eventData?.eventDate.startTime ?? "")} (
                {formatTimezone(eventData?.eventDate.timezone ?? "")})
              </p>
            </div>

            <p className="py-2 px-3 flex items-center gap-1 bg-mid-dark-gray/50 rounded-[10px] max-w-[132px] w-fit h-8 text-xs font-medium font-sf-pro-display">
              <Clock size={12} />
              Starts in {daysUntilEvent(
                eventData?.eventDate?.startDate ?? "",
              )}{" "}
              Days
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-10">
          <p className="uppercase font-sf-pro-display font-medium py-1">
            Your Orders
          </p>

          <div className="flex flex-wrap gap-3">
            {purchaseHistory.map((item, index) => (
              <OrderCards
                key={item.orderId}
                orderDate={formatShortDate(item.purchaseDate)}
                orderTime={formatTimeLong(item.purchaseDate)}
                quantity={item.quantity}
                index={index}
                orderId={item.orderId || "N/A"}
              />
            ))}
          </div>
        </div>

        <OtherActions />
        <p className="font-sf-pro-display text-sm md:text-base mb-4" >Tickets</p>
        <div className="flex flex-wrap gap-3">
          {ticketData?.items.map((item) => (
            <div
              key={item.ticketId}
              className="w-full md:w-[200px] h-16 rounded-[10px] p-3 bg-secondary-white flex items-center justify-between"
            >
              <p className="text-sm font-sf-pro-display capitalize text-black">
                {item.ticketName}
              </p>
              <EllipsisVertical color="#000000" size={11} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderCards({ orderDate, orderTime, quantity, index, orderId }: { orderDate: string; orderTime: string; quantity: number; index: number; orderId: string }) {
  return (
    <div
      className={cn(
        "relative w-full md:w-[196px] h-[120px] flex flex-col gap-1 py-5 px-3 rounded-[10px] border-white",
        { "bg-white": index === 0, "bg-transparent border": index !== 0 },
      )}
    >
      <span
        className={cn(
          "absolute w-[21px] h-4 top-5 right-3 font-sf-pro-rounded text-[10px] text-center rounded-full",
          { "bg-[#DEDDDD] text-black": index === 0 },
        )}
      >
        {quantity}
      </span>

      <div
        className={cn(
          "flex flex-col gap-0.5 font-sf-pro-rounded font-semibold",
          {
            "text-black": index === 0,
            "text-white": index !== 0,
          },
        )}
      >
        <p className="text-xs">{orderDate}</p>
        <p className="text-[10px] text-soft-gray">{orderTime}</p>
      </div>

      <p className="w-[53px] text-[8px] flex flex-col font-sf-pro-rounded text-soft-gray font-bold text-xs">
        Order ID: {orderId}
      </p>

      <Link
        to="/"
        className={cn("font-sf-pro-display text-[10px] underline", {
          "text-black": index === 0,
          "text-white": index !== 0,
        })}
      >
        View Order
      </Link>
    </div>
  );
}

function OtherActions() {
  return (
    <div className="flex flex-wrap gap-3 font-sf-pro-rounded mb-10 ">
      {actions.map((item) => (
        <Link
          key={item.name}
          to="#"
          className="w-[172px] h-18 flex flex-col justify-between gap-1 p-2 bg-medium-gray rounded-[10px]"
        >
          <img src={item.icon} alt={item.name} className="size-3" />
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-xs">{item.name}</p>
            <p className="text-[10px]">{item.description}</p>
          </div>
        </Link>
      ))}
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
