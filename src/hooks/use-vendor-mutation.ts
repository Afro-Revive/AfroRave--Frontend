import { vendorService } from "@/services/vendor.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventKeys } from "@/lib/event-keys";
import { toast } from "sonner";
import { VendorSlotApplication, VendorSlotRequest, type VendorSlot } from "@/types/vendor";
import type { PaginatedResponse } from "@/types";

export function useGetVendorAvailableEvents() {
  return useQuery({
    queryKey: eventKeys.vendorAvailable(),
    queryFn: () => vendorService.getAvailableEvents(),
  });
}

export function useGetAllVendorSlots(eventId: string) {
  return useQuery({
    queryKey: eventKeys.vendorSlots(eventId),
    queryFn: () => vendorService.getAllVendorSlots(eventId),
    enabled: !!eventId,
  });
}

export function useGetAllVendorApplications(eventId: string) {
  return useQuery({
    queryKey: eventKeys.vendorApplications(eventId),
    queryFn: () => vendorService.getAllVendorApplications(eventId),
    enabled: !!eventId,
  });
}

/**
 * Fetches all vendor applications for an event once, then splits them into Revenue and Service slots
 */

export function useVendorApplicationsByType(eventId: string) {
  const query = useGetAllVendorApplications(eventId);

  const paginated = query.data?.data as
    | PaginatedResponse<VendorSlotApplication[]>
    | undefined;
  const applications = (paginated?.items as VendorSlotApplication[] | undefined) ?? [];

  return{
    ...query,
    applications,
    revenueApplications: applications.filter((application) => application.vendorType === "Revenue"),
    serviceApplications: applications.filter((application) => application.vendorType === "Service"),
  }
}

/**
 * Fetches all vendor slots for an event once, then splits them into Revenue and Service slots
 */
export function useVendorSlotsByType(eventId: string) {
  const query = useGetAllVendorSlots(eventId);

  const paginated = query.data?.data as
    | PaginatedResponse<VendorSlot[]>
    | undefined;
  const slots = (paginated?.items as VendorSlot[] | undefined) ?? [];

  return {
    ...query,
    slots,
    revenueSlots: slots.filter((slot) => slot.vendorType === "Revenue"),
    serviceSlots: slots.filter((slot) => slot.vendorType === "Service"),
  };
}

export function useGetVendorSlotById(vendorId: string) {
  return useQuery({
    queryKey: eventKeys.vendorSlotById(vendorId),
    queryFn: () => vendorService.getVendorSlotById(vendorId),
    enabled: !!vendorId,
  });
}

export function useCreateVendorListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: VendorSlotRequest) => {
      await vendorService.createVendorListing(data);
    },
    onSuccess: () => {
      toast.success("Vendor listing created successfully.");
      queryClient.invalidateQueries({ queryKey: eventKeys.vendorAvailable() });
    },
    onError: () => toast.error("Failed to create vendor listing."),
  });
}

export function useGetOrganizerVendorListings(eventVendorId: string) {
  return useQuery({
    queryKey: eventKeys.organizerVendorListings(eventVendorId),
    queryFn: () => vendorService.getOrganizerVendorListings(eventVendorId),
    enabled: !!eventVendorId,
  })
}

/**
 * Fetches all vendor slots applications for an event once, then splits them into Revenue and Service slots
 */
export function useVendorApplicationsSlotsByType(eventVendorId: string) {
  const query = useGetOrganizerVendorListings(eventVendorId);

  const paginated = query.data?.data as
    | PaginatedResponse<VendorSlotApplication[]>
    | undefined;
  const slots = (paginated?.items as VendorSlotApplication[] | undefined) ?? [];

  return {
    ...query,
    slots,
    revenueSlots: slots.filter((slot) => slot.vendorType === "Revenue"),
    serviceSlots: slots.filter((slot) => slot.vendorType === "Service"),
  };
}


interface VendorApplicationDecision {
  applicationId: number;
  reason?: string;
}

// Vendor application lists query key for invalidation after accept/reject mutation
const vendorApplicationListsKey = [...eventKeys.all, "vendor", "slot"] as const;

/**
 * Accept Vendor Application
 */

export function useAcceptVendorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reason }: VendorApplicationDecision) =>
      vendorService.acceptVendorListings(applicationId, reason),
    onSuccess: () => {
      toast.success("Vendor application accepted successfully.");
      queryClient.invalidateQueries({ queryKey: vendorApplicationListsKey });
    },
    onError: () => toast.error("Failed to accept vendor application."),
  });
}

/**
 * Reject Vendor Application
 */

export function useRejectVendorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reason }: VendorApplicationDecision) =>
      vendorService.rejectVendorListings(applicationId, reason),
    onSuccess: () => {
      toast.success("Vendor application rejected successfully.");
      queryClient.invalidateQueries({ queryKey: vendorApplicationListsKey });
    },
    onError: () => toast.error("Failed to reject vendor application."),
  });
}
