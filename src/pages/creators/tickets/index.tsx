import { FormBase } from '@/components/reusable'
import BaseTable from '@/components/reusable/base-table'
import { TicketSummaryCard } from '@/components/shared/ticket-summary-card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  useCreateTicket,
  useDeleteTicket,
  useGetEventTickets,
  useGetTicket,
} from '@/hooks/use-event-mutations'
import { transformTicketsToCreateRequest } from '@/lib/event-transforms'
import { toVisibility } from '@/lib/helper-func'
import type { TicketData } from '@/types'
import type { PaginatedResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  type UnifiedTicketForm,
  defaultUnifiedTicketValues,
  unifiedTicketFormSchema,
} from '../add-event/schemas/ticket-schema'
import type { TicketType } from '../add-event/ticket-forms/create/helper'
import { TicketForm } from '../add-event/ticket-forms/create/ticket-form'
import {
  TicketFormatPicker,
  type TicketFormat,
} from '../add-event/ticket-forms/create/ticket-format-picker'
import {
  CreatorPageContainer,
  SelectedEventGate,
} from '../_components/selected-event-page'
import { OnlyShowIf } from '@/lib/environment'
import { formatNaira } from '@/lib/format-price'

export default function TicketsPage() {
  return (
    <SelectedEventGate>
      {(event) => (
        <EventTickets
          eventId={event.eventId}
          eventName={event.eventName}
          accessType={event.accessType}
        />
      )}
    </SelectedEventGate>
  )
}

function EventTickets({ eventId, eventName, accessType }: IEventTickets) {
  // Only an explicit 'private' hides group tickets — an unrecognised or missing
  // accessType leaves them available rather than silently removing an option.
  const isPrivateEvent = toVisibility(accessType) === 'private'

  const [selectedType, setSelectedType] = useState<TicketType>()

  const { data: ticketsResponse, isLoading, error, refetch } = useGetEventTickets(eventId)
  const { mutate: createTicketMutation, isPending: isCreatingTIcket } = useCreateTicket(eventId)

  const deleteTicketMutation = useDeleteTicket(eventId)

  const tickets = ticketsResponse?.data as PaginatedResponse<TicketData> | undefined

  const ticketForm = useForm<UnifiedTicketForm>({
    resolver: zodResolver(unifiedTicketFormSchema),
    defaultValues: {
      ...defaultUnifiedTicketValues,
      whenToStart: 'immediately',
      scheduledDate: undefined,
    },
  })

  function handleCreateTicket(values: UnifiedTicketForm) {
    const ticketReuest = transformTicketsToCreateRequest(values, eventId)

    createTicketMutation(ticketReuest[0], {
      onSuccess: () => {
        setSelectedType(undefined)
        ticketForm.reset()
      },
    })
  }

  async function handleDeleteTicket(id: string) {
    deleteTicketMutation.mutateAsync(id, { onSuccess: () => refetch() })
  }

  /**
   * Invite-only isn't a ticketType — it's a single ticket carrying the
   * invite_only flag, matching how the API splits ticketType from accessType.
   */
  function handleSelectFormat(format: TicketFormat) {
    const ticketType: TicketType =
      format === 'group_ticket' ? 'group_ticket' : 'single_ticket'

    ticketForm.setValue('ticket.ticketType', ticketType)
    ticketForm.setValue('ticket.invite_only', format === 'invite_only')
    setSelectedType(ticketType)
  }

  return (
    <CreatorPageContainer heading={eventName}>
      <div className='w-full flex flex-col gap-10 md:gap-14 pt-6 px-4 md:p-14'>
        <div className='flex flex-col gap-[13px]'>
          <p className='font-sf-pro-display font-black text-base md:text-xl text-black'>
            Your Tickets
          </p>

          {(() => {
            if (isLoading) return <LoadingState />

            if (error) return <ErrorState onClick={refetch} />

            // No empty state: the format list below is always on screen, so it
            // already says what to do next.
            return (tickets?.items ?? []).map((ticket) => (
              <TicketCard
                key={ticket.ticketId}
                ticket={ticket}
                onDelete={() => handleDeleteTicket(ticket.ticketId)}
                isLoading={deleteTicketMutation.isPending}
              />
            ))
          })()}
        </div>

        <OnlyShowIf condition={!isLoading && !error}>
          {selectedType ? (
            <FormBase form={ticketForm} onSubmit={() => {}} className='flex flex-col gap-5'>
              <TicketForm
                form={ticketForm}
                type={selectedType}
                onSubmit={() =>
                  ticketForm.handleSubmit(handleCreateTicket, (errors) =>
                    console.log('Ticket validation errors:', errors),
                  )()
                }
                isLoading={isCreatingTIcket}
                onCancel={() => {
                  setSelectedType(undefined)
                  ticketForm.reset()
                }}
              />
            </FormBase>
          ) : (
            <TicketFormatPicker
              selected={null}
              onSelect={handleSelectFormat}
              hiddenFormats={isPrivateEvent ? ['group_ticket'] : []}
            />
          )}
        </OnlyShowIf>

        {(tickets?.items?.length ?? 0) > 0 ? <TicketSales tickets={tickets!.items} /> : null}
      </div>
    </CreatorPageContainer>
  )
}

