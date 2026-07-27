import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DestructiveAddBtn({
  name,
  special = false,
  showIcon = true,
  onClick,
}: {
  name: string;
  special?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="destructive"
      className="px-5 py-2.5 rounded-[6px] gap-3 h-8"
      onClick={onClick}
    >
      {showIcon && <Plus color="#ffffff" size={12} />}
      <span className="font-sf-pro-text text-xs capitalize">
        {special ? name : `Add ${name}`}
      </span>
    </Button>
  );
}
