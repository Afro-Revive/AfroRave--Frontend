import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { formatNaira } from "@/lib/format-price";
const TotalAccordion = ({ totalPrice }: { totalPrice: number }) => {
  const serviceFee = 0.05 * totalPrice;
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full md:py-2 py-1 rounded-lg border border-white"
    >
      <AccordionItem value="fees" className="border-none">
        <AccordionTrigger className="px-4 md:py-2 py-1 text-sm font-inter hover:no-underline items-center">
          <div className="flex w-full items-center justify-between ">
            <span className="md:text-lg text-base">TOTAL</span>
            <span className="md:text-lg text-base">
              {formatNaira(totalPrice + serviceFee)}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 text-sm font-inter ">
          <div className="flex items-center justify-between py-2">
            <p>Ticket Price</p>
            <p>{formatNaira(totalPrice)}</p>
          </div>
          <div className="flex items-center justify-between py-2  ">
            <p>Service Fee</p>
            <p>{formatNaira(serviceFee)}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TotalAccordion;
