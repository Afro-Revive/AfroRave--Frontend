import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import { MdStorefront } from "react-icons/md";
import { Button } from "@/components/ui/button";
import EventSelect from "@/components/shared/vendor-select";
import { Upload } from "lucide-react";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import CreateVendorSlot from "../component/create-vendor-slot-modal";
import { cn } from "@/lib/utils";
import { useEventSelectorStore } from "@/stores";

export default function RevenueVendorPage() {
  const { selectedEventId } = useEventSelectorStore();
  const { revenueSlots } = useVendorSlotsByType(selectedEventId ?? "");
  console.log("Revenue Slots:", revenueSlots); // Debugging line

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-wrap items-center justify-between bg-white h-36 md:h-14 px-8 border-l border-light-gray">
        <AddFilterBUtton />

        <div className="flex items-center gap-2 md:gap-8">
          {/* <SectionMapBtn type="upload" />
          <SectionMapBtn type="edit" /> */}

          <EventSelect />

          <CreateVendorSlot type="Revenue" />
        </div>
      </div>

      <div className="w-full h-full flex flex-col pt-10 pb-14 px-5">
        <div className="w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]">

          {revenueSlots.length > 0 ? (
            <div></div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3 ">
              <MdStorefront size={40} color="#ae2323" />
              <p className="text-light-red text-xl font-sf-pro-display">
                No Revenue Slots Created
              </p>
              <p className="text-soft-gray text-base font-sf-pro-display">
                Create your first revenue vendor slot to start receiving
                applications
              </p>
            </div>
          )}
          {/* <div className='w-full h-full flex flex-col'>
            {slots.map((item) => (
              <VendorItem key={item.id} {...item} />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}

function SectionMapBtn({ type }: { type: "edit" | "upload" }) {
  return (
    <Button
      variant="ghost"
      className={cn("h-8 flex items-center gap-1 hover:bg-black/10", {
        "text-[#00AD2E]": type === "edit",
        "text-deep-red": type === "upload",
      })}
    >
      <Upload size={18} />
      <span className="text-xs font-sf-pro-display">Upload Section Map</span>
    </Button>
  );
}
