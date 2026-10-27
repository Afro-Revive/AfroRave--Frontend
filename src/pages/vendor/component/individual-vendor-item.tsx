import { useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { VendorSlotApplication } from "@/types/vendor";
import { initialsFrom, stripUnderscores } from "@/lib/helper-func";
import VendorProfileModal from "./vendor-profile-modal";
import { APPLICATION_STATUS } from "./vendor-application-status";

/** One application in a slot's vendors list; opens the vendor's profile. */
export function IndividualVendorItem({
  application,
}: {
  application: VendorSlotApplication;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const vendorName = application.vendorBusinessName;
  const status = APPLICATION_STATUS[application.status];
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
        className="flex items-center justify-between gap-4 px-5 py-4 border-t border-black/10 hover:bg-black/5 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={avatar} alt="" className="object-cover" />
            <AvatarFallback className="bg-black text-white font-inter-tight text-xs">
              {initialsFrom(vendorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 min-w-0 font-inter-tight text-black">
            <p className="text-sm font-semibold capitalize leading-none truncate">
              {vendorName}
            </p>
            <p className="text-[10px] capitalize leading-none truncate">
              {stripUnderscores(application.category)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <p className={cn("font-inter-tight text-xs", status?.className)}>
            {status?.label ?? application.status}
          </p>
          <RiArrowRightSLine className="size-5 text-black" />
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
