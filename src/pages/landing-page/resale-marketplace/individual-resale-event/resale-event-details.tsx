import type { IEvents } from "@/data/events";
import { BaseSelect } from "@/components/reusable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ICustomSelectProps } from "@/components/reusable/base-select";
import { formatNaira } from "@/lib/format-price";
import { EventLocation } from "@/pages/landing-page/event-page/event-location";

export default function ResaleEventDetails({ event }: { event: IEvents }) {
  return (
    <section className="flex flex-col mt-[136px] px-20 pb-11 gap-[257px]">
      <div className="min-w-full flex gap-[54px]">
        <img
          src={event.image}
          alt={event.event_name}
          width={301}
          height={388}
          className="max-w-[301px] w-auto max-h-[388px] h-auto"
        />

        <div className="w-full flex flex-col gap-[87px]">
          <div className="flex flex-col">
            <p className="font-phosphate text-[40px] tracking-[-0.25px] leading-normal uppercase">
              {event.event_name}
            </p>
            <p className="font-inter-tight text-[32px] mb-2 font-[200]">
              {event.event_location}
            </p>
            <p className="font-inter-tight text-[32px]">
              {event.event_date}, {event.event_time.start_time} -{" "}
              {event.event_time.end_time}
            </p>
          </div>

          <TicketContainer tickets={event.tickets} />
        </div>
      </div>

      <EventLocation event_location={event.event_location} />
    </section>
  );
}

function TicketContainer({ tickets }: { tickets: IEvents["tickets"] }) {
  return (
    <div className="w-full flex flex-col gap-[50px]">
      <BaseSelect placeholder="Price" items={price} width={224} />

      <div className="grid grid-cols-2 gap-x-[78px] gap-y-[50px] px-3.5">
        {tickets.map((item) => (
          <ResaleTicketCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

function ResaleTicketCard({ name, price }: { name: string; price: number }) {
  return (
    <div className="relative min-w-full flex flex-col pl-[15px] py-[19px] bg-medium-gray font-input-mono rounded-[2px]">
      <div className="w-2/3 flex items-center justify-between mb-[9px]">
        <p className="font-bold text-[15px]">{name}</p>

        <img src="/assets/check-badge.png" alt="Check" width={12} height={12} />
      </div>
      <p className="text-sm mb-[18px]">SELLER'S PRICE: {formatNaira(price)}</p>
      <div className="flex items-center gap-[65px]">
        <p>STATUS: </p>
        <p className="text-xs text-lime-green">AVAILABLE</p>
      </div>

      <Button
        variant="green"
        className="absolute top-0 right-0 rounded-t-none rounded-br-none rounded-bl-[5px] px-6 py-[9px]"
      >
        <Plus color="var(--foreground)" size={18} />
      </Button>
    </div>
  );
}

const price: ICustomSelectProps["items"] = [
  { value: "< 10,0000", label: "< 10,000" },
  { value: "< 20,0000", label: "< 20,000" },
  { value: "< 30,0000", label: "< 30,000" },
  { value: "< 40,0000", label: "< 40,000" },
];
