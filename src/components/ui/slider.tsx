import { useState, useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Render an editable number input under each thumb */
  showInputs?: boolean;
  /** How a committed value is displayed while the input is not focused. */
  formatInputValue?: (value: number) => string;
  /** Extra classes for each input. */
  inputClassName?: string;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showInputs = false,
  formatInputValue,
  inputClassName,
  onValueChange,
  ...props
}: SliderProps) {
  const values = useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  // While an input is focused it holds raw keystrokes, so a half-typed number
  // ("50" on the way to "500000") is never reformatted under the cursor.
  const [drafts, setDrafts] = useState<(string | null)[]>([]);

  function commit(index: number, next: number) {
    const clamped = Math.min(Math.max(next, Number(min)), Number(max));
    const updated = values.map((current, i) => (i === index ? clamped : current));

    // Keep the thumbs ordered — typing a min above the max would otherwise
    // hand Radix an out-of-order array.
    if (index > 0 && updated[index] < updated[index - 1]) {
      updated[index] = updated[index - 1];
    }
    if (index < updated.length - 1 && updated[index] > updated[index + 1]) {
      updated[index] = updated[index + 1];
    }

    onValueChange?.(updated);
  }

  function handleInputChange(index: number, raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setDrafts((prev) => {
      const next = [...prev];
      next[index] = digits;
      return next;
    });
    if (digits !== "") commit(index, Number(digits));
  }

  function handleBlur(index: number) {
    setDrafts((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    // An input left empty falls back to the bound value rather than NaN.
    if (drafts[index] === "") commit(index, Number(min));
  }

  const slider = (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        showInputs ? undefined : className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-mid-dark-gray/30 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-system-black absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-system-black bg-system-black block size-4 shrink-0 rounded-full border-2 shadow-sm transition-colors hover:ring-4 hover:ring-system-black/20 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-system-black/20 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );

  if (!showInputs) return slider;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {slider}

      <div className="flex items-center justify-between gap-3">
        {values.map((current, index) => {
          const draft = drafts[index];
          return (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              value={
                draft ??
                (formatInputValue ? formatInputValue(current) : String(current))
              }
              onChange={(event) => handleInputChange(index, event.target.value)}
              onFocus={(event) => {
                setDrafts((prev) => {
                  const next = [...prev];
                  next[index] = String(current);
                  return next;
                });
                event.target.select();
              }}
              onBlur={() => handleBlur(index)}
              className={cn(
                "w-full border border-mid-gray px-3 py-2 text-center text-xs font-sf-pro-display text-system-black bg-transparent focus:outline-none focus:border-system-black transition-colors",
                inputClassName,
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export { Slider };
