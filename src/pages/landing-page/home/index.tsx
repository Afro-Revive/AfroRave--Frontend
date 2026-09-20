import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDays,
  endOfDay,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo";
import { CategoryBlock } from "@/components/shared/category-block";
import { getRoutePath } from "@/config/get-route-path";
import { useGetAllEvents } from "@/hooks/use-event-mutations";
import { app_store_links } from "@/layouts/root-layout/footer";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types";
import type { EventData } from "@/types/event";

export default function LandingPage() {
  return (
    <div className="w-full text-white ">
      <SEO
        title="Afro Revive - African Concert Tickets & Events"
        description="Buy tickets for the hottest African concerts and events. Secure your spot for live performances by top African artists and experience authentic African entertainment."
      />

      <div className="flex w-full flex-col gap-8 pb-20 md:pb-28">
        <HeroSection />
        <DiscoverEventsSection />
        <ResaleSection />
        <BecomeCreatorSection />
        <MobileAppSection />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex xl:h-screen lg:h-[70vh h] items-center overflow-hidden px-8 pt-[90px]">
      {/* Warm glow bleeding in from behind the mockups, as in the design. */}
      <div className="pointer-events-none absolute -right-24 top-0 h-full  rounded-full bg-deep-red/20 blur-[120px]" />

      {/* w-full so justify-between has room to push the mockups to the right edge. */}
      <div className="relative flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:justify-between max-md:mt-10">
        <div className="flex max-w-2xl flex-col gap-6">
          <h1 className="font-work-sans sm:text-6xl text-5xl font-black uppercase leading-[1.05] lg:text-[80px]">
            Tickets
            <br />
            To Every
            <br />
            <span className="text-deep-red">Sold - Out</span>
            <br />
            Event
            <br />
            Near You
          </h1>

          <p className="font-inter-tight md:text-xl text-base leading-relaxed text-mid-dark-gray">
            Introducing Ticket Resale, designed to make reselling tickets
            simple. Complete transactions without relying on unverified
            third-party channels.
          </p>

          <Link
            to={getRoutePath("events")}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-deep-red px-5 py-4 font-input-mono text-sm uppercase tracking-wide text-white transition-colors hover:bg-deep-red/90"
          >
            Find Tickets
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] shrink-0 lg:mx-0 lg:ml-auto lg:max-w-[450px] lg:self-start lg:-mt-16">
          <img
            src="/assets/FAN_HOMEPAGE/PROP EVENT.png"
            alt=""
            aria-hidden="true"
            className="w-full rounded-xl -rotate-2 shadow-2xl"
          />
          <img
            src="/assets/FAN_HOMEPAGE/WALLET.png"
            alt=""
            aria-hidden="true"
            className="relative max-md:mt-10 md:ml-auto md:w-[70%] rounded-xl shadow-2xl rotate-4"
          />
        </div>
      </div>
    </section>
  );
}

/** Mirrors the quick filters on the events page so the two stay recognisable. */
const DISCOVER_FILTERS = [
  { key: "all", label: "All" },
  { key: "concert", label: "Concert" },
  { key: "week", label: "This Week" },
  { key: "resale", label: "Resale" },
] as const;

type DiscoverFilter = (typeof DISCOVER_FILTERS)[number]["key"];

