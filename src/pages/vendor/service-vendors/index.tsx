import { SidebarToggle } from "@/components/shared/sidebar-toggle";
import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import { useEventSelectorStore } from "@/stores";
import CreateVendorSlot from "../component/create-vendor-slot-modal";
import {
  VENDOR_HOW_IT_WORKS,
  VendorHowItWorks,
} from "../component/vendor-how-it-works";

export default function ServiceVendorPage() {
  const { selectedEventId } = useEventSelectorStore();
  const { serviceSlots } = useVendorSlotsByType(selectedEventId ?? "");
  console.log("Service Slots:", serviceSlots); // Debugging line

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full bg-white flex items-start gap-4 px-5 py-6">
        <SidebarToggle />

        <div className="flex flex-col gap-1">
          <p className="font-inter-tight text-2xl font-bold text-black">
            Service Vendors
          </p>
          <p className="font-inter-tight text-sm text-black">
            Post offers for the professional services your event needs and
            review vendor applications.
          </p>
        </div>
      </div>

      {/* On the page background as on Event Details; the offers list stays a white card. */}
      <div className="w-full flex flex-col gap-6 px-5 py-6 md:py-8">
        <VendorHowItWorks {...VENDOR_HOW_IT_WORKS.Service} />
        {/* The create form is open by default. */}
        <div className="w-full">
          <CreateVendorSlot type="Service" inline />
        </div>
      </div>
    </section>
  );
}
