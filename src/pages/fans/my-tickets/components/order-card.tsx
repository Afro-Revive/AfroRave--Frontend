import { cn } from "@/lib/utils";
function OrderCard({
  orderDate,
  orderTime,
  quantity,
  orderId,
  isSelected,
  onClick,
  onViewOrder,
}: {
  orderDate: string;
  orderTime: string;
  quantity: number;
  index: number;
  orderId: string;
  isSelected: boolean;
  onClick: () => void;
  onViewOrder: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full md:w-[196px] h-[120px] flex flex-col gap-1 py-5 px-3 rounded-[10px] border-white text-left transition-all",
        {
          "bg-white": isSelected,
          "bg-transparent border": !isSelected,
        },
      )}
    >
      <span
        className={cn(
          "absolute w-[21px] h-4 top-5 right-3 font-sf-pro-rounded text-[10px] text-center rounded-full",
          { "bg-[#DEDDDD] text-black": isSelected },
        )}
      >
        {quantity}
      </span>

      <div
        className={cn(
          "flex flex-col gap-0.5 font-sf-pro-rounded font-semibold",
          {
            "text-black": isSelected,
            "text-white": !isSelected,
          },
        )}
      >
        <p className="text-xs">{orderDate}</p>
        <p className="text-[10px] text-soft-gray">{orderTime}</p>
      </div>

      <p className="text-[8px] font-sf-pro-rounded font-bold text-xs text-soft-gray">
        Order ID: {orderId}
      </p>

      <button
        type="button"
        className={cn("font-sf-pro-display text-left text-[10px] underline", {
          "text-black": isSelected,
          "text-white": !isSelected,
        })}
        onClick={(e) => {
          e.stopPropagation();
          onViewOrder();
        }}
      >
        View Order
      </button>
    </button>
  );
}

export default OrderCard;