import { FormBase } from '@/components/reusable'
import BaseTable from '@/components/reusable/base-table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useCreatePromoCode,
  useCreateTicket,
  useDeleteTicket,
  useGetEventPromoCodes,
  useGetEventTickets,
  useDeletePromoCode,
  useGetTicket,
} from '@/hooks/use-event-mutations'
import { transformTicketsToCreateRequest } from '@/lib/event-transforms'
import type { PromoCodeData, TicketData } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Plus, Ticket, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import {
  type TPromoCodeSchema,
  defaultPromoCodeValues,
  promoCodeSchema,
} from '../../add-event/schemas/promo-code-schema'
import {
  type UnifiedTicketForm,
  defaultUnifiedTicketValues,
  unifiedTicketFormSchema,
} from '../../add-event/schemas/ticket-schema'
import type { TicketType } from '../../add-event/ticket-forms/create/helper'
import { TicketForm } from '../../add-event/ticket-forms/create/ticket-form'
import { TicketModal } from '../../add-event/ticket-forms/create/ticket-modal'
import { populatePromoCodeJson } from '../../add-event/ticket-forms/promo-code-form/helper'
import { PromoCodeFormFields } from '../../add-event/ticket-forms/promo-code-form/promo-code-form'
import { TabChildrenContainer } from '../component/edit-tab-children-container'
import { cn } from '@/lib/utils'
import { OnlyShowIf } from '@/lib/environment'

