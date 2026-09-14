import { cn } from "@/lib/utils";
import { BsInfoCircle } from "react-icons/bs";
function OrderCard({
  orderDate,
  quantity,
  orderId,
  isSelected,
  onClick,
  onViewOrder,
}: {
  orderDate: string;
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
        "relative w-full md:w-[196px] h-fit flex flex-col gap-1 py-3 px-3 rounded-[10px] border-white text-left transition-all",
        {
          "bg-white": isSelected,
          "bg-transparent border": !isSelected,
        },
      )}
    >

       <p className="md:text-base font-work-sans font-bold text-sm text-soft-gray">
        Order ID: {orderId}
      </p>

      <span
        className={cn(
          "absolute w-4 h-4 top-5 right-3 font-sf-pro-rounded text-[10px] text-center rounded-full",
          { "bg-[#DEDDDD] text-black": isSelected },
        )}
      >
        <BsInfoCircle className="inline-block ml-1 w-full h-full" />
      </span>

      <div
        className={cn(
          "flex flex-col gap-0.5 font-inter-tight font-semibold",
          {
            "text-black": isSelected,
            "text-white": !isSelected,
          },
        )}
      >
        <p className="text-xs">{orderDate}</p>
      </div>

      <p className={cn("font-inter-tight text-xs  text-white", { "text-deep-red font-semibold": isSelected })}>
        {quantity} {quantity > 1 ? "Tickets" : "Ticket"}
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