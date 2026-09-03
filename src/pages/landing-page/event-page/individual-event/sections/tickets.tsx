import { TicketTab } from "../../_components/ticket-tab";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/format-price";
import { type LucideIcon, Plus, Minus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useGetEventTickets,
  useGetEventResaleListings,
} from "@/hooks/use-event-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCart, useUpdateCartQuantity } from "@/hooks/use-cart";

import { useCartStore } from "@/stores";
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

export default function TicketSection({ eventId, layout }: ITicketProps) {
  const [isSales, setIsSales] = useState(() =>
    isResaleOnlyCart(useCartStore.getState().items),
  );
  const { data: ticketResponse, isPending: isLoading } =
    useGetEventTickets(eventId);
  const { data: resaleListingsResponse, isPending: isResaleListingsLoading } =
    useGetEventResaleListings(eventId);

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
    <div
      className={cn("!w-full flex flex-col gap-7", {
        "px-5 lg:px-32": layout === "default",
        "pl-5 lg:pl-32": layout !== "default",
      })}
    >
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
        <TicketCardSkeleton layout={layout} />
      ) : (
        <div
          className={cn("w-full", {
            "flex gap-7 overflow-x-scroll scrollbar-none":
              layout === "with-flyer" || layout === "standard-carousel",
            "grid sm:grid-cols-2 gap-x-5 gap-y-7": layout === "default",
          })}
        >
          {(showResale ? resaleListings : tickets).map((ticket) => (
            <TicketCard key={ticket.cartKey} ticket={ticket} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
}

function TicketCard({ ticket, layout }: ITicketCard) {
  const { cartKey, ticketId, listingId, name, price, caption, available } =
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
    useCartStore.getState().openCart();
  }

  function updateCart(quantity: number) {
    updateQuantityMutation.mutate({ data: quantity, cartKey });
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between h-fit rounded-md bg-gunmetal-gray pl-5 pr-2 py-2.5 text-xl font-sf-pro-display",
        {
          "md:min-w-[480px] min-w-80 last:mr-5":
            layout === "with-flyer" || layout === "standard-carousel",
          "w-full": layout === "default",
        },
      )}
    >
      <div className="flex flex-col gap-1 font-sf-pro-display font-normal">
        <p className="md:text-base text-sm capitalize">{name}</p>
        <p className="text-sm">{formatNaira(price, { free: price === 0 })}</p>
        <p className="text-xs text-[#ACACAC]">{caption}</p>
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
          disabled={isSoldOut || atLimit}
          isLoading={
            createCartMutation.isPending || updateQuantityMutation.isPending
          }
        />
      </div>
    </div>
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

function TicketCardSkeleton({ layout }: { layout: ITicketProps["layout"] }) {
  return (
    <Skeleton
      className={cn(
        "flex items-center justify-between h-[76px] rounded-md bg-gunmetal-gray pl-5 pr-2 py-2.5 text-xl font-sf-pro-display",
        {
          "md:min-w-[480px] last:mr-5":
            layout === "with-flyer" || layout === "standard-carousel",
          "w-full": layout === "default",
        },
      )}
    />
  );
}

interface ITicketProps {
  layout: "default" | "standard-carousel" | "with-flyer";
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
  layout: ITicketProps["layout"];
}
