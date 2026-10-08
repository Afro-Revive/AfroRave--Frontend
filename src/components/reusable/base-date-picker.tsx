// import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BaseDatePickerProps {
  className?: string;
  value?:
    | Date
    | string
    | { start_date: Date; end_date: Date }
    | { start_time: string; end_time: string }
    | { x?: string; instagram?: string; tiktok?: string; facebook?: string }
    | undefined;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
}

export function BaseDatePicker({
  className,
  value,
  onChange,
  onBlur,
}: BaseDatePickerProps) {
  const dateValue = value instanceof Date ? value : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-transparent",
            className
          )}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[10000000000]">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