function LoadingState() {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red mx-auto mb-2' />
        <p className='text-sm text-gray-600'>Loading tickets...</p>
      </div>
    </div>
  )
}

function ErrorState({ onClick }: { onClick: () => void }) {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-sm text-red-600 mb-2'>Failed to load tickets. Please try again.</p>
        <Button variant='outline' size='sm' onClick={onClick} className='text-xs'>
          Try Again
        </Button>
      </div>
    </div>
  )
}

function TicketSales({ tickets }: { tickets: TicketData[] }) {
  const salesData = tickets.map((ticket) => {
    const isUnlimited = ticket.quantity === 0
    const sold = isUnlimited ? ticket.availableQuantity : ticket.quantity - ticket.availableQuantity
    const isSoldOut = !isUnlimited && ticket.availableQuantity === 0
    return {
      ticketName: ticket.ticketName,
      ticketSold: isUnlimited ? `${sold} / ∞` : `${sold} / ${ticket.quantity}`,
      price: formatNaira(ticket.price, { free: ticket.price === 0 }),
      status: isSoldOut ? 'SOLD OUT' : ('ONGOING' as const),
    }
  })

  return (
    <div className='w-full bg-white p-3 md:p-5 flex flex-col gap-5 rounded-[10px]'>
      <div className='flex items-center gap-1'>
        <img src='/assets/harmburger/ticket.png' alt='Ticket' className='size-5' />
        <p className='text-black font-medium md:text-xl text-base font-sf-pro-display'>Ticket Sales</p>
      </div>

      <BaseTable caption='A table of your ticket sales' columns={columns} data={salesData} />
    </div>
  )
}

function TicketCard({ ticket, onDelete, isLoading = false }: ITIcketCard) {
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

  const typeBadge = ticketType
    ? ({ Single: 'Single Ticket', Group: 'Group Ticket', MultiDay: 'Multi Day' } as const)[ticketType]
    : null

  return (
    <>
      <TicketSummaryCard
        name={ticket.ticketName}
        price={ticket.price}
        typeLabel={typeBadge ?? 'Ticket'}
        isInviteOnly={accessType === 'Invite'}
        onClick={() => setDetailOpen(true)}
        onDelete={onDelete}
        isDeleting={isLoading}
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

const columns: { key: string; label: string }[] = [
  { key: 'ticketName', label: 'Ticket Name' },
  { key: 'ticketSold', label: 'Ticket Sold' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status' },
]

interface IEventTickets {
  eventId: string
  eventName: string
  /** The event's 'Public' | 'Private' flag, used to gate group tickets. */
  accessType?: string
}

interface ITIcketCard {
  ticket: TicketData
  onDelete: () => void
  isLoading?: boolean
}
