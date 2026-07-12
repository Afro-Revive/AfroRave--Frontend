import { useOrderReceiptDetails } from "@/hooks/use-order-mutations";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/format-price";
import { formatEventDate, formatShortDate, formatTimeLong } from "@/lib/helper-func";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { OrderReceiptDetailsData } from "@/types/order";

interface OrderDetailsProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  orderId,
  isOpen,
  onClose,
}: OrderDetailsProps) {
  const {
    mutate: fetchOrderDetails,
    data: orderResponse,
    isPending,
  } = useOrderReceiptDetails();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [isOpen, orderId, fetchOrderDetails]);

  const receipt = orderResponse?.data as OrderReceiptDetailsData | undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary-white text-black border-none p-0 md:max-w-[460px] max-w-full rounded-lg overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Order Receipt</DialogTitle>

        {/* Header */}
        <div className="relative flex items-center justify-center px-6 pt-4 ">
          <p className="md:text-base text-sm font-extrabold font-sf-pro-display uppercase tracking-widest text-system-black text-center">
            {receipt?.eventName}
          </p>
          <button
            onClick={onClose}
            className="absolute right-6 text-black"
          >
            <X size={18} />
          </button>
        </div>
        <div className="bg-white mx-auto w-[90%] mb-2 rounded-lg">
          {isPending ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-deep-red" />
            </div>
          ) : receipt ? (
            <div className="px-6 pt-4 pb-4 flex flex-col gap-0">
              <p className="text-sm text-system-black font-medium text-center font-sf-pro-display pb-3 mb-3 border-b border-dashed border-black/20">
                ORDER DETAILS
              </p>

              <div className="flex flex-col gap-6 pt-4">
                <Row label="CUSTOMER" value={receipt.customerName} />
                <Row
                  label="PURCHASE DATE"
                  value={`${formatEventDate(receipt.purchaseDate)} at ${formatTimeLong(receipt.purchaseDate)}`}
                  capitalize
                />
                <Row
                  label="EVENT DATE"
                  value={formatShortDate(receipt.purchaseDate)}
                  capitalize
                />
                <Row label="ORDER CODE" value={receipt.orderCode} />
                <Row
                  label="TICKETS"
                  value={`X ${receipt.items.length}`}
                  capitalize
                />
                <Row label="STATUS" value={receipt.status} capitalize />
                <div className="border-b border-dashed border-black/20" />
                <Row
                  label="PAYMENT METHOD"
                  value={receipt.paymentMethod}
                  capitalize
                />
                <Row label="SUBTOTAL" value={formatNaira(receipt.cost)} />
                <Row label="FEES & TAXES" value={formatNaira(receipt.tax)} />
                <Row label="TOTAL" value={formatNaira(receipt.totalPaid)} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-black/40 font-sf-pro-display">
                No receipt found.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-system-black font-sf-pro-display">{label}</p>
      <p
        className={`text-sm font-sf-pro-display text-black ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
