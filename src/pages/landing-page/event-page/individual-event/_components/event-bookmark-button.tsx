import { useEffect, useState } from "react";
import { useSaveEventToWatchlist, useDeleteEventFromWatchlist } from "@/hooks/use-event-mutations";
import { Bookmark, Loader2 } from "lucide-react";

interface EventBookmarkButtonProps {
  isWatchlisted: boolean | undefined;
  eventId: string;
}

const EventBookmarkButton = ({
  isWatchlisted,
  eventId,
}: EventBookmarkButtonProps) => {
  const [watchlisted, setWatchlisted] = useState(!!isWatchlisted);
  const { mutate: saveEventToWatchlist, isPending: isSaving } =
    useSaveEventToWatchlist(eventId);
  const { mutate: deleteEventFromWatchlist, isPending: isDeleting } =
    useDeleteEventFromWatchlist(eventId);
  const isUpdating = isSaving || isDeleting;

  useEffect(() => {
    setWatchlisted(!!isWatchlisted);
  }, [isWatchlisted]);

  function handleClick() {
    const wasWatchlisted = watchlisted;
    setWatchlisted(!wasWatchlisted);
    if (wasWatchlisted) {
      deleteEventFromWatchlist(undefined, {
        onError: () => setWatchlisted(wasWatchlisted),
      });
    } else {
      saveEventToWatchlist(undefined, {
        onError: () => setWatchlisted(wasWatchlisted),
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-system-black rounded-full px-3 py-3 items-center justify-center flex gap-2"
    >
      <span className="text-sm font-inter font-bold uppercase text-white">
        {watchlisted ? "Remove from Watchlist" : "Save to Mobile"}
      </span>
      {isUpdating ? (
        <Loader2 size={16} color="var(--foreground)" className="animate-spin" />
      ) : (
        <Bookmark size={16} color="var(--foreground)" />
      )}
    </button>
  );
};

export default EventBookmarkButton;