export default function TicketsTab({ eventId, setActiveTab, eventName }: ITicketTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentForm, setCurrentForm] = useState<string>()
  const [selectedType, setSelectedType] = useState<TicketType>()
  const [ticketFormOpen, setTicketFormOpen] = useState(false)
  const [ticketTab, setTicketTab] = useState<'ticket' | 'promocode'>('ticket')

  const { data: ticketsResponse, isLoading, error, refetch } = useGetEventTickets(eventId)
  const {
    data: promocodeResponse,
    isLoading: isLoadingPromoCodes,
    refetch: refetchPromocodes,
    error: promocodeError,
  } = useGetEventPromoCodes(eventId)
  const { mutate: createPrmocodeMutation, isPending: isCreatingPromoCode } =
    useCreatePromoCode(eventId)
  const { mutate: createTicketMutation, isPending: isCreatingTIcket } = useCreateTicket(eventId)

  const deleteTicketMutation = useDeleteTicket(eventId)
  const deletePromocodeMutation = useDeletePromoCode(eventId)

  const tickets = ticketsResponse?.data || []
  const promocodes = promocodeResponse?.data || []

  useEffect(() => {
    const formParam = searchParams.get('form')

    if (formParam === 'create' || formParam === 'promocode') {
      setCurrentForm(formParam)
    }
  }, [searchParams, setSearchParams])

  const ticketForm = useForm<UnifiedTicketForm>({
    resolver: zodResolver(unifiedTicketFormSchema),
    defaultValues: {
      ...defaultUnifiedTicketValues,
      whenToStart: 'immediately',
      scheduledDate: undefined,
    },
  })

  const promocodeForm = useForm<{ promoCodes: TPromoCodeSchema }>({
    resolver: zodResolver(z.object({ promoCodes: promoCodeSchema })),
    defaultValues: { promoCodes: defaultPromoCodeValues },
  })

  function handleCreateTicket(values: UnifiedTicketForm) {
    const ticketReuest = transformTicketsToCreateRequest(values, eventId)

    createTicketMutation(ticketReuest[0], {
      onSuccess: () => {
        setSelectedType(undefined)
        ticketForm.reset()
        setTicketFormOpen(false)
      },
    })
  }

  function handleCreatePromoCode() {
    const promocodeRequest = populatePromoCodeJson(promocodeForm)

    createPrmocodeMutation(
      { ...promocodeRequest, eventId },
      {
        onSuccess: () => {
          setSelectedType(undefined)
          promocodeForm.reset()
          handleBackClick()
        },
      },
    )
  }

  async function handleDeleteTicket(id: string) {
    deleteTicketMutation.mutateAsync(id, { onSuccess: () => refetch() })
  }

  async function handleDeletePromocode(id: string) {
    deletePromocodeMutation.mutateAsync(id)
  }

  function handleAddTicket(selectedType: TicketType) {
    ticketForm.setValue('ticket.ticketType', selectedType)
    setSelectedType(selectedType)
    setTicketFormOpen(true)
  }

  function handleBackClick() {
    setCurrentForm(undefined)
    setSelectedType(undefined)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('form')
      return next
    })
  }

  if (currentForm === 'promocode') {
    return (
      <TabChildrenContainer
        handleSaveEvent={() => promocodeForm.handleSubmit(handleCreatePromoCode)()}
        handleBackClick={handleBackClick}
        currentTab='tickets'
        onChange={setActiveTab}
        isLoading={isCreatingPromoCode}>
        <FormBase form={promocodeForm} onSubmit={() => {}} className='max-w-[560px] w-full'>
          <PromoCodeFormFields form={promocodeForm} eventTickets={tickets} />
        </FormBase>
      </TabChildrenContainer>
    )
  }

  return (
    <TabChildrenContainer
      handleSaveEvent={() => {}}
      handleBackClick={() => setActiveTab('event-details')}
      currentTab='tickets'
      onChange={setActiveTab}
      buttonText={eventName}
      isLoading={undefined}>

      {/* Ticket creation modal */}
      <Dialog
        open={ticketFormOpen}
        onOpenChange={(open) => {
          setTicketFormOpen(open)
          if (!open) { setSelectedType(undefined); ticketForm.reset() }
        }}>
        <DialogContent
          noCancel
          className='w-[95vw] sm:max-w-[864px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden'>
          <DialogTitle className='sr-only'>Create ticket</DialogTitle>
          <DialogDescription className='sr-only'>Ticket creation form</DialogDescription>
          {/* Header */}
          <div className='flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100 shrink-0'>
            <span className='text-base font-black uppercase font-sf-pro-display text-black'>
              Create {selectedType?.replace(/_/g, ' ')}
            </span>
            <DialogClose asChild>
              <button type='button' className='text-gray-400 hover:text-black transition-colors p-1 rounded'>
                <X size={20} />
              </button>
            </DialogClose>
          </div>
          {/* Scrollable form content */}
          <div className='overflow-y-auto flex-1 px-5 sm:px-7 py-5'>
            <FormBase form={ticketForm} onSubmit={() => {}} className='flex flex-col gap-5'>
              <TicketForm
                form={ticketForm}
                type={selectedType || 'single_ticket'}
                onSubmit={() => ticketForm.handleSubmit(handleCreateTicket, (errors) => console.log('Ticket validation errors:', errors))()}
                isLoading={isCreatingTIcket}
                onCancel={() => { setTicketFormOpen(false); setSelectedType(undefined); ticketForm.reset() }}
              />
            </FormBase>
          </div>
        </DialogContent>
      </Dialog>
      <div className='w-full flex flex-col gap-10 md:gap-14 pt-6 px-4 md:p-14'>
        <div className='flex flex-col gap-[13px]'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <div className='flex gap-3'>
              {[
                { value: 'ticket', name: 'Your Tickets' },
                { value: 'promocode', name: 'Promo Codes' },
              ].map((item) => {
                const isActive = ticketTab === item.value

                return (
                  <Button
                    key={item.value}
                    onClick={() => setTicketTab(item.value as 'ticket' | 'promocode')}
                    className={cn(
                      'font-sf-pro-display p-0 bg-transparent hover:bg-transparent shadow-none',
                      {
                        'font-black text-base md:text-xl text-black': isActive,
                        'text-sm md:text-lg font-medium text-medium-gray': !isActive,
                      },
                    )}>
                    {item.name}
                  </Button>
                )
              })}
            </div>

            <OnlyShowIf condition={ticketTab === 'promocode'}>
              <Button
                type='button'
                onClick={() => setCurrentForm('promocode')}
                className='flex items-center gap-1.5 py-2 px-3 bg-[#00AD2E] rounded-[20px] text-white text-xs font-sf-pro-text hover:bg-[#00AD2E]/90 shrink-0'>
                <Plus size={14} /> <span className='hidden sm:inline'>ADD PROMOCODE</span><span className='sm:hidden'>Add</span>
              </Button>
            </OnlyShowIf>

            <OnlyShowIf condition={ticketTab === 'ticket' && tickets.length > 0}>
              <TicketModal onContinue={handleAddTicket} />
            </OnlyShowIf>
          </div>

          {(() => {
            if (isLoading || isLoadingPromoCodes) {
              return <LoadingState activeTab={ticketTab} />
            }

            if (ticketTab === 'ticket' && error) {
              return <ErrorState activeTab={ticketTab} onClick={refetch} />
            }

            if (ticketTab === 'promocode' && promocodeError) {
              return <ErrorState activeTab={ticketTab} onClick={refetchPromocodes} />
            }

            if (tickets.length === 0 && ticketTab === 'ticket') {
              return <EmptyTicketState onAddTicket={handleAddTicket} />
            }

            if (promocodes.length === 0 && ticketTab === 'promocode') {
              return (
                <div className='w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
                  <Button
                    type='button'
                    onClick={() => setCurrentForm('promocode')}
                    className='self-center w-fit flex items-center gap-2 py-2 px-3 bg-[#00AD2E] rounded-[20px] text-white text-xs font-sf-pro-text hover:bg-[#00AD2E]/90'>
                    <Plus /> <span>ADD PROMOCODE</span>
                  </Button>

                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No promocodes created yet
                  </h3>
                </div>
              )
            }

            if (ticketTab === 'ticket') {
              return tickets.map((ticket) => (
                <TicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  onDelete={() => handleDeleteTicket(ticket.ticketId)}
                  isLoading={deleteTicketMutation.isPending}
                />
              ))
            }

            return promocodes.map((promocode) => (
              <PromoCodeCard
                key={promocode.promocodeId}
                promocode={promocode}
                onDelete={() => handleDeletePromocode(promocode.promocodeId)}
                isLoading={deletePromocodeMutation.isPending}
              />
            ))
          })()}
        </div>

        {tickets.length > 0 ? <TicketSales tickets={tickets} /> : null}
      </div>
    </TabChildrenContainer>
  )
}

