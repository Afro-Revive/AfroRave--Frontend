import { TicketSummaryCard } from '@/components/shared/ticket-summary-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetTicket } from '@/hooks/use-event-mutations'
import { useGetTicketInvites } from '@/hooks/use-invite-ticket-mutations'
import type { TicketData } from '@/types'
import { X } from 'lucide-react'
import { useState } from 'react'

/** One saved ticket in the list, with its detail popup. */
export function TicketCard({
  ticket,
  onDelete,
  onEdit,
  onSendInvite,
  onSelect,
  isSelected = false,
  isLoading = false,
  isUpdating = false,
}: ITicketCard) {
  const [detailOpen, setDetailOpen] = useState(false)
  // Fetch full ticket data eagerly so badges and description are always available
  const { data: fullTicketResponse, isLoading: isLoadingDetail, isError: isDetailError } = useGetTicket(ticket.ticketId)

  // Handle both wrapped ApiResponse<TicketData> and direct TicketData response shapes
  const fullTicket: TicketData | null =
    (fullTicketResponse as { data?: TicketData })?.data ??
    (fullTicketResponse as unknown as TicketData) ??
    null

  const detail = fullTicket ?? ticket

  // quantity === 0 means unlimited — never sold out
  const isUnlimited = (detail.quantity ?? ticket.quantity) === 0
  const isSoldOut = !isUnlimited && (detail.availableQuantity ?? ticket.availableQuantity) === 0

  const ticketType = detail.ticketType ?? ticket.ticketType
  const accessType = detail.accessType ?? ticket.accessType
  const salesType = detail.salesType ?? ticket.salesType
  // Description: check top-level field first, then nested ticketDetails
  const description =
    (detail.description && detail.description.trim()) ||
    (detail.ticketDetails?.description && detail.ticketDetails.description.trim()) ||
    ''

  // Available count for display
  const availableQty = detail.availableQuantity ?? ticket.availableQuantity

  // Only invite-only tickets show a count, so only they fetch one. Shares its
  // key with the Send Invites modal, so sending refreshes this too.
  const isInviteOnly = accessType === 'Invite'
  const { data: invites = [] } = useGetTicketInvites(ticket.ticketId, {
    enabled: isInviteOnly,
  })
  const invitesSent = isInviteOnly ? invites.length : undefined

  const typeBadge = ticketType
    ? ({ Single: 'Single Ticket', Group: 'Group Ticket', MultiDay: 'Multi Day' } as const)[ticketType]
    : null

  return (
    <>
      <TicketSummaryCard
        name={ticket.ticketName}
        price={ticket.price}
        typeLabel={typeBadge ?? 'Ticket'}
        accessLabel={accessType}
        isInviteOnly={isInviteOnly}
        // Invite-only tickets select, so their invites show below the list.
        // Others keep the detail popup — there's nothing per-ticket to list.
        onClick={isInviteOnly ? onSelect : () => setDetailOpen(true)}
        isSelected={isSelected}
        onDelete={onDelete}
        onEdit={onEdit}
        onSendInvite={onSendInvite}
        invitesSent={invitesSent}
        isDeleting={isLoading}
        isUpdating={isUpdating}
      />

      {/* Detail popup */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent noCancel className='max-w-sm p-0 rounded-[16px] overflow-hidden bg-[#EFEFEF]'>
          <DialogTitle className='sr-only'>{ticket.ticketName}</DialogTitle>
          <DialogDescription className='sr-only'>Ticket details</DialogDescription>

          {/* Header */}
          <div className='relative flex flex-col items-center px-10 pt-6 pb-4'>
            <DialogClose asChild>
              <button type='button' className='absolute right-4 top-4 text-gray-600 hover:text-black p-1 rounded transition-colors'>
                <X size={20} />
              </button>
            </DialogClose>
            <p className='font-bold font-sf-pro-display text-[17px] text-black text-center leading-snug'>{ticket.ticketName}</p>
            <p className='text-sm text-gray-500 font-sf-pro-display mt-1 text-center'>
              {isUnlimited
                ? '∞ tickets available'
                : isSoldOut
                  ? 'Sold Out'
                  : `${availableQty} remaining`}
            </p>
          </div>

          {/* Body — white card */}
          <div className='mx-3 mb-4 bg-white rounded-[12px] px-4 py-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto'>
            {salesType === 'Door' ? (
              /* Door ticket — Sell On Mobile App */
              <button
                type='button'
                className='w-full py-2 rounded-full bg-[#E5E5EA] text-[#3C3C43] text-sm font-sf-pro-display font-medium'
                onClick={() => {}}>
                Sell On Mobile App
              </button>
            ) : (
              <>
                <div>
                  <p className='font-sf-pro-display font-bold text-[15px] text-black mb-1'>Description</p>
                  {isLoadingDetail ? (
                    <p className='text-sm text-gray-400 font-sf-pro-display'>Loading...</p>
                  ) : isDetailError ? (
                    <p className='text-sm text-red-400 font-sf-pro-display italic'>Failed to load details.</p>
                  ) : description ? (
                    <p className='font-sf-pro-display text-[14px] text-black leading-relaxed'>{description}</p>
                  ) : (
                    <p className='text-sm text-gray-400 font-sf-pro-display italic'>No description provided.</p>
                  )}
                </div>
                {accessType === 'Invite' && (
                  <CopyLinkButton ticketId={ticket.ticketId} eventId={ticket.eventId} />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CopyLinkButton({ ticketId, eventId }: { ticketId: string; eventId: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const inviteLink = `${window.location.origin}/events/${eventId}/invite/${ticketId}`
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Button
      type='button'
      onClick={handleCopy}
      className='w-full h-9 rounded-full bg-deep-red hover:bg-deep-red/90 text-white text-xs font-semibold font-sf-pro-text uppercase'>
      {copied ? 'Copied!' : 'Copy Link'}
    </Button>
  )
}

interface ITicketCard {
  ticket: TicketData
  onDelete: () => void
  onEdit: () => void
  /** Called only for invite-only tickets. */
  onSendInvite: () => void
  /** Clicking an invite-only ticket selects it, to show its invites. */
  onSelect: () => void
  isSelected?: boolean
  isLoading?: boolean
  isUpdating?: boolean
}
