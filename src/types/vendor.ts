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

export interface VendorSlotRequest{
  vendorType: string,
  category: string,
  description: string,
  eventId: string,
  vendorDetails: {
    slotData: {
      slotName: string,
      slotNumber: 0,
      price: 0,
      applicationDeadline: string
    },
    serviceData: {
      serviceName: string,
      hasBudgetRange: boolean,
      minBudget: 0,
      maxBudget: 0,
      startTime: string,
      stopTime: string,
      startDate: string,
      endDate: string,
      applicationDeadline: string
    },
    contact: {
      useDifferentContactDetails: boolean,
      email: string,
      phoneNumbers: string[]
    },
    hideSocialLinks: true,
    applicationDeadline: string
  }
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
