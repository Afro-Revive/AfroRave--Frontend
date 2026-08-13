import { useParams } from "react-router-dom";

import { SearchData } from "../../component/search-data";
import { IndividualVendorItem } from "../../component/individual-vendor-item";
import { BackButton } from "../../component/back-btn";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import EventSelect from "@/components/shared/vendor-select";
import { ExportButton } from "../../component/export-btn";
import { useEventSelectorStore } from "@/stores";
import { useVendorApplicationsByType } from "@/hooks/use-vendor-mutation";

export default function IndividualServicePage() {
  const { serviceId } = useParams();
  const { selectedEventId } = useEventSelectorStore();
  const { serviceApplications } = useVendorApplicationsByType(
    selectedEventId ?? "",
  );
  const service = serviceApplications.find(
    (item) => item.vendorId === serviceId,
  );

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray">
        <div className="flex items-center gap-3">
          <BackButton name={service ? service.vendorBusinessName : "Slot name"} />

          <AddFilterBUtton />
        </div>

        <div className="flex items-center gap-8">
          <ExportButton />

          <EventSelect />
        </div>
      </div>

      <div className="w-full h-full flex flex-col pt-10 pb-14 px-5">
        <div className="w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]">
          <SearchData />

          <div className="w-full flex flex-col">
            {service ? (
              <>
                {/* {serviceApplications.map((item) => (
                  <IndividualVendorItem key={item.id} {...item} />
                ))} */}
              </>
            ) : (
              <p className="text-black w-full text-center opacity-60">
                No Services Found!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
