import { Button } from "@/components/ui/button";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import { ChevronLeft, Upload, ChevronRight } from "lucide-react";
import { useAfroStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { ProfileSection } from "./components/profile-section";
import { VendorEditProfileModal } from "./edit-profile-modal";
import { ViewProfileModal } from "./view-profile-modal";

export default function VendorProfilePage() {
  const { user } = useAfroStore();
  console.log("Vendor Profile Page User:", user);

  return (
    <section className="w-full h-full flex flex-col justify-start items-start px-[1px]">
      <div className="w-full h-14 flex items-center justify-between px-4 md:px-8 bg-white">
        <AddFilterBUtton />

        <div className="flex items-center gap-1 md:gap-4">
          <Button
            variant="ghost"
            className="px-2 md:px-5 py-2.5 rounded-[6px] gap-1 h-8 text-black opacity-50 hover:bg-black/10"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline font-sf-pro-text text-xs capitalize">
              Upload Portfolio
            </span>
          </Button>
          <ViewProfileModal />
          <VendorEditProfileModal />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 md:gap-8 px-4 md:px-5 py-6 md:py-10">
        <div className="w-full flex items-center gap-3 pr-3">
          <img
            src="/assets/dashboard/store.png"
            alt="Store"
            width={42}
            height={42}
            className="w-8 h-8 md:w-10 md:h-10"
          />

          <p className="text-xl sm:text-2xl md:text-[28px] font-sf-pro-display text-black break-words font-normal">
            Welcome! {user?.profile.firstName} {user?.profile.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-y-3 md:gap-x-2">
          <ProfileSection user={user} />
          <div className="w-full flex flex-col gap-2 h-full">
            <VendorSummarySection />
            <InboxSection user={user} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <SlotOverviewSection />
          </div>
        </div>
      </div>
    </section>
  );
}



function VendorSummarySection() {
  return (
    <SectionContainer className="flex flex-col flex-1">
      <p className="text-black font-bold font-sf-pro-display text-[14px] md:text-[15px] mb-1">Vendor Summary</p>
      <VendorSummarySubSection name="Saved Events" amount={12} />
      <VendorSummarySubSection name="Total Events Secured" amount={50} />
      <VendorSummarySubSection name="Total Slots Acquired" amount={80} />
    </SectionContainer>
  );
}

function SlotOverviewSection() {
  return (
    <SectionContainer className="!py-3 md:!py-4 flex flex-col gap-3">
      <p className="text-black font-bold font-sf-pro-display text-[14px] md:text-[15px]">Slot Overview</p>

      {/* <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[600px] px-4 md:px-0">
          <BaseTable caption="Slot Overview" columns={columns} />
        </div>
      </div> */}

      <div className="w-full flex items-center justify-between mt-1">
        <div className="flex gap-1 text-[11px] md:text-[12px]">
          <p className="py-1 px-2 text-black font-sf-pro-rounded">
            1-4 of 16 items
          </p>
          <p className="py-1 px-2 text-black font-sf-pro-rounded">
            1 of 4 pages
          </p>
        </div>

        <div className="px-2 flex gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#1e1e1e]" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#1e1e1e]" />
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}

function InboxSection({ user }: { user: User | null }) {
  return (
    <SectionContainer className="flex flex-row items-center justify-between !py-4 md:!py-5">
      <div className="flex items-center gap-3 md:gap-4">
        <p className="text-black font-medium font-sf-pro-display text-[14px] md:text-[15px]">Inbox</p>
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#EB5757] flex items-center justify-center">
          <span className="text-white text-[10px] md:text-[11px] font-sf-pro-rounded font-semibold">
            {user?.messages || 6}
          </span>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto">
        <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1e1e1e]" />
      </Button>
    </SectionContainer>
  );
}

function VendorSummarySubSection({
  name,
  amount,
}: {
  name: string;
  amount: number;
}) {
  return (
    <div className="w-full h-11 md:h-12 flex items-center justify-between border-t border-[#E0E0E0] text-black">
      <p className="text-[12px] md:text-[13px] font-sf-pro-display capitalize">
        {name}
      </p>
      <p className="px-3 md:px-3.5 text-[11px] md:text-[12px] font-sf-pro-rounded">{amount}</p>
    </div>
  );
}

export function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full px-5 md:px-[30px] py-5 md:py-6 bg-secondary-white rounded-[10px]",
        className
      )}
    >
      {children}
    </div>
  );
}

const columns = [
  { key: "eventName", label: "Event Name" },
  { key: "requestedSlots", label: "Requested Slots" },
  { key: "totalPrice", label: "Total Price" },
  { key: "status", label: "Status" },
];

;