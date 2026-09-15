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

  // currently using the ticket resale response to get the payout history
  // However this will change to the payoutHistory response once the endpoint has added the updated eventName and ticketName
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
            Funds Are Added To Your Wallet After Successful Resale
          </p>

          <div className="w-full flex flex-col gap-5">
            {isLoadingPayouts ? (
              <LoadingFallback className="h-[120px]" />
            ) : payoutHistory.length === 0 ? (
              <p className="text-white/60 text-sm font-sf-pro-display">
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

/**
    E
 */
function PayoutHistoryItem({ listing }: PayoutHistoryItemProps) {
  const { ticketName, amount, quantity, createdDate: date, status, eventName } = listing;
  // for now the response will change and it will include the eventName and ticketName
  return (
    <div
      role="button"
      tabIndex={0}
      className="w-full flex items-center justify-between py-4 border border-mid-dark-gray/50 font-sf-pro-display text-white hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2"
    >
      <div className="flex flex-col gap-1">
        {/** Ticket name will be replaced with the actual event name */}
        <p className="text-sm font-medium">{eventName}</p>
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1 text-xs font-sf-pro-display text-[#8E8E93]">
            <TransformedTicket color="#8E8E93" size={14} />
            {ticketName} x {quantity}
          </p>
          <p className="hidden md:flex items-center gap-1 text-xs font-sf-pro-display text-[#8E8E93]">
            <CiCalendar className="w-3.5 h-3.5 shrink-0" />
            {formatShortDate(date)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-white uppercase tracking-wide">
          {formatNaira(amount)}
        </p>

        <Badge
          className={cn(
            "capitalize font-normal font-sf-pro-rounded px-2 py-0.5 text-[10px] tracking-wide",
            {
              "bg-green/30 text-green hover:bg-[#34C759]/30": status === "Sold",
              "bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30":
                status === "Active",
            },
          )}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}
