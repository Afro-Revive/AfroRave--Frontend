import type { EventDetailData } from '@/types'
import { parseApiDate, toVisibility } from '@/lib/helper-func'
import { africanTimezones } from './constant'

export function convertTime(time: string) {
  const [hourStr, minute] = time.split(':')
  let hour = Number.parseInt(hourStr, 10)

  const period = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12

  return {
    hour: hour.toString().padStart(2, '0'),
    minute,
    period,
  }
}

export function formatDateOnly(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getOffset(timeZone: string): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    timeZoneName: 'shortOffset',
  })

  const parts = formatter.formatToParts(now)
  const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value || 'UTC'

  const match = offsetPart.match(/GMT([+-]\d+)/)
  return match ? match[1] : '+0'
}

/**
 * The zone shown for each saved offset. The API keeps only the offset ("+1"),
 * not the zone picked, so Lagos can't round-trip as Lagos; without this the
 * first zone in the list with that offset came back (Lagos saved, Algiers shown).
 */
const PREFERRED_ZONE_BY_OFFSET: Record<string, string> = {
  '+0': 'Africa/Accra',
  '+1': 'Africa/Lagos',
  '+2': 'Africa/Johannesburg',
  '+3': 'Africa/Nairobi',
}

/** "+1", "UTC+1", "GMT+01:00" and "1" all read as "+1"; anything else as is. */
function normaliseOffset(offset: string): string {
  const match = offset?.trim().match(/^(?:UTC|GMT)?\s*([+-])?0?(\d{1,2})(?::?00)?$/i)
  return match ? `${match[1] ?? '+'}${Number(match[2])}` : offset
}

export function getAfricanTimezoneByOffset(offset: string) {
  const normalised = normaliseOffset(offset)
  const preferred = PREFERRED_ZONE_BY_OFFSET[normalised]
  return (
    africanTimezones.find((tz) => tz.value === preferred) ??
    africanTimezones.find((tz) => getOffset(tz.value) === normalised)
  )
}

export function transformEventToSchema(event: EventDetailData) {
  const eventDate = event.eventDate

  return {
    name: event.eventName,
    age_rating: event.ageRating,
    category: event.category,
    custom_url: event.customUrl,
    venue: event.venue,
    description: event.description,
    event_type: 'standalone' as const,
    // Both are seeded so a save round-trips them. transformEventDetailsToCreateRequest
    // treats a missing visibility as 'Private', which would quietly take a
    // public event off discovery on the first edit.
    visibility: toVisibility(event.accessType),
    // posterUrl is what the detail response carries; the nested flyer is only a
    // fallback for events saved before that field existed.
    poster_url: event.posterUrl || event.eventDetails.desktopMedia?.flyer || '',
    time_zone: getAfricanTimezoneByOffset(eventDate.timezone)?.value,
    // Event days are plain calendar days ('2026-10-20'): parseApiDate keeps
    // the day, where new Date reads it as UTC midnight and can land a day off.
    start_date: {
      date: parseApiDate(eventDate.startDate),
      hour: convertTime(eventDate.startTime).hour,
      minute: convertTime(eventDate.startTime).minute,
      period: convertTime(eventDate.startTime).period as 'AM' | 'PM',
    },
    end_date: {
      date: parseApiDate(eventDate.endDate),
      hour: convertTime(eventDate.endTime).hour,
      minute: convertTime(eventDate.endTime).minute,
      period: convertTime(eventDate.endTime).period as 'AM' | 'PM',
    },
    email: event.eventDetails.eventContact.email,
    // Optional, so an event saved without one comes back as null.
    website_url: event.eventDetails.eventContact.website ?? '',
    socials: {
      instagram: event.eventDetails.socials.instagram,
      tiktok: event.eventDetails.socials.tiktok,
      x: event.eventDetails.socials.x,
      facebook: event.eventDetails.socials.facebook,
    },
  }
}
