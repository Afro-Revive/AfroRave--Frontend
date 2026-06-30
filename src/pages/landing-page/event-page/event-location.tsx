"use client";

import type { IEvents } from "@/data/events";
import { BlockName } from "./_components/block-name";
import { EventOutlineButton } from "./_components/event-otline-btn";

export function EventLocation({
  event_location,
}: {
  event_location: IEvents["event_location"];
}) {
  const encoded = encodeURIComponent(event_location);
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/${encoded}`;

  return (
    <div className="flex max-lg:flex-col gap-[30px] lg:gap-[120px]">
      <BlockName name="location" />

      <div className="flex flex-col gap-8">
        <div className="w-full lg:w-[525px] xl:w-[722px] h-[300px] md:h-[452px]">
          <iframe
            src={embedUrl}
            loading="lazy"
            className="w-full h-full rounded-[4px] border border-white"
          />
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-sf-pro-display">{event_location}</p>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <EventOutlineButton>
              <span className="text-sm font-sf-pro-rounded font-medium">
                Open in Maps
              </span>
            </EventOutlineButton>
          </a>
        </div>
      </div>
    </div>
  );
}
