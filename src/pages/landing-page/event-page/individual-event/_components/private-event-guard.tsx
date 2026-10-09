import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import {
  useGetViewerAccessStatus,
  useRequestAccess,
} from "@/hooks/use-private-event-mutations";
import { toVisibility } from "@/lib/helper-func";
import { useAfroStore } from "@/stores";
import type { EventDetailData } from "@/types";
import { Lock } from "lucide-react";

/**
 * Private events don't sell tickets to the public — approved guests get theirs
 * by invite. Anyone else sees a request-access card where the tickets would be.
 */
export function PrivateEventGuard({
  event,
  children,
}: {
  event: EventDetailData;
  children: React.ReactNode;
}) {
  if (toVisibility(event.accessType) !== "private") return <>{children}</>;

  return <PrivateEventAccess eventId={event.eventId}>{children}</PrivateEventAccess>;
}

function PrivateEventAccess({
  eventId,
  children,
}: {
  eventId: string;
  children: React.ReactNode;
}) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const { openAuthModal } = useAuth();
  const requestAccess = useRequestAccess(eventId);

  // Only a signed-in viewer has a status; anyone else can only be asked to log in.
  const { data: access, isPending: isStatusLoading } = useGetViewerAccessStatus(
    eventId,
    { enabled: isAuthenticated },
  );

  if (isAuthenticated && isStatusLoading) {
    return <Skeleton className="h-[120px] w-full rounded-2xl bg-black/30" />;
  }

  // Approved guests see the tickets; the section handles sold out and the rest.
  if (access?.canPurchaseTickets || access?.status === "Approved") {
    return <>{children}</>;
  }

  // Organisers don't deny — a request they don't approve stays pending, so a
  // Denied status reads as pending too. The status refetches after a request;
  // until it lands, the click counts.
  if (
    access?.status === "Pending" ||
    access?.status === "Denied" ||
    requestAccess.isSuccess
  ) {
    return (
      <AccessNotice
        title="Your request is pending"
        body="The organiser is reviewing your request. We'll email you once you're approved."
        action={<RequestButton disabled>Request sent</RequestButton>}
      />
    );
  }

  if (access?.isApplicationPaused) {
    return (
      <AccessNotice
        title="Requests are paused"
        body="The organiser has paused requests for this event. Check back later."
      />
    );
  }

  // Ended, or closed some other way such as a passed deadline.
  if (access && (access.isApplicationEnded || !access.canRequestAccess)) {
    return (
      <AccessNotice
        title="Requests have closed"
        body="The organiser is no longer accepting requests for this event."
      />
    );
  }

  function handleRequestAccess() {
    if (!isAuthenticated) {
      // stayOnPage brings them back here to request access, not to their dashboard.
      openAuthModal("login", "guest", {
        notice: "Log in to request access to this private event.",
        stayOnPage: true,
      });
      return;
    }

    requestAccess.mutate();
  }

  return (
    <AccessNotice
      title="This is a private event"
      body="Tickets are only available to approved guests. Request access and the organiser will review it. We'll email you once you're approved."
      action={
        <RequestButton
          onClick={handleRequestAccess}
          disabled={requestAccess.isPending}
        >
          {requestAccess.isPending ? "Requesting..." : "Request access"}
        </RequestButton>
      }
    />
  );
}

function AccessNotice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-5 rounded-2xl bg-black/30 p-5 md:p-6">
      <div className="flex flex-1 items-start md:items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-black">
          <Lock aria-hidden="true" className="size-4" />
        </span>

        <div className="flex flex-col gap-1">
          <p className="text-base md:text-lg font-work-sans font-bold text-white">
            {title}
          </p>
          <p className="text-sm text-white font-inter-tight">{body}</p>
        </div>
      </div>

      {action}
    </div>
  );
}

function RequestButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 shrink-0 rounded-lg font-inter-tight bg-tech-blue px-5 text-sm font-medium text-white hover:bg-tech-blue/90 max-md:w-full"
    >
      {children}
    </Button>
  );
}
