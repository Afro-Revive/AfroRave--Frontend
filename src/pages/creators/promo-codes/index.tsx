import { FormBase } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useCreatePromoCode,
  useDeletePromoCode,
  useGetEventPromoCodes,
  useGetEventTickets,
} from '@/hooks/use-event-mutations'
import type { PromoCodeData, TicketData } from '@/types'
import type { PaginatedResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import {
  type TPromoCodeSchema,
  defaultPromoCodeValues,
  promoCodeSchema,
} from '../add-event/schemas/promo-code-schema'
import { populatePromoCodeJson } from '../add-event/ticket-forms/promo-code-form/helper'
import { PromoCodeFormFields } from '../add-event/ticket-forms/promo-code-form/promo-code-form'
import {
  CreatorPageContainer,
  SelectedEventGate,
} from '../_components/selected-event-page'

export default function PromoCodesPage() {
  return (
    <SelectedEventGate>
      {(event) => <EventPromoCodes eventId={event.eventId} eventName={event.eventName} />}
    </SelectedEventGate>
  )
}

function EventPromoCodes({ eventId, eventName }: { eventId: string; eventName: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCreating, setIsCreating] = useState(false)

  const {
    data: promocodeResponse,
    isLoading,
    refetch,
    error,
  } = useGetEventPromoCodes(eventId)

  // The form lets you scope a code to specific tickets, so it needs the list.
  const { data: ticketsResponse } = useGetEventTickets(eventId)

  const { mutate: createPromoCodeMutation, isPending: isCreatingPromoCode } =
    useCreatePromoCode(eventId)
  const deletePromocodeMutation = useDeletePromoCode(eventId)

  const promocodes = promocodeResponse?.data as PaginatedResponse<PromoCodeData> | undefined
  const tickets = ticketsResponse?.data as PaginatedResponse<TicketData> | undefined

  useEffect(() => {
    if (searchParams.get('form') === 'promocode') setIsCreating(true)
  }, [searchParams])

  const promocodeForm = useForm<{ promoCodes: TPromoCodeSchema }>({
    resolver: zodResolver(z.object({ promoCodes: promoCodeSchema })),
    defaultValues: { promoCodes: defaultPromoCodeValues },
  })

  function handleCreatePromoCode() {
    const promocodeRequest = populatePromoCodeJson(promocodeForm)

    createPromoCodeMutation(
      { ...promocodeRequest, eventId },
      {
        onSuccess: () => {
          promocodeForm.reset()
          handleBackClick()
        },
      },
    )
  }

  async function handleDeletePromocode(id: string) {
    deletePromocodeMutation.mutateAsync(id)
  }

  function handleBackClick() {
    setIsCreating(false)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('form')
      return next
    })
  }

  if (isCreating) {
    return (
      <CreatorPageContainer
        heading='Add Promo Code'
        onBack={handleBackClick}
        action={
          <Button
            variant='destructive'
            className='py-2 w-fit px-8 text-xs font-sf-pro-text font-black rounded-[5px]'
            onClick={() => promocodeForm.handleSubmit(handleCreatePromoCode)()}
            disabled={isCreatingPromoCode}>
            {isCreatingPromoCode ? 'SAVING...' : 'SAVE'}
          </Button>
        }>
        <div className='w-full flex flex-col items-center pt-6 px-4 md:p-14'>
          <FormBase form={promocodeForm} onSubmit={() => {}} className='max-w-[560px] w-full'>
            <PromoCodeFormFields form={promocodeForm} eventTickets={tickets?.items} />
          </FormBase>
        </div>
      </CreatorPageContainer>
    )
  }

  return (
    <CreatorPageContainer heading={eventName}>
      <div className='w-full flex flex-col gap-10 md:gap-14 pt-6 px-4 md:p-14'>
        <div className='flex flex-col gap-[13px]'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <p className='font-sf-pro-display font-black text-base md:text-xl text-black'>
              Promo Codes
            </p>

            <Button
              type='button'
              onClick={() => setIsCreating(true)}
              className='flex items-center gap-1.5 py-2 px-3 bg-[#00AD2E] rounded-[20px] text-white text-xs font-sf-pro-text hover:bg-[#00AD2E]/90 shrink-0'>
              <Plus size={14} />
              <span className='hidden sm:inline'>ADD PROMOCODE</span>
              <span className='sm:hidden'>Add</span>
            </Button>
          </div>

          {(() => {
            if (isLoading) {
              return (
                <div className='w-full py-8 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red mx-auto mb-2' />
                    <p className='text-sm text-gray-600'>Loading promocodes...</p>
                  </div>
                </div>
              )
            }

            if (error) {
              return (
                <div className='w-full py-8 flex items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-sm text-red-600 mb-2'>
                      Failed to load promocodes. Please try again.
                    </p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => refetch()}
                      className='text-xs'>
                      Try Again
                    </Button>
                  </div>
                </div>
              )
            }

            if ((promocodes?.items?.length ?? 0) === 0) {
              return (
                <div className='w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
                  <Button
                    type='button'
                    onClick={() => setIsCreating(true)}
                    className='self-center w-fit flex items-center gap-2 py-2 px-3 bg-[#00AD2E] rounded-[20px] text-white text-xs font-sf-pro-text hover:bg-[#00AD2E]/90'>
                    <Plus /> <span>ADD PROMOCODE</span>
                  </Button>

                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No promocodes created yet
                  </h3>
                </div>
              )
            }

            return (promocodes?.items ?? []).map((promocode) => (
              <PromoCodeCard
                key={promocode.promocodeId}
                promocode={promocode}
                onDelete={() => handleDeletePromocode(promocode.promocodeId)}
                isLoading={deletePromocodeMutation.isPending}
              />
            ))
          })()}
        </div>
      </div>
    </CreatorPageContainer>
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
