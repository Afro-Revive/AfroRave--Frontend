import { Badge } from '@/components/ui/badge'
import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import {
  ActionPopover,
  ActionPopoverItem,
} from '@/pages/creators/add-event/component/action-popover'
import { Send } from 'lucide-react'
import { BsTicketPerforated } from 'react-icons/bs'

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
  accessLabel,
  isInviteOnly = false,
  onClick,
  onEdit,
  onDelete,
  onSendInvite,
  invitesSent,
  isSelected = false,
  isUpdating = false,
  isDeleting = false,
}: {
  name: string
  price: number
  typeLabel: string
  /** The ticket's accessType — Free, Paid or Invite. */
  accessLabel?: string
  isInviteOnly?: boolean
  onClick?: () => void
  /** Omit where the ticket can only be removed. */
  onEdit?: () => void
  onDelete: () => void
  /** Only reaches the menu on an invite-only ticket. */
  onSendInvite?: () => void
  /** Invites sent so far. Shown on invite-only tickets only. */
  invitesSent?: number
  /** Highlighted as the ticket whose details are showing below. */
  isSelected?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
}) {
  return (
    <div className='w-full flex flex-col'>
      <div
        role={onClick ? 'button' : undefined}
        aria-pressed={onClick ? isSelected : undefined}
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-between border px-3 py-[11px] shadow-[0px_2px_10px_2px_#0000001A] rounded-[5px] transition-colors',
          isSelected ? 'border-deep-red' : 'border-mid-dark-gray/30',
          onClick && 'cursor-pointer',
        )}>
        <div className='flex flex-row gap-1 items-center'>
          <BsTicketPerforated size={20} color='#AE0D0D' className='rotate-90' />

          <div className='flex flex-col gap-1 ml-2'>
            <p className='capitalize md:text-sm text-xs font-semibold font-work-sans leading-[100%] text-black'>
              {name}
            </p>
            <p className='capitalize md:text-xs text-[10px] font-medium font-inter-tight leading-[100%] text-[#949494]'>
              {formatNaira(price, { free: true })}
            </p>
          </div>
        </div>

        {/* stopPropagation so opening the menu doesn't also fire onClick. */}
        <div
          className='flex items-center gap-3'
          onClick={(event) => event.stopPropagation()}>
          <TicketBadge text={typeLabel} />

          {/* Falls back to Invite so callers that only know the boolean — the
              create flow holds no accessType — keep their badge. */}
          {(accessLabel ?? (isInviteOnly ? 'Invite' : undefined)) && (
            <TicketBadge
              type={isInviteOnly ? 'invite-only' : 'access'}
              text={accessLabel ?? 'Invite'}
            />
          )}

          {isInviteOnly && (
            <span
              title={`${invitesSent ?? 0} ${invitesSent === 1 ? 'invite' : 'invites'} sent`}
              className='flex items-center gap-1 font-inter-tight md:text-sm text-xs font-semibold text-[#00AD2E]'>
              <Send className='size-4' />
              {invitesSent ?? 0}
            </span>
          )}

          <ActionPopover
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onEdit={onEdit}
            onDelete={onDelete}
            editLabel='Edit Ticket'
            extraActions={
              isInviteOnly && onSendInvite ? (
                <ActionPopoverItem
                  onClick={onSendInvite}
                  disabled={isUpdating || isDeleting}>
                  Send Invite
                </ActionPopoverItem>
              ) : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}

function TicketBadge({
  type = 'default',
  text = 'invite only',
}: {
  type?: 'default' | 'invite-only' | 'access'
  text?: string
}) {
  return (
    <Badge
      className={cn(
        'py-1.5 px-2 rounded-[6px] md:text-xs text-[10px] font-sf-pro-rounded leading-[100%] whitespace-nowrap capitalize',
        {
          'bg-[#00AD2E4D] text-[#00AD2E]': type === 'default',
          'bg-[#409BFF]/60 text-tech-blue': type === 'invite-only',
          'bg-black/10 text-black/70': type === 'access',
        },
      )}>
      {text}
    </Badge>
  )
}
