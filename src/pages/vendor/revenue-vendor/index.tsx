import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import { SidebarToggle } from "@/components/shared/sidebar-toggle";
import CreateVendorSlot from "../component/create-vendor-slot-modal";
import {
  VENDOR_HOW_IT_WORKS,
  VendorHowItWorks,
} from "../component/vendor-how-it-works";
import { useEventSelectorStore } from "@/stores";

export default function RevenueVendorPage() {
  const { selectedEventId } = useEventSelectorStore();
  const { revenueSlots } = useVendorSlotsByType(selectedEventId ?? "");
  console.log("Revenue Slots:", revenueSlots); // Debugging line

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full bg-white flex items-start gap-4 px-5 py-6">
        <SidebarToggle />

        <div className="flex flex-col gap-1">
          <p className="font-inter-tight text-2xl font-bold text-black">
            Revenue Vendor
          </p>
          <p className="font-inter-tight text-sm text-black">
            Sell stall slots to vendors who want to sell goods and products at
            your event.
          </p>
        </div>
      </div>

      {/* The create form is open by default, on the page background as on Event Details. */}
      <div className="w-full flex flex-col gap-6 px-5 py-6 md:py-8">
        <VendorHowItWorks {...VENDOR_HOW_IT_WORKS.Revenue} />

        <div className="w-full">
          <CreateVendorSlot type="Revenue" inline />
        </div>
      </div>
    </section>
  );
}
