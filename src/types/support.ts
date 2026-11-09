/** A message for the support team, from anyone (no login needed). */
export interface SupportMessageRequest {
  name: string
  email: string
  subject?: string
  message: string
  /** What it's about, e.g. "LED screen rentals". */
  category?: string
  phoneNumber?: string
}
