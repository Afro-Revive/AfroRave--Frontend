import { z } from 'zod'

const scheduledStartSchema = z.object({
  whenToStart: z.enum(['immediately', 'at-a-scheduled-date'], {
    required_error: 'Pick an option.',
  }),
  allow_ticket_resell: z.boolean().optional().default(false),
  scheduledDate: z
    .object({
      date: z.date({ required_error: 'A start date is required.' }),
      hour: z.string().min(1).max(2),
      minute: z.string().min(1).max(2),
      period: z.enum(['AM', 'PM']),
    })
    .optional(),
})

function withScheduledStart<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  return schema.merge(scheduledStartSchema).refine(
    (data) => {
      if (data.whenToStart === 'immediately') return true
      return !!data.scheduledDate
    },
    {
      message: 'Scheduled date is required when schedule start is enabled',
      path: ['scheduledDate'],
    },
  )
}

const ticketBaseFields = z.object({
  ticketName: z.string().min(3, { message: 'Provide a valid ticket name.' }),
  type: z.enum(['paid', 'free'], { required_error: 'Pick an option.' }),
  invite_only: z.boolean().optional().default(false),
  salesType: z.string({ required_error: 'Select a sale type.' }),
  quantity: z.object({
    availability: z.enum(['limited', 'unlimited']),
    amount: z.string().optional(),
  }).refine(
    (q) => q.availability === 'unlimited' || (q.amount != null && q.amount.length >= 1),
    { message: 'Provide a valid quantity.', path: ['amount'] },
  ),
  price: z.string().optional(),
  purchase_limit: z.string(),
  description: z
    .string()
    .min(10, { message: 'Description too short.' })
    .max(2000, { message: 'Description too long.' }),
})

const singleTicketObject = ticketBaseFields.extend({
  ticketType: z.literal('single_ticket'),
})

const groupTicketObject = ticketBaseFields.extend({
  ticketType: z.literal('group_ticket'),
  group_size: z.string(),
})

const multiDayObject = ticketBaseFields.extend({
  ticketType: z.literal('multi_day'),
  days_valid: z.string(),
})

const TicketItemSchema = z.discriminatedUnion('ticketType', [
  singleTicketObject,
  groupTicketObject,
  multiDayObject,
])

export const unifiedTicketFormSchema = withScheduledStart(
  z.object({
    ticket: TicketItemSchema,
  }),
).refine(
  (data) => {
    // Validate that paid tickets have a price
    if (data.ticket.type === 'paid' && (!data.ticket.price || data.ticket.price.length < 3)) {
      return false
    }
    return true
  },
  {
    message: 'Paid tickets must have a valid price',
    path: ['ticket', 'price'],
  },
)

export const confirmationMailSchema = z.object({
  confirmationEmail: z.string().max(250, { message: 'Message too long' }).optional(),
  email: z
    .string({
      required_error:
        'Confirmation email description cannot be empty or contain invalid characters. Please enter a clear and concise message.',
    })
    .email({
      message:
        'Confirmation email description cannot be empty or contain invalid characters. Please enter a clear and concise message.',
    }),
})

export type UnifiedTicketForm = z.infer<typeof unifiedTicketFormSchema>

export const defaultUnifiedTicketValues: UnifiedTicketForm = {
  ticket: {
    ticketName: '',
    type: 'paid',
    invite_only: false,
    salesType: '',
    quantity: {
      availability: 'limited',
      amount: '',
    },
    price: '',
    purchase_limit: '',
    description: '',
    ticketType: 'single_ticket',
  },
  whenToStart: 'at-a-scheduled-date',
  allow_ticket_resell: false,
  scheduledDate: {
    date: new Date(),
    hour: '12',
    minute: '00',
    period: 'AM',
  },
}
