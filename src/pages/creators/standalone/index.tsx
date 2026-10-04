import { LoadingFallback } from "@/components/loading-fallback";
import { ComingSoon } from "@/components/reusable";
import {
  DashboardCardSkeleton,
  DashboardCards,
  type EventVisibility,
} from "@/components/shared/dashboard-cards";
import { Button } from "@/components/ui/button";
import { getRoutePath } from "@/config/get-route-path";
import {
  useGetEvent,
  useGetOrganizerEvents,
} from "@/hooks/use-event-mutations";
import { formatNaira } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { EventData, EventDetailData } from "@/types";
import type { PaginatedResponse } from "@/types/api";
import {
  ArrowRight,
  Download,
  Plus,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardTabs, type DashboardTab } from "./components/dashboard-tabs";
import { Pagination } from "@/components/shared/pagination";
import {
  EventFilters,
  countEventsByStatus,
  getListEventStatus,
  type EventListFilter,
} from "./components/event-filters";
import { useGuideStore } from "@/stores";
import { FiBarChart } from "react-icons/fi";
import { IconType } from "react-icons/lib";

function formatEventDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  return (
    date.toLocaleDateString("en-GB", { weekday: "short" }) +
    ", " +
    day +
    suffix +
    " " +
    date.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  );
}

/** Three rows of the widest grid. */
const EVENTS_PER_PAGE = 12;

export default function StandalonePage() {
  // Asks for the whole set in one request
  const { data: response, isPending: isLoading } = useGetOrganizerEvents({
    pageNumber: 1,
    pageSize: 200,
  });
  const [activeTab, setActiveTab] = useState<DashboardTab>("events");
  const [activeFilter, setActiveFilter] = useState<EventListFilter>("all");
  const [page, setPage] = useState(1);
  const { startGuide } = useGuideStore();

  // Memoised because `?? []` hands back a new array every render, which would
  // otherwise invalidate both useMemos below on every pass.
  const allEvents = useMemo(
    () =>
      (response?.data as PaginatedResponse<EventData> | undefined)?.items ?? [],
    [response],
  );

  // Counts come off the unfiltered list, so the pills keep showing every
  // bucket's size no matter which one is selected.
  const counts = useMemo(() => countEventsByStatus(allEvents), [allEvents]);

  // Filtering moved up here from the card: the counts above need the status of
  // every event anyway, and doing it in both places let them disagree.
  const events = useMemo(
    () =>
      activeFilter === "all"
        ? allEvents
        : allEvents.filter(
            (event) => getListEventStatus(event) === activeFilter,
          ),
    [allEvents, activeFilter],
  );

  const totalPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE));

  // Clamped rather than reset: a filter that shrinks the list can strand you on
  // a page that no longer exists, which would render an empty grid.
  const currentPage = Math.min(page, totalPages);

  const visibleEvents = useMemo(
    () =>
      events.slice(
        (currentPage - 1) * EVENTS_PER_PAGE,
        currentPage * EVENTS_PER_PAGE,
      ),
    [events, currentPage],
  );

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <section className="w-full h-full flex flex-col items-start mb-[75px]">
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "guestlist" ? (
        <ComingSoon
          title="Guestlist"
          description="Guestlist management is coming soon. You will be able to invite and check in guests from here."
          showBackButton={false}
        />
      ) : (
        <div className="w-full px-6 lg:px-10 pt-6 flex flex-col gap-8">
          <EventFilters
            counts={counts}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((item) => (
                <StandAloneEvents
                  key={item.eventId}
                  id={item.eventId}
                  accessType={item.accessType}
                />
              ))
            ) : (
              <EmptyState onStartGuide={startGuide} />
            )}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalCount={events.length}
            onPageChange={setPage}
            itemLabel={{ one: "event", other: "events" }}
          />
        </div>
      )}
    </section>
  );
}

function EmptyState({ onStartGuide }: { onStartGuide: () => void }) {
  return (
    <div className="col-span-full w-full py-20 flex flex-col items-center gap-4">
      <p className="text-2xl font-bold text-charcoal font-sf-pro-display">
        No events yet
      </p>
      <p className="text-sm text-gray-400 max-w-xs font-sf-pro-text leading-relaxed text-center">
        Tap the + to start a quick tutorial on creating your first event.
      </p>
      <button
        onClick={onStartGuide}
        className="w-16 h-16 rounded-full bg-deep-red/10 flex items-center justify-center mt-2 hover:bg-deep-red/20 transition-colors"
      >
        <Plus color="#8B0000" size={28} strokeWidth={1.5} />
      </button>
    </div>
  );
}

