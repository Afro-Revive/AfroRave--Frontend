import { Ticket2 } from 'iconsax-react'
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
  hiddenFormats = [],
}: {
  selected: TicketFormat | null
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
          Choose Ticket Format
        </h2>
        <p className='font-inter-tight font-medium text-sm text-[#464444]'>
          Select how this ticket admits guests. You can add more ticket types after this
          one.
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
                <Ticket2 size={18} color='#AE0D0D' variant='Outline' />
              </span>

              <span className='flex flex-col gap-1'>
                <span
                  className={cn(
                    'font-inter-tight text-sm font-bold uppercase tracking-[0.08em]',
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
