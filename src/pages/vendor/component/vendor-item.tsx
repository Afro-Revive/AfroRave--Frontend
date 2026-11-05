import { useState } from "react";
import { getRoutePath } from "@/config/get-route-path";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Info, Plus } from "lucide-react";

export function VendorItem({
  id,
  name,
  category,
  date,
  count,
  status,
  type = "revenue",
  children,
}: IVendorItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col border-t border-mid-dark-gray/30 last:border-b">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-black/5"
      >
        <div className="flex flex-col gap-3 font-sf-pro-display text-black text-left">
          <p className="text-sm capitalize leading-[100%]">{name}</p>
          <p className="text-[10px] capitalize leading-[100%]">{category}</p>
        </div>

        <div className="flex items-center gap-8">
          <p className="font-sf-pro-display text-xs text-black">{date}</p>
          {count && (
            <p className="font-sf-pro-display text-sm font-medium text-tech-blue">
              {count}
            </p>
          )}
          <Badge
            className={cn(
              "font-sf-pro-display text-xs capitalize p-0 bg-transparent",
              {
                "text-bright-mint": status === "Active" || status === "Complete",
                "text-deep-red": status === "Draft",
              }
            )}
          >
            {status}
          </Badge>
          <Plus
            className={cn(
              "size-[13px] text-black/40 transition-transform duration-200",
              { "rotate-45": open }
            )}
          />
        </div>
      </button>

      {open && (
        <div className="flex flex-col gap-3 px-8 pb-5 pt-1 bg-black/[0.02]">
          {children}
          <Link
            to={
              type === "revenue"
                ? getRoutePath("revenue_vendor_slot", { slotId: id })
                : getRoutePath("service_vendor_slot", { slotId: id })
            }
            className="w-fit flex items-center gap-1.5 text-xs font-sf-pro-display text-deep-red hover:underline"
          >
            <Info size={14} />
            View Full Details
          </Link>
        </div>
      )}
    </div>
  );
}

interface IVendorItem {
  id: string;
  name: string;
  category: string;
  date: string;
  count?: string;
  status: string;
  type?: "revenue" | "service";
  children?: React.ReactNode;
}
