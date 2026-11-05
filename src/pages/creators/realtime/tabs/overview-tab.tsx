import { BaseBarChart, BasePieChart } from "@/components/reusable";
import { formatNaira } from "@/lib/format-price";
import {
  AnalyticsGate,
  type IAnalyticsTabProps,
} from "../components/analytics-state";

/** Each stream keeps its colour across all three charts, whatever its size. */
const TICKETS_COLOR = "#00AD2E";
const VENDORS_COLOR = "#FF9500";

/** The unfilled remainder of a share chart. */
const REMAINDER_COLOR = "#ebebeb";


export default function OverviewTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const netRevenue = Math.max(data.totalNetRevenue, 0);
        const vendorRevenue = Math.max(data.totalRevenueFromVendors, 0);
        // Net revenue is what tickets and vendors add up to, so tickets are the balance.
        const ticketRevenue = Math.max(netRevenue - vendorRevenue, 0);

        const shareOfNet = (value: number) =>
          netRevenue ? `${Math.round((value / netRevenue) * 100)}%` : "0%";

        return (
          <div className="w-full flex flex-col gap-6">
            <h2 className="font-inter text-3xl font-semibold text-system-black">Overview</h2>

            <div className="w-full flex flex-col lg:flex-row gap-4">
              <BasePieChart
                className="flex-1 min-w-0"
                variant="donut"
                title="Revenue streams"
                description={`Tickets ${formatNaira(ticketRevenue)} · Vendors ${formatNaira(vendorRevenue)}`}
                totalLabel=""
                valueLabel="Revenue"
                valueFormatter={formatNaira}
                sort={false}
                data={[
                  {
                    label: "Tickets",
                    value: ticketRevenue,
                    color: TICKETS_COLOR,
                  },
                  {
                    label: "Vendors",
                    value: vendorRevenue,
                    color: VENDORS_COLOR,
                  },
                ]}
                emptyMessage="No revenue recorded for this event yet"
              />

              <BasePieChart
                className="flex-1 min-w-0"
                title="Tickets"
                description={`${data.totalTicketsIssued.toLocaleString()} tickets issued · ${shareOfNet(
                  ticketRevenue,
                )} of net revenue`}
                valueLabel="Revenue"
                variant="donut"
                totalLabel=""
                valueFormatter={formatNaira}
                sort={false}
                data={[
                  {
                    label: "Tickets",
                    value: ticketRevenue,
                    color: TICKETS_COLOR,
                  },
                  {
                    label: "Rest of net revenue",
                    value: Math.max(netRevenue - ticketRevenue, 0),
                    color: REMAINDER_COLOR,
                  },
                ]}
                emptyMessage="No ticket revenue for this event yet"
              />

              <BasePieChart
                className="flex-1 min-w-0"
                title="Vendors"
                variant="donut"
                description={`Top category: ${data.topVendorCategory || "—"} · ${shareOfNet(
                  vendorRevenue,
                )} of net revenue`}
                valueLabel="Revenue"
                valueFormatter={formatNaira}
                sort={false}
                totalLabel=""
                data={[
                  {
                    label: "Vendors",
                    value: vendorRevenue,
                    color: VENDORS_COLOR,
                  },
                  {
                    label: "Rest of net revenue",
                    value: Math.max(netRevenue - vendorRevenue, 0),
                    color: REMAINDER_COLOR,
                  },
                ]}
                emptyMessage="No vendor revenue for this event yet"
              />
            </div>


            <div className="w-full grid gap-4 lg:grid-cols-2">

              <BaseBarChart
                className="min-w-0"
                title="Top Towns"
                description="Attendees by town or city"
                orientation="horizontal"
                data={data.audienceInsights?.locations ?? []}
                xKey="location"
                series={[{ key: "count", label: "Attendees" }]}
                emptyMessage="No town data for this event"
              />

              <BaseBarChart
                className="min-w-0"
                title="Top Age Range"
                description="Attendees by age group"
                orientation="horizontal"
                data={data.audienceInsights?.ageGroups ?? []}
                xKey="ageRange"
                series={[{ key: "count", label: "Attendees" }]}
                emptyMessage="No age data for this event"
              />

              <BaseBarChart
                className="min-w-0"
                title="Gender"
                description="Attendees by gender"
                orientation="horizontal"
                data={data.audienceInsights?.genders ?? []}
                xKey="gender"
                series={[{ key: "count", label: "Attendees" }]}
                emptyMessage="No gender data for this event"
              />
            </div>
          </div>
        );
      }}
    </AnalyticsGate>
  );
}
