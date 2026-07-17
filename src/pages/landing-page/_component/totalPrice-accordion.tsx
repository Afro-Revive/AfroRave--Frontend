import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { formatNaira } from "@/lib/format-price";
import type { PromoDiscount } from "./promo-code";

const TotalAccordion = ({
  totalPrice,
  discount,
}: {
  totalPrice: number;
  discount?: PromoDiscount | null;
}) => {
  const serviceFee = parseFloat(import.meta.env.VITE_TICKET_SALES_PERCENTAGE || "0") * totalPrice;
  const discountAmount = discount?.discountAmount ?? 0;
  const hasDiscount = discountAmount > 0;
  const discountedTicketPrice = Math.max(totalPrice - discountAmount, 0);
  const originalTotal = totalPrice + serviceFee;
  const total = Math.max(originalTotal - discountAmount, 0);
  const discountLabel =
    discount?.discountType?.toLowerCase() === "percentage"
      ? `${discount.discountValue}% OFF`
      : `${formatNaira(discount?.discountValue ?? 0)} OFF`;

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
            <span className="md:text-lg text-base flex items-center gap-2">
              {hasDiscount && (
                <span className="line-through text-white/50 text-xs md:text-sm">
                  {formatNaira(originalTotal)}
                </span>
              )}
              {formatNaira(total, { free: total === 0 })}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 text-sm font-inter ">
           {hasDiscount && (
            <div className="flex items-center justify-between py-2">
              <p>Discount </p>
              <p> {discountLabel}</p>
            </div>
          )}
          <div className="flex items-center justify-between py-2">
            
            <p>Ticket Price</p>
            <span className="flex items-center gap-2">
              {hasDiscount && (
                <span className="line-through text-white/50">
                  {formatNaira(totalPrice)}
                </span>
              )}
              <span>
                {formatNaira(discountedTicketPrice, {
                  free: discountedTicketPrice === 0,
                })}
              </span>
            </span>
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
