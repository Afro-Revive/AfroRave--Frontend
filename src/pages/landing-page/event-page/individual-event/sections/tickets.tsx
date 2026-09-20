import { TicketTab } from "../../_components/ticket-tab";
import { formatNaira } from "@/lib/format-price";
import { type LucideIcon, Plus, Minus, LoaderCircle } from "lucide-react";
import { BiGroup } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/reusable/base-modal";
import { useState } from "react";
import {
  useGetEventTickets,
  useGetEventResaleListings,
} from "@/hooks/use-event-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCart, useUpdateCartQuantity } from "@/hooks/use-cart";

import { useAfroStore, useCartStore } from "@/stores";
import type {
  PaginatedResponse,
  PurchasableTicket,
  ResaleListingData,
  TicketData,
} from "@/types";
import {
  isResaleOnlyCart,
  toPurchasableResaleListings,
  toPurchasableTickets,
} from "@/lib/purchasable-tickets";

export default function TicketSection({ eventId }: ITicketProps) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const [isSales, setIsSales] = useState(() =>
    isResaleOnlyCart(useCartStore.getState().items),
  );
  const { data: ticketResponse, isPending: isLoading } =
    useGetEventTickets(eventId);
  const { data: resaleListingsResponse, isPending: isResaleListingsLoading } =
    useGetEventResaleListings(eventId, isAuthenticated);

  const tickets = toPurchasableTickets(
    ticketResponse?.data as PaginatedResponse<TicketData> | undefined,
  );

  const resaleListings = toPurchasableResaleListings(
    resaleListingsResponse?.data as
      | PaginatedResponse<ResaleListingData>
      | undefined,
  );

  const hasResale = resaleListings.length > 0;

  // Never leave the resale tab mounted once its listings are gone.
  const showResale = isSales && hasResale;
  const isTabLoading = showResale ? isResaleListingsLoading : isLoading;

  return (
    <div className="w-full min-w-0 flex flex-col gap-7">
      <div className="flex items-center gap-5">
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

      {isTabLoading ? (
        <TicketCardSkeleton />
      ) : (
        // One card: the container owns the surface and rounding, divide-y draws
        // the separators so the last row has no trailing border.
        <div className="w-full flex flex-col overflow-hidden rounded-md bg-gunmetal-gray divide-y divide-mid-dark-gray">
          {(showResale ? resaleListings : tickets).map((ticket) => (
            <TicketCard key={ticket.cartKey} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Also used by the cart so both surfaces stay identical. */
export function TicketCard({ ticket }: ITicketCard) {
  const {
    cartKey,
    ticketId,
    listingId,
    name,
    price,
    caption,
    available,
    purchaseLimit,
    groupSize,
    description,
  } = ticket;
  const [showDetails, setShowDetails] = useState(false);
  const localItems = useCartStore((state) => state.items);

  const ticketCount =
    localItems.find((i) => i.cartKey === cartKey)?.quantity ?? 0;
  const isSoldOut = available <= 0;
  // Whichever runs out first: stock on hand, or what one buyer is allowed.
  const maxPerBuyer = Math.min(available, purchaseLimit || available);
  const atLimit = ticketCount >= maxPerBuyer;

  const createCartMutation = useCreateCart();
  const updateQuantityMutation = useUpdateCartQuantity();

  function createCart() {
    createCartMutation.mutate({
      cartKey,
      ticketId,
      listingId,
      quantity: 1,
      purchaseLimit: maxPerBuyer,
    });
    useCartStore.getState().openCart();
  }

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate({ data: quantity, cartKey });
  }

  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={() => setShowDetails(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setShowDetails(true);
        }
      }}
      className="w-full flex items-center justify-between gap-4 h-fit pl-5 pr-2 py-4 text-xl font-sf-pro-display cursor-pointer transition-colors hover:bg-white/5">
      <div className="flex items-start gap-3 min-w-0">
        <BsInfoCircle
          aria-hidden="true"
          className="w-5 h-5 shrink-0 mt-0.5 text-white"
        />

        <div className="flex flex-col gap-1 font-sf-pro-display font-normal min-w-0">
        <div className="flex items-center gap-2">
          <p className="md:text-base text-sm capitalize">{name}</p>

        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-tech-blue">
            {formatNaira(price, { free: price === 0 })}
          </p>
          <p className="text-xs text-[#ACACAC]">{caption}</p>
          
        </div>
         {groupSize ? <GroupBadge size={groupSize} /> : null}
        </div>
      </div>

      {/* stopPropagation so using the counter doesn't also open the modal. */}
      <div onClick={(event) => event.stopPropagation()} className="shrink-0">
        {isSoldOut ? (
          <SoldOutPill />
        ) : (
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
              disabled={atLimit}
              isLoading={
                createCartMutation.isPending || updateQuantityMutation.isPending
              }
            />
          </div>
        )}
      </div>
    </div>

    <BaseModal
      open={showDetails}
      onClose={() => setShowDetails(false)}
      size="small"
      title={name}
      titleClassName="items-start px-6 "
      titleTextClassName="font-inter-tight font-bold md:text-2xl text-xl normal-case"
      className="bg-system-black border border-white/10">
      <div className="flex flex-col gap-2 px-6 pb-6 font-sf-pro-display">
        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <SoldOutPill />
          ) : (
            <>
              <p className="text-base text-tech-blue">
                {formatNaira(price, { free: price === 0 })}
              </p>
              <p className="text-xs text-[#ACACAC]">{caption}</p>
            </>
          )}
        </div>

        {groupSize ? <GroupBadge size={groupSize} /> : null}

        {description ? (
          <div className="flex flex-col gap-1 ">
            <p className="font-inter-tight font-bold text-2xl text-white">
              Description
            </p>
          <p className="text-sm whitespace-pre-line text-white/80">{description}</p>
          </div>
        ) : (
          <p className="text-sm text-white">
            No description provided for this ticket.
          </p>
        )}
      </div>
    </BaseModal>
    </>
  );
}

function SoldOutPill() {
  return (
    <span className="flex items-center justify-center h-12 px-5 rounded-full bg-mid-dark-gray font-sf-pro-rounded text-xs font-bold uppercase tracking-wide text-white/60">
      Sold Out
    </span>
  );
}

/** Matches the group badge on the my-tickets route. */
function GroupBadge({ size }: { size: number }) {
  return (
    <span
      title={`Admits ${size} people`}
      className="flex w-fit items-center gap-1 shrink-0 rounded-full text-[#BFEAC8] font-inter-tight text-xs font-bold"
    >
      <BiGroup className="w-5 h-5" />
      Group of {size}
    </span>
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
        <LoaderCircle
          color="var(--foreground)"
          size={16}
          className="animate-spin"
        />
      ) : (
        <Icon color="var(--foreground)" size={16} />
      )}
    </Button>
  );
}

function TicketCardSkeleton() {
  return (
    <Skeleton className="w-full flex items-center justify-between h-[76px] rounded-md bg-gunmetal-gray pl-5 pr-2 py-2.5 text-xl font-sf-pro-display" />
  );
}

interface ITicketProps {
  eventId: string;
}

interface ITicketButton {
  action: () => void;
  Icon: LucideIcon;
  isLoading?: boolean;
  disabled?: boolean;
}

interface ITicketCard {
  ticket: PurchasableTicket;
}
