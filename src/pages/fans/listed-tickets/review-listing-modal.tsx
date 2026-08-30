import { useEffect, useState } from "react";
import BaseModal from "@/components/reusable/base-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/format-price";
import { useCancelResaleListing } from "@/hooks/use-tickets-mutations";
import type { UsersResaleTickets } from "@/types/ticket";

interface ReviewListingModalProps {
  listing: UsersResaleTickets;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewListingModal({
  listing,
  open,
  onOpenChange,
}: ReviewListingModalProps) {

  const cancelResaleListingMutation = useCancelResaleListing();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [draftPrice, setDraftPrice] = useState(String(listing.price));

  // Start from the saved price each time the modal opens, so an abandoned edit
  // does not linger into the next viewing.
  useEffect(() => {
    if (open) {
      setIsEditingPrice(false);
      setDraftPrice(String(listing.price));
    }
  }, [open, listing.price]);

  const parsedDraft = Number(draftPrice.replace(/,/g, ""));
  const isDraftValid = Number.isFinite(parsedDraft) && parsedDraft > 0;

  // Same fee basis the resale flow prices against, so the payout shown here
  // matches what the seller agreed to when they listed.
  const serviceFeeRate =
    Number(import.meta.env.VITE_TICKET_RESALE_PERCENTAGE) || 0;
  // While editing, the whole breakdown previews the draft price.
  const price = isEditingPrice && isDraftValid ? parsedDraft : listing.price;
  const subtotal = price * listing.quantity;
  const serviceFee = subtotal * serviceFeeRate;
  const payout = subtotal - serviceFee;

  const isSold = listing.status === "Sold";
  const isActive = !isSold;

  function cancelEdit() {
    setDraftPrice(String(listing.price));
    setIsEditingPrice(false);
  }

  const cancelListing = (id: string) => {
    cancelResaleListingMutation.mutate(id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <BaseModal
      open={open}
      onClose={onOpenChange}
      size="small"
      floatingCancel
      title="Review Your Listing"
      titleClassName="font-sf-pro-display py-4 border-b-1 border-[#595959]/50"
      cancelClassName="top-4 md:top-4 right-4 md:right-4 p-0 bg-transparent hover:bg-transparent backdrop-blur-none"
      className="bg-system-black sm:max-w-[460px]"
    >
      <div className="flex flex-col gap-6 px-6 py-8 font-sf-pro-display text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-medium capitalize truncate">
              {listing.ticketName}
            </p>
            <p className="text-xs text-white/50">
              {listing.quantity} {listing.quantity === 1 ? "ticket" : "tickets"}{" "}
              listed
            </p>
          </div>
          <Badge
            className={cn(
              "capitalize font-normal px-2 py-0.5 text-[10px] tracking-wide shrink-0",
              {
                "bg-[#34C759]/20 text-[#34C759] hover:bg-[#34C759]/30":
                  listing.status === "Sold",
                "bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30":
                  listing.status === "Active",
              },
            )}
          >
            {listing.status}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-4">
          {isEditingPrice ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-white/60">Price per ticket</p>
              <div className="flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 focus-within:border-white/50">
                <span className="text-xs text-white/60">₦</span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={draftPrice}
                  onChange={(event) =>
                    setDraftPrice(event.target.value.replace(/[^\d,]/g, ""))
                  }
                  className="w-24 bg-transparent text-right text-xs text-white outline-none"
                />
              </div>
            </div>
          ) : (
            <Row
              label="Price per ticket"
              value={formatNaira(listing.price)}
              action={
                isActive ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingPrice(true)}
                    className="text-[11px] tracking-wide text-white/60 underline underline-offset-2 hover:text-white"
                  >
                    Edit
                  </button>
                ) : undefined
              }
            />
          )}
          <Row label="Quantity" value={`x ${listing.quantity}`} />
          <Row label="Subtotal" value={formatNaira(subtotal)} />
          {serviceFeeRate > 0 && (
            <Row
              label={`Service fee (${(serviceFeeRate * 100).toFixed(0)}%)`}
              value={`- ${formatNaira(serviceFee)}`}
            />
          )}
          <div className="mt-1 border-t border-white/10 pt-3">
            <Row label="Your Payout" value={formatNaira(payout)} emphasis />
          </div>
        </div>

        {isSold && (
          <p className="text-[11px] leading-relaxed text-white/40">
            This listing has sold. Check wallet for payout.
          </p>
        )}

        {/* TODO: neither action is wired to the API — there is no update-price
            or remove-listing endpoint yet, so both only update local state. */}
        {isActive && isEditingPrice && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={cancelEdit}
                className="flex-1 h-10 rounded-lg font-inter text-xs uppercase font-semibold text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!isDraftValid || parsedDraft === listing.price}
                onClick={() => setIsEditingPrice(false)}
                className="flex-1 h-10 rounded-lg font-inter text-xs uppercase font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-40"
              >
                Save Price
              </Button>
            </div>
            {!isDraftValid && draftPrice.length > 0 && (
              <p className="text-center text-[11px] text-[#FF9500]">
                Enter a price greater than zero.
              </p>
            )}
          </div>
        )}

        {isActive && !isEditingPrice && (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => cancelListing(listing.id)}
              className="w-full h-10 rounded-lg bg-white text-black hover:bg-white/70 hover:text-black font-inter text-xs uppercase font-semibold"
            >
              Remove Listing
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-white/40">
              Removing takes the ticket off the resale market and returns it to
              your tickets.
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

function Row({
  label,
  value,
  emphasis = false,
  action,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <p
          className={cn("text-xs text-white/60", {
            "text-sm text-white": emphasis,
          })}
        >
          {label}
        </p>
        {action}
      </div>
      <p
        className={cn("text-xs text-white", {
          "text-base font-bold": emphasis,
        })}
      >
        {value}
      </p>
    </div>
  );
}
