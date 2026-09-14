import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
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
  formatEventDate,
  formatShortDate,
  formatTimeLong,
  formatTimezone,
  getEventSocialLinks,
  toAbsoluteUrl,
  type EventSocials as EventSocialsData,
  type EventSocialPlatform,
} from "@/lib/helper-func";
import { BiGroup } from "react-icons/bi";
import {
  useUserActiveTickets,
  useUserPastTickets,
} from "@/hooks/use-profile-mutations";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderDetailsModal from "../components/order-details-modal";
import TicketResaleModal from "@/pages/fans/my-tickets/tickets-resale/modals/ticket-resale";
import TicketTransferModal from "@/pages/fans/my-tickets/tickets-transfer";
import { Socials, type ISocials } from "@/layouts/components/socials";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter, FaTiktok, FaFacebookF } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { BsInfoCircle } from "react-icons/bs";

type OrderLineItem = {
  ticketId: string;
  ticketName: string;
  quantity: number;
  groupSize?: number;
};

type EnrichedOrder = {
  orderId: string;
  purchaseDate: string;
  quantity: number;
  items: OrderLineItem[];
};

/**
 * Group size worth showing. Falls back to the size alone when the API omits
 * ticketType, and ignores a size of 1 since that admits one person like any other.
 */
function groupSizeOf(ticket: UserTicketTicketDetails): number | undefined {
  const size = ticket.groupSize ?? 0;
  const isGroup = ticket.ticketType === "Group" || size > 1;
  return isGroup && size > 1 ? size : undefined;
}

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
        groupSize: groupSizeOf(ticket),
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
    <section className="w-full flex flex-col items-center justify-center md:gap-[10px] md:mt-10 mt-4 ">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className=" md:ml-[50px] self-start w-fit h-auto p-2 hover:bg-white/10"
      >
        <ChevronLeft color="#ffffff" className="size-10" />
      </Button>

      <div className="container px-5 md:px-[60px] flex flex-col">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-x-10 md:gap-y-6 mb-10">
          {/* Event card — same treatment as the fans event card, scaled up. */}
          <div className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 aspect-[5/7] w-full max-w-[360px] md:w-[300px] lg:w-[360px] shrink-0 md:col-start-1 md:row-start-1">
            <img
              src={ticketEvent?.desktopMedia?.flyer}
              alt={ticketEvent?.eventName}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent" />

            <div className="absolute inset-x-0 bottom-[10%] flex flex-col gap-2 p-5">
              <p className="font-inter-tight text-xl md:text-2xl font-black text-white capitalize leading-tight">
                {ticketEvent?.eventName}
              </p>
              <p className="font-inter-tight text-sm text-white/85 leading-snug">
                {ticketEvent?.eventVenue}
              </p>
              <p className="font-inter-tight text-sm text-white/85 leading-snug">
                {eventDate} at{" "}
                {formatTimeLong(eventDetails?.eventDate?.startTime ?? "")} (
                {formatTimezone(eventDetails?.eventDate?.timezone ?? "")})
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full min-w-0 md:col-start-2 md:row-start-1 md:row-span-2">
            <div className="flex flex-col gap-3 mb-10">
              <p className="font-inter-tight font-bold py-1 md:text-xl text-lg">
                Your Orders
              </p>
              <p className="font-inter-tight font-light text-sm">
                View and manage all the tickets you've purchased.
              </p>
              <div className="flex flex-wrap gap-3">
                {orders.map((item, index) => (
                  <OrderCard
                    key={item.orderId}
                    orderDate={formatShortDate(item.purchaseDate)}
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
                    <p className="md:text-xl text-base font-inter-tight text-white tracking-wider">
                      Tickets
                    </p>
                    <p className="md:text-sm text-xs font-inter-tight font-light capitalize text-white tracking-wider">
                      all tickets in your order.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {selectedOrder.items.flatMap((line) =>
                        Array.from({ length: line.quantity }).map((_, i) => (
                          <div
                            key={`${line.ticketId}-${i}`}
                            className="w-fit min-w-[220px] rounded-md py-4 px-3 bg-secondary-white flex items-center text-left"
                          >
                            <div className="w-full flex flex-row items-center justify-between gap-4 text-black">
                              <div className="flex items-center gap-2 min-w-0">
                                {line.groupSize ? (
                                  <span
                                    title={`Admits ${line.groupSize} people`}
                                    className="flex items-center gap-1 shrink-0 rounded-full text-green px-2 py-0.5 font-inter-tight text-xs font-bold"
                                  >
                                    <BiGroup className="w-5 h-5" />
                                    {line.groupSize}
                                  </span>
                                ) : null}

                                <p className="text-sm font-inter-tight font-bold capitalize truncate">
                                  {line.ticketName}
                                </p>
                              </div>

                              <BsInfoCircle className="w-4 h-4 shrink-0" />
                            </div>
                          </div>
                        )),
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* order-last on mobile; back under the card at md via explicit grid placement. */}
          <div className="order-last md:order-none md:col-start-1 md:row-start-2 flex flex-col gap-4 md:py-4 py-2 md:px-10">
            <p className="font-inter-tight font-bold md:text-xl text-lg">
              Contact event Organizers
            </p>

            <EventSocials
              socials={eventDetails?.eventDetails?.socials}
              contact={eventDetails?.eventDetails?.eventContact}
            />
            <p className="max-w-xs w-fit font-inter-tight text-xs font-bold">
              Your event QR Code is only available in the Afrorevive app.
              Download the app to view your QR code and scan it for check-in
            </p>
          </div>
        </div>

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

type EventContactData = EventDetailData["eventDetails"]["eventContact"];

const SOCIAL_ICONS: Record<EventSocialPlatform, IconType> = {
  instagram: IoLogoInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
};

function EventSocials({
  socials,
  contact,
}: {
  socials?: Partial<EventSocialsData>;
  contact?: EventContactData;
}) {
  const links: ISocials[] = getEventSocialLinks(socials).map(
    ({ platform, alt, url }) => {
      const Icon = SOCIAL_ICONS[platform];
      return { href: url, alt, icon: <Icon className="w-6 h-6" /> };
    },
  );

  const website = contact?.website?.trim();
  const email = contact?.email?.trim();

  // Icons when the organizer shared socials, otherwise fall back to whatever
  // contact detail they did give.
  return links.length > 0 ? (
    <Socials data={links} className="w-fit justify-start gap-3" />
  ) : website ? (
    <a
      href={toAbsoluteUrl(website, "https://")}
      target="_blank"
      rel="noopener noreferrer"
      className="font-inter-tight text-sm text-white/85 underline w-fit hover:text-white"
    >
      {website}
    </a>
  ) : email ? (
    <a
      href={`mailto:${email}`}
      className="font-inter-tight text-sm text-white/85 underline w-fit hover:text-white"
    >
      {email}
    </a>
  ) : (
    <p className="font-inter-tight text-sm text-white/60">
      This organizer hasn't shared any contact details.
    </p>
  );
}

export interface otherActionProps {
  onSell: () => void;
  onTransfer: () => void;
  onUpgrade: () => void;
  disabled?: boolean;
}

function OtherActions({
  onSell,
  onTransfer,
  disabled = false,
}: otherActionProps) {
  const actions = [
    {
      icon: "/assets/resell/ticket-icon.svg",
      name: "Resell",
      description: "Sell tickets at your own price",
      action: onSell,
    },
    {
      icon: "/assets/resell/transfer_icon.svg",
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
    <div className="flex md:flex-wrap gap-3 font-sf-pro-rounded mb-10">
      {actions.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={item.action}
          disabled={disabled}
          title={disabled ? "This event has already ended" : undefined}
          className={cn(
            "w-fit h-fit flex flex-col justify-between gap-1 p-2 bg-tech-blue rounded-[10px] text-left",
            disabled && "opacity-40 cursor-not-allowed",
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold font-inter-tight text-sm">{item.name}</p>
              <img src={item.icon} alt={item.name} className="md:size-6 size-4" />
            </div>
            <p className="font-inter-tight font-bold text-xs">
              {item.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
