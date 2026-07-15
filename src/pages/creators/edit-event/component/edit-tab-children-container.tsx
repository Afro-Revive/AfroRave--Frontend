import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TabChildrenContainer({
  handleBackClick,
  isLoading,
  isPublishing,
  isUploading,
  isPublished,
  handleSaveEvent,
  handlePublishEvent,
  currentTab,
  children,
  buttonText,
  onChange,
}: ITabChildrenProps) {
  return (
    <div className="w-full h-fit flex flex-col items-center">
      <div className="w-full md:flex max-md:flex max-md:flex-col md:items-center justify-between py-3 px-5 md:px-8 bg-white border-l border-[#e9e9e9]">
        <Button
          variant="ghost"
          className="w-fit h-fit hover:bg-black/10 !p-1 flex items-center gap-3"
          onClick={handleBackClick}
          disabled={!handleBackClick}
        >
          <ChevronLeft color="#000000" className="min-w-1.5 min-h-3" />
          <span className="text-sm font-medium font-sf-pro-display text-black">
            {buttonText}
          </span>
        </Button>

        <div className="flex items-center md:gap-8 gap-4 mt-3 md:mt-0">
          <Select value={currentTab} onValueChange={onChange}>
            <SelectTrigger className=" bg-black !text-white rounded-md !px-4 text-sm font-regular [&_svg]:!text-white [&_svg]:!opacity-100">
              <SelectValue placeholder="Tabs" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {[
                { label: "Event Details", value: "event-details" },
                { label: "Tickets", value: "tickets" },
                { label: "Theme", value: "theme" },
                { label: "Settings", value: "settings" },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="destructive"
            className="py-2 w-fit px-8 text-xs font-sf-pro-text font-black rounded-[5px]"
            onClick={handleSaveEvent}
            disabled={isLoading || isUploading}
          >
            {isUploading ? "UPLOADING..." : isLoading ? "SAVING..." : "SAVE"}
          </Button>

          {isPublished === false && (
            <Button
              variant="default"
              className="h-8 w-24 text-xs font-sf-pro-text font-black rounded-[5px]"
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
  handleSaveEvent: () => void;
  handlePublishEvent?: () => void;
  currentTab: string;
  onChange: (tab: string) => void;
  children: React.ReactNode;
  buttonText?: string;
}
