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
    hideSocialLinks: boolean;
    /** "Paused" while the organizer has paused applications. */
    status?: string;
    applicationDeadline: string;
  };
}

export type VendorSlotsResponse = ApiResponse<VendorSlot[]>;

export interface VendorSlotApplication {
  id: number;
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
  noOfRequestedStalls: number;
  priceOffer: number;
  proposedPrice: number;
  status: "Pending" | "Accepted" | "Acquired" | "Rejected" | "Secured";
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

// Values kept from the first list where a category carried over, so saved profiles still match.
export const VENDOR_CATEGORIES: VendorCategory[] = [
    { value: 'food_beverage', label: 'Food & Drinks' },
    { value: 'merchandise', label: 'Fashion & Merchandise' },
    { value: 'beauty_wellness', label: 'Beauty & Personal Care' },
    { value: 'djs_hosts', label: 'DJs & Hosts' },
    { value: 'photography', label: 'Photography, Video & Media' },
    { value: 'art_crafts', label: 'Arts & Crafts' },
    { value: 'equipment_rentals', label: 'Equipment Rentals' },
    { value: 'equipment_furniture_rentals', label: 'Equipment & Furniture Rentals' },
    { value: 'decorator', label: 'Decorator' },
    { value: 'event_staffing_security', label: 'Event Staffing & Security' },
    { value: 'cleaning_services', label: 'Cleaning Services' },
    { value: 'games_activities_experiences', label: 'Games, Activities & Experiences' },
]

/** A category's label, or the raw value tidied up for older categories no longer listed. */
export function vendorCategoryLabel(value?: string | null): string {
    if (!value) return ''
    const match = VENDOR_CATEGORIES.find((category) => category.value === value || category.label === value)
    return match ? match.label : value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export interface VendorApplications{
    id: number
    eventId: string
    eventName: string
    eventVenue: string
    eventStartDate: string
    eventVendorId: string
    vendorType: string
    category: string
    description: string
    vendorDetails: {
         slotData: {
            slotName: string
            slotNumber: number
            price: number
            applicationDeadline: string
        }
         serviceData: {
            serviceName: string
            hasBudgetRange: boolean
            minBudget: number
            maxBudget: number
            startTime: string
            stopTime: string
            startDate: string
            endDate: string
            applicationDeadline: string
        }
         contact: {
            useDifferentContactDetails: boolean
            email: string
            phoneNumbers: string[]
        }
         hideSocialLinks: boolean
        status: string
        applicationDeadline: string
    }
    requestedSlots: number
    noOfRequestedStalls: number
    priceOffer: number
    proposedPrice: number
    status: string
    message: string
    createdDate: string
    updatedDate: string
}

export type VendorApplicationsResponse = ApiResponse<VendorApplications>

export interface VendorApplicationRequest {
    eventId: string
    eventVendorId: string
    vendorId: string
    requestedSlots: number
    noOfRequestedSlots: number
    priceOffer: number | null
    message: string
    vendorType: string
    category: string
    description: string
    vendorDetails: {
         slotData: {
            slotName: string
            slotNumber: number
            price: number
            applicationDeadline: string
        }
        serviceData: {
            serviceName: string
            hasBudgetRange: boolean
            minBudget: number
            maxBudget: number
            startTime: string
            stopTime: string
            startDate: string
            endDate: string
            applicationDeadline: string
        }
         contact: {
            useDifferentContactDetails: boolean
            email: string
            phoneNumbers: string[]
        }
        hideSocialLinks: boolean
        status: string
        applicationDeadline: string
    }
}

export type VendorAvailableEvents = ApiResponse<VendorSlot[]>
// GET /api/Event/vendor/summary
export interface VendorSummary {
    savedEvents: number
    securedEvents: number
    acquiredSlots: number
}

export type VendorSummaryResponse = ApiResponse<VendorSummary>

// GET /api/Profile/vendor/event/watchlist
export interface VendorSavedEvent {
    id: string
    eventId: string
    eventName: string
    description: string
    venue: string
    startDate: string
    endDate: string
    category: string
    posterUrl: string
    createdDate: string
}

export type VendorSavedEventsResponse = ApiResponse<VendorSavedEvent>

// POST /api/Event/vendor/slot/pay
export interface PayVendorSlotRequest {
    applicationId: number
    paymentMethod: string
    reference?: string
    /** Where Paystack sends the vendor back to after paying */
    callbackUrl?: string
}
