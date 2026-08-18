import { LoadingFallback } from "@/components/loading-fallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Info } from "lucide-react";
import { SlotDescription } from "../../component/description-show-more";
import RequestVendorSlotModal from "../../component/request-vendor-slot-modal";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEvent } from "@/hooks/use-event-mutations";
import { cn } from "@/lib/utils";
import { useGetVendorSlots } from "@/hooks/use-event-mutations";
import { EventDetailData } from "@/types/event";
import type { VendorSlot } from "@/types/vendor";
import { PaginatedResponse } from "@/types";
import { formatNaira } from "@/lib/format-price";
import {
  formatEventDate,
  formatEventTime,
  stripUnderscores,
} from "@/lib/helper-func";

export default function VendorEventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: eventResponse, isPending: isLoading } = useGetEvent(
    eventId || "",
  );
  const app_percentage = import.meta.env.VITE_VENDOR_APPLICATIONS_PERCENTAGE;
  const [openModal, setOpenModal] = useState(false)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const { data: vendorSlotsResponse, isPending: isLoadingSlots } =
    useGetVendorSlots(eventId || "");
  const vendorSlots = vendorSlotsResponse?.data as
    | PaginatedResponse<VendorSlot[]>
    | undefined;
  const availableVendorSlots = vendorSlots?.items as VendorSlot[] | undefined;
  const event = eventResponse?.data as EventDetailData | undefined;
  const selectedSlot = availableVendorSlots?.find(
    (s) => s.vendorId === selectedSlotId,
  );

  const revenuePrice = (price: number): string => {
    let totalPrice = app_percentage * price
    totalPrice += price
    return formatNaira(totalPrice)
  }

  const handleSlotRequest = (slotId: string) => {
    setSelectedSlotId(slotId)
    setOpenModal(true)
  }

  if (isLoading && isLoadingSlots) return <LoadingFallback />;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <p className="text-xl font-bold mb-4">Event not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isEnded = new Date(event.eventDate.endDate) < new Date();

  return (
    <section className="w-full h-full flex flex-col bg-[#F2F2F7] md:bg-white min-h-screen">
      {/* Header */}
      <div className="w-full h-14 flex items-center justify-between px-6 md:px-8 border-b md:border-none md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="-ml-3"
        >
          <ChevronLeft className="h-12 w-12 text-black" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex w-full h-16 items-center justify-between px-8 bg-white mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="pl-0 hover:bg-transparent text-black"
        >
          <ChevronLeft className="h-18 w-18" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row items-start gap-12 py-4 px-6 md:px-8 w-full">
        <div className="flex flex-col md:w-[45%] w-full justify-baseline ">
          {/* Left Column: Event Info */}
          <div className="flex md:flex-row flex-col gap-5">
            {/* Banner */}
            <div className="md:w-3/5 w-full h-[500px] md:h-[450px] rounded-[20px] overflow-hidden bg-gray-100 shadow-sm relative">
              <img
                src={event.eventDetails.desktopMedia?.flyer}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex w-2/5 flex-col gap-2">
              <h1 className="text-xl md:text-3xl text-black font-black font-sf-pro-display uppercase leading-tight">
                {event.eventName}
              </h1>
              <div className="flex flex-col text-sm md:text-base text-system-black font-sf-pro-display">
                <p>{event.venue}</p>
                <p>
                  {formatEventDate(event.eventDate.startDate)} at{" "}
                  {formatEventTime(event.eventDate.startTime)}
                </p>
                <div className="mt-2">
                  <span
                    className={cn(
                      "text-xs font-bold rounded-full ",
                      isEnded ? "text-red-500" : "text-[#00AD2E]",
                    )}
                  >
                    {isEnded ? "Ended" : "Upcoming"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* About Event */}
          <div className="bg-[#8E8E93] text-white rounded-[20px] p-4 relative w-fit overflow-hidden md:mt-16 mt-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white">
              <h3 className="text-xl font-bold font-sf-pro-display">About Event</h3>
              <Info className="w-5 h-5" />
            </div>

            <div
              className={cn(
                "text-sm leading-relaxed font-sf-pro-display transition-all duration-300",
              )}
            >
              {event.description ||
                "We're Looking For Food Vendors To Serve A Variety Of Delicious Meals, Snacks, Or Beverages To Our Attendees. This Slot Is Ideal For Mobile Food Trucks, Grills, Or Packaged Treats. What We're Looking For: - Quick-Service Or Grab-And-Go Options - Clean And Appealing Booth/Truck Setups - Ability To Handle High Foot Traffic - Compliance With Health And Safety Standards Electricity And Water Access Will Be Provided On-Site. Vendors Must Arrive 2 Hours Before Event Start For Setup And Be Fully Self-Sufficient."}
            </div>
          </div>
        </div>

        {/* Right Column: Cards (Desktop) or swipeable row (Mobile) */}
        <div className="md:w-[55%] w-full md:flex-1 md:min-w-0 flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[calc(100vh-140px)] snap-x snap-mandatory md:snap-none scrollbar-none -mx-6 px-6 pb-2 md:mx-0 md:px-0 md:pb-0 md:content-start gap-4">
          {isLoadingSlots ? (
            <Card className="w-full p-6 rounded-[20px] bg-white border-none shadow-xl h-48 animate-pulse" />
          ) : availableVendorSlots && availableVendorSlots.length > 0 ? (
            availableVendorSlots.map((slot) => {
              const isRevenue = slot.vendorType === "Revenue";
              const deadline = isRevenue
                ? slot.vendorDetails.slotData.applicationDeadline
                : slot.vendorDetails.serviceData.applicationDeadline;
              console.log(deadline);

              return (
                <Card
                  key={slot.vendorId}
                  className="w-80 shrink-0 snap-center md:w-auto md:flex-1 md:min-w-65 md:max-w-80 md:shrink md:snap-align-none md:h-110 p-6 rounded-xl bg-white border-none shadow-sm flex flex-col gap-6"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
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
                    <h3 className="font-bold text-sm uppercase">
                      {slot.vendorName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {stripUnderscores(slot.category)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-system-black">
                        {isRevenue ? "Price Per Slot:" : "Budget:"}
                      </span>
                      <span className="font-bold">
                        {isRevenue
                          ? revenuePrice(slot.vendorDetails.slotData.price)
                          : slot.vendorDetails.serviceData.hasBudgetRange
                            ? `${formatNaira(slot.vendorDetails.serviceData.minBudget)} - ${formatNaira(slot.vendorDetails.serviceData.maxBudget)}`
                            : formatNaira(
                                slot.vendorDetails.serviceData.minBudget,
                              )}
                      </span>
                    </div>
                    <SlotDescription description={slot.description} />
                    {isRevenue && (
                      <div className="flex justify-between items-center">
                        <span className="text-system-black">
                          Available Slots:
                        </span>
                        <span className="text-[#34C759] font-bold">
                          {slot.vendorDetails.slotData.slotNumber}
                        </span>
                      </div>
                    )}
                    {!isRevenue &&
                      slot.vendorDetails.serviceData.startTime != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-system-black">
                            Work Duration:
                          </span>
                          <span className="text-system-black">
                            {slot.vendorDetails.serviceData.startTime} -{" "}
                            {slot.vendorDetails.serviceData.stopTime}
                          </span>
                        </div>
                      )}
                    {deadline && (
                      <div className="flex justify-between items-center">
                        <span className="text-system-black">
                          Application Deadline:
                        </span>
                        <span>
                          {new Date(deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={"secondary"}
                    className="mt-auto font-sf-pro-text rounded-full uppercase text-xs"
                    onClick={() => handleSlotRequest(slot.vendorId)}
                    disabled={isEnded}
                  >
                    Request For {isRevenue ? "Slot" : "Offer"}
                  </Button>
                </Card>
              );
            })
          ) : (
            <Card className="p-6 rounded-[20px] bg-white border-none shadow-sm text-center text-sm text-gray-500">
              No vendor slots available for this event yet.
            </Card>
          )}
        </div>
       
      </div>
       <div className="py-8 px-5 flex justify-end">
            <p className="font-sf-pro-display text-base text-black font-medium capitalize">
                Contact Details arent shared until after payment has been approved
            </p>
        </div>

      {selectedSlot && (
        <RequestVendorSlotModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          slot={selectedSlot}
        />
      )}
    </section>
  );
}