/**
 * Takes the detail payload, so unlike getListEventStatus it can see sold_out —
 * ticket counts live on eventStat, which the list endpoint doesn't return.
 */
function getEventStatus(
  event: EventDetailData,
): "drafts" | "upcoming" | "ongoing" | "sold_out" | "ended" {
  if (!event.isPublished) return "drafts";

  const now = new Date();
  const startDate = new Date(event.eventDate.startDate);
  const endDate = new Date(event.eventDate.endDate);

  if (now > endDate) return "ended";

  const { ticketSold, totalTicket } = event.eventStat;
  if (totalTicket > 0 && ticketSold >= totalTicket) return "sold_out";

  if (now >= startDate && now <= endDate) return "ongoing";

  return "upcoming";
}

/**
 * accessType arrives as a free-form string, so anything that isn't recognisably
 * public or private returns undefined and the badge stays off rather than
 * guessing at an event's visibility.
 */
function toEventVisibility(accessType?: string): EventVisibility | undefined {
  const value = accessType?.trim().toLowerCase();


  if (value === "private") return "Private";
  if (value === "public") return "Public";

  return undefined;
}

function StandAloneEvents({
  id,
  accessType,
}: {
  id: string;
  accessType?: string;
}) {
  const { data: response, isPending: isLoading } = useGetEvent(id);

  const event = response?.data as EventDetailData | undefined;

  if (isLoading) {
    return <DashboardCardSkeleton />;
  }

  if (!event) {
    return null;
  }

  const status = getEventStatus(event);

  return (
    <DashboardCards
      image={event.eventDetails.desktopMedia?.flyer}
      name={event.eventName}
      startDate={formatEventDate(event.eventDate.startDate)}
      status={status}
      visibility={toEventVisibility(accessType)}
      eventId={event.eventId}
      cardInfo={[
        <StatParagraph
          key="sold_tickets"
          name="Tickets Sold"
          stats={{
            value: event.eventStat.ticketSold,
            totalValue: event.eventStat.totalTicket,
          }}
        />,
        <StatParagraph
          key="profit"
          name="Net Profit"
          stats={{ totalValue: formatNaira(event.eventStat.netProfit) }}
        />,
      ]}
      cardButtons={event_buttons}
      customButton={[
        <EventActionButton
          key="event_action"
          eventId={event.eventId}
          status={status}
        />,
      ]}
    />
  );
}

type EventStatus = ReturnType<typeof getEventStatus>;

/**
 * The card's third action, which changes with the event's state: a draft is
 * still being written, an ended event only has its numbers left, and anything
 * live is managed.
 */
function EventActionButton({
  eventId,
  status,
}: {
  eventId: string;
  status: EventStatus;
}) {
  const action = {
    drafts: {
      label: "Edit Draft",
      to: getRoutePath("edit_event", { eventId }),
      Icon: ArrowRight,
      className: "text-tech-blue hover:text-tech-blue",
    },
    ended: {
      label: "Report",
      to: getRoutePath("reports"),
      Icon: Download,
      className: "text-[#464444] hover:text-black",
    },
  }[status as "drafts" | "ended"] ?? {
    // upcoming, ongoing and sold_out are all still live events.
    label: "Manage",
    to: getRoutePath("edit_event", { eventId }),
    Icon: ArrowRight,
    className: "text-deep-red hover:text-deep-red",
  };

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 rounded-none border-l border-gray-100 hover:bg-gray-50",
        action.className,
      )}
    >
      <Link to={action.to}>
        <span className="font-sf-pro-text text-[10px] font-semibold uppercase whitespace-nowrap">
          {action.label}
        </span>
        <action.Icon size={12} />
      </Link>
    </Button>
  );
}

function StatParagraph({ name, stats }: IStatParagraph) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-work-sans text-xs font-bold uppercase text-[#464444] whitespace-nowrap">
        {name}
      </p>

      <p className="font-inter-tight text-xs font-bold text-[#00AD2E] whitespace-nowrap">
        {typeof stats.value === "number" ? (
          <>
            {stats.value} /{" "}
            <span className="text-black">{stats.totalValue}</span>
          </>
        ) : (
          stats.totalValue
        )}
      </p>
    </div>
  );
}

const event_buttons: {
  src?: string;
  Icon?: LucideIcon | IconType;
  alt: string;
  label: string;
}[] = [
  {
    Icon: FiBarChart,
    alt: "Analytics",
    label: "Analytics",
  },
  { Icon: Ticket, alt: "Tickets", label: "Tickets" },
];

interface IStatParagraph {
  name: string;
  stats: { value?: number; totalValue: number | string };
}
