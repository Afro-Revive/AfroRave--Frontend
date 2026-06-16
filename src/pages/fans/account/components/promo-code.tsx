import { cn } from "@/lib/utils";
import { Badge } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { useValidatePromocode } from "@/hooks/use-cart";

interface CartItem {
  cartId: string;
  ticketId: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
}

interface PromoCodeProps {
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

const PromoCode = ({ cartItems, totalPrice, totalQuantity }: PromoCodeProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const validatePromocodeMutation = useValidatePromocode();

  function handleValidatePromocode(promocode: string) {
    if (!promocode) return;
    validatePromocodeMutation.mutate(
      {
        data: {
          promoCode: promocode,
          eventIds: cartItems.map((item) => item.eventId),
          subtotal: totalPrice,
          totalTickets: totalQuantity,
          ticketIds: cartItems.map((item) => item.ticketId),
        },
      },
      {
        onSuccess: (data) => {
          setMessage(data.data.data.message);
          setIsValid(data.data.data.isValid);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "w-full h-10 flex items-center gap-[5px] pl-2 md:py-8 py-6 rounded-sm border border-white",
          { "border-white": !isValid, "border-green-500": isValid },
        )}
      >
        <Badge color="#ffffff" fill="#ffffff" stroke="#ffffff" size={13} />
        <Input
          placeholder="ENTER PROMO CODE"
          className="border-none pl-none rounded-none uppercase text-xs font-input-mono text-white font-light placeholder:text-white"
          onChange={(e) => handleValidatePromocode(e.target.value)}
        />
      </div>

      {!isValid && message && (
        <p className="text-sm font-sf-pro-display leading-[100%] text-[#FF9500]">
          {message}
        </p>
      )}
    </div>
  );
};

export default PromoCode;
