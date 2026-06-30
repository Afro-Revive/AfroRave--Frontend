import { useState } from "react";
import { useCartStore } from "@/stores";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import type { PaginatedResponse, TicketData } from "@/types";
import { formatNaira } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartSummaryFloat({
  eventTickets,
  action,
  isLoading,
}: {
  eventTickets: PaginatedResponse<TicketData> | undefined;
  action: () => void;
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const localItems = useCartStore((state) => state.items);

  const totalTickets = localItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = localItems.reduce((sum, item) => {
    const ticket = eventTickets?.items.find(
      (t) => t.ticketId === item.ticketId,
    );
    return sum + (ticket?.price ?? 0) * item.quantity;
  }, 0);

  const selectedTickets = localItems
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      ticketId: item.ticketId,
      quantity: item.quantity,
      name:
        eventTickets?.items.find((t) => t.ticketId === item.ticketId)
          ?.ticketName ?? "Ticket",
      price:
        eventTickets?.items.find((t) => t.ticketId === item.ticketId)?.price ??
        0,
    }));

  return (
    <div className="fixed bottom-0 md:right-0 right-10 z-[999999] w-80">
      <div className={cn( isOpen ? "bg-white": " bg-mid-dark-gray ", "bg-white rounded-t-xl shadow-2xl overflow-hidden")}>
        {/* Expandable panel — grows upward from the bar */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "max-h-[400px]" : "max-h-0",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
            <div className="flex items-center ">
              <p className="text-black font-inter font-black md:text-2xl text-xl tracking-wide">
                Your Items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-black" />
              <span className="bg-soft-gray text-white text-xs font-bold font-sf-pro-rounded rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {totalTickets}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-black/60 hover:text-white transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Ticket list */}
          <ul className="flex flex-col px-4 gap-2 divide-y divide-white/10 max-h-52 overflow-y-auto">
            {selectedTickets.length === 0 ? (
              <li className="px-5 py-4 text-white/40 text-xs font-sf-pro-display text-center">
                No tickets selected yet
              </li>
            ) : (
              selectedTickets.map((item) => (
                <li
                  key={item.ticketId}
                  className="flex items-center border border-soft-gray rounded-md justify-between px-5 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-black capitalize text-sm font-inter">
                      {item.name}
                    </p>
                    <p className="text-black text-xs font-inter">
                      {formatNaira(item.price, { free: item.price === 0 })}
                    </p>
                  </div>
                  <span className="text-black md:text-xl text-lg font-sf-pro-text">
                    ×{item.quantity}
                  </span>
                </li>
              ))
            )}
          </ul>

          {/* Checkout CTA inside panel */}
          <div className="px-5 py-4 border-t border-white/10">
            <Button
              onClick={action}
              disabled={isLoading || totalTickets === 0}
              className="w-full h-11 flex items-center justify-between bg-deep-red hover:bg-deep-red/80 px-3 rounded-lg font-sf-pro-display"
            >
              {isLoading ? (
                <LoaderCircle size={16} className="animate-spin mx-auto" />
              ) : (
                <>
                  <span className="text-sm">Checkout</span>
                  <span className="text-base font-semibold">
                    {formatNaira(totalPrice, {
                      free: totalPrice === 0 && totalTickets > 0,
                    })}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom bar — hidden when panel is open */}
        {!isOpen && (
          <div className="flex flex-col items-center w-full bg-mid-dark-gray px-6">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full flex justify-center pt-3 pb-6 hover:bg-white/5 transition-colors"
            >
              <ChevronUp size={18} className="text-white/60" />
            </button>
            <button
              type="button"
              onClick={action}
              disabled={isLoading || totalTickets === 0}
              className="flex items-center bg-soft-gray rounded-md justify-between w-full px-5 py-4 mb-4 hover:bg-soft-gray/80 transition-colors disabled:opacity-50"
            >
              <span className="text-white text-sm font-sf-pro-display">Checkout</span>
              <span className="text-white md:text-xl text-base font-inter">
                {formatNaira(totalPrice, { free: totalPrice === 0 && totalTickets > 0 })}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
