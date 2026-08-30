import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ReviewListingModal from "./review-listing-modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetUsersResaleTickets } from "@/hooks/use-tickets-mutations";
// import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import { Search } from "lucide-react";
import { PaginatedResponse } from "@/types";
import { UsersResaleTickets } from "@/types/ticket";
import { LoadingFallback } from "@/components/loading-fallback";
import { formatNaira } from "@/lib/format-price";
import { formatShortDate } from "@/lib/helper-func";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";

export default function ListedTicketPage() {
  // The listing being reviewed, or null when the modal is closed.
  const [reviewing, setReviewing] = useState<UsersResaleTickets | null>(null);
  const { data, isLoading } = useGetUsersResaleTickets();
  const listedTickets = data?.data as
    | PaginatedResponse<UsersResaleTickets>
    | undefined;
  if (isLoading) {
    return <LoadingFallback className="mb-[160px] h-[250px]" />;
  }
  return (
    <div className="w-full flex-1 flex flex-col items-center pt-8 pb-[100px] px-4 md:px-0">
      <div className="w-full max-w-[550px] flex flex-col gap-6">
                      <div className="w-full flex items-center gap-3 py-3 px-4 rounded-lg border border-white/10 bg-transparent font-sf-pro-display text-white transition-colors focus-within:border-white/20">
                <Search className="w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search"
                  className="p-0 h-auto bg-transparent border-none placeholder:text-white/40 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
        {/* List */}
        <div className="flex flex-col gap-0">
          {listedTickets?.items.length === 0 && (
            <div className="w-full flex flex-col items-center h-screen justify-center gap-4 ">
              <p className=" text-base font-sf-pro-display uppercase text-white text-center font-bold">
               No Listed Tickets
              </p>
              <Link to={getRoutePath("my_tickets")} className="w-fit px-12 py-2 bg-white text-black font-sf-pro-display text-sm rounded-lg transition-colors border-none flex items-center justify-center">
                Sell Your Tickets
              </Link>
            
              </div>
          )}
          {listedTickets?.items.map((item) => (
            <ListedTickets
              key={item.id}
              listing={item}
              onReview={() => setReviewing(item)}
            />
          ))}
        </div>
      </div>

      {reviewing && (
        <ReviewListingModal
          listing={reviewing}
          open={reviewing !== null}
          onOpenChange={(next) => !next && setReviewing(null)}
        />
      )}
    </div>
  );
}

function ListedTickets({ listing, onReview }: ListedTicketsProps) {
  const { ticketName, price, quantity, createdDate: date, status } = listing;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onReview}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onReview();
        }
      }}
      className="w-full flex items-center justify-between py-4 border-b border-white/5 font-sf-pro-display text-white hover:bg-white/5 transition-colors cursor-pointer rounded-lg px-2 -mx-2"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{ticketName}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs">x {quantity}</p>
          <p className="text-xs text-white uppercase tracking-wide">
            {formatNaira(price)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs text-white/40 hidden md:block">
          {formatShortDate(date)}
        </p>

        <Badge
          className={cn(
            "capitalize font-normal px-2 py-0.5 text-[10px] tracking-wide",
            {
              "bg-[#34C759]/20 text-[#34C759] hover:bg-[#34C759]/30":
                status === "Sold",
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

export interface ListedTicketsProps {
  listing: UsersResaleTickets;
  onReview: () => void;
}
