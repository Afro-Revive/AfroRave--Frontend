import { useState } from "react";
import BaseModal from "@/components/reusable/base-modal";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import type { VendorSlot, VendorSlotApplication } from "@/types/vendor";
import type { PaginatedResponse } from "@/types";
import { useAfroStore } from "@/stores";
import { useGetAllVendorApplications } from "@/hooks/use-vendor-mutation";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { daysUntilEvent, stripUnderscores } from "@/lib/helper-func";
import { formatNaira } from "@/lib/format-price";

interface EditVendorSlotModalProps {
  type: "Revenue" | "Service";
  slot: VendorSlot | undefined;
}

export default function EditVendorSlotModal({
  type,
  slot,
}: EditVendorSlotModalProps) {
  const [open, setOpen] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const label = type === "Revenue" ? "Slot" : "Offer";
  const { user } = useAfroStore();
  const slotData = slot?.vendorDetails?.slotData;
  const serviceData = slot?.vendorDetails?.serviceData;
  const applicationDeadline =
    type === "Revenue"
      ? slotData?.applicationDeadline
      : serviceData?.applicationDeadline;

  const { data: applicationsData } = useGetAllVendorApplications(
    slot?.eventId ?? "",
  );
  const applications =
    (applicationsData?.data as PaginatedResponse<VendorSlotApplication> | undefined)
      ?.items ?? [];
  const slotApplications = applications.filter(
    (application) => application.eventVendorId === slot?.vendorId,
  );
  const confirmedVendors = slotApplications.filter(
    (application) => application.status === "Approved",
  ).length;
  const pendingRequests = slotApplications.filter(
    (application) => application.status === "Pending",
  ).length;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-8 px-5 py-2.5 rounded-[6px] gap-4 font-inter text-xs capitalize"
      >
        Edit {label}
        <SquarePen className="w-4 h-4" />
      </Button>

      <BaseModal
        open={open}
        onClose={setOpen}
        size="small"
        floatingCancel
        title={`Edit Vendor ${label}`}
        className="sm:max-w-[640px]"
      >
        <div className="max-h-[80vh] overflow-y-auto py-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-5">
            <p className="font-inter text-xl font-black text-system-black">
              {slot?.vendorName}
            </p>
            {/**
             * Replace this when the backend returns the slot status
             */}
            <div className="rounded-xl px-4 py-1.5 bg-[#BFEACB]">
              <p className="font-inter font-semibold text-xs text-[#00AD2E]">
                Application Ongoing
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-[#d9d9d9] px-8">
            <div className="flex flex-col text-white bg-[#ACACAC] rounded-xl px-3 py-4 gap-2 mt-8">
              <p className="font-inter font-bold text-xl">{slot?.vendorName}</p>
              <p className="font-inter text-sm">
                {stripUnderscores(slot?.category)}
              </p>
              {applicationDeadline && (
                <p>
                  Application ends in {daysUntilEvent(applicationDeadline)} days
                </p>
              )}
            </div>
            <div className="flex flex-col text-white bg-[#ACACAC] rounded-xl px-3 py-4 gap-2 ">
              <p className="font-bold text-base font-sf-pro-display">
                Contact Details
              </p>
              <p className="font-sf-pro-display font-sm text-white/70">
                How secured vendors contact you
              </p>
              <div className="flex flex-row gap-1">
                <MdOutlineMailOutline className="w-5 h-5" />
                <p className="font-sf-pro-display text-sm font-semibold">{slot?.vendorDetails?.contact.email || user?.email}</p>
              </div>
              <div className="flex flex-row gap-1">
                <CiPhone className="w-5 h-5" />
                <p className="font-sf-pro-display text-sm font-semibold">
                  {slot?.vendorDetails?.contact.phoneNumbers ||
                    user?.profile.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col text-black bg-white rounded-xl px-3 py-4 gap-2 ">
              <p className="font-bold font-inter text-system-black text-xl">
                Description
              </p>
              <p
                className={`font-inter text-sm ${viewMore ? "line-clamp-none" : "line-clamp-3"}`}
              >
                {slot?.description || "No description provided"}
              </p>
              {slot?.description && (
                <p
                  className="font-sf-pro-display font-bold text-xs uppercase cursor-pointer"
                  onClick={() => setViewMore((prev) => !prev)}
                >
                  {viewMore ? "View Less" : "View More"}
                </p>
              )}
            </div>

            <div className="flex flex-col text-black bg-white rounded-xl px-3 py-4 gap-3">
              <p className="font-bold font-inter text-system-black text-xl">
                Slot Overview
              </p>
              <table className="w-full text-sm font-inter">
                <tbody>
                  <tr className="border-b border-[#E0E0E0]">
                    <td className="py-2 text-mid-dark-gray">
                      {type === "Revenue" ? "Price per Slot" : "Budget"}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {type === "Revenue"
                        ? slotData?.price !== undefined
                          ? formatNaira(slotData.price)
                          : "N/A"
                        : serviceData?.hasBudgetRange
                          ? `${formatNaira(serviceData.minBudget)} - ${formatNaira(serviceData.maxBudget)}`
                          : serviceData?.minBudget !== undefined
                            ? formatNaira(serviceData.minBudget)
                            : "N/A"}
                    </td>
                  </tr>
                  {type === "Revenue" && (
                    <tr className="border-b border-[#E0E0E0]">
                      <td className="py-2 text-mid-dark-gray">Total Slots</td>
                      <td className="py-2 text-right font-semibold">
                        {slotData?.slotNumber ?? "N/A"}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-[#E0E0E0]">
                    <td className="py-2 text-mid-dark-gray">
                      Confirmed Vendors
                    </td>
                    <td className="py-2 text-right font-semibold text-black">
                      {confirmedVendors}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-mid-dark-gray">
                      Pending Requests
                    </td>
                    <td className="py-2 text-right font-semibold text-black">
                      {pendingRequests}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </BaseModal>
    </>
  );
}
