import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function SlotDescription({ description }: { description?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (expanded) return;
    const el = textRef.current;
    if (!el) return;

    const checkTruncation = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [description, expanded]);

  if (!description) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-system-black">Description:</span>
      <p
        ref={textRef}
        className={cn(
          "text-xs text-gray-600",
          expanded ? "line-clamp-none" : "line-clamp-3",
        )}
      >
        {description}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="self-start text-[10px] font-bold uppercase text-deep-red"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}