function EmptyTicketState({ onAddTicket }: { onAddTicket: (type: TicketType) => void }) {
  return (
    <div className='w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
      <Ticket className='w-12 h-12 text-gray-400 mb-4' />
      <h3 className='text-lg font-medium text-gray-900 mb-2'>No tickets created yet</h3>
      <p className='text-sm text-gray-500 text-center max-w-md'>
        Start by creating your first ticket type. You can add multiple ticket types with different
        pricing and features.
      </p>
      <div className='mt-4'>
        <TicketModal
          onContinue={onAddTicket}
          trigger={
            <Button className='bg-deep-red text-white hover:bg-deep-red/80'>
              Create First Ticket
            </Button>
          }
        />
      </div>
    </div>
  )
}

function LoadingState({ activeTab }: { activeTab: TicketTab }) {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red mx-auto mb-2' />
        <p className='text-sm text-gray-600'>
          Loading {activeTab === 'ticket' ? 'tickets' : 'promocodes'}...
        </p>
      </div>
    </div>
  )
}

function ErrorState({ activeTab, onClick }: { activeTab: TicketTab; onClick: () => void }) {
  return (
    <div className='w-full py-8 flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-sm text-red-600 mb-2'>
          Failed to load {activeTab === 'ticket' ? 'tickets' : 'promocodes'}. Please try again.
        </p>
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
      price: `₦${ticket.price.toLocaleString()}`,
      status: isSoldOut ? 'SOLD OUT' : ('ONGOING' as const),
    }
  })

  return (
    <div className='w-full bg-white p-3 md:p-5 flex flex-col gap-5 rounded-[10px]'>
      <div className='flex items-center gap-1'>
        <img src='/assets/harmburger/ticket.png' alt='Ticket' className='size-5' />
        <p className='text-black font-medium text-xl font-sf-pro-display'>Ticket Sales</p>
      </div>

      <BaseTable caption='A table of your ticket sales' columns={columns} data={salesData} />
    </div>
  )
}

