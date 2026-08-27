import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BlockName } from "./block-name";

/** Toggle between the primary-sale and resale ticket lists. */
export function TicketTab({ name, isActive, action }: ITicketTab) {
  return (
    <Button
      variant="ghost"
      onClick={action}
      aria-pressed={isActive}
      className="p-0 h-fit w-fit hover:bg-transparent"
    >
      <BlockName
        name={name}
        className={cn("transition-colors", { "text-white/60": !isActive })}
      />
    </Button>
  );
}

interface ITicketTab {
  name: string;
  isActive: boolean;
  action: () => void;
}
