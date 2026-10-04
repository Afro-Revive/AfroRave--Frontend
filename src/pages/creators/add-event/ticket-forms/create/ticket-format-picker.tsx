import { BsTicketPerforated } from 'react-icons/bs';
import { cn } from '@/lib/utils'

/**
 * UI-level formats, which don't map one-to-one onto `ticketType`: invite-only
 * is a single ticket carrying the `invite_only` flag, the same split the API
 * makes between ticketType (Single/Group/MultiDay) and accessType (…/Invite).
 * The caller does that translation.
 */
export type TicketFormat = 'single_ticket' | 'group_ticket' | 'invite_only'

const TICKET_FORMATS: { value: TicketFormat; name: string; caption: string }[] = [
  {
    value: 'single_ticket',
    name: 'Single Ticket',
    caption: 'Admits only one individual',
  },
  {
    value: 'group_ticket',
    name: 'Group Ticket',
    caption:
      'Admits a set number of guests under one ticket. Not available for private events.',
  },
  {
    value: 'invite_only',
    name: 'Invite-only Ticket',
    caption:
      'Admits one guest by invitation. Invitations can be sent from your guestlist',
  },
]

export function TicketFormatPicker({
  selected,
  onSelect,
  header = 'Choose Ticket Format',
  description = 'Select how this ticket admits guests. You can add more ticket types after this one.',
  hiddenFormats = [],
}: {
  selected: TicketFormat | null
  header?: string
  description?: string
  onSelect: (format: TicketFormat) => void
  /** Formats the event can't offer — a private event has no group tickets. */
  hiddenFormats?: TicketFormat[]
}) {
  const formats = TICKET_FORMATS.filter(
    ({ value }) => !hiddenFormats.includes(value),
  )

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='font-inter-tight font-bold text-2xl text-black uppercase'>
          {header}
        </h2>
        <p className='font-inter-tight font-medium text-sm text-[#464444]'>
          {description}
        </p>
      </div>

      <div role='radiogroup' className='w-full flex flex-col gap-4'>
        {formats.map(({ value, name, caption }) => {
          const isSelected = selected === value

          return (
            <button
              key={value}
              type='button'
              role='radio'
              aria-checked={isSelected}
              onClick={() => onSelect(value)}
              className={cn(
                'w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                isSelected
                  ? 'border-deep-red'
                  : 'border-black/10 hover:border-black/30',
              )}>
              <span className='shrink-0 pt-0.5'>
                <BsTicketPerforated size={20} color='#AE0D0D' />
              </span>

              <span className='flex flex-col gap-1'>
                <span
                  className={cn(
                    'font-work-sans text-sm  uppercase ',
                    isSelected ? 'text-deep-red' : 'text-black',
                  )}>
                  {name}
                </span>

                <span
                  className={cn(
                    'font-inter-tight text-sm',
                    isSelected ? 'text-deep-red' : 'text-[#464444]',
                  )}>
                  {caption}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
