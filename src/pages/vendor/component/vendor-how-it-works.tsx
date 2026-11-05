import { RiStore2Line } from "react-icons/ri";

/** Each vendor type's note, shared by its list page and its slot pages. */
export const VENDOR_HOW_IT_WORKS = {
  Revenue: {
    title: "How revenue vendor stalls work",
    points: [
      "Rent stalls to approved vendors.",
      "Vendors pay to confirm their space.",
      "Stall payments are added to your event revenue.",
    ],
  },
  Service: {
    title: "How service vendor stalls work",
    points: [
      "Post a slot for the service you need.",
      "Review applications and choose who to book for your event.",
    ],
  },
} as const satisfies Record<
  "Revenue" | "Service",
  { title: string; points: readonly string[] }
>;

/** The tinted "how it works" note at the top of the revenue and service vendor pages. */
export function VendorHowItWorks({
  title,
  points,
}: {
  title: string;
  points: readonly string[];
}) {
  return (
    <div className="w-full flex flex-col gap-2 rounded-2xl bg-light-red/10 px-6 md:px-10 py-5 shadow-sm text-light-red font-inter-tight">
      <div className="flex items-center gap-2">
        <RiStore2Line size={24} className="shrink-0" />
        <p className="text-lg md:text-xl font-bold">{title}</p>
      </div>

      <ul className="list-disc pl-8 text-sm md:text-base">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
