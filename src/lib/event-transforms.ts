import type { unifiedTicketFormSchema } from '@/pages/creators/add-event/schemas/ticket-schema'
import type { VendorSchema } from '@/pages/creators/add-event/schemas/vendor-service-schema'
import type { slotSchema } from '@/pages/creators/add-event/schemas/vendor-slot-schema'
import type { EditEventDetailsSchema } from '@/schema/edit-event-details'
import type {
  CreateEventRequest,
  CreateThemeRequest,
  CreateTicketRequest,
  CreateVendorRequest,
} from '@/types'
import type { z } from 'zod'
import type { ThemeAndBannerSchema } from '@/pages/creators/add-event/schemas/theme-schema'

/**
 * Convert timezone name to UTC offset format (e.g., "Africa/Lagos" -> "+1")
 * @param timezoneName - The timezone name (e.g., "Africa/Lagos")
 * @returns The UTC offset in format "+H" or "-H" (just the hour)
 */
export function convertTimezoneToUTCOffset(timezoneName: string): string {
  try {
    const date = new Date()
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezoneName }))

    // Calculate the difference in minutes
    const diffInMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)

    // Convert to hours (rounded to nearest hour)
    const hours = Math.round(diffInMinutes / 60)

    // Format as +H or -H (just the hour)
    const sign = hours >= 0 ? '+' : '-'
    return `${sign}${Math.abs(hours)}`
  } catch {
    // Fallback to GMT if timezone is invalid
    console.warn(`Invalid timezone: ${timezoneName}, falling back to GMT`)
    return '+0'
  }
}

/**
 * Transform form data from EventDetailsTab to CreateEventRequest format
 */
export function transformEventDetailsToCreateRequest(
  formData: z.infer<typeof EditEventDetailsSchema>,
): CreateEventRequest {
  // Convert time format from 12-hour to 24-hour
  const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
    let hour24 = Number.parseInt(hour, 10)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minute}`
  }

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Convert timezone to UTC offset format
  const timezoneOffset = convertTimezoneToUTCOffset(formData.time_zone)

  return {
    eventName: formData.name,
    ageRating: formData.age_rating,
    category: formData.category,
    venue: formData.venue,
    description: formData.description,
    customUrl: formData.custom_url,
    eventDate: {
      timezone: timezoneOffset, // Use UTC offset instead of timezone name
      startDate: formatDate(formData.start_date.date),
      endDate: formatDate(formData.end_date.date),
      frequency: formData.frequency || 'Weekly',
      startTime: convertTo24Hour(
        formData.start_date.hour,
        formData.start_date.minute,
        formData.start_date.period,
      ),
      endTime: convertTo24Hour(
        formData.end_date.hour,
        formData.end_date.minute,
        formData.end_date.period,
      ),
      occurance: formData.occurrence || 0,
    },
    eventDetails: {
      termsOfRefund: '', // This field is not in the form, can be added later
      eventContact: {
        email: formData.email,
        website: formData.website_url,
      },
      socials: {
        instagram: formData.socials.instagram || '',
        x: formData.socials.x || '',
        tiktok: formData.socials.tiktok || '',
        facebook: formData.socials.facebook || '',
      },
    },
  }
}

/**
 * Transform CreateEventRequest back to form data format
 */
export function transformCreateRequestToEventDetails(
  eventData: CreateEventRequest,
): Partial<z.infer<typeof EditEventDetailsSchema>> {
  // Convert 24-hour time back to 12-hour format
  const convertTo12Hour = (
    time24: string,
  ): { hour: string; minute: string; period: 'AM' | 'PM' } => {
    const [hour, minute] = time24.split(':')
    const hourNum = Number.parseInt(hour, 10)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return {
      hour: hour12.toString(),
      minute,
      period,
    }
  }

  const startTime = convertTo12Hour(eventData.eventDate.startTime)
  const endTime = convertTo12Hour(eventData.eventDate.endTime)

  return {
    name: eventData.eventName,
    age_rating: eventData.ageRating,
    category: eventData.category,
    venue: eventData.venue,
    description: eventData.description,
    custom_url: eventData.customUrl,
    event_type:
      eventData.eventDate.frequency === 'Weekly' && (eventData.eventDate.occurance || 0) > 1
        ? 'season'
        : 'standalone',
    frequency: eventData.eventDate.frequency,
    occurrence: eventData.eventDate.occurance,
    time_zone: eventData.eventDate.timezone,
    start_date: {
      date: new Date(eventData.eventDate.startDate),
      hour: startTime.hour,
      minute: startTime.minute,
      period: startTime.period,
    },
    end_date: {
      date: new Date(eventData.eventDate.endDate),
      hour: endTime.hour,
      minute: endTime.minute,
      period: endTime.period,
    },
    email: eventData.eventDetails.eventContact.email,
    website_url: eventData.eventDetails.eventContact.website,
    socials: {
      instagram: eventData.eventDetails.socials.instagram,
      x: eventData.eventDetails.socials.x,
      tiktok: eventData.eventDetails.socials.tiktok,
      facebook: eventData.eventDetails.socials.facebook,
    },
  }
}

/**
 * Transform form data from CreateTicketForm to CreateTicketRequest format
 */
export function transformTicketsToCreateRequest(
  formData: z.infer<typeof unifiedTicketFormSchema>,
  eventId: string,
): CreateTicketRequest[] {
  // Convert time format from 12-hour to 24-hour
  const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
    let hour24 = Number.parseInt(hour, 10)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minute}`
  }

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Map ticket types from form schema to API literal types
  const mapTicketType = (ticketType: string): 'Single' | 'Group' | 'MultiDay' => {
    switch (ticketType) {
      case 'single_ticket':
        return 'Single'
      case 'group_ticket':
        return 'Group'
      case 'multi_day':
        return 'MultiDay'
      default:
        return 'Single'
    }
  }

  // Map access types from form schema to API literal types
  const mapAccessType = (type: string, inviteOnly?: boolean): 'Free' | 'Paid' | 'Invite' => {
    if (inviteOnly) return 'Invite'
    return type === 'paid' ? 'Paid' : 'Free'
  }

  // Map sales types from form schema to API literal types
  const mapSalesType = (salesType: string): 'Online' | 'Door' => {
    return salesType === 'door_sales' ? 'Door' : 'Online'
  }

  // Convert form data to API format for the single ticket
  const ticket = formData.ticket

  return [ticket].map((ticket) => ({
    ticketName: ticket.ticketName,
    accessType: mapAccessType(ticket.type, ticket.invite_only),
    salesType: mapSalesType(ticket.salesType),
    ticketType: mapTicketType(ticket.ticketType),
    quantity: ticket.quantity.availability === 'unlimited' ? 0 : Number.parseInt(ticket.quantity.amount || '0', 10),
    price: Number.parseFloat(ticket.price || '0'),
    purchaseLimit: ticket.purchase_limit ? Number.parseInt(ticket.purchase_limit, 10) : 10,
    groupSize:
      ticket.ticketType === 'group_ticket' && ticket.group_size
        ? Number.parseInt(ticket.group_size, 10)
        : 0,
    validDays:
      ticket.ticketType === 'multi_day' && ticket.days_valid
        ? Number.parseInt(ticket.days_valid, 10)
        : 0,
    description: ticket.description,
    eventId,
    ticketDetails: {
      saleImmediately: formData.whenToStart === 'immediately',
      saleBegins: formData.scheduledDate
        ? `${formatDate((formData.scheduledDate as { date: Date; hour: string; minute: string; period: 'AM' | 'PM' }).date)}T${convertTo24Hour(
            (
              formData.scheduledDate as {
                date: Date
                hour: string
                minute: string
                period: 'AM' | 'PM'
              }
            ).hour,
            (
              formData.scheduledDate as {
                date: Date
                hour: string
                minute: string
                period: 'AM' | 'PM'
              }
            ).minute,
            (
              formData.scheduledDate as {
                date: Date
                hour: string
                minute: string
                period: 'AM' | 'PM'
              }
            ).period,
          )}`
        : '',
      allowResell: false, // Add logic if needed
      mail: { body: '' }, // Add logic if needed
    },
  }))
}

