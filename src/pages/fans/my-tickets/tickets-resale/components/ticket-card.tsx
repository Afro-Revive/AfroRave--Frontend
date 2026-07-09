import { cn } from "@/lib/utils";
import { TransformedTicket } from "../../components/transformed-ticket-icon";
import { formatNaira } from "@/lib/format-price";
import { Plus, Minus } from "lucide-react";
interface TicketCardProps {
  ticketName: string;
  ticketPrice: number;
  ticketQuantity: number;
  isSelected: boolean;
  count: number;
  maxReached: boolean;
  onSelect: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function TicketCard({
  ticketName,
  ticketPrice,
  ticketQuantity,
  isSelected,
  count,
  maxReached,
  onSelect,
  onIncrement,
  onDecrement,
}: TicketCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
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
          {ticketName}
        </p>
        <p className="text-xs text-black/40 font-sf-pro-display">
          {formatNaira(ticketPrice)} · {ticketQuantity} available
        </p>
      </div>

      {isSelected ? (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onDecrement}
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
            onClick={onIncrement}
            disabled={count >= ticketQuantity || maxReached}
            className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors disabled:opacity-30"
          >
            <Plus size={10} />
          </button>
        </div>
      ) : (
        <span className="text-xs text-black/30 font-sf-pro-display">
          ×{ticketQuantity}
        </span>
      )}
    </button>
  );
}
