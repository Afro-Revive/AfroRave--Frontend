import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGetEventAttendees } from "@/hooks/use-event-mutations";
import { formatShortDate } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import { useEventSelectorStore } from "@/stores";
import type { EventAttendee, PaginatedResponse } from "@/types";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AnalyticsMessage,
  type IAnalyticsTabProps,
} from "../components/analytics-state";
import {
  AnalyticsCard,
  ProgressBar,
  StatTile,
  SummaryCard,
} from "../components/analytics-ui";
import { attendeeCounts } from "../lib/analytics-data";

const ATTENDEES_PER_PAGE = 20;
const COLUMNS = ["Name", "Ticket", "Order ID", "Order Date", "Check-in"];

/**
 * Everyone with a ticket for the selected event, 20 a page, searchable. The list
 * reads its own endpoint; the summary above it counts the analytics response's
 * full attendee list, which the page has already loaded.
 */
export default function AttendeeListTab({
  data: analytics,
}: IAnalyticsTabProps) {
  const { selectedEventId } = useEventSelectorStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  // A new event or search is a new list, so the old page number is meaningless.
  useEffect(() => setPage(1), [selectedEventId, debouncedSearch]);

  const { data, isPending, isFetching, isError } = useGetEventAttendees(
    selectedEventId ?? "",
    {
      pageNumber: page,
      pageSize: ATTENDEES_PER_PAGE,
      search: debouncedSearch || undefined,
    },
  );

  if (!selectedEventId)
    return <AnalyticsMessage message="Select an event to see its attendees." />;

  const attendeePage = data?.data as
    PaginatedResponse<EventAttendee> | undefined;
  const attendees = attendeePage?.items ?? [];
  const counts = analytics?.attendeeList
    ? attendeeCounts(analytics.attendeeList)
    : null;

  return (
    <>
      {counts && (
        <SummaryCard description="Tickets on this event, and how many have been scanned in at the door.">
          <StatTile
            label="Tickets"
            value={counts.tickets.toLocaleString()}
            caption="Held by attendees"
          />
          <StatTile
            label="Checked In"
            value={counts.checkedIn.toLocaleString()}
            caption={`${counts.tickets ? Math.round((counts.checkedIn / counts.tickets) * 100) : 0}% of tickets`}
          >
            <ProgressBar
              value={counts.checkedIn}
              max={counts.tickets}
              label="Tickets checked in"
            />
          </StatTile>
          <StatTile
            label="Still to Arrive"
            value={(counts.tickets - counts.checkedIn).toLocaleString()}
          />
        </SummaryCard>
      )}

      <AnalyticsCard
        title="Attendees"
        description="One row per ticket. Search by name or email."
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search attendees"
            className="h-11 rounded-lg border border-[#595959]/50 pl-9 pr-9 font-inter-tight"
          />

          {isFetching && !isPending && (
            <LoaderCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-mid-dark-gray" />
          )}
        </div>

        {isPending ? (
          <div className="flex justify-center py-10">
            <LoaderCircle className="size-6 animate-spin text-deep-red" />
          </div>
        ) : isError ? (
          <p className="py-10 text-center font-inter-tight text-sm text-mid-dark-gray">
            We couldn’t load the attendees. Try again shortly.
          </p>
        ) : attendees.length === 0 ? (
          <p className="py-10 text-center font-inter-tight text-sm text-mid-dark-gray">
            {debouncedSearch
              ? `No attendees match “${debouncedSearch}”.`
              : "No one has a ticket for this event yet."}
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableCaption className="sr-only">
                Attendees for this event
              </TableCaption>

              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((label) => (
                    <TableHead
                      key={label}
                      className="font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]"
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {attendees.map((attendee, index) => (
                  // No id of its own; an order can hold several tickets, hence the index.
                  <TableRow
                    key={`${attendee.orderId ?? "order"}-${attendee.email ?? ""}-${index}`}
                    className="font-inter-tight text-sm text-black"
                  >
                    <TableCell className="flex flex-col">
                      <span>{attendee.name || "—"}</span>
                      <span className="text-xs text-mid-dark-gray">
                        {attendee.email}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {attendee.ticketName || attendee.ticket || "—"}
                      {attendee.quantity > 1 && (
                        <span className="text-mid-dark-gray">
                          {" "}
                          × {attendee.quantity}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {attendee.orderId || "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {attendee.orderDate
                        ? formatShortDate(attendee.orderDate)
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
                          attendee.isCheckedIn
                            ? "bg-[#00AD2E]/15 text-[#00AD2E]"
                            : "bg-black/5 text-mid-dark-gray",
                        )}
                      >
                        {attendee.isCheckedIn ? "Checked in" : "Not arrived"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          page={attendeePage?.pageNumber ?? page}
          totalPages={attendeePage?.totalPages ?? 1}
          totalCount={attendeePage?.totalCount ?? attendees.length}
          onPageChange={setPage}
          itemLabel={{ one: "attendee", other: "attendees" }}
          isLoading={isFetching}
        />
      </AnalyticsCard>
    </>
  );
}
