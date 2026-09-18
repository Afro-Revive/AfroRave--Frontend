import { Clock4 } from "lucide-react";
import type { EventDetailData } from "@/types";
import {
  daysUntilEvent,
  formatDateLong,
  formatTimeLong,
} from "@/lib/helper-func";
import { OnlyShowIf } from "@/lib/environment";
import { ShowMoreText } from "@/components/reusable/show-more-text";

export default function EventDescription({
  event,
}: {
  event: EventDetailData;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <p className="font-inter-tight md:text-2xl text-lg font-bold">
        About Event
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-sf-pro-rounded font-medium text-xs text-white">
          <OnlyShowIf condition={event.ageRating === "18+"}>
            <p className="px-3 w-16 h-8 rounded-[6px] bg-light-red flex justify-center items-center">
              18+
            </p>
          </OnlyShowIf>

          <div className="text-white flex items-center gap-2.5 px-3 h-8 rounded-[6px] bg-medium-gray">
            <Clock4 color="#ffffff" size={16} />

            <p>
              {formatTimeLong(event.eventDate.startTime)} -{" "}
              {formatTimeLong(event.eventDate.endTime)}
            </p>
          </div>

          <p className="text-white flex items-center justify-center px-3 w-24 h-8 rounded-[6px] bg-medium-gray">
            {daysUntilEvent(event.eventDate.startDate)} Days Left
          </p>
        </div>

        <div className="flex flex-col mt-5 gap-1">
          <p className="font-inter-tight text-lg font-bold uppercase">
            {event.eventName}
          </p>

          <p className="font-inter-tight text-sm md:text-base font-bold">
            {formatDateLong(event.eventDate.startDate)} | {event.venue}
          </p>

          <p className="font-inter-tight text-sm md:text-base font-bold">
            Doors open: {formatTimeLong(event.eventDate.startTime)} -{" "}
            {formatTimeLong(event.eventDate.endTime)}
          </p>
        </div>

        <div className="flex flex-col gap-1 font-inter-tight text-sm">
          <ShowMoreText text={event.description} limit={200} className="text-sm font-inter-tight" />
        </div>
      </div>
    </div>
  );
}
