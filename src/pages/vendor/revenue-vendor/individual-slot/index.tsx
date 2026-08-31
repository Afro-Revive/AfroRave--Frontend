import { useParams } from "react-router-dom";
import { IndividualVendorItem } from "../../component/individual-vendor-item";
import {
  useGetVendorSlotById,
  useVendorApplicationsSlotsByType,
} from "@/hooks/use-vendor-mutation";
import EventSelect from "@/components/shared/vendor-select";
import CreateVendorSlot from "../../component/create-vendor-slot-modal";
import EditVendorSlotModal from "../../component/edit-vendor-slot-modal";
import { VendorSlot } from "@/types/vendor";
import { LoadingFallback } from "@/components/loading-fallback";

export default function IndividualSlots() {
  const { slotId } = useParams();
  const { data: slotData, isLoading: isSlotLoading } = useGetVendorSlotById(
    slotId ?? "",
  );
  const { revenueSlots: revenueApplications, isLoading: isApplicationsLoading } =
    useVendorApplicationsSlotsByType(slotId ?? "");
  const slot = slotData?.data as VendorSlot | undefined;
  if (isSlotLoading || isApplicationsLoading) {
    return <LoadingFallback />;
  }
  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray">
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-3">
            <BackButton name={slot ? slot.vendorName : "Slot name"} />
          </div> */}
          <p className="font-inter text-sm font-medium text-mid-dark-gray">
            Event:
          </p>
          <EventSelect />
        </div>
       {slot?.status === "Active" && (
          <p className="font-inter text-sm font-semibold text-[#00AD2E]">
            Application Ongoing
          </p>
        )}

        <div className="flex items-center gap-3">
          <EditVendorSlotModal type="Revenue" slot={slot} />
          <CreateVendorSlot type="Revenue" />
        </div>
        {/* 
        <div className="flex items-center gap-8">
          <Button
            variant="destructive"
            className="px-5 py-2.5 rounded-[6px] gap-3 h-8"
          >
            <span className="font-sf-pro-text text-xs capitalize">
              View Section Map
            </span>
          </Button>
        </div> */}
      </div>

      <div className="w-full h-full flex flex-col pt-10 pb-14 px-5">
        <div className="w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]">
          <div className="w-full h-full flex flex-col">
            {revenueApplications.length > 0 ? (
              <>
                {revenueApplications?.map((item) => (
                  <IndividualVendorItem key={item.vendorId} application={item} />
                ))}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                  src="/public/assets/event/stopwatch.svg"
                  alt="Empty State"
                  className="w-12 h-12"
                />
                <p className="text-center text-[#00AD2E] text-xl font-sf-pro-display mt-4">
                  Application Is Ongoing.
                </p>
                <p className="text-center font-sf-pro-display text-soft-gray text-base">
                  No vendors have applied for this slot yet. You’ll see all
                  incoming requests here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