function PromoCodeCard({ promocode, onDelete, isLoading = false }: { promocode: PromoCodeData; onDelete: () => void; isLoading?: boolean }) {
  const [detailOpen, setDetailOpen] = useState(false)

  const discountLabel = promocode.discountType === 'Percentage'
    ? `${promocode.discountValue}% off`
    : `₦${promocode.discountValue?.toLocaleString()} off`

  const description = promocode.promoDetails?.description ?? ''

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <div
        className='w-full h-16 bg-white py-4 pl-3 pr-1 rounded-[8px] flex items-center justify-between shadow-sm border border-gray-100 cursor-pointer'
        onClick={() => setDetailOpen(true)}>
        <div className='flex items-center gap-5'>
          <Button variant='ghost' className='py-0 px-1 w-fit h-fit hover:bg-black/20' onClick={(e) => e.stopPropagation()}>
            <img src='/assets/event/menu.png' alt='Grip' className='size-4' />
          </Button>
          <p className='text-sm font-sf-pro-display text-black'>{promocode.promoCode}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='p-1 !w-fit h-fit hover:bg-black/20' onClick={(e) => e.stopPropagation()}>
              <EllipsisVertical className='w-[3px] h-[13px]' color='#000000' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={onDelete} disabled={isLoading} className='text-deep-red focus:text-deep-red'>
              <Trash2 size={16} className='mr-2' />
              {isLoading ? 'Deleting...' : 'Delete Promo Code'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent noCancel className='max-w-sm p-0 rounded-[10px] overflow-hidden'>
          <DialogTitle className='sr-only'>{promocode.promoCode}</DialogTitle>
          <DialogDescription className='sr-only'>Promo code details</DialogDescription>
          <div className='relative flex flex-col items-center px-10 pt-5 pb-3'>
            <DialogClose asChild>
              <button type='button' className='absolute right-4 top-4 text-gray-400 hover:text-black p-1 rounded transition-colors'>
                <X size={18} />
              </button>
            </DialogClose>
            <p className='font-black font-sf-pro-display text-base text-black text-center'>{promocode.promoCode}</p>
            <p className='text-xs text-[#2E7D32] font-sf-pro-display mt-0.5 text-center'>{discountLabel}</p>
          </div>
          <div className='px-5 pb-5 flex flex-col gap-3'>
            {(promocode.startDate || promocode.endDate) && (
              <div className='flex items-center gap-4 text-xs font-sf-pro-display text-gray-500'>
                {promocode.startDate && <span>From: {formatDate(promocode.startDate)}</span>}
                {promocode.endDate && <span>Until: {formatDate(promocode.endDate)}</span>}
              </div>
            )}
            <div>
              <p className='font-sf-pro-display font-semibold text-[14px] text-black mb-1'>Description</p>
              {description ? (
                <p className='font-sf-pro-display text-[13px] text-[#3C3C43] leading-relaxed'>{description}</p>
              ) : (
                <p className='text-sm text-gray-400 font-sf-pro-display italic'>No description provided.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
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

  // Log the raw response once loaded to help debug API response shape
  if (fullTicketResponse && !isLoadingDetail) {
    console.log('[TicketCard] raw API response for', ticket.ticketId, fullTicketResponse)
    console.log('[TicketCard] extracted fullTicket:', fullTicket)
  }

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
  const allowResell = detail.ticketDetails?.allowResell

  // Available count for display
  const availableQty = detail.availableQuantity ?? ticket.availableQuantity

  const typeBadge = ticketType
    ? ({ Single: 'Single Ticket', Group: 'Group Ticket', MultiDay: 'Multi Day' } as const)[ticketType]
    : null
  const salesBadge = salesType === 'Door' ? 'Door Ticket' : null
  const inviteBadge = accessType === 'Invite' ? 'Invite Only' : null
  const freeBadge = accessType === 'Free' ? 'Free' : null
  const resellBadge = allowResell ? 'Resale' : null

  return (
    <>
      <div
        className='w-full min-h-16 bg-white py-3 pl-3 pr-1 rounded-[8px] flex items-center justify-between shadow-sm border border-gray-100 cursor-pointer'
        onClick={() => setDetailOpen(true)}>
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <Button
            variant='ghost'
            className='py-0 px-1 w-fit h-fit hover:bg-black/20 shrink-0'
            onClick={(e) => e.stopPropagation()}>
            <img src='/assets/event/menu.png' alt='Grip' className='size-4' />
          </Button>
          <p className='text-sm font-sf-pro-display text-black truncate'>{ticket.ticketName}</p>
          <div className='flex flex-wrap items-center gap-1.5 ml-2'>
            {typeBadge && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F5E9] text-[#2E7D32]'>
                {typeBadge}
              </span>
            )}
            {salesBadge && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E0F2F1] text-[#00695C]'>
                {salesBadge}
              </span>
            )}
            {inviteBadge && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFEBEE] text-[#B71C1C]'>
                {inviteBadge}
              </span>
            )}
            {freeBadge && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E3F2FD] text-[#1565C0]'>
                {freeBadge}
              </span>
            )}
            {resellBadge && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF8E1] text-[#F57F17]'>
                {resellBadge}
              </span>
            )}
            {isSoldOut && (
              <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFEBEE] text-[#B71C1C]'>
                Sold Out
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='p-1 !w-fit h-fit hover:bg-black/20 shrink-0'
              onClick={(e) => e.stopPropagation()}>
              <EllipsisVertical className='w-[3px] h-[13px]' color='#000000' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => onDelete()}
              disabled={isLoading}
              className='text-deep-red focus:text-deep-red'>
              <Trash2 size={16} className='mr-2' />
              {isLoading ? 'Deleting...' : 'Delete Ticket'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

type TicketTab = 'ticket' | 'promocode'

interface ITicketTab {
  eventId: string
  setActiveTab: (tab: string) => void
  eventName: string
}

interface ITIcketCard {
  ticket: TicketData
  onDelete: () => void
  isLoading?: boolean
}
