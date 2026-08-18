import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import { useGetEvent } from "@/hooks/use-event-mutations";
import { formatEventDate } from "@/lib/helper-func";
import type { EventDetailData } from "@/types/event";
import type { VendorApplications } from "@/types/vendor";
import { VendorSlotCard } from "./vendor-slot-card";
import { VendorSlotCardSkeleton } from "./vendor-slot-card-skeleton";

interface VendorApplicationCardProps {
  application: VendorApplications;
  isBookmarked: boolean;
  onBookmark: (e?: React.MouseEvent) => void;
}

export function VendorApplicationCard({
  application,
  isBookmarked,
  onBookmark,
}: VendorApplicationCardProps) {
  const { data: eventResponse, isPending } = useGetEvent(application.eventId);
  const event = eventResponse?.data as EventDetailData | undefined;

  if (isPending) return <VendorSlotCardSkeleton />;

  const isEnded = event ? new Date(event.eventDate.endDate) < new Date() : false;
  const securedSlots = application.status === "Approved" ? application.requestedSlots : 0;

  return (
    <Link to={getRoutePath("vendor_slot_details", { eventId: application.eventId })}>
      <VendorSlotCard
        image={event?.eventDetails.desktopMedia?.flyer || "/placeholder.png"}
        name={application.eventName}
        date={event ? formatEventDate(event.eventDate.startDate) : ""}
        securedSlots={securedSlots}
        totalSlots={application.requestedSlots}
        isEnded={isEnded}
        isBookmarked={isBookmarked}
        onBookmark={onBookmark}
        onMore={(e) => {
          e?.preventDefault();
          e?.stopPropagation();
        }}
      />
    </Link>
  );
}
