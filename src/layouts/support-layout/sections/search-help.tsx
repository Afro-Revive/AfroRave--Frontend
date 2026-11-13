import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchHelp() {
  return (
    <div className="w-full h-[320px] flex flex-col items-center justify-center gap-3 bg-[url(/assets/support/bg.jpg)] bg-cover bg-center">
      <p className="text-[32px] font-semibold font-inter-tight">
        How can we help you?
      </p>

      <div className="max-w-[704px] w-full h-10 flex items-center px-8 rounded-[5px] bg-white">
        <Search size={14} color="#000000" opacity={70} />
        <Input className="w-full border-none bg-transparent h-10 text-black placeholder:text-black/70 rounded-none font-inter-tight text-xs" />
      </div>
    </div>
  );
}
