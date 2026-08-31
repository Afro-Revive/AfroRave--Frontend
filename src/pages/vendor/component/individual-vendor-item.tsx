import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { VendorSlotApplication } from "@/types/vendor";
import { initialsFrom, stripUnderscores } from "@/lib/helper-func";
import VendorProfileModal from "./vendor-profile-modal";

export function IndividualVendorItem({
  application
}: { application: VendorSlotApplication }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const vendorName = application.vendorBusinessName
  const category = application.category;
  const date = application.createdAt
  const status = application.status
  const avatar =
    application.vendorProfilePicture ||
    application.vendorBusinessData?.profilePicture;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsProfileOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsProfileOpen(true);
          }
        }}
        className="flex items-center justify-between px-8 py-5 border-t border-mid-dark-gray/30 last:border-y hover:bg-black/5 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={avatar} alt="" className="object-cover" />
            <AvatarFallback className="bg-mid-dark-gray/20 text-black font-inter text-xs">
              {initialsFrom(vendorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 font-sf-pro-display text-black">
            <p className="text-sm capitalize leading-[100%]">{vendorName}</p>
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
                "text-[#00AD2E]": status === "Acquired",
              }
            )}
          >
            {status}
          </Badge>
        </div>
      </div>

      <VendorProfileModal
        application={application}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </>
  );
}
