import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import { useGetEvent } from "@/hooks/use-event-mutations";
import { formatEventDate } from "@/lib/helper-func";
import type { EventDetailData } from "@/types/event";
import type { VendorApplications } from "@/types/vendor";
import { VendorSlotCard } from "./vendor-slot-card";
import { VendorSlotCardSkeleton } from "./vendor-slot-card-skeleton";

interface VendorApplicationCardProps {
  applications: VendorApplications[];
  isBookmarked: boolean;
  onBookmark: (e?: React.MouseEvent) => void;
}

export function VendorApplicationCard({
  applications,
  isBookmarked,
  onBookmark,
}: VendorApplicationCardProps) {

  const primary = applications[0];
  const { data: eventResponse, isPending } = useGetEvent(primary.eventId);
  const event = eventResponse?.data as EventDetailData | undefined;

  if (isPending) return <VendorSlotCardSkeleton />;

  const isEnded = event
    ? new Date(event.eventDate.endDate) < new Date()
    : false;
  const totalSlots = applications.reduce(
    (sum, application) => sum + application.requestedSlots,
    0,
  );

  // Calculate the total number of secured slots (applications with status "Secured")
  const securedSlots = applications
    .filter((application) => application.status === "Secured")
    .reduce((sum, application) => sum + application.requestedSlots, 0);

  return (
    <Link to={getRoutePath("vendor_slot_details", { eventId: primary.eventId })}>
      <VendorSlotCard
        image={event?.eventDetails.desktopMedia?.flyer || "/placeholder.png"}
        name={primary.eventName}
        date={event ? formatEventDate(event.eventDate.startDate) : ""}
        securedSlots={securedSlots}
        totalSlots={totalSlots}
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
