import type { VendorSlotApplication } from "@/types/vendor";

export type ApplicationStatus = VendorSlotApplication["status"];

/**
 * How each application status reads to the organizer. A new application is a
 * request; once accepted it waits on the vendor's payment (Acquired), shown as
 * pending; once paid it's secured.
 */
export const APPLICATION_STATUS: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  Pending: { label: "Requested", className: "text-[#007AFF]" },
  Acquired: { label: "Pending", className: "text-orange-peel" },
  Secured: { label: "Secured", className: "text-green" },
  Rejected: { label: "Rejected", className: "text-deep-red" },
};

export type ApplicationFilter = "all" | ApplicationStatus;

/** The filter pills over the applications list, in the design's order. */
export const APPLICATION_FILTERS: { value: ApplicationFilter; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "Pending", label: "Requests" },
    { value: "Secured", label: "Secured" },
    { value: "Acquired", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
  ];
