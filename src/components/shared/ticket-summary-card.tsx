import { Badge } from '@/components/ui/badge'
import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import { ActionPopover } from '@/pages/creators/add-event/component/action-popover'
import { Ticket2 } from 'iconsax-react'

/**
 * One saved ticket, as listed while building an event and while editing one.
 * Takes plain values rather than a ticket object: the two callers hold
 * different shapes — the create flow's SavedTicket and the API's TicketData —
 * and normalising at the call site keeps this free of either.
 */
export function TicketSummaryCard({
  name,
  price,
  typeLabel,
  isInviteOnly = false,
  onClick,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: {
  name: string
  price: number
  typeLabel: string
  isInviteOnly?: boolean
  onClick?: () => void
  /** Omit where the ticket can only be removed. */
  onEdit?: () => void
  onDelete: () => void
  isUpdating?: boolean
  isDeleting?: boolean
}) {
  return (
    <div className='w-full flex flex-col'>
      <div
        role={onClick ? 'button' : undefined}
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-between border border-mid-dark-gray/30 px-3 py-[11px] shadow-[0px_2px_10px_2px_#0000001A] rounded-[5px]',
          onClick && 'cursor-pointer',
        )}>
        <div className='flex flex-row gap-1 items-center'>
          <Ticket2 size={20} color='#00AD2E' variant='Bold' />

          <div className='flex flex-col gap-1 ml-2'>
            <p className='capitalize text-sm font-semibold font-inter-tight leading-[100%] text-black'>
              {name}
            </p>
            <p className='capitalize text-xs font-medium font-inter-tight leading-[100%] text-[#949494]'>
              {formatNaira(price, { free: true })}
            </p>
          </div>
        </div>

        {/* stopPropagation so opening the menu doesn't also fire onClick. */}
        <div
          className='flex items-center gap-3'
          onClick={(event) => event.stopPropagation()}>
          <TicketBadge text={typeLabel} />
          {isInviteOnly && <TicketBadge type='invite-only' />}

          <ActionPopover
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      {isInviteOnly && (
        <p className='p-2.5 text-xs leading-[100%] font-sf-pro-display uppercase text-deep-red/70'>
          access the invite link in your dashboard
        </p>
      )}
    </div>
  )
}

function TicketBadge({
  type = 'default',
  text = 'invite only',
}: {
  type?: 'default' | 'invite-only'
  text?: string
}) {
  return (
    <Badge
      className={cn(
        'py-1.5 px-2 rounded-[6px] text-xs font-sf-pro-rounded leading-[100%] whitespace-nowrap',
        {
          'bg-[#00AD2E4D] text-[#00AD2E]': type === 'default',
          'bg-deep-red/30 text-deep-red': type === 'invite-only',
        },
      )}>
      {text}
    </Badge>
  )
}
