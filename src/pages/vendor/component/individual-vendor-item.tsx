import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  ACQUIRED_STATUS_COLOR,
  isAcquiredStatus,
  vendorStatusLabel,
} from "@/lib/helper-func";
import type { IVendor } from "@/data/slots";

export function IndividualVendorItem({
  logoUrl,
  name,
  category,
  date,
  service_name,
  status,
}: IndividualVendorItemProp) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-mid-dark-gray/30 last:border-y hover:bg-black/5">
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt={name}
          width={44}
          height={44}
          className="rounded-full"
        />

        <div className="flex flex-col gap-0.5 font-sf-pro-display text-black">
          <p className="text-sm capitalize leading-[100%]">{name}</p>
          <p className="text-[10px] capitalize leading-[100%]">{category}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {service_name && (
          <p className="font-sf-pro-display font-medium text-sm text-black">
            {service_name}
          </p>
        )}
        <p className="font-sf-pro-display text-xs text-black">{date}</p>
        <Badge
          className={cn(
            "font-sf-pro-display text-xs capitalize p-0 bg-transparent",
            {
              "text-bright-mint": status === "Active" || status === "Complete",
              "text-deep-red": status === "Rejected",
              "text-orange-peel": status === "Pending",
              "text-tech-blue": status === "Requested",
              [ACQUIRED_STATUS_COLOR]: isAcquiredStatus(status),
            }
          )}
        >
          {vendorStatusLabel(status)}
        </Badge>
        <Info size={20} color="#000000" />
      </div>
    </div>
  );
}

interface IndividualVendorItemProp {
  logoUrl: string;
  name: string;
  category: string;
  date: string;
  service_name?: string;
  status: IVendor["status"];
}
