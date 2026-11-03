import { getRoutePath } from "@/config/get-route-path";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { IVendor } from "@/data/slots";

export function VendorItem({
  id,
  name,
  category,
  date,
  count,
  status,
  type = "revenue",
}: IVendorItem) {
  return (
    <Link
      to={
        type === "revenue"
          ? getRoutePath("revenue_vendor_slot", { slotId: id })
          : getRoutePath("service_vendor_slot", { slotId: id })
      }
      className="flex items-center justify-between px-8 py-5 border-t border-mid-dark-gray/30 last:border-y hover:bg-black/5"
    >
      <div className="flex flex-col gap-3 font-inter-tight text-black">
        <p className="text-sm capitalize leading-[100%]">{name}</p>
        <p className="text-[10px] capitalize leading-[100%]">{category}</p>
      </div>

      <div className="flex items-center gap-8">
        <p className="font-inter-tight text-xs text-black">{date}</p>
        {count && (
          <p className="font-inter-tight text-sm font-medium text-tech-blue">
            {count}
          </p>
        )}
        <Badge
          className={cn(
            "font-inter-tight text-xs capitalize p-0 bg-transparent",
            {
              "text-bright-mint": status === "Active" || status === "Complete",
              "text-deep-red": status === "Draft",
            }
          )}
        >
          {status}
        </Badge>
        <Info size={20} color="#000000" />
      </div>
    </Link>
  );
}

interface IVendorItem {
  id: number;
  name: string;
  category: string;
  date: string;
  count?: string;
  status: IVendor["status"];
  type?: "revenue" | "service";
}
