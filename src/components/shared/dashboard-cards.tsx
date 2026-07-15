import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { RenderEventImage } from "./render-event-flyer";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";

export function DashboardCardSkeleton() {
  return (
    <div className="w-full h-fit flex flex-col border border-gray-200 overflow-hidden">
      <Skeleton className="w-full h-[140px] rounded-none" />
      <div className="flex items-center justify-between px-4 py-2.5 bg-white gap-4">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <div className="grid grid-cols-3 border-t border-gray-100 bg-white">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-9 rounded-none" />
        ))}
      </div>
    </div>
  );
}

export function DashboardCards({
  eventId,
  image,
  name,
  status,
  cardInfo,
  cardButtons,
  className,
  customButton,
  startDate,
}: IDashboardCardProps) {
  return (
    <div className="w-full h-fit flex flex-col border border-gray-200 overflow-hidden">
      {/* Image section with text overlay */}
      <div className="relative flex flex-col items-start justify-end h-[300px] group overflow-hidden">
        <Link
          to={getRoutePath("edit_event", { eventId: eventId })}
          className="w-full h-full"
        >
          <RenderEventImage
            event_name={name}
            image={image}
            className={cn(
              "w-full h-full group-hover:scale-105 transition-all duration-300",
              {
                grayscale: status === "ended",
              },
            )}
          />
        </Link>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

        {/* Status Badge — top left */}
        {status && <StatusBadge status={status} />}

        {/* Link icon — top right */}
        <Link to={getRoutePath("individual_event", { eventId: eventId })}>
          <img
            src="/assets/dashboard/creator/link.png"
            alt="Link"
            width={10}
            height={10}
            className="absolute top-2 right-2 z-10 opacity-70"
          />
        </Link>

        {/* Event name + date — bottom left overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 z-10">
          <p className="font-sf-pro-text font-medium text-[12px] text-white leading-tight capitalize line-clamp-1">
            {name}
          </p>
          <p className="font-sf-pro-display text-[10px] text-white/75 mt-0.5">
            {startDate}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-5 px-3 py-2.5 bg-white border-t border-gray-100">
        {cardInfo}
      </div>

      {/* Action bar — 3 icon buttons */}
      <div
        className={cn(
          "grid grid-cols-3 border-t border-gray-100 bg-white",
          className,
        )}
      >
        {cardButtons.map((item, index) => (
          <EventButtons
            key={item.alt}
            {...item}
            className={
              index < cardButtons.length - 1
                ? "border-r border-gray-100"
                : "border-none"
            }
          />
        ))}

        {customButton}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "ended" | "drafts" | "upcoming" | "ongoing" | "sold_out";
}) {
  return (
    <Badge
      className={cn(
        "py-0.5 px-2 rounded-full text-[9px] font-bold text-white font-sf-pro-text absolute top-2 left-2 z-10 uppercase tracking-wide",
        {
          "bg-tech-blue": status === "drafts",
          "bg-deep-red": status === "ended",
          "bg-green-500": status === "ongoing",
          "bg-orange-500": status === "sold_out",
          "bg-amber-500": status === "upcoming",
        },
      )}
    >
      {status === "sold_out" ? "Sold Out" : status}
    </Badge>
  );
}

function EventButtons({
  Icon,
  alt,
  className,
  action,
  src,
}: IEventButtonsProps) {
  return (
    <Button
      onClick={action}
      variant="ghost"
      className={cn(
        "flex items-center justify-center h-9 hover:bg-gray-50 rounded-none",
        className,
      )}
    >
      {Icon && <Icon color="#888888" size={13} xlinkTitle={alt} />}
      {src && (
        <img
          src={src}
          alt={alt}
          width={13}
          height={11}
          className="opacity-40"
        />
      )}
    </Button>
  );
}

interface IDashboardCardProps {
  className?: string;
  image?: string;
  name: string;
  startDate: string;
  status?: "ended" | "drafts" | "upcoming" | "ongoing" | "sold_out";
  eventId: string;
  cardInfo: React.ReactNode[];
  cardButtons: Omit<IEventButtonsProps, "className">[];
  customButton?: React.ReactNode[];
}

interface IEventButtonsProps {
  Icon?: LucideIcon;
  src?: string;
  alt: string;
  className?: string;
  action?: () => void;
}
