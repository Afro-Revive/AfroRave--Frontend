import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function ExportButton() {
  return (
    <Button
      variant="ghost"
      className="px-5 py-2.5 rounded-[6px] gap-1 h-8 text-black"
    >
      <Upload />
      <span className="font-inter-tight text-xs capitalize">Export</span>
    </Button>
  );
}
