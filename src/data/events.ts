export interface IEvents {
  id: number
  thumbnail: string
  image: string
  event_name: string
  event_location: string
  event_date: string
  event_time: { start_time: string; end_time: string }
  rated_18: boolean
  description: string[]
  artist_lineup: string[]
  tickets: { name: string; price: number }[]
  socials: {
    website?: string
    instagram_link?: string
    x_link?: string
    tiktok_link?: string
    youtube_link?: string
  }
}
