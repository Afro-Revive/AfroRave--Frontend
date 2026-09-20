import { cn } from "@/lib/utils";
import type { EventDetailData } from "@/types";
import { RenderEventImage } from "@/components/shared/render-event-flyer";

export default function EventDetailsSection({ event }: ComponentProps) {
  // posterUrl is the current field; older events only carry desktopMedia.flyer.
  const poster =
    event.posterUrl ||
    event.eventDetails?.posterUrl ||
    event.eventDetails?.desktopMedia?.flyer;

  return (
    <div className={cn("relative w-full flex flex-col gap-5")}>
      <div className="flex flex-col gap-1">
        <p className="text-2xl md:text-4xl uppercase font-work-sans tracking-[-0.25px] font-black">
          {event.eventName}
        </p>
      </div>
      <RenderEventImage
        image={poster}
        event_name={event.eventName}
        // w-full so it fills the column instead of overflowing it at a fixed width.
        className="w-full max-w-[450px] h-100 md:h-[550px] shrink-0 object-cover"
      />
    </div>
  );
}

type ComponentProps = {
  event: EventDetailData;
};
