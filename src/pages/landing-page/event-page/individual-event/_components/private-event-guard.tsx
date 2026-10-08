import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
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
  // TODO: let approved guests through to the tickets once the event response
  // says whether the viewer has been approved.
  if (toVisibility(event.accessType) !== "private") return <>{children}</>;

  return <PrivateEventNotice />;
}

function PrivateEventNotice() {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated);
  const { openAuthModal } = useAuth();

  function handleRequestAccess() {
    if (!isAuthenticated) {
      // stayOnPage brings them back here to request access, not to their dashboard.
      openAuthModal("login", "guest", {
        notice: "Log in to request access to this private event.",
        stayOnPage: true,
      });
      return;
    }

    // TODO: send the access request once the endpoint exists.
  }

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-5 rounded-2xl bg-black/30 p-5 md:p-6">
      <div className="flex flex-1 items-start md:items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-black">
          <Lock aria-hidden="true" className="size-4" />
        </span>

        <div className="flex flex-col gap-1">
          <p className="text-base md:text-lg font-work-sans font-bold text-white">
            This is a private event
          </p>
          <p className="text-sm text-white font-inter-tight">
            Tickets are only available to approved guests. Request access and
            the organiser will review it. We&apos;ll email you once you&apos;re
            approved.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleRequestAccess}
        className="h-11 shrink-0 rounded-lg font-inter-tight bg-tech-blue px-5 text-sm font-medium text-white hover:bg-tech-blue/90 max-md:w-full">
        Request access
      </Button>
    </div>
  );
}
