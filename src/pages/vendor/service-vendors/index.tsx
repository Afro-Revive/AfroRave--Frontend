import { VendorItem } from "../component/vendor-item";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import { ExportButton } from "../component/export-btn";
import EventSelect from "@/components/shared/vendor-select";
import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import { useEventSelectorStore } from "@/stores";
import CreateVendorSlot from "../component/create-vendor-slot-modal";
import { formatShortDate, stripUnderscores } from "@/lib/helper-func";

export default function ServiceVendorPage() {
  const { selectedEventId } = useEventSelectorStore();
  const { serviceSlots } = useVendorSlotsByType(selectedEventId ?? "");
  console.log("Service Slots:", serviceSlots); // Debugging line

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-wrap items-center justify-between bg-white h-36 md:h-14 px-8 border-l border-light-gray">
        <AddFilterBUtton />

        <div className="flex items-center gap-2 md:gap-8">
          <ExportButton />
          <EventSelect />
          <CreateVendorSlot type="Service" />
        </div>
      </div>

      <div className="w-full h-full flex flex-col pt-10 pb-14 px-5">
        <div className="w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]">
          {serviceSlots.length > 0 ? (
            <div className="w-full h-full flex flex-col">
              {serviceSlots.map((slot) => (
                <VendorItem
                  key={slot.vendorId}
                  id={slot.vendorId}
                  name={slot.vendorName}
                  category={stripUnderscores(slot.category)}
                  date={formatShortDate(
                    slot.vendorDetails.serviceData?.applicationDeadline ?? "",
                  )}
                  // Backend doesn't return a slot status yet — replace when it does.
                  status="Active"
                  type="service"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <img
                src="/public/assets/event/document.svg"
                alt="Empty State"
                className="w-12 h-12"
              />
              <p className="text-light-red text-xl font-sf-pro-display">
                No Offers Created
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
