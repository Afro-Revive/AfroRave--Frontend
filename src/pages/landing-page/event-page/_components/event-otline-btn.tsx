import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EventOutlineButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center justify-center gap-2.5 h-10 w-[188px] rounded-[10px] border-white font-medium text-2xl font-inter-tight hover:text-white hover:bg-black/10",
        className
      )}
    >
      {children}
    </Button>
  );
}
