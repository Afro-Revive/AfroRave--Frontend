import { useState } from "react";
import { RiInformationLine, RiPauseLine, RiPlayLine } from "react-icons/ri";
import { SidebarToggle } from "@/components/shared/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { LoadingFallback } from "@/components/loading-fallback";
import {
  useGetVendorSlotById,
  useToggleVendorApplications,
  useVendorApplicationsSlotsByType,
} from "@/hooks/use-vendor-mutation";
import { daysUntilEvent } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import type { VendorSlot } from "@/types/vendor";
import CreateVendorSlot from "./create-vendor-slot-modal";
import { VendorApplicationsList } from "./vendor-applications-list";
import { VENDOR_HOW_IT_WORKS, VendorHowItWorks } from "./vendor-how-it-works";
import { VendorSlotSummary } from "./vendor-slot-summary";

type SlotTab = "vendors" | "details";

/**
 * One slot's page, for either vendor type: its applications (the default tab)
 * or its details, with pause/resume and create in the header.
 */
export function VendorSlotPage({
  type,
  slotId,
}: {
  type: "Revenue" | "Service";
  slotId: string;
}) {
  const [tab, setTab] = useState<SlotTab>("vendors");
  const { data: slotData, isLoading: isSlotLoading } =
    useGetVendorSlotById(slotId);
  const {
    revenueSlots,
    serviceSlots,
    isLoading: isApplicationsLoading,
  } = useVendorApplicationsSlotsByType(slotId);
  const toggleApplications = useToggleVendorApplications(slotId);

  if (isSlotLoading || isApplicationsLoading) {
    return <LoadingFallback />;
  }

  const slot = slotData?.data as VendorSlot | undefined;
  const applications = type === "Revenue" ? revenueSlots : serviceSlots;
  const isPaused = slot?.status === "Paused";

  const tabs: { value: SlotTab; label: string }[] = [
    {
      value: "vendors",
      label: type === "Revenue" ? "Revenue Vendors" : "Service Vendors",
    },
    {
      value: "details",
      label: type === "Revenue" ? "Stall Details" : "Offer Details",
    },
  ];

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full bg-white flex flex-col gap-4 px-5 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <SidebarToggle />

            <div className="flex flex-col gap-1">
              <p className="font-inter-tight text-2xl font-bold text-black">
                {slot?.vendorName}
              </p>
              <p className="font-inter-tight font-medium text-sm text-mid-dark-gray">
                Manage all vendor applications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!slot || toggleApplications.isPending}
              onClick={() => toggleApplications.mutate(!isPaused)}
              className="h-9 gap-1.5 rounded-lg border-black/20 px-4 bg-white font-semibold font-inter-tight text-sm text-black"
            >
              {isPaused ? (
                <RiPlayLine className="size-4" />
              ) : (
                <RiPauseLine className="size-4" />
              )}
              {isPaused ? "Resume Application" : "Pause Application"}
            </Button>
            <CreateVendorSlot type={type} />
          </div>
        </div>

        <div className="flex md:ml-12 items-center gap-2 flex-wrap">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-inter-tight text-sm transition-colors",
                tab === value
                  ? "border-deep-red text-deep-red"
                  : "border-black/20 text-black hover:border-black/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 px-5 py-6 md:py-8">
        {!slot ? (
          <p className="py-12 text-center font-inter-tight text-sm text-mid-dark-gray">
            This {type === "Revenue" ? "stall" : "offer"} couldn’t be loaded.
          </p>
        ) : tab === "vendors" ? (
          <>
            <VendorHowItWorks {...VENDOR_HOW_IT_WORKS[type]} />
            <DeadlineBar slot={slot} type={type} isPaused={isPaused} />
            <VendorSlotSummary
              type={type}
              slot={slot}
              applications={applications}
            />
            <VendorApplicationsList applications={applications} />
          </>
        ) : (
          // The whole form, open on the page like create, filled in to edit.
          <CreateVendorSlot type={type} slot={slot} inline />
        )}
      </div>
    </section>
  );
}

/** The grey line under the note: paused, closed, or how long until it closes. */
function DeadlineBar({
  slot,
  type,
  isPaused,
}: {
  slot: VendorSlot;
  type: "Revenue" | "Service";
  isPaused: boolean;
}) {
  const deadline =
    slot.vendorDetails?.applicationDeadline ??
    (type === "Revenue"
      ? slot.vendorDetails?.slotData?.applicationDeadline
      : slot.vendorDetails?.serviceData?.applicationDeadline);

  let text: string | null = null;
  if (isPaused) {
    text = "Applications are paused. Vendors can’t apply until you resume.";
  } else if (deadline) {
    const days = daysUntilEvent(deadline);
    text =
      days < 0
        ? "Applications have closed."
        : days === 0
          ? "Application ends today"
          : `Application ends in ${days} ${days === 1 ? "day" : "days"}`;
  }

  if (!text) return null;

  return (
    <div className="w-full flex items-center gap-2 rounded-lg bg-[#D9D9D9] px-4 py-3 font-inter-tight text-sm text-black">
      <RiInformationLine className="size-5 shrink-0" />
      {text}
    </div>
  );
}
