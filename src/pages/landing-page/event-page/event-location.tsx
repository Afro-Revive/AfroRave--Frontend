"use client";

import type { IEvents } from "@/data/events";
import { EventOutlineButton } from "./_components/event-otline-btn";
import { CiLocationOn } from "react-icons/ci";

export function EventLocation({
  event_location,
}: {
  event_location: IEvents["event_location"];
}) {
  const encoded = encodeURIComponent(event_location);
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/${encoded}`;

  return (
    <div className="flex max-lg:flex-col gap-[30px] lg:gap-[120px] w-full min-w-0">

      <div className="flex flex-col gap-8 w-full min-w-0">
        <div className="w-full max-w-[722px] h-[300px] md:h-[452px]">
          <iframe
            src={embedUrl}
            loading="lazy"
            className="w-full h-full rounded-[4px] border border-white"
          />
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-inter-tight text-base font-bold">{event_location}</p>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <EventOutlineButton className="w-fit py-5">
              <CiLocationOn className="w-6 h-6" />
              <span className="text-sm font-inter-tight font-bold ">
                Open in Maps
              </span>
            </EventOutlineButton>
          </a>
        </div>
      </div>
    </div>
  );
}
