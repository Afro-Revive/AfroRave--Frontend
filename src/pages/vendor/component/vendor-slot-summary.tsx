import { Link } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { getRoutePath } from "@/config/get-route-path";
import { formatNaira } from "@/lib/format-price";
import type { VendorSlot, VendorSlotApplication } from "@/types/vendor";

/**
 * A slot's numbers, laid out like the tickets page summary. A revenue slot
 * shows what its secured stalls bring in; a service slot, the budget it offers.
 */
export function VendorSlotSummary({
  type,
  slot,
  applications,
}: {
  type: "Revenue" | "Service";
  slot: VendorSlot | undefined;
  applications: VendorSlotApplication[];
}) {
  const secured = applications.filter(
    (application) => application.status === "Secured",
  );
  const requests = applications.filter(
    (application) => application.status === "Pending",
  ).length;

  const price = slot?.vendorDetails?.slotData?.price ?? 0;
  // A vendor can secure more than one stall; one when it doesn't say.
  const netProfit = secured.reduce(
    (total, application) =>
      total +
      price *
        (application.noOfRequestedStalls || application.requestedSlots || 1),
    0,
  );

  const serviceData = slot?.vendorDetails?.serviceData;
  const budget = serviceData?.hasBudgetRange
    ? `${formatNaira(serviceData.minBudget)} - ${formatNaira(serviceData.maxBudget)}`
    : "—";

  return (
    <div className="w-full flex flex-col gap-5 rounded-xl bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-inter-tight text-base font-bold text-black">
            Summary
          </p>
          <p className="font-inter-tight text-sm text-mid-dark-gray">
            {type === "Revenue"
              ? "Stall sales and vendor requests for this slot."
              : "The budget and vendor requests for this offer."}
          </p>
        </div>

        {/* Analytics reads the selected event, which is already this one. */}
        <Button
          asChild
          className="h-10 shrink-0 gap-2 rounded-lg bg-black px-4 font-inter-tight text-sm text-white hover:bg-black/90"
        >
          <Link to={getRoutePath("realtime")}>
            View Analytics
            <RiArrowRightLine className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {type === "Revenue" ? (
          <SummaryStat label="Net Profit">{formatNaira(netProfit)}</SummaryStat>
        ) : (
          <SummaryStat label="Budget">{budget}</SummaryStat>
        )}
        <SummaryStat label="Total Secured">{secured.length}</SummaryStat>
        <SummaryStat label="Total Requests">{requests}</SummaryStat>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-[#F2F2F2] px-4 py-3">
      <p className="font-inter-tight text-sm text-black">{label}</p>
      <p className="font-inter-tight text-xl font-bold text-black">{children}</p>
    </div>
  );
}
