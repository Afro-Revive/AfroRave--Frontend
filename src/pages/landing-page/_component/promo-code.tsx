import { cn } from "@/lib/utils";
import { Badge, X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useValidatePromocode } from "@/hooks/use-cart";
import { useCartStore } from "@/stores";
import type { PromoValidationResult } from "@/types/cart";

const DEBOUNCE_MS = 600;

interface CartItem {
  cartId: string;
  ticketId: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PromoDiscount {
  discountAmount: number;
  discountType: string;
  discountValue: number;
}

interface PromoCodeProps {
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  onApply?: (discount: PromoDiscount | null) => void;
}

const PromoCode = ({
  cartItems,
  totalPrice,
  totalQuantity,
  onApply,
}: PromoCodeProps) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [discount, setDiscount] = useState<{
    discountType: string;
    discountValue: number;
  } | null>(null);
  const { setPromoCodeId } = useCartStore()
  const validatePromocodeMutation = useValidatePromocode();
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleValidatePromocode(promocode: string) {
    setCode(promocode);
    clearTimeout(debounceRef.current);
    if (!promocode) {
      setMessage(null);
      setIsValid(null);
      setDiscount(null);
      setPromoCodeId(null);
      onApply?.(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      validatePromocode(promocode);
    }, DEBOUNCE_MS);
  }

  function handleClearPromocode() {
    clearTimeout(debounceRef.current);
    setCode("");
    setMessage(null);
    setIsValid(null);
    setDiscount(null);
    setPromoCodeId(null);
    onApply?.(null);
  }

  function validatePromocode(promocode: string) {
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
          const payload = data.data as PromoValidationResult
          setMessage(payload.message);
          setIsValid(payload.isValid);
          if (payload.isValid) {
            setDiscount({
              discountType: payload.discountType,
              discountValue: payload.discountValue,
            });
            setPromoCodeId(payload.promoCodeId)
            onApply?.({
              discountAmount: payload.discountAmount,
              discountType: payload.discountType,
              discountValue: payload.discountValue,
            });
          } else {
            setDiscount(null);
            setPromoCodeId(null);
            onApply?.(null);
          }
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || "This Code is Invalid.";
          setMessage(errorMessage);
          setIsValid(false);
          setDiscount(null);
          setPromoCodeId(null);
          onApply?.(null);
        }
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
          readOnly={!!discount}
          value={
            discount
              ? `${code} · ${
                  discount.discountType.toLowerCase() === "percentage"
                    ? `${discount.discountValue}% OFF`
                    : `₦${discount.discountValue.toLocaleString()} OFF`
                }`
              : code
          }
          className="border-none pl-none rounded-none uppercase text-xs font-input-mono text-white font-light placeholder:text-white"
          onChange={(e) => handleValidatePromocode(e.target.value)}
        />
        {discount && (
          <button
            type="button"
            aria-label="Remove promo code"
            onClick={handleClearPromocode}
            className="pr-2 text-white"
          >
            <X size={14} />
          </button>
        )}
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
