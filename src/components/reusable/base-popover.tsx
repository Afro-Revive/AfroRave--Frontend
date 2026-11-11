/**
 * A reusable popover component built on top of shadcn/ui Popover.
 * Provides a simple way to display floating content relative to a trigger element.
 *
 * @example
 * ```tsx
 * <BasePopover
 *   trigger={<Button>Open Popover</Button>}
 *   content={
 *     <div className="p-4">
 *       <p>Popover content goes here</p>
 *     </div>
 *   }
 * />
 * ```
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface IPopoverProps {
  /** The trigger element that opens the popover (usually a button) */
  trigger: React.ReactNode;
  /** The content to display in the popover */
  content: React.ReactNode;
  className?: string;
  /** Pass both to control it, e.g. to close it once an option is picked. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Which side of the trigger it opens on. Below by default. */
  side?: "top" | "right" | "bottom" | "left";
  /** Which edge of the trigger it lines up with. Centred by default. */
  align?: "start" | "center" | "end";
  /** How far it keeps from the edges of the screen. */
  collisionPadding?: number;
  /** Runs as it closes, before focus goes back to the trigger; preventDefault() keeps focus where it is. */
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Base popover component that provides a consistent way to display floating content.
 * The popover appears when the trigger element is clicked and is positioned relative to it.
 */
export function BasePopover({
  trigger,
  content,
  className = "bg-medium-gray",
  open,
  onOpenChange,
  side,
  align,
  collisionPadding,
  onCloseAutoFocus,
}: IPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        collisionPadding={collisionPadding}
        onCloseAutoFocus={onCloseAutoFocus}
        className={cn("max-w-fit border-none flex flex-col p-0", className)}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
