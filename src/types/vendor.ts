import { ApiResponse } from "./api"

export interface VendorRegistration {
    firstName: string
    lastName: string
    category: string
    email: string
    businessName: string
    isRegistered: boolean
    description: string
}

export interface VendorNewsletterData {
    email: string
    firstName: string
    lastName: string
    businessName: string
    category: string
    description: string
    isRegisteredBusiness: boolean
}

export interface VendorCategory {
    value: string
    label: string
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'merchandise', label: 'Merchandise & Apparel' },
    { value: 'art_crafts', label: 'Art & Crafts' },
    { value: 'beauty_wellness', label: 'Beauty & Wellness' },
    { value: 'entertainment', label: 'Entertainment Services' },
    { value: 'photography', label: 'Photography & Videography' },
    { value: 'technology', label: 'Technology & Electronics' },
    { value: 'other', label: 'Other' },
]

// Vendor Slot Data for GET /api/Event/{eventId}/vendor-slots
export interface VendorSlot {
    vendorId: string
    vendorType: string
    category: string
    vendorCategory: string
    vendorName: string
    description: string
    contactEmail: string
    contactPhone: string
    eventId: string
    eventName: string
    status: string
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
    status: string
    message: string
    createDate: string
    updatedDate: string
}

export type VendorApplicationsResponse = ApiResponse<VendorApplications>

export interface VendorApplicationRequest {
    eventId: string
    eventVendorId: string
    requestedSlots: number
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
    }
}

export type VendorAvailableEvents = ApiResponse<VendorSlot[]>