function DiscoverEventsSection() {
  const [activeFilter, setActiveFilter] = useState<DiscoverFilter>("all");
  const { data: allEventResponse, isPending } = useGetAllEvents();

  const filteredEvents = useMemo(() => {
    const events =
      (allEventResponse?.data as PaginatedResponse<EventData> | undefined)
        ?.items ?? [];

    if (activeFilter === "all") return events;

    const now = new Date();
    const weekEnd = endOfDay(addDays(now, 7));

    return events.filter((event) => {
      if (activeFilter === "resale") return !!event.hasResaleTickets;
      if (activeFilter === "concert") {
        return /concert|festival|music|live/i.test(event.eventName);
      }

      const start = new Date(event.startDate);
      if (isNaN(start.getTime())) return false;
      return (
        isToday(start) ||
        isWithinInterval(start, { start: startOfDay(now), end: weekEnd })
      );
    });
  }, [allEventResponse, activeFilter]);

  return (
    <section className="flex flex-col gap-6 px-8">
      <h2 className="font-work-sans text-3xl font-black uppercase md:text-5xl">
        Discover Events
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        {DISCOVER_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={activeFilter === key}
            onClick={() => setActiveFilter(key)}
            className={cn(
              "rounded-full border px-4 py-1.5 font-input-mono text-xs transition-colors",
              activeFilter === key
                ? "border-deep-red text-white"
                : "border-white/20 text-white/70 hover:border-deep-red hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <CategoryBlock
        data={filteredEvents.map((e) => ({
          ...e,
          desktopMedia: e.metadata.desktopMedia,
        }))}
        showLocation
        isLoading={isPending}
        homePage
      />
    </section>
  );
}

function ResaleSection() {
  return (
    <section className="flex flex-col gap-10 rounded-2xl bg-[#111111] px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
      <div className="flex max-w-xl max-md:text-center flex-col gap-5">
        <p className="font-input-mono text-sm uppercase tracking-[0.45em] text-deep-red">
          Ticket Resale
        </p>

        <h2 className="font-work-sans text-3xl font-black uppercase leading-tight md:text-6xl">
          Can&rsquo;t Make It To An Event?
        </h2>

        <p className="font-inter-tight text-sm md:text-base leading-relaxed text-white">
          Resell your ticket directly on the platform. Once sold, ownership
          transfers securely to the new buyer and the ticket is revalidated,
          removing the need for external payments, DMs, or unverified QR codes.
        </p>

        <Link
          to={getRoutePath("resell")}
          className="w-fit hidden rounded-full md:inline-flex items-center gap-2 bg-transparent border border-white px-7 py-3 font-input-mono text-xs uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
        >
          Learn More
          <ArrowRight size={14} />
        </Link>
      </div>

      <img
        src="/assets/FAN_HOMEPAGE/sell.png"
        alt=""
        aria-hidden="true"
        className="mx-auto shrink-0 object-contain md:mx-0 md:mr-24 w-80 -rotate-2"
      />
      <Link
        to={getRoutePath("resell")}
        className="w-full md:hidden rounded-full inline-flex items-center justify-center gap-2 bg-transparent border border-white px-7 py-5 font-input-mono text-sm uppercase tracking-wide font-semibold text-white transition-colors hover:bg-white hover:text-black"
      >
        Learn More
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}

const CREATOR_STATS = [
  { value: "₦0", label: "Setup Cost" },
  { value: "100%", label: "Ownership & Control" },
  { value: "24/7", label: "Creator Support" },
];

function BecomeCreatorSection() {
  return (
    <section className="flex flex-col md:gap-10 gap-5 md:px-12 px-6 md:py-24 py-6 md:flex-row md:items-center md:justify-between">
      <div className="flex max-w-2xl flex-col gap-5">
        <h2 className="font-work-sans text-3xl font-black uppercase md:text-5xl">
          Become A Creator
        </h2>

        <p className="font-inter-tight text-base md:text-xl leading-relaxed text-white">
          Resell your ticket directly on the platform. Once sold, ownership
          transfers securely to the new buyer and the ticket is revalidated,
          removing the need for external payments, DMs, or unverified QR codes.
        </p>

        <Link
          to={getRoutePath("creators_home")}
          className="w-fit rounded-full bg-white font-semibold items-center inline-flex gap-2 px-7 py-3 font-input-mono text-xs uppercase tracking-wide text-black transition-colors hover:bg-white/90"
        >
          Get Started
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex w-full flex-col divide-y divide-[#ACACAC] md:w-auto md:flex-row md:divide-x md:divide-y-0">
        {CREATOR_STATS.map(({ value, label }) => (
          <div
            key={label}
            // md:-my-10/py-10 lengthens the vertical rules; on mobile the rules
            // already span the full width, so it only needs plain padding.
            className="flex w-full flex-col gap-1 py-6 text-center md:w-auto md:-my-10 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0"
          >
            <p className="font-inter font-medium text-2xl">
              {value}
            </p>
            <p className="font-input-mono text-sm uppercase tracking-wide text-white">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileAppSection() {
  return (
    <section className="relative overflow-hidden flex flex-col gap-6 md:px-12 md:py-48 px-6 py-20 bg-[#111111] ">
      <img
        src="/assets/FAN_HOMEPAGE/mobile app.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="relative flex flex-col gap-6">
        <h2 className="font-phosphate text-3xl font-black uppercase md:text-5xl">
          Get The Mobile App
        </h2>

        <p className="max-w-xl font-inter-tight text-sm md:text-base leading-relaxed text-white">
          Our Ticket Resale feature currently supports only direct ticket sales,
          safely and securely. List, set your price, and let us handle the rest.
        </p>

        <div className="flex items-center gap-3">
          {app_store_links.map((store) => (
            <a
              key={store.alt}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={store.alt}
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={store.src}
                alt={store.alt}
                className="h-10 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
