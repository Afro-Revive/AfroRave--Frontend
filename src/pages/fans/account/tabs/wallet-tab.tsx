import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { CiCalendar } from "react-icons/ci";
import { useState } from "react";
import { WithdrawFundsModal } from "../components/withdraw-funds-modal";
import { TransformedTicket } from "@/pages/fans/my-tickets/components/transformed-ticket-icon";
import { usePayoutHistory, useWalletDetails } from "@/hooks/use-profile-mutations";
import { PaginatedResponse, PayoutHistoryData, WalletDetailsData } from "@/types";
import { formatNaira } from "@/lib/format-price";
import { formatShortDate } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import { LoadingFallback } from "@/components/loading-fallback";

export default function WalletTab() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { data: walletDetailsResponse, isLoading } = useWalletDetails();
  const { data: payoutHistoryResponse, isLoading: isLoadingPayouts } =
    usePayoutHistory();

  const walletDetails = walletDetailsResponse?.data as
    | WalletDetailsData
    | undefined;
  const availableBalance = walletDetails?.balance;

  const payoutHistory =
    (
      payoutHistoryResponse?.data as
        | PaginatedResponse<PayoutHistoryData>
        | undefined
    )?.items ?? [];

  if (isLoading) {
    return <LoadingFallback className="mb-[160px] h-[250px]" />;
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center pt-8 pb-[100px] px-4 md:px-0">
      <div className="w-full max-w-[550px] flex flex-col gap-8">
        {/* Title */}
        <h2 className="text-[#8E8E93] font-bold text-base md:text-lg font-inter-tight text-left">
          Manage Your Payout Funds
        </h2>
        {/* Available Balance Card */}
        <div className="w-full bg-[#2A2A2A] border border-white/5 rounded-4xl px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <Wallet className="w-5 h-5 text-deep-red" />
            <span className="text-sm font-inter-tight font-bold text-[#8E8E93] tracking-wide">
              Available Balance
            </span>
          </div>
          <p className="text-white text-xl md:text-2xl font-bold font-inter-tight">
            {formatNaira(availableBalance ?? 0)}
          </p>
        </div>

        <Button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="w-full h-12 bg-white text-deep-red hover:bg-white/60 font-inter-tight font-semibold rounded-2xl transition-colors border-none"
        >
          Withdraw Funds
        </Button>

        {/* Payout History */}
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-white text-sm font-inter-tight font-bold capitalize tracking-wider">
            PAYOUT HISTORY
          </h3>
          <p className="text-[#8E8E93] text-sm font-inter-tight mb-4">
            Resale Earnings And Refunds Are Added To Your Wallet
          </p>

          <div className="w-full flex flex-col gap-5">
            {isLoadingPayouts ? (
              <LoadingFallback className="h-[120px]" />
            ) : payoutHistory.length === 0 ? (
              <p className="text-white/60 text-sm font-inter-tight">
                No payout history available.
              </p>
            ) : (
              payoutHistory.map((item) => (
                <PayoutHistoryItem
                  key={item.id}
                  listing={item}
                />
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        <WithdrawFundsModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          availableBalance={availableBalance ?? 0}
        />
      </div>
    </div>
  );
}

interface PayoutHistoryItemProps {
  listing: PayoutHistoryData;
}

type EntryTone = "in" | "refund" | "pending" | "failed" | "neutral";

/**
 * What a wallet entry is, by the API's transaction type: money in (a resale
 * sale, a refund, a top-up) or out (a wallet purchase, a withdrawal).
 */
function describeEntry({ transactionType, description, status }: PayoutHistoryData): {
  label: string;
  fallbackTitle: string;
  incoming: boolean;
  tone: EntryTone;
} {
  const type = transactionType?.toLowerCase() ?? "";
  if (type === "refund") {
    return { label: "Refund", fallbackTitle: "Order refund", incoming: true, tone: "refund" };
  }
  if (type === "credit") {
    if (/resale ticket sold/i.test(description ?? "")) {
      return { label: "Sold", fallbackTitle: "Resale ticket sold", incoming: true, tone: "in" };
    }
    if (/wallet funding/i.test(description ?? "")) {
      return { label: "Top-up", fallbackTitle: "Wallet top-up", incoming: true, tone: "in" };
    }
    return { label: "Credit", fallbackTitle: description || "Credit", incoming: true, tone: "in" };
  }
  if (type === "debit") {
    return { label: "Purchase", fallbackTitle: description || "Wallet purchase", incoming: false, tone: "neutral" };
  }
  if (type.includes("withdrawal") || type.includes("payout")) {
    const state = status?.toLowerCase() ?? "";
    return {
      label: status || "Withdrawal",
      fallbackTitle: "Withdrawal to bank",
      incoming: false,
      tone: state === "pending" || state === "processing" ? "pending" : state === "failed" ? "failed" : "neutral",
    };
  }
  return { label: transactionType || "Entry", fallbackTitle: description || "Wallet entry", incoming: false, tone: "neutral" };
}

function PayoutHistoryItem({ listing }: PayoutHistoryItemProps) {
  const { ticketName, amount, quantity, createdDate: date, eventName } = listing;
  const entry = describeEntry(listing);

  return (
    <div className="w-full flex items-center justify-between gap-3 py-4 border border-mid-dark-gray/50 font-inter-tight text-white rounded-lg px-2 -mx-2">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-medium">{eventName || entry.fallbackTitle}</p>
        <div className="flex items-center gap-2">
          {ticketName && (
            <p className="flex items-center gap-1 text-xs font-inter-tight text-[#8E8E93]">
              <TransformedTicket color="#8E8E93" size={14} />
              {ticketName} x {quantity || 1}
            </p>
          )}
          <p className={cn("items-center gap-1 text-xs font-inter-tight text-[#8E8E93]", ticketName ? "hidden md:flex" : "flex")}>
            <CiCalendar className="w-3.5 h-3.5 shrink-0" />
            {formatShortDate(date)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-2">
        <p className="text-xs text-white uppercase tracking-wide whitespace-nowrap">
          {entry.incoming ? "+" : "−"}
          {formatNaira(Math.abs(amount))}
        </p>

        <Badge
          className={cn(
            "capitalize font-normal font-inter-tight px-2 py-0.5 text-[10px] tracking-wide",
            {
              "bg-green/30 text-green hover:bg-[#34C759]/30": entry.tone === "in",
              "bg-[#0A84FF]/20 text-[#409CFF] hover:bg-[#0A84FF]/30": entry.tone === "refund",
              "bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30": entry.tone === "pending",
              "bg-deep-red/20 text-deep-red hover:bg-deep-red/30": entry.tone === "failed",
              "bg-white/10 text-white/70 hover:bg-white/15": entry.tone === "neutral",
            },
          )}
        >
          {entry.label}
        </Badge>
      </div>
    </div>
  );
}
