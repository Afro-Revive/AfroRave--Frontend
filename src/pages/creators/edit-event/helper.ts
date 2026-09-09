import type { EventDetailData } from '@/types'
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

export function getAfricanTimezoneByOffset(offset: string) {
  return africanTimezones.find((tz) => getOffset(tz.value) === offset) || undefined
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
    time_zone: getAfricanTimezoneByOffset(eventDate.timezone)?.value,
    start_date: {
      date: new Date(eventDate.startDate),
      hour: convertTime(eventDate.startTime).hour,
      minute: convertTime(eventDate.startTime).minute,
      period: convertTime(eventDate.startTime).period as 'AM' | 'PM',
    },
    end_date: {
      date: new Date(eventDate.endDate),
      hour: convertTime(eventDate.endTime).hour,
      minute: convertTime(eventDate.endTime).minute,
      period: convertTime(eventDate.endTime).period as 'AM' | 'PM',
    },
    email: event.eventDetails.eventContact.email,
    website_url: event.eventDetails.eventContact.website,
    socials: {
      instagram: event.eventDetails.socials.instagram,
      tiktok: event.eventDetails.socials.tiktok,
      x: event.eventDetails.socials.x,
      facebook: event.eventDetails.socials.facebook,
    },
  }
}
