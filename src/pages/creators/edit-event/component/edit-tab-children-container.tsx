import { Button } from "@/components/ui/button";
import { SidebarToggle } from "@/components/shared/sidebar-toggle";

// handleBackClick and buttonText are still accepted but unused while the back
// button above the title is commented out.
export function TabChildrenContainer({
  isLoading,
  isPublishing,
  isUploading,
  isPublished,
  hasChanges,
  handleSaveEvent,
  handlePublishEvent,
  children,
}: ITabChildrenProps) {
  return (
    <div className="w-full h-fit flex flex-col items-center">
      {/* Mobile: the title block and actions dissolve (contents) into one
          wrapping row, reordered as title + buttons, then the description,
          then "Unsaved changes". md: toggle, title block, actions side by side. */}
      <div className="w-full flex max-md:flex-wrap items-center gap-x-3 gap-y-2 md:gap-4 py-3 px-5 md:px-8 bg-white border-l border-[#e9e9e9]">
        {/* <Button
          variant="ghost"
          className="w-fit h-fit hover:bg-black/10 !p-1 flex items-center gap-3"
          onClick={handleBackClick}
          disabled={!handleBackClick}
        >
          <ChevronLeft color="#000000" className="min-w-1.5 min-h-3" />
          <span className="text-sm font-medium font-inter-tight text-black">
            {buttonText}
          </span>
        </Button> */}
        <SidebarToggle className="self-start" />

        <div className="max-md:contents md:flex md:flex-1 md:flex-col md:gap-2">
          <p className="max-md:order-1 max-md:flex-1 max-md:min-w-0 text-xl md:text-2xl font-bold font-inter-tight text-black capitalize">
            Event Details
          </p>
          <p className="max-md:order-3 max-md:basis-full text-sm font-inter-tight text-black">
            Update the information attendees see on your event page.
          </p>
        </div>

        <div className="max-md:contents flex items-center gap-8">
          {hasChanges && (
            <p className="max-md:order-4 max-md:basis-full flex items-center gap-1.5 text-xs font-inter-tight text-mid-dark-gray">
              <span className="size-1.5 rounded-full bg-deep-red" aria-hidden />
              Unsaved changes
            </p>
          )}

          {/* Nothing to save until something's been edited. */}
          <Button
            variant="destructive"
            className="max-md:order-2 py-2 w-fit xl:px-8 px-4 text-xs font-inter-tight font-black rounded-[5px]"
            onClick={handleSaveEvent}
            disabled={!hasChanges || isLoading || isUploading}
          >
            {isUploading ? "UPLOADING..." : isLoading ? "SAVING..." : "SAVE"}
          </Button>

          {isPublished === false && (
            <Button
              variant="default"
              className="max-md:order-2 h-8 w-fit px-4 md:w-24 text-xs font-inter-tight font-black rounded-[5px]"
              onClick={handlePublishEvent}
              disabled={isPublishing}
            >
              {isPublishing ? "PUBLISHING..." : "PUBLISH"}
            </Button>
          )}
        </div>
      </div>

      <div className="container w-full h-fit flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

interface ITabChildrenProps {
  handleBackClick?: () => void;
  isLoading?: boolean;
  isPublished?: boolean;
  isPublishing?: boolean;
  isUploading?: boolean;
  hasChanges?: boolean;
  handleSaveEvent: () => void;
  handlePublishEvent?: () => void;
  children: React.ReactNode;
  buttonText?: string;
}
