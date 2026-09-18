import {
  addDays,
  endOfDay,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { date_list } from "@/components/constants";
import {
  BaseSelect,
  type ICustomSelectProps,
} from "@/components/reusable/base-select";
import { useMemo } from "react";
import {
  useGetTrendingEvents,
  useGetAllEvents,
} from "@/hooks/use-event-mutations";
import { CategoryBlock } from "@/components/shared/category-block";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import type { EventData, TrendingEventData } from "@/types/event";
import type { PaginatedResponse } from "@/types";

const MONTH_ABBRS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/** Map category label to slug keywords for matching against event names */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "concerts-and-festivals": ["concert", "festival", "music", "live"],
  "arts-and-performance": [
    "art",
    "perform",
    "theatre",
    "theater",
    "dance",
    "show",
  ],
  children: ["child", "kid", "family", "youth"],
  sports: ["sport", "football", "basketball", "athletics", "game", "match"],
  "career-and-business": [
    "career",
    "business",
    "conference",
    "summit",
    "networking",
    "workshop",
  ],
  comedy: ["comedy", "stand-up", "standup", "laugh"],
  "culture-and-religion": [
    "culture",
    "cultural",
    "religion",
    "religious",
    "heritage",
    "tradition",
  ],
};

/**
 * Toggle filters that sit alongside the selects. `when` values are mutually
 * exclusive — picking one replaces the other.
 */
const QUICK_FILTERS = [
  { param: "resale", value: "true", label: "Resale" },
  { param: "when", value: "tonight", label: "Tonight" },
  { param: "when", value: "week", label: "This Week" },
] as const;

function filterEvents(
  events: EventData[],
  params: URLSearchParams,
): EventData[] {
  const q = params.get("q")?.toLowerCase().trim() ?? "";
  const exactDate = params.get("date") ?? "";
  const month = params.get("month") ?? "";
  const categorySlug = params.get("category") ?? "";
  const when = params.get("when") ?? "";
  const resaleOnly = params.get("resale") === "true";

  // Computed once for the whole pass rather than per event.
  const now = new Date();
  const weekEnd = endOfDay(addDays(now, 7));

  return events.filter((event) => {
    if (when) {
      const start = new Date(event.startDate);
      if (isNaN(start.getTime())) return false;

      if (when === "tonight" && !isToday(start)) return false;
      if (
        when === "week" &&
        !isWithinInterval(start, { start: startOfDay(now), end: weekEnd })
      ) {
        return false;
      }
    }

    if (resaleOnly && !event.hasResaleTickets) return false;

    if (q) {
      const matchesName = event.eventName.toLowerCase().includes(q);
      const matchesVenue = event.venue.toLowerCase().includes(q);
      if (!matchesName && !matchesVenue) return false;
    }

    if (exactDate) {
      if (!event.startDate.startsWith(exactDate)) return false;
    }

    if (month) {
      const eventDate = new Date(event.startDate);
      if (!isNaN(eventDate.getTime())) {
        const eventMonth = MONTH_ABBRS[eventDate.getMonth()];
        if (eventMonth !== month) return false;
      }
    }

    if (categorySlug) {
      const keywords = CATEGORY_KEYWORDS[categorySlug] ?? [];
      if (keywords.length > 0) {
        const name = event.eventName.toLowerCase();
        const hasMatch = keywords.some((kw) => name.includes(kw));
        if (!hasMatch) return false;
      }
    }

    return true;
  });
}

