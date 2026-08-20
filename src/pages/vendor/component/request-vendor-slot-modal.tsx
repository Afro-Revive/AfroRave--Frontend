import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState } from "react";
import { formatNaira } from "@/lib/format-price";
import type { VendorApplicationRequest, VendorSlot } from "@/types/vendor";
import { useApplyVendorSlot } from "@/hooks/use-event-mutations";
import { cn } from "@/lib/utils";
import { stripUnderscores } from "@/lib/helper-func";
import { Button } from "@/components/ui/button";

interface RequestVendorSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: VendorSlot;
}

export default function RequestVendorSlotModal({
  isOpen,
  onClose,
  slot,
}: RequestVendorSlotModalProps) {
  const app_percentage = import.meta.env.VITE_VENDOR_APPLICATIONS_PERCENTAGE;
  const {mutate: applyVendorSlot} = useApplyVendorSlot()
  const isRevenue = slot.vendorType === "Revenue";
  const { slotData, serviceData } = slot.vendorDetails;
  const availableStalls = slotData?.slotNumber;
  const hasBudgetRange = serviceData?.hasBudgetRange;
  const minBudget = serviceData?.minBudget ?? 0;
  const maxBudget = serviceData?.maxBudget;

  const [stallCount, setStallCount] = useState(1);
  const [price, setPrice] = useState(0);

  // Resets stale state left over from a previously opened card whenever a
  // different slot is passed in, without waiting an extra render for an effect.
  const prevVendorIdRef = useRef(slot.vendorId);
  if (prevVendorIdRef.current !== slot.vendorId) {
    prevVendorIdRef.current = slot.vendorId;
    setStallCount(1);
    setPrice(0);
  }

  function handleClose() {
    setStallCount(1);
    setPrice(0);
    onClose();
  }

  function handleStallDecrement() {
    setStallCount((prev) => Math.max(1, prev - 1));
  }

  function handleStallIncrement() {
    setStallCount((prev) =>
      availableStalls ? Math.min(availableStalls, prev + 1) : prev + 1,
    );
  }

  const revenuePrice = (price: number, noOfSlots: number): string => {
    let totalPrice = app_percentage * price;
    totalPrice += price;
    const revenuePrice = totalPrice * noOfSlots
    return formatNaira(revenuePrice);
  };

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setPrice(0);
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setPrice(
      hasBudgetRange && maxBudget != null
        ? Math.min(parsed, maxBudget)
        : parsed,
    );
  }

  function handleSubmit() {
    const payload: VendorApplicationRequest = {
      eventId: slot.eventId,
      eventVendorId: slot.vendorId,
      requestedSlots: stallCount,
      noOfRequestedSlots: stallCount,
      priceOffer: isRevenue ? null : price,
      vendorId: slot.vendorId,
      message: "",
      vendorType: slot.vendorType,
      category: slot.vendorCategory,
      description: slot.description,
      vendorDetails: {
        slotData: {
          slotName: slotData?.slotName ?? "",
          slotNumber: stallCount,
          price: slotData?.price ?? 0,
          applicationDeadline: slotData?.applicationDeadline ?? "",
        },
        serviceData: {
          serviceName: serviceData?.serviceName ?? "",
          hasBudgetRange: serviceData?.hasBudgetRange ?? false,
          minBudget: serviceData?.minBudget ?? 0,
          maxBudget: serviceData?.maxBudget ?? 0,
          startTime: serviceData?.startTime ?? "",
          stopTime: serviceData?.stopTime ?? "",
          startDate: serviceData?.startDate ?? "",
          endDate: serviceData?.endDate ?? "",
          applicationDeadline: serviceData?.applicationDeadline ?? "",
        },
        contact: {
          useDifferentContactDetails: false,
          email: slot.vendorDetails.contact.email ?? "",
          phoneNumbers: slot.vendorDetails.contact.phoneNumbers ?? [],
        },
        hideSocialLinks: slot.vendorDetails.hideSocialLinks ?? false,
        status: slot.vendorDetails.status ?? "",
        applicationDeadline: slot.vendorDetails.applicationDeadline ?? "",
      }
      
    }
    applyVendorSlot(payload)
    handleClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-secondary-white text-black border-none p-0 md:max-w-[400px] max-w-[95vw] rounded-[16px] overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">
          Request For {isRevenue ? "Slot" : "Offer"}
        </DialogTitle>

        {/* Header */}
        <div className="relative flex items-center justify-center px-6 pt-4 pb-2">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-fit px-2 py-1 rounded-2xl text-xs font-sf-pro-rounded capitalize",
                isRevenue
                  ? "bg-[#00AD2E]/30 text-[#00AD2E]"
                  : "bg-orange-peel/30 text-orange-peel",
              )}
            >
              {isRevenue ? "Revenue vendor" : "Service vendor"}
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-base font-semibold font-sf-pro-display text-system-black">
                {slot.vendorName}
              </p>
              <p className="text-xs font-sf-pro-display text-system-black">
                {stripUnderscores(slot.vendorCategory)}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute right-6 text-black/40 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-black/40 font-inter text-center">
          {isRevenue
            ? "Select the number of stalls you'd like to request"
            : "Set your price to cover this service"}
        </p>

        <div className="mx-auto w-[90%] mb-2 rounded-lg px-3 pb-4 flex flex-col gap-4">
          <div
            className="flex flex-col justify-between"
            style={{ minHeight: "160px" }}
          >
            <div className="flex flex-col gap-4 flex-1 ">
              {isRevenue ? (
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleStallDecrement}
                    disabled={stallCount <= 1}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex flex-col items-center gap-1 flex-1">
                    <p className="text-xl font-semibold font-inter">
                      {stallCount}
                    </p>
                    <p className="text-xs text-black/40 font-inter">
                      {stallCount === 1 ? "stall" : "stalls"} requested
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStallIncrement}
                    disabled={
                      availableStalls != null && stallCount >= availableStalls
                    }
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-full flex items-center gap-3">
                    <p className="py-[11px] w-14 h-full flex items-center justify-center bg-[#acacac] rounded-[5px] text-white text-sm shrink-0">
                      ₦
                    </p>
                    <Input
                      type="number"
                      min={hasBudgetRange ? minBudget : 0}
                      max={hasBudgetRange ? maxBudget : undefined}
                      value={price || ""}
                      onChange={handlePriceChange}
                      placeholder="Enter your price"
                      className="h-9 border-black/10 text-black"
                    />
                  </div>
                </div>
              )}

              {isRevenue && availableStalls != null && (
                <p className="text-xs text-black/50 font-inter text-center">
                  {availableStalls} stall{availableStalls === 1 ? "" : "s"}{" "}
                  available
                </p>
              )}

              {!isRevenue &&
                (hasBudgetRange ? maxBudget != null : minBudget > 0) && (
                  <p className="text-xs text-black/50 font-inter text-center">
                    {hasBudgetRange
                      ? `Budget range: ${formatNaira(minBudget)} - ${formatNaira(maxBudget as number)}`
                      : `Budget: ${formatNaira(minBudget)}`}
                  </p>
                )}
            </div>

            <Button
              type="button"
              variant={"secondary"}
              disabled={isRevenue ? stallCount < 1 : price <= 0}
              onClick={handleSubmit}
              className="mt-auto font-sf-pro-text rounded-full uppercase text-xs"
            >
              <div className="flex flex-row justify-between items-center w-full">
                <p>Request</p>
                <span className="font-semibold text-sm">
                  {isRevenue
                    ? `${revenuePrice(slot.vendorDetails.slotData.price, stallCount)}`
                    : `${formatNaira(price)}`}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
