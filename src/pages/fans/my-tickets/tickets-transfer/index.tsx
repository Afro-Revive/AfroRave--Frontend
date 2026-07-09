import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UserTicketTicketDetails } from "@/types";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { TransformedTicket } from "../components/transformed-ticket-icon";
import { useTransferTickets } from "@/hooks/use-tickets-mutations";
import { ticketService } from "@/services/tickets.service";
import { useState, useEffect, useRef } from "react";

interface TicketTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketDetails: UserTicketTicketDetails[];
}

type Step = "select" | "email";

type VerifyState = {
  email: string;
  status: string;
};

const MAX_TRANSFER = 3;
const DEBOUNCE_MS = 400;

export default function TicketTransferModal({
  isOpen,
  onClose,
  ticketDetails,
}: TicketTransferModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selections, setSelections] = useState<Record<string, number>>({});
  // State to track selected tickets and their verification status
  const [verifications, setVerifications] = useState<
    Record<string, VerifyState>
  >({});
  // holds references to debounce timers for each ticket's email input
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const { mutate: transferTickets, isPending: isTransferring } =
    useTransferTickets();

  const totalSelectedCount = Object.values(selections).reduce(
    (sum, q) => sum + q,
    0,
  );
  const maxReached = totalSelectedCount >= MAX_TRANSFER;

  const selectedTickets = ticketDetails.filter(
    (t) => (selections[t.ticketId] ?? 0) > 0,
  );

  const allVerified =
    selectedTickets.length > 0 &&
    selectedTickets.every(
      (t) => verifications[t.ticketId]?.status === "verified",
    );

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleEmailChange(ticketId: string, value: string) {
    // Reset to idle on change
    setVerifications((prev) => ({
      ...prev,
      [ticketId]: { email: value, status: "idle" },
    }));

    if (!isValidEmail(value)) return;

    // Clear existing debounce for this field
    if (debounceRefs.current[ticketId]) {
      clearTimeout(debounceRefs.current[ticketId]);
    }

    // Debounce the verify call
    debounceRefs.current[ticketId] = setTimeout(() => {
      verifyEmail(ticketId, value);
    }, DEBOUNCE_MS);
  }

  async function verifyEmail(ticketId: string, email: string) {
    setVerifications((prev) => ({
      ...prev,
      [ticketId]: { email, status: "loading" },
    }));
   
    try {
     await ticketService.verifyTransferRecipient(email);
      setVerifications((prev) => ({
        ...prev,
        [ticketId]: {
          email,
          status: "verified",
        },
      }));
    } catch {
      setVerifications((prev) => ({
        ...prev,
        [ticketId]: {
          email,
          status: "error",
        },
      }));
    }
  }

  // Clear all debounce timers on unmount
  useEffect(() => {
    const refs = debounceRefs.current;
    return () => {
      Object.values(refs).forEach(clearTimeout);
    };
  }, []);

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

  function handleIncrement(ticketId: string, maxQty: number) {
    setSelections((prev) => ({
      ...prev,
      [ticketId]: Math.min(maxQty, (prev[ticketId] ?? 1) + 1),
    }));
  }

  function handleDecrement(ticketId: string) {
    setSelections((prev) => ({
      ...prev,
      [ticketId]: Math.max(1, (prev[ticketId] ?? 1) - 1),
    }));
  }

  function handleClose() {
    setStep("select");
    setSelections({});
    setVerifications({});
    Object.values(debounceRefs.current).forEach(clearTimeout);
    debounceRefs.current = {};
    onClose();
  }

  function handleSubmit() {
    if (!allVerified) return;
    const payload = selectedTickets.map((t) => ({
      ticketId: t.ticketId,
      quantity: selections[t.ticketId],
      recipientIdentifier: verifications[t.ticketId].email,
    }));
    transferTickets(payload, { onSuccess: handleClose });
  }

  const headerTitle =
    step === "select" ? "Tickets" : "Enter Recipients Email Address";
  const headerSub =
    step === "select"
      ? "Select the tickets you want to transfer"
      : "Please note that the recipient of this offer must create an account on Afro Revive and accept this offer before the transfer is completed.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-secondary-white text-black border-none p-0 md:max-w-[420px] max-w-[95vw] rounded-[16px] overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Transfer Ticket</DialogTitle>

        {/* Header */}
        <div className="relative flex items-center justify-center px-6 pt-7">
          {step === "email" && (
            <button
              onClick={() => setStep("select")}
              className="absolute left-6 text-system-black/70 hover:text-black transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <button
            onClick={handleClose}
            className="absolute right-6 text-system-black/70 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={cn("flex flex-col px-6 gap-1", step === "email" && "pt-3")}
        >
          <p className="text-sm font-bold font-sf-pro-text tracking-tight text-system-black">
            {headerTitle}
          </p>
          <p className="text-xs text-system-black font-sf-pro-text text-left">
            {headerSub}
          </p>
        </div>

        <div className="mx-auto w-[90%] mb-4 rounded-lg pb-6 flex flex-col gap-4">
          {/* ── SELECT ── */}
          {step === "select" && (
            <>
              <div className="flex flex-col gap-3">
                {ticketDetails.map((ticket) => {
                  const isSelected = (selections[ticket.ticketId] ?? 0) > 0;
                  const count = selections[ticket.ticketId] ?? 0;
                  return (
                    <button
                      key={ticket.ticketId}
                      type="button"
                      onClick={() => handleToggleTicket(ticket.ticketId)}
                      className={cn(
                        "w-full rounded-[8px] border px-4 py-3 flex items-center gap-3 text-left transition-all",
                        isSelected
                          ? "border-system-black bg-system-black/5"
                          : "border-black/10 hover:border-black/30",
                      )}
                    >
                      <TransformedTicket color="#ae0d0d" />
                      <div className="flex flex-col gap-0.5 flex-1">
                        <p className="text-sm font-semibold font-sf-pro-display capitalize">
                          {ticket.ticketName}
                        </p>
                        <p className="text-xs text-black/40 font-sf-pro-display">
                          {ticket.totalQuantity} available
                        </p>
                      </div>

                      {isSelected ? (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleDecrement(ticket.ticketId)}
                            disabled={count <= 1}
                            className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center hover:border-black transition-colors disabled:opacity-30"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-bold font-sf-pro-display w-4 text-center">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleIncrement(
                                ticket.ticketId,
                                ticket.totalQuantity,
                              )
                            }
                            disabled={
                              count >= ticket.totalQuantity || maxReached
                            }
                            className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors disabled:opacity-30"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-black/30 font-sf-pro-display">
                          ×{ticket.totalQuantity}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={totalSelectedCount === 0}
                onClick={() => setStep("email")}
                className={cn(
                  "w-full rounded-lg py-2 text-sm font-inter transition-all mt-2 relative flex items-center justify-center px-4",
                  totalSelectedCount > 0
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/10 text-black/30 cursor-not-allowed",
                )}
              >
                <span>Continue</span>
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

          {/* ── EMAIL ── */}
          {step === "email" && (
            <div className="flex flex-col gap-1.5">
              {selectedTickets.map((ticket) => {
                const qty = selections[ticket.ticketId] ?? 0;
                const v = verifications[ticket.ticketId] ?? {
                  email: "",
                  status: "idle",
                };
                return (
                  <div
                    key={ticket.ticketId}
                    className="w-full py-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold font-sf-pro-display capitalize flex-1">
                        {ticket.ticketName}
                      </p>
                      <p className="text-xs text-black/40 font-sf-pro-display">
                        ×{qty}
                      </p>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Recipient email address"
                        value={v.email}
                        onChange={(e) =>
                          handleEmailChange(ticket.ticketId, e.target.value)
                        }
                        className={cn(
                          "w-full text-xs font-inter px-3 py-2 pr-8 rounded-md border bg-transparent outline-none transition-colors placeholder:text-black/30",
                          v.status === "verified" &&
                            "border-green-500 focus:border-green-500",
                          v.status === "error" &&
                            "border-red-400 focus:border-red-500",
                          v.status === "idle" || v.status === "loading"
                            ? "border-black/10 focus:border-black/40"
                            : "",
                        )}
                      />
                      {/* Status indicator */}
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        {v.status === "loading" && (
                          <Loader2
                            size={13}
                            className="animate-spin text-black/30"
                          />
                        )}
                        {v.status === "verified" && (
                          <CheckCircle2 size={13} className="text-green-500" />
                        )}
                      </div>
                    </div>

                    {v.status === "verified" && (
                      <p className="text-[10px] text-green-600 font-inter font-medium">
                        Recipient verified
                      </p>
                    )}
                    {v.status === "error" && (
                      <p className="text-[10px] text-red-500 font-inter">
                       Recipient is not registered on the platform.
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allVerified || isTransferring}
                className={cn(
                  "w-full py-1.5 rounded-md text-sm font-bold font-sf-pro-display transition-all mt-2",
                  allVerified && !isTransferring
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/10 text-black/30 cursor-not-allowed",
                )}
              >
                {isTransferring ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
