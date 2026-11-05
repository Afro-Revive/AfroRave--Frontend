import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchData() {
  return (
    <div className="w-full h-[100px] flex px-8 gap-2 items-center">
      <Search size={14} color="#000000" />

      <Input
        className="w-full text-xs font-inter-tight opacity-70 text-black border-none outline-none"
        placeholder="Search"
      />
    </div>
  );
}
