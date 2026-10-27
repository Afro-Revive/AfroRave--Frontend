import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { stripUnderscores } from "@/lib/helper-func";
import type { VendorSlotApplication } from "@/types/vendor";
import { IndividualVendorItem } from "./individual-vendor-item";
import {
  APPLICATION_FILTERS,
  type ApplicationFilter,
} from "./vendor-application-status";

/** A slot's applications: filter pills with counts, a search and the rows. */
export function VendorApplicationsList({
  applications,
  type,
  slotId,
}: {
  applications: VendorSlotApplication[];
  type: "Revenue" | "Service";
  slotId: string;
}) {
  const [filter, setFilter] = useState<ApplicationFilter>("all");
  const [search, setSearch] = useState("");

  const countFor = (value: ApplicationFilter) =>
    value === "all"
      ? applications.length
      : applications.filter((application) => application.status === value)
          .length;

  const query = search.trim().toLowerCase();
  const visible = applications.filter(
    (application) =>
      (filter === "all" || application.status === filter) &&
      (!query ||
        application.vendorBusinessName?.toLowerCase().includes(query) ||
        stripUnderscores(application.category)?.toLowerCase().includes(query)),
  );

  return (
    <div className="w-full flex flex-col rounded-xl bg-white overflow-hidden">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <p className="font-inter-tight text-xl font-bold text-black">Vendors</p>
          <p className="font-inter-tight text-sm text-mid-dark-gray">
            All vendor applications
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {APPLICATION_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full border px-3 py-1 font-inter-tight text-xs transition-colors",
                filter === value
                  ? "border-deep-red text-deep-red"
                  : "border-black/20 text-black hover:border-black/40",
              )}
            >
              {label} {countFor(value)}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 h-10 rounded-lg border border-black/20 px-3 focus-within:border-black/40">
          <RiSearchLine className="size-4 shrink-0 text-mid-dark-gray" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent font-inter-tight text-sm text-black outline-none placeholder:text-mid-dark-gray"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        visible.map((application) => (
          <IndividualVendorItem
            key={application.id}
            application={application}
            type={type}
            slotId={slotId}
          />
        ))
      ) : (
        <div className="flex flex-col items-center gap-1 px-5 py-12 border-t border-black/10 text-center font-inter-tight">
          {applications.length === 0 ? (
            <>
              <p className="text-base font-semibold text-black">
                No applications yet
              </p>
              <p className="text-sm text-mid-dark-gray">
                You’ll see every vendor that applies here.
              </p>
            </>
          ) : (
            <p className="text-sm text-mid-dark-gray">
              No applications match this filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
