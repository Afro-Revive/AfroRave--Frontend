import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function BaseAccordion({
  style,
  trigger,
  stringContent,
  children,
  isActive,
  icon,
  triggerClassName,
}: IBaseAccordion) {
  // Controlled so the section holding the current route opens itself — landing on a
  // vendor slot should reveal that slot's name in the sidebar, not leave it collapsed.
  // Still collapsible by hand, and only forced open when `isActive` flips on.
  const [value, setValue] = useState(isActive ? "item-1" : "")

  useEffect(() => {
    if (isActive) setValue("item-1")
  }, [isActive])

  return (
    <Accordion type="single" collapsible value={value} onValueChange={setValue}>
      <AccordionItem
        value="item-1"
        className={cn("flex flex-col w-full", {
          "p-0": style === "dashboard",
        })}
      >
        <AccordionTrigger
          className={cn(
            "hover:no-underline",
            {
              "items-center justify-between h-[64px] px-6 [&>svg]:hidden":
                style === "dashboard",
            },
            triggerClassName,
          )}
        >
          <div className={cn("flex items-center", { "gap-2.5": icon })}>
            {/* Icon — turns red when active, gray when not */}
            {icon && (
              <span className={cn({
                "text-deep-red": isActive && style === "dashboard",
                "text-system-black": !isActive && style === "dashboard",
              })}>
                {icon}
              </span>
            )}
            {/* Text — always black, dims slightly when inactive */}
            <p className={cn("font-['Inter'] uppercase", {
              "text-[14px] font-normal tracking-normal leading-none text-[#1E1E1E]": style === "dashboard",
              "": !isActive && style === "dashboard",
            })}>{trigger}</p>
          </div>

          <div className="flex w-fit h-fit text-system-black">
            <Plus color="currentColor" className="size-[15px]" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col p-0">
          {stringContent}

          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface IBaseAccordion {
  style?: "dashboard" | "others";
  trigger: string;
  stringContent?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  icon?: React.ReactNode;
  triggerClassName?: string;
}