export default function EventCategoryBlocks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSearch =
    (location.state as { fromSearch?: boolean } | null)?.fromSearch === true;

  // Sync BaseSelect state with URL params
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedMonth = searchParams.get("month") ?? "";

  // isPending is dropped while the Trending block below is commented out.
  const { data: trendingEventResponse } = useGetTrendingEvents();
  const { data: allEventResponse, isPending: isLoadingAllEvent } =
    useGetAllEvents();

  const trendingEvents = trendingEventResponse?.data as
    | PaginatedResponse<TrendingEventData>
    | undefined;
  const allEvents = allEventResponse?.data as
    | PaginatedResponse<EventData>
    | undefined;

  const filteredEvents = useMemo(
    () => filterEvents(allEvents?.items ?? [], searchParams),
    [allEvents, searchParams],
  );

  const activeFilters = [
    searchParams.get("q"),
    searchParams.get("date"),
    searchParams.get("month"),
    searchParams.get("category"),
    searchParams.get("when"),
    searchParams.get("resale"),
  ].filter(Boolean);

  /** Clicking an active quick filter clears it, so each button toggles. */
  const toggleQuickFilter = (param: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (next.get(param) === value) next.delete(param);
    else next.set(param, value);
    setSearchParams(next);
  };

  const clearFilters = () => {
    if (fromSearch) {
      // Came from search bar on another page — go back to where they were
      navigate(-1);
    } else {
      // Filtered on this page itself — just reset URL params
      setSearchParams(new URLSearchParams());
    }
  };
  console.log(trendingEvents);

  return (
    <section className="w-full bg-[#1E1E1E] flex flex-col gap-10  pb-16 md:px-8 lg:px-0 min-h-[calc(100vh-300px)]">
      {/* <div className='lg:pl-[60px]'>
        <CategoryBlock
          name='Trending'
          data={trendingEvents?.items ?? []}
          showLocation={true}
          isLoading={isLoadingTrending}
          layout='start'
        />
      </div> */}
      <OffTheDeckHero />

      <div className="flex flex-col gap-10 md:px-20 px-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 md:gap-6 overflow-x-auto min-h-[40px]">
            <BaseSelect
              type="others"
              placeholder={category_list.placeholder}
              width={category_list.width}
              items={category_list.items}
              value={selectedCategory}
              onChange={(value) => {
                const next = new URLSearchParams(searchParams);
                if (value) next.set("category", value);
                else next.delete("category");
                setSearchParams(next);
              }}
              triggerClassName="rounded-full hover:border-deep-red md:w-1/5 w-full px-5"
            />

            <BaseSelect
              type="others"
              placeholder={date_list.placeholder}
              items={date_list.items}
              value={selectedMonth}
              onChange={(value) => {
                const next = new URLSearchParams(searchParams);
                if (value) next.set("month", value);
                else next.delete("month");
                // Clear exact date when month is chosen (they'd conflict)
                next.delete("date");
                setSearchParams(next);
              }}
              triggerClassName="rounded-full hover:border-deep-red md:w-1/5 w-full px-5"
            />

            {QUICK_FILTERS.map(({ param, value, label }) => {
              const active = searchParams.get(param) === value;

              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleQuickFilter(param, value)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "border-deep-red bg-deep-red text-white"
                      : "border-white/20 text-white hover:border-deep-red",
                  )}
                >
                  {label}
                </button>
              );
            })}

            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-white/50 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Show result count only when there's an active text search */}
          {searchParams.get("q") && (
            <p className="text-xs text-white/40">
              {filteredEvents.length} result
              {filteredEvents.length !== 1 ? "s" : ""} for &ldquo;
              {searchParams.get("q")}&rdquo;
            </p>
          )}
        </div>

        <CategoryBlock
          data={filteredEvents.map((e) => ({
            ...e,
            desktopMedia: e.metadata.desktopMedia,
          }))}
          showLocation={true}
          isLoading={isLoadingAllEvent}
          display="grid"
        />

      </div>
    </section>
  );
}

const off_the_deck_socials: { href: string; icon: IconType; alt: string }[] = [
  { href: "https://www.instagram.com/offthedeck__?stkn=dDJ4Z2k3N2wxMHFs", icon: IoLogoInstagram, alt: "Off The Deck on Instagram" },
  { href: "https://x.com/offthedeck_?s=11", icon: FaXTwitter, alt: "Off The Deck on X" },
  { href: "https://youtube.com/@offthedecksessions?si=HMM-5ob4HRRoLmJH", icon: FaYoutube, alt: "Off The Deck on YouTube" },
];

function OffTheDeckHero() {
  return (
    <section className="relative mt-20 flex min-h-50 md:min-h-80 w-full items-center-safe md:pt-8 pt-6 justify-start overflow-hidden ">
      <img
        src="/assets/landing-page/ad bg.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Keeps the copy legible over the brighter centre of the artwork. */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex flex-col gap-4 md:px-24 px-8 ">
        <p className="font-phosphate text-2xl md:text-4xl font-black uppercase leading-0 mb-2 text-secondary-white">
          OffTheDeck
        </p>

        <p className="font-inter-tight text-base font-bold md:text-xl capitalize text-secondary-white">
          New episodes out on YouTube
        </p>
        <p className="font-inter-tight text-sm md:text-base text-secondary-white">
          Listen to specially curated dj sessions
        </p>

        <div className="mt-1 flex items-center gap-4">
          {off_the_deck_socials.map(({ href, icon: Icon, alt }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={alt}
              className="text-white transition-opacity hover:opacity-80"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const category_list: ICustomSelectProps = {
  width: 368,
  defaultValue: "sports",
  placeholder: "All Events",
  items: [
    { value: "concerts-and-festivals", label: "Concerts & Festivals" },
    { value: "arts-and-performance", label: "Arts & Performance" },
    { value: "children", label: "Children" },
    { value: "sports", label: "Sports" },
    { value: "career-and-business", label: "Career & Business" },
    { value: "comedy", label: "Comedy" },
    { value: "culture-and-religion", label: "Culture & Religion" },
  ],
};
