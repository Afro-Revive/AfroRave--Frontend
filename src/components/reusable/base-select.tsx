/**
 * A reusable select component built on top of shadcn/ui Select.
 * Provides a flexible way to create dropdown select inputs with various customization options.
 * Supports different types (auth/others), loading states, and custom item rendering.
 *
 * @example
 * ```tsx
 * <BaseSelect
 *   type="auth"
 *   placeholder="Select an option"
 *   items={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   label="Options"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type * as React from "react";

export interface ICustomSelectProps {
  /** Select type variant (affects styling) */
  type?: "auth" | "others";
  /** Minimum width of the select trigger in pixels */
  width?: number;
  /** Default selected value */
  defaultValue?: string;
  /** Placeholder text when no value is selected */
  placeholder: string;
  /** Array of selectable items */
  items: { value: string; label: string }[];
  /** Controlled selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Custom renderer for the selected item */
  selectedItemRenderer?: (value: string) => React.ReactNode;
  /** Custom options to replace default items */
  customOptions?: React.ReactNode;
  /** Label text for the select group */
  label?: string;
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Additional CSS classes for the trigger element */
  triggerClassName?: string;
  /** Additional CSS classes for the content element */
  contentClassName?: string;
  /** Additional CSS classes for the item elements */
  itemClassName?: string;
  /** Additional CSS classes applied directly to the SelectValue span */
  valueClassName?: string;
}

/**
 * Base select component that provides a consistent way to create dropdown select inputs.
 * Supports different styling variants, loading states, and custom content rendering.
 */
export function BaseSelect({
  type = "others",
  width = 165,
  defaultValue,
  placeholder,
  items,
  value,
  onChange,
  selectedItemRenderer,
  customOptions,
  label,
  isLoading = false,
  triggerClassName,
  contentClassName,
  itemClassName,
  valueClassName,
}: ICustomSelectProps) {
  const safeItems = Array.isArray(items)
    ? items.filter(
      (item) =>
        item && typeof item === "object" && "value" in item && "label" in item
    )
    : [];

  if (isLoading) {
    return (
      <div
        className={cn(
          `!min-w-[${width}px] border bg-transparent animate-pulse`,
          {
            "border-charcoal w-full h-[35px] font-sf-pro-text rounded-[4px] text-black":
              type === "auth",
            "border-white h-[50px] font-input-mono rounded-[3px]":
              type === "others",
          },
          triggerClassName
        )}
      />
    );
  }

  return (
    <Select value={value} onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger
        className={cn(
          `!min-w-[${width}px] border bg-transparent`,
          {
            "border-charcoal w-full h-[35px] font-sf-pro-text rounded-[4px] text-black":
              type === "auth",
            "border-white data-[state=open]:bg-charcoal/50 data-[state=open]:border-none font-sf-pro-text text-xs rounded-[3px]":
              type === "others",
          },
          triggerClassName
        )}
      >
        {selectedItemRenderer ? (
          <SelectValue
            placeholder={placeholder}
            className={cn("leading-normal", valueClassName, {
              "font-light font-input-mono text-sm": type === "others",
              "font-normal font-sf-pro-text": type === "auth",
            })}
          >
            {value && selectedItemRenderer(value)}
          </SelectValue>
        ) : (
          <SelectValue
            placeholder={placeholder}
            className={cn("leading-normal", valueClassName, {
              "font-light font-input-mono text-sm": type === "others",
              "font-normal font-sf-pro-text": type === "auth",
            })}
          />
        )}
      </SelectTrigger>
      <SelectContent
        className={cn(
          "flex flex-col",
          {
            "bg-white/10 backdrop-blur-md border border-white/20":
              type === "others",
            "border-charcoal bg-white": type === "auth",
          },
          contentClassName
        )}
        position="popper"
        sideOffset={5}
      >
        <SelectGroup>
          {label && (
            <SelectLabel
              className={cn("text-sm", {
                "text-white": type === "others",
                "text-black": type === "auth",
              })}
            >
              {label}
            </SelectLabel>
          )}
          {customOptions
            ? customOptions
            : safeItems.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className={cn(
                  "border-b last:border-none rounded-none",
                  {
                    "font-sf-pro-text font-light text-xs text-white hover:!text-white hover:!bg-white/10 data-[highlighted]:!text-white border-white":
                      type === "others",
                    "font-sf-pro-text text-black hover:!text-black hover:!bg-black/10 data-[highlighted]:!bg-black/20 data-[highlighted]:!black-white border-black":
                      type === "auth",
                  },
                  itemClassName
                )}
              >
                {item.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
