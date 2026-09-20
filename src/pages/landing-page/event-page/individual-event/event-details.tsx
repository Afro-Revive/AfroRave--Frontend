import { EventLocation } from "@/pages/landing-page/event-page/event-location";
import type { EventDetailData } from "@/types";
import Cart from "../cart";
import { SectionContainer } from "./_components/section-container";
import ContactSection from "./sections/contact";
import EventDescription from "./sections/event-description";
import EventDetailsSection from "./sections/event-details";
import TicketSection from "./sections/tickets";
import EventBookmarkButton from "./_components/event-bookmark-button";
import { useAfroStore } from "@/stores";

export default function EventDetails({ event }: IEventDetailsProp) {
  const { isAuthenticated } = useAfroStore();

  return (
    <section className="md:pb-16 w-full flex flex-col items-center">
      {/* pt clears the fixed header — there's no background image to sit under. */}
      <div className="relative w-full grid lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] gap-10 lg:gap-[100px] px-5 lg:px-[120px] pt-[120px] md:pt-[140px] z-10">
        <div className="lg:sticky lg:top-30 lg:self-start">
          <EventDetailsSection event={event} />
        </div>

        {isAuthenticated && (
          <div className="absolute top-20 right-2 md:top-28 md:right-5 z-10">
            <EventBookmarkButton
              isWatchlisted={event?.isOnWatchlist}
              eventId={event.eventId}
            />
          </div>
        )}

        {/* Everything else scrolls past the pinned column. */}
        <div className="flex min-w-0 flex-col gap-8 md:gap-16 md:mt-14">

          <Cart event={event} />

          {/**Event Description */}
          <EventDescription event={event} />

          {/**Tickets */}
          <TicketSection eventId={event.eventId} />

          {/**Location */}
          <SectionContainer>
            <EventLocation event_location={event.venue} />
          </SectionContainer>

          {/**Contact */}
          <ContactSection event={event} />

          {/* <TermsSection /> */}
        </div>
      </div>
    </section>
  );
}

interface IEventDetailsProp {
  event: EventDetailData;
}
