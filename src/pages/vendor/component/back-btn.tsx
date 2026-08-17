import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function BackButton({ name }: { name: string }) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(-1)}
      variant="ghost"
      className="flex items-center gap-3 py-0.5 px-1.5 hover:bg-black/10"
    >
      <ChevronLeft color="#000000" size={16} />
      <span className="font-medium text-xs font-sf-pro-rounded uppercase text-black">
        {name}
      </span>
    </Button>
  );
}
