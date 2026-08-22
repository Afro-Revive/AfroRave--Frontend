import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { VendorSlotApplication } from "@/types/vendor";
import { stripUnderscores } from "@/lib/helper-func";

export function IndividualVendorItem({
  application
}: { application: VendorSlotApplication }) {
  const isRevenue = application.vendorType === "Revenue";
  console.log(application.vendorType)
  const name = isRevenue ? application.vendorDetails.slotData.slotName : application.vendorDetails.serviceData?.serviceName;
  const category = application.category;
  const date = application.createdAt 
  const status = application.status
  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-mid-dark-gray/30 last:border-y hover:bg-black/5">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5 font-sf-pro-display text-black">
          <p className="text-sm capitalize leading-[100%]">{name}</p>
          <p className="text-[10px] capitalize leading-[100%]">{stripUnderscores(category)}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <p className="font-sf-pro-display text-xs text-black">{date}</p>
        <Badge
          className={cn(
            "font-sf-pro-display text-xs capitalize p-0 bg-transparent",
            {
              "text-deep-red": status === "Rejected",
              "text-orange-peel": status === "Pending",
            }
          )}
        >
          {status}
        </Badge>
        <Info size={20} color="#000000" />
      </div>
    </div>
  );
}

