import { z } from 'zod'

/** What the Get In Touch form can be about. Sent as the message's category and subject. */
export const SERVICE_CATEGORIES = [
  'Platform support',
  'Rentals & Production',
  'Events Consulting',
  'General enquiries',
] as const

export const getInTouchSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be at most 50 characters' }),
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  category: z.string().min(1, { message: 'Choose what this is about' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' }),
})

export type GetInTouchValues = z.infer<typeof getInTouchSchema>

export const defaultGetInTouchValues: GetInTouchValues = {
  firstName: '',
  lastName: '',
  email: '',
  category: '',
  message: '',
}