/**
 * Transform form data from ThemeTab to CreateThemeRequest format
 */
export function transformThemeToCreateRequest(
  themeData: ThemeAndBannerSchema,
  eventId: string,
): CreateThemeRequest {
  return {
    desktopMedia: {
      flyer: themeData.banner.flyer || '',
      background: themeData.banner.background || '',
    },
    theme: {
      themeName: themeData.theme,
    },
    eventId,
  }
}

/**
 * Transform form data from ServiceForm to CreateVendorRequest format
 */
export function transformServiceToCreateRequest(
  formData: VendorSchema,
  eventId: string,
): CreateVendorRequest {
  // Convert time format from 12-hour to 24-hour
  const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
    let hour24 = Number.parseInt(hour, 10)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minute}`
  }

  // Map vendor type from form string to API literal type
  const mapVendorType = (type: string): 'Revenue' | 'Service' => {
    return type === 'revenue_vendor' ? 'Revenue' : 'Service'
  }

  // Convert form data to API format for each service
  return {
    vendorType: mapVendorType(formData.vendor.type),
    category: formData.vendor.baseVendorDetails.category,
    description: formData.vendor.baseVendorDetails.description,
    eventId,
    vendorDetails: {
      slotData: {
        slotName:
          formData.vendor.type === 'revenue_vendor' && formData.vendor.slot_name
            ? formData.vendor.slot_name
            : '',
        slotNumber:
          formData.vendor.type === 'revenue_vendor' && formData.vendor.number_of_slots
            ? Number(formData.vendor.number_of_slots)
            : 0,
        price:
          formData.vendor.type === 'revenue_vendor' && formData.vendor.price_per_slot
            ? Number(formData.vendor.price_per_slot)
            : 0,
      },
      serviceData: {
        serviceName:
          formData.vendor.type === 'service_vendor' && formData.vendor.service_name
            ? formData.vendor.service_name
            : '',
        minBudget:
          formData.vendor.type === 'service_vendor' && formData.vendor.budget.minBudget
            ? Number(formData.vendor.budget.minBudget)
            : 0,
        maxBudget:
          formData.vendor.type === 'service_vendor' && formData.vendor.budget.maxBudget
            ? Number(formData.vendor.budget.maxBudget)
            : 0,
        startDate:
          formData.vendor.type === 'service_vendor' && formData.vendor.startTime
            ? `${new Date().toISOString().split('T')[0]}T${convertTo24Hour(
                formData.vendor.startTime.hour,
                formData.vendor.startTime.minute,
                formData.vendor.startTime.period,
              )}:00`
            : new Date().toISOString(),
        endDate:
          formData.vendor.type === 'service_vendor' && formData.vendor.stopTime
            ? `${new Date().toISOString().split('T')[0]}T${convertTo24Hour(
                formData.vendor.stopTime.hour,
                formData.vendor.stopTime.minute,
                formData.vendor.stopTime.period,
              )}:00`
            : new Date().toISOString(),
      },
      contact: {
        email: formData.vendor.baseVendorDetails?.email || '',
        phoneNumbers:
          formData.vendor.baseVendorDetails?.phone?.map(
            (phone) => `${phone.countryCode}${phone.number}`,
          ) || [],
      },
    },
  }
}

/**
 * Transform form data from SlotForm to CreateVendorRequest format
 */
export function transformSlotToCreateRequest(
  formData: z.infer<typeof slotSchema>,
  eventId: string,
): CreateVendorRequest[] {
  // Map vendor type from form string to API literal type
  const mapVendorType = (type: string): 'Revenue' | 'Service' => {
    return type === 'revenue_vendor' ? 'Revenue' : 'Service'
  }

  // Convert form data to API format for each slot
  return formData.slot.map((slot) => ({
    vendorType: mapVendorType(slot.type),
    category: slot.category,
    description: slot.description,
    eventId,
    vendorDetails: {
      slotData: {
        slotName: slot.name,
        slotNumber: Number.parseInt(slot.slotAmount, 10),
        price: Number.parseFloat(slot.pricePerSlot),
      },
      serviceData: {
        serviceName: '', // Not applicable for slots
        minBudget: 0,
        maxBudget: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      },
      contact: {
        email: formData.email,
        phoneNumbers: formData.phone.map((phone) => `${phone.countryCode}${phone.number}`),
      },
    },
  }))
}

// /**
//  * Transform form data from PromoCodeForm to CreatePromoCodeRequest format
//  */
// export function transformPromoCodeToCreateRequest(
//   formData: z.infer<typeof promoCodeSchema>,
//   eventId: string,
// ): CreatePromoCodeRequest[] {
//   // Convert time format from 12-hour to 24-hour
//   const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
//     let hour24 = Number.parseInt(hour, 10)
//     if (period === 'PM' && hour24 !== 12) hour24 += 12
//     if (period === 'AM' && hour24 === 12) hour24 = 0
//     return `${hour24.toString().padStart(2, '0')}:${minute}`
//   }

//   // Format date to YYYY-MM-DD
//   const formatDate = (date: Date): string => {
//     return date.toISOString().split('T')[0]
//   }

//   // Map discount type from form schema to API literal type
//   const mapDiscountType = (type: string): 'Flat' | 'Percentage' => {
//     return type === 'percentage' ? 'Percentage' : 'Flat'
//   }

//   // Convert form data to API format for each promocode
//   return {
//     promoCode: promo.code,
//     discountType: mapDiscountType(promo.discount.type),
//     discountValue: Number.parseFloat(promo.discount.amount),
//     discountUsage: Number.parseInt(promo.usageLimit, 10),
//     startDate: `${formatDate(promo.startDate.date)}T${convertTo24Hour(
//       promo.startDate.hour,
//       promo.startDate.minute,
//       promo.startDate.period,
//     )}:00`,
//     endDate: `${formatDate(promo.endDate.date)}T${convertTo24Hour(
//       promo.endDate.hour,
//       promo.endDate.minute,
//       promo.endDate.period,
//     )}:00`,
//     eventId,
//     promoCodeDetails: {
//       tickets: [], // This could be mapped from form data if available
//       isMinimumSpend: promo.conditions.spend.minimum || false,
//       minimumSpend: promo.conditions.spend.amount
//         ? Number.parseFloat(promo.conditions.spend.amount)
//         : 0,
//       isMinimumTicket: promo.conditions.purchased.minimum || false,
//       minimumTicket: promo.conditions.purchased.amount
//         ? Number.parseInt(promo.conditions.purchased.amount, 10)
//         : 0,
//       note: promo.notes || '',
//       isPrivate: promo.private || false,
//       isPartnership: promo.partnershipCode || false,
//       partnerName: '', // This could be mapped from form data if available
//       commisionType: '', // This could be mapped from form data if available
//       commission: 0, // This could be mapped from form data if available
//     },
//   }
// }
