import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { UserTicketTicketDetails } from "@/types";
import { TicketCard } from "../components/ticket-card";
import {
  ChevronLeft,
  ChevronRight,
  SquarePen,
  X,
} from "lucide-react";
import { TransformedTicket } from "../../my-tickets/components/transformed-ticket-icon";
import { useTicketResale } from "@/hooks/use-tickets-mutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";

interface TicketResaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticketDetails: UserTicketTicketDetails[];
}

type Step = "select" | "price" | "picker";

const PRICE_STEP = 1000;
const MAX_RESALE = 3;

export default function TicketResaleModal({
  isOpen,
  onClose,
  ticketDetails,
}: TicketResaleModalProps) {
  const [step, setStep] = useState<Step>("select");
  // State to track selected tickets and their quantities
  const [selections, setSelections] = useState<Record<string, number>>({});
  // State to track the prices for each selected ticket, where price is a string
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const { mutate, isPending } = useTicketResale();
  const navigate = useNavigate();
  const ticketServiceFee = import.meta.env.VITE_TICKET_RESALE_PERCENTAGE;

  // Calculate the total number of selected tickets
  const totalSelectedCount = Object.values(selections).reduce(
    (sum, q) => sum + q,
    0,
  );
  const ticketAfterServiceFee = (price: number) => {
    const serviceFee = price * ticketServiceFee;
    return price - serviceFee;
  };
  const maxReached = totalSelectedCount >= MAX_RESALE;

  // Filter the ticket details to only include selected tickets for editing
  const selectedTickets = ticketDetails.filter(
    (t) => (selections[t.ticketId] ?? 0) > 0,
  );

  // parses prices for multiplication
  // contains an array of all selected tickets with their resale prices
  const parsedPrices = Object.fromEntries(
    selectedTickets.map((t) => [
      t.ticketId,
      // strips commas from the price string and converts it to a number
      parseFloat((prices[t.ticketId] ?? "").replace(/,/g, "")) || 0,
    ]),
  );

  // checks if parsedPrices for each ticket is greater than 0
  const allPriced =
    selectedTickets.length > 0 &&
    selectedTickets.every((t) => parsedPrices[t.ticketId] > 0);

  const editingTicket = selectedTickets.find(
    (t) => t.ticketId === editingTicketId,
  );

  const editingPriceStr =
    prices[editingTicketId ?? ""] ||
    editingTicket?.price.toLocaleString() ||
    "";

  const editingParsed = parseFloat(editingPriceStr.replace(/,/g, "")) || 0;

  function handleToggleTicket(ticketId: string) {
    setSelections((prev) => {
      if (prev[ticketId]) {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      }
      return { ...prev, [ticketId]: 1 };
    });
  }

  function handleTicketIncrement(ticketId: string, maxQty: number) {
    setSelections((prev) => ({
      ...prev,
      [ticketId]: Math.min(maxQty, (prev[ticketId] ?? 1) + 1),
    }));
  }

  function handleTicketDecrement(ticketId: string) {
    setSelections((prev) => ({
      ...prev,
      [ticketId]: Math.max(1, (prev[ticketId] ?? 1) - 1),
    }));
  }

  function handlePriceIncrement(ticketId: string) {
    setPrices((prev) => {
      const current = parseFloat((prev[ticketId] ?? "").replace(/,/g, "")) || 0;
      const next = current + PRICE_STEP;
      return { ...prev, [ticketId]: next.toLocaleString() };
    });
  }

  function handlePriceDecrement(ticketId: string) {
    setPrices((prev) => {
      const current = parseFloat((prev[ticketId] ?? "").replace(/,/g, "")) || 0;
      const next = Math.max(0, current - PRICE_STEP);
      return { ...prev, [ticketId]: next > 0 ? next.toLocaleString() : "" };
    });
  }

  function openPicker(ticketId: string) {
    setEditingTicketId(ticketId);
    setStep("picker");
    // ensures picker opens with the ticket price on default and the current price if it has been setg
    setPrices((prev) => {
      if (prev[ticketId]) return prev;
      const ticket = ticketDetails.find((t) => t.ticketId === ticketId);
      return ticket
        ? { ...prev, [ticketId]: ticket.price.toLocaleString() }
        : prev;
    });
  }

  function handleClose() {
    setStep("select");
    setSelections({});
    setPrices({});
    setEditingTicketId(null);
    onClose();
  }

  function handleSubmit() {
    if (!allPriced) return;
    const payload = selectedTickets.map((t) => ({
      ticketId: t.ticketId,
      quantity: selections[t.ticketId],
      price: parsedPrices[t.ticketId],
    }));
    mutate(payload, { onSuccess: () => {
        handleClose();
        navigate(getRoutePath('listed_tickets'));
    } });
  }

  const headerTitle =
    step === "select"
      ? "Sell"
      : step === "price"
        ? "Set Price"
        : (editingTicket?.ticketName ?? "Set Price");

  const headerSub =
    step === "select"
      ? "Select the ticket you want to sell"
      : step === "price"
        ? "Set your selling price per ticket"
        : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-secondary-white text-black border-none p-0 md:max-w-[420px] max-w-[95vw] rounded-[16px] overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Sell Ticket</DialogTitle>

        {/* Header */}
        <div className="relative flex items-center justify-center px-6 pt-5 pb-3">
          {(step === "price" || step === "picker") && (
            <button
              onClick={() =>
                step === "picker" ? setStep("price") : setStep("select")
              }
              className="absolute left-6 text-black/40 hover:text-black transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold font-inter text-system-black">
              {headerTitle}
            </p>
            {headerSub && (
              <p className="text-xs text-black/40 font-inter text-center">
                {headerSub}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="absolute right-6 text-black/40 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-auto w-[90%] mb-4 rounded-lg px-3 pb-6 flex flex-col gap-4">
          {/* ── SELECT ── */}
          {step === "select" && (
            <>
              <div className="flex flex-col gap-3">
                {ticketDetails.map((ticket) => {
                  const isSelected = (selections[ticket.ticketId] ?? 0) > 0;
                  return (
                    <TicketCard
                      key={ticket.ticketId}
                      ticketName={ticket.ticketName}
                      ticketPrice={ticket.price}
                      ticketQuantity={ticket.totalQuantity}
                      isSelected={isSelected}
                      count={selections[ticket.ticketId] ?? 0}
                      maxReached={maxReached}
                      onSelect={() => handleToggleTicket(ticket.ticketId)}
                      onIncrement={() =>
                        handleTicketIncrement(ticket.ticketId, ticket.totalQuantity)
                      }
                      onDecrement={() => handleTicketDecrement(ticket.ticketId)}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                disabled={totalSelectedCount === 0}
                onClick={() => setStep("price")}
                className={cn(
                  "w-full rounded-lg py-2 text-sm font-inter transition-all mt-2 relative flex items-center justify-center px-4",
                  totalSelectedCount > 0
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/10 text-black/30 cursor-not-allowed",
                )}
              >
                <span>Set Price</span>
                {totalSelectedCount > 0 && (
                  <span className="absolute right-4 flex items-center gap-1.5">
                    <TransformedTicket color="white" />
                    <span className="font-bold">{totalSelectedCount}</span>
                  </span>
                )}
              </button>

              {maxReached && (
                <p className="text-xs text-light-red font-inter text-center">
                  Maximum Ticket Limit Reached
                </p>
              )}
            </>
          )}

          {/* ── PRICE ── */}
          {step === "price" && (
            <>
              <div className="flex flex-col gap-3">
                {selectedTickets.map((ticket) => {
                  const qty = selections[ticket.ticketId] ?? 0;
                  // parsed returns 0 when the price has not been set.
                  const parsed = parsedPrices[ticket.ticketId] ?? 0;

                  return (
                    <div
                      key={ticket.ticketId}
                      className="w-full rounded-[8px] border border-black/10 px-4 py-3 flex flex-col gap-2"
                    >
                      {/* Name + qty + set price */}
                      <div className="flex items-center gap-2">
                        <TransformedTicket color="black" />
                        <p className="text-sm font-semibold font-sf-pro-display capitalize flex-1">
                          {ticket.ticketName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {parsed > 0 && (
                            <p className="text-sm font-bold font-sf-pro-display">
                              {formatNaira(parsed)}
                            </p>
                          )}
                          <p className="text-xs text-black/40 font-sf-pro-display">
                            ×{qty}
                          </p>
                        </div>
                      </div>

                      {/* Fee breakdown — only once price is set */}
                      {parsed > 0 && (
                        <div className=" w-full items-center  pt-2 border-t border-black/10">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex flex-row justify-between items-center">
                              <p className="font-inter text-xs font-light">
                                Service fee
                              </p>
                              <p className="font-inter text-xs ">
                                {formatNaira(
                                  parsed - ticketAfterServiceFee(parsed),
                                )}
                              </p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <p className="font-inter text-xs font-light">Your Payout</p>
                              <p className="font-inter text-xs font-bold text-deep-red">
                                {formatNaira(ticketAfterServiceFee(parsed))}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => openPicker(ticket.ticketId)}
                        className="flex justify-center items-center w-full gap-1.5 px-3 py-1.5 rounded-md border bg-black text-white hover:bg-black/80 transition-colors"
                      >
                        <SquarePen size={11} className="text-white" />
                        <span className="text-xs font-sf-pro-display text-white">
                          {parsed > 0 ? formatNaira(parsed) : "Set Price"}
                        </span>
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allPriced || isPending}
                  className={cn(
                    "w-full py-2 rounded-md text-sm font-bold font-inter uppercase transition-all",
                    allPriced && !isPending
                      ? "bg-deep-red text-white hover:bg-deep-red/90"
                      : "bg-black/10 text-black/30 cursor-not-allowed",
                  )}
                >
                  {isPending ? "Listing..." : "List for Sale"}
                </button>
              </div>
            </>
          )}

          {/* ── PICKER ── */}
          {step === "picker" && editingTicket && (
            <div
              className="flex flex-col justify-between"
              style={{ minHeight: "340px" }}
            >
              <div className="flex flex-col gap-6 py-10 flex-1 justify-center">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handlePriceDecrement(editingTicket.ticketId)}
                    disabled={editingParsed <= 0}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex flex-col items-center gap-1 flex-1">
                    <p className="text-xl font-semibold font-inter">
                      {editingParsed > 0
                        ? formatNaira(editingParsed)
                        : formatNaira(editingTicket.price)}
                    </p>
                    <p className="text-xs text-black/40 font-inter">
                      per ticket
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePriceIncrement(editingTicket.ticketId)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <p className="text-xs text-black/50 font-inter text-center">
                  You Will Be Paid Out{" "}
                  <span className="font-semibold text-sm text-black">
                    {formatNaira(ticketAfterServiceFee(
                      editingParsed > 0 ? editingParsed : editingTicket.price,
                    ))}
                  </span>{" "}
                  per ticket after fees
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep("price")}
                className="w-full py-2 rounded-md text-sm font-bold font-inter uppercase bg-deep-red text-white hover:bg-deep-red/90 transition-all"
              >
                Set Price
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

