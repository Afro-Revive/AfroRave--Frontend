import { ApiResponse } from "./api";
export interface VendorRegistration {
  firstName: string;
  lastName: string;
  category: string;
  email: string;
  businessName: string;
  isRegistered: boolean;
  description: string;
}

export interface VendorNewsletterData {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  category: string;
  description: string;
  isRegisteredBusiness: boolean;
}

export interface VendorCategory {
  value: string;
  label: string;
}

// Vendor Slots Response for GET /api/Event/{eventId}/vendor-slots
export interface VendorSlot {
  vendorId: string;
  vendorType: "Revenue" | "Service";
  category: string;
  vendorCategory: string;
  vendorName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  eventId: string;
  eventName: string;
  status: string;
  vendorDetails: {
    slotData: {
      slotName: string;
      slotNumber: number;
      price: number;
      applicationDeadline: string;
    };
    serviceData: {
      serviceName: string;
      hasBudgetRange: boolean;
      minBudget: number;
      maxBudget: number;
      startTime: string;
      stopTime: string;
      startDate: string;
      endDate: string;
      applicationDeadline: string;
    };
    contact: {
      useDifferentContactDetails: boolean;
      email: string;
      phoneNumbers: string[];
    };
    hideSocialLinks: true;
    applicationDeadline: string;
  };
}

export type VendorSlotsResponse = ApiResponse<VendorSlot[]>;

export interface VendorSlotApplication {
  id: string;
  eventId: string;
  eventName: string;
  vendorId: string;
  vendorBusinessName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorProfilePicture: string;
  vendorDescription: string;
  vendorBusinessData: {
    portfolio: {
      webUrl: string;
      fileUrl: string;
    };
    socials: {
      facebook: string;
      instagram: string;
      x: string;
      linkedin: string;
      tikTok: string;
      youTube: string;
      socialLink: string;
    };
    gallery: string[];
    aboutBusiness: string;
    profilePicture: string;
  };
  eventVendorId: string;
  vendorType: string;
  category: string;
  description: string;
  vendorDetails: {
    slotData: {
      slotName: string;
      slotNumber: number;
      price: number;
      applicationDeadline: string;
    };
    serviceData: {
      serviceName: string;
      hasBudgetRange: boolean;
      minBudget: number;
      maxBudget: number;
      startTime: string;
      stopTime: string;
      startDate: string;
      endDate: string;
      applicationDeadline: string;
    };
    contact: {
      useDifferentContactDetails: boolean;
      email: string;
      phoneNumbers: string[];
    };
    hideSocialLinks: true;
    applicationDeadline: string;
  };
  requestedSlots: number;
  status: "Pending" | "Approved" | "Rejected";
  message: string;
  createdAt: string;
  updatedAt: string;
}

export type VendorSlotApplicationsResponse = ApiResponse<VendorSlotApplication[]>;

export interface VendorSlotRequest {
  vendorType: string;
  category: string;
  description: string;
  eventId: string;
  vendorDetails: {
    slotData: {
      slotName: string;
      slotNumber: number;
      price: number;
      applicationDeadline?: Date | null;
    };
    serviceData: {
      serviceName: string;
      hasBudgetRange: boolean;
      minBudget: number;
      maxBudget: number;
      startTime: string;
      stopTime: string;
      startDate?: string;
      endDate?: string;
      applicationDeadline: Date | null;
    };
    contact: {
      useDifferentContactDetails: boolean;
      email: string;
      phoneNumbers: string[];
    };
    hideSocialLinks: boolean;
    applicationDeadline: string;
  };
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "merchandise", label: "Merchandise & Apparel" },
  { value: "art_crafts", label: "Art & Crafts" },
  { value: "beauty_wellness", label: "Beauty & Wellness" },
  { value: "entertainment", label: "Entertainment Services" },
  { value: "photography", label: "Photography & Videography" },
  { value: "technology", label: "Technology & Electronics" },
  { value: "other", label: "Other" },
];
