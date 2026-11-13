import { cn } from "@/lib/utils";
import { Badge, X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useValidatePromocode } from "@/hooks/use-cart";
import { useCartStore } from "@/stores";
import type { PromoCartItem, PromoValidationResult } from "@/types/cart";

const DEBOUNCE_MS = 600;

interface CartItem {
  cartId: string;
  ticketId: string;
  eventId: string;
  name: string;
  price: number;
  fee: number;
  quantity: number;
  resale: boolean;
  listingId?: string;
  eventName: string;
  venue: string;
  category: string;
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
  // The cart's tickets the valid code covers, from the response.
  const [eligibleTicketIds, setEligibleTicketIds] = useState<string[] | null>(null);
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
      setEligibleTicketIds(null);
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
    setEligibleTicketIds(null);
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
          items: cartItems.map(toPromoCartItem),
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
            setEligibleTicketIds(payload.eligibleTicketIds ?? null);
            onApply?.({
              discountAmount: payload.discountAmount,
              discountType: payload.discountType,
              discountValue: payload.discountValue,
            });
          } else {
            setDiscount(null);
            setEligibleTicketIds(null);
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
          setEligibleTicketIds(null);
          setPromoCodeId(null);
          onApply?.(null);
        }
      },
    );
  }

  // Named only when the code leaves some of the cart's tickets out; a code that
  // covers the whole cart needs no note.
  const eligibleNames = eligibleTicketIds
    ? [...new Set(cartItems.filter((item) => eligibleTicketIds.includes(item.ticketId)).map((item) => item.name))]
    : [];
  const coversPartOfCart =
    eligibleNames.length > 0 &&
    cartItems.some((item) => !eligibleTicketIds?.includes(item.ticketId));

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

      {isValid && coversPartOfCart && (
        <p className="text-sm font-inter-tight leading-snug text-white/70">
          This promo code only applies to {joinNames(eligibleNames)}.
        </p>
      )}

      {!isValid && message && (
        <p className="text-sm font-inter-tight leading-[100%] text-[#FF9500]">
          {message}
        </p>
      )}
    </div>
  );
};

export default PromoCode;

/** A checkout line as validate-promocode reads it. */
function toPromoCartItem(item: CartItem): PromoCartItem {
  return {
    ticketId: item.ticketId,
    ticketName: item.name,
    price: item.price,
    basePrice: item.price,
    salesPrice: item.price + item.fee,
    fee: item.fee,
    quantity: item.quantity,
    eventId: item.eventId,
    eventName: item.eventName,
    venue: item.venue,
    category: item.category,
    isResale: item.resale,
    ...(item.resale && { listingId: item.listingId, resellTicketId: item.ticketId }),
  };
}

/** "A", "A and B", "A, B and C". */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
