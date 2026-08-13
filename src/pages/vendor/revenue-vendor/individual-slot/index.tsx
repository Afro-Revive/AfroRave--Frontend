import { useParams } from "react-router-dom";
import { IndividualVendorItem } from "../../component/individual-vendor-item";
import { useEventSelectorStore } from '@/stores'
import { Button } from "@/components/ui/button";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import { BackButton } from "../../component/back-btn";
import EventSelect from "@/components/shared/vendor-select";
import { useVendorApplicationsByType} from "@/hooks/use-vendor-mutation";

export default function IndividualSlots() {
  const { slotId } = useParams();
  const { selectedEventId } = useEventSelectorStore();
  const { revenueApplications } = useVendorApplicationsByType(selectedEventId ?? "");
  const slot = revenueApplications.find((item) => item.vendorId === slotId);

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton name={slot ? slot.vendorBusinessName : "Slot name"} />
          </div>
          <p className="font-inter text-sm font-medium text-mid-dark-gray">
            Event:
          </p>
          <EventSelect />
        </div>

        <div>

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
                {/* {revenueApplications.map((item) => (
                  <IndividualVendorItem key={item.vendorId} logoUrl={item.logoUrl}  />
                ))} */}
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
