import { VendorItem } from "../component/vendor-item";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import { ExportButton } from "../component/export-btn";
import VendorSelect from "@/components/shared/vendor-select";
import { useGetAllVendorSlots } from "@/hooks/use-event-mutations";
import { useEventSelectorStore } from "@/stores";
import CreateVendorSlot from "../component/create-vendor-slot-modal";
import { VendorSlot } from "@/types/vendor";
import { PaginatedResponse } from "@/types";
import { MdStorefront } from "react-icons/md";

export default function ServiceVendorPage() {
  const { selectedEventId } = useEventSelectorStore();
  const { data: slotsResponse } = useGetAllVendorSlots(selectedEventId ?? "");
  const slots = slotsResponse?.data as
    | PaginatedResponse<VendorSlot[]>
    | undefined;
  const slotsData = slots?.items as VendorSlot[] | undefined;
  const serviceSlots =
    slotsData?.filter((slot) => slot.vendorType === "Service") || [];

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-wrap items-center justify-between bg-white h-36 md:h-14 px-8 border-l border-light-gray">
        <AddFilterBUtton />

        <div className="flex items-center gap-2 md:gap-8">
          <ExportButton />
          <VendorSelect />
          <CreateVendorSlot type="Service" />
        </div>
      </div>

      <div className="w-full h-full flex flex-col pt-10 pb-14 px-5">
        <div className="w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]">

          {serviceSlots.length > 0 ? (
            <div></div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MdStorefront size={40} color="#ae2323" />
              <p className="text-light-red text-xl font-sf-pro-display">
                No Service Slots Created
              </p>
              <p className="text-soft-gray text-base font-sf-pro-display">
                Create your first offer to start receiving applications
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
