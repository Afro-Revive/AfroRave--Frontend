import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RichTextContent } from '@/components/reusable/rich-text-content'
import { getRoutePath } from '@/config/get-route-path'
import { formatNaira } from '@/lib/format-price'
import { stripUnderscores } from '@/lib/helper-func'
import { cn } from '@/lib/utils'
import type { EventDetailData } from '@/types'
import type { VendorApplications } from '@/types/vendor'
import type { ReactNode } from 'react'
import { RiCheckboxCircleLine, RiCloseLine, RiInformationLine, RiLockLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { SlotStatusPill } from '../../component/slot-status-pill'
import { formatShortDate } from '../../lib/format-date'
import {
  getAmountDue,
  getApplicationDeadline,
  getSlotName,
  isRevenueApplication,
  type SlotStatus,
} from '../slot-status'
import { SlotReceiptDialog } from './slot-receipt-dialog'

/**
 * The right-hand card on a slot's page. What it shows at the bottom (notice, amount due
 * and buttons) depends on the slot's status and whether it's a revenue or service slot.
 */
export function SlotSummaryCard({
  application,
  event,
  status,
  onWithdraw,
  isWithdrawing,
  onPay,
  isPaying,
}: ISlotSummaryCard) {
  const isRevenue = isRevenueApplication(application)
  const service = application.vendorDetails?.serviceData
  const amountDue = getAmountDue(application)
  const showAmountDue = isRevenue && (status === 'in_review' || status === 'approved')
  const organizerEmail = application.vendorDetails?.contact?.useDifferentContactDetails
    ? application.vendorDetails.contact.email
    : event?.eventDetails?.eventContact?.email

  return (
    <section className='flex flex-col gap-5 rounded-xl bg-[#262626] p-5'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-3'>
          <p className='font-work-sans text-xs font-bold tracking-wide text-[#9A9A9A] uppercase'>Your Slot</p>
          <SlotStatusPill status={status} />
        </div>
        <h2 className='font-inter-tight text-xl font-semibold text-white'>{getSlotName(application)}</h2>
        <p className='font-inter-tight text-sm text-tech-blue'>{stripUnderscores(application.category)}</p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <p className='font-work-sans text-sm font-bold tracking-wide text-[#9A9A9A] uppercase'>
            Slot Description
          </p>
          <RiInformationLine aria-hidden className='size-4 text-[#9A9A9A]' />
        </div>
        <div className='max-h-[136px] [scrollbar-color:#5A5A5A_transparent] [scrollbar-width:thin] overflow-y-auto pr-3 font-inter-tight text-[13px] leading-snug text-white'>
          <RichTextContent value={application.description || 'No description was added for this slot.'} />
        </div>
      </div>

      <dl className='overflow-hidden rounded-md border-t border-[#3A3A3A] pt-5'>
        <DetailRow name='Event Date' value={formatShortDate(event?.eventDate?.startDate ?? application.eventStartDate) || '—'} />
        {isRevenue ? (
          <>
            <DetailRow name='Slot Fee' value={formatNaira(application.vendorDetails?.slotData?.price ?? 0)} />
            {application.requestedSlots > 1 && <DetailRow name='Slots Requested' value={application.requestedSlots} />}
          </>
        ) : (
          <>
            {service && (
              <DetailRow
                name={service.hasBudgetRange ? 'Budget Range' : 'Budget'}
                value={
                  service.hasBudgetRange
                    ? `${formatNaira(service.minBudget)} - ${formatNaira(service.maxBudget)}`
                    : formatNaira(service.minBudget)
                }
              />
            )}
            <DetailRow name='Proposed Price' value={formatNaira(application.priceOffer || application.proposedPrice || 0)} />
          </>
        )}
      </dl>

      {status === 'secured' ? (
        <div className='flex items-center gap-3 rounded-md bg-[#12301A] px-4 py-3'>
          <RiCheckboxCircleLine className='size-7 shrink-0 text-[#34C759]' />
          <div className='flex flex-col'>
            <p className='font-inter-tight text-sm font-bold text-white'>
              {isRevenue ? `Paid ${formatNaira(amountDue)}` : 'Offer accepted'}
            </p>
            <p className='font-sf-pro-text text-[11px] text-white/70'>{formatShortDate(application.updatedDate)}</p>
          </div>
        </div>
      ) : (
        <StatusNotice application={application} event={event} status={status} />
      )}

      {showAmountDue && (
        <div className='flex items-center justify-between'>
          <span className='font-sf-pro-text text-sm text-[#BDBDBD]'>Amount Due</span>
          <span className='font-inter-tight text-xl font-bold text-white'>{formatNaira(amountDue)}</span>
        </div>
      )}

      {status === 'in_review' && (
        <WithdrawButton application={application} onConfirm={onWithdraw} isWithdrawing={isWithdrawing} />
      )}

      {status === 'approved' && isRevenue && (
        <button
          type='button'
          onClick={onPay}
          disabled={isPaying}
          className='h-9 w-full rounded-md bg-[#1FB52B] font-sf-pro-text text-sm font-medium text-white transition-colors hover:bg-[#1A9E25] disabled:opacity-60'>
          {isPaying ? 'Starting payment...' : 'Pay now'}
        </button>
      )}

      {status === 'approved' && !isRevenue && <ContactOrganizerButton email={organizerEmail} className='w-full' />}

      {status === 'secured' && (
        <div className='grid grid-cols-2 gap-2.5'>
          <SlotReceiptDialog application={application} />
          <ContactOrganizerButton email={organizerEmail} />
        </div>
      )}

      {(status === 'rejected' || status === 'expired' || status === 'completed') && (
        <Link
          to={getRoutePath('vendor_discover')}
          className='flex h-9 w-full items-center justify-center rounded-md bg-light-red font-sf-pro-text text-sm font-medium text-white transition-colors hover:bg-light-red/85'>
          Discover Events
        </Link>
      )}

      {showAmountDue && (
        <p
          className={cn(
            'flex items-center justify-center gap-1.5 font-sf-pro-text text-xs',
            status === 'approved' ? 'text-[#9A9A9A]' : 'text-[#5A5A5A]',
          )}>
          <RiLockLine className='size-3.5' />
          Secure Payment With Paystack
        </p>
      )}
    </section>
  )
}

function StatusNotice({ application, event, status }: { application: VendorApplications; event?: EventDetailData; status: SlotStatus }) {
  const deadline = formatShortDate(getApplicationDeadline(application))
  const messages: Partial<Record<SlotStatus, ReactNode>> = {
    in_review: `Request sent on ${formatShortDate(application.createdDate)}. You’ll get an email as soon as the organizer approves.`,
    approved: isRevenueApplication(application) ? (
      deadline ? (
        <>
          Approved by the organizer. Pay before <strong className='text-white'>“{deadline}”</strong> to secure this slot.
        </>
      ) : (
        'Approved by the organizer. Pay now to secure this slot.'
      )
    ) : undefined,
    rejected: 'Your request for this slot was declined by the organizer.',
    expired: deadline ? (
      <>
        Payment wasn’t made before <strong className='text-white'>“{deadline}”</strong>.
      </>
    ) : (
      'Payment wasn’t made before the deadline.'
    ),
    completed: `This event ended on ${formatShortDate(event?.eventDate?.endDate ?? application.eventStartDate)}.`,
  }
  const message = messages[status]
  if (!message) return null

  return (
    <p className='flex items-start gap-2.5 rounded-md bg-[#3A3A3A] px-3 py-3 font-inter-tight font-semibold text-xs leading-snug text-[#BDBDBD]'>
      <RiInformationLine className='mt-px size-4 shrink-0' />
      <span>{message}</span>
    </p>
  )
}

function DetailRow({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className='flex items-center justify-between gap-4 border-b border-[#2E2E2E] bg-[#1E1E1E] px-3 py-3 font-inter-tight text-xs last:border-none'>
      <dt className='text-[#BDBDBD]'>{name}</dt>
      <dd className='text-right text-[13px] text-white'>{value}</dd>
    </div>
  )
}

function WithdrawButton({
  application,
  onConfirm,
  isWithdrawing,
}: {
  application: VendorApplications
  onConfirm: () => void
  isWithdrawing: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type='button'
          disabled={isWithdrawing}
          className='h-9 w-full rounded-md bg-light-red font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-light-red/85 disabled:opacity-60'>
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Request'}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[100vw] max-w-[350px] gap-6 rounded-xl border-none bg-[#4A4A4A] px-8 pt-[70px] pb-5 text-white sm:rounded-xl'>
        <AlertDialogCancel
          aria-label='Close'
          className='absolute top-5 right-8 mt-0 flex size-10 items-center justify-center rounded-full border-none bg-white/25 p-0 text-white hover:bg-white/35 hover:text-white sm:mt-0'>
          <RiCloseLine className='size-5' />
        </AlertDialogCancel>
        <AlertDialogHeader className='gap-6 space-y-0 text-left sm:text-left'>
          <AlertDialogTitle className='font-inter-tight text-2xl leading-[1.05] font-bold'>
            Withdraw This Request?
          </AlertDialogTitle>
          <AlertDialogDescription className='font-inter-tight text-[15px] leading-[19px] text-white'>
            The organizer will stop reviewing your request for{' '}
            <strong className='font-bold'>
              {getSlotName(application)} at {application.eventName}.
            </strong>{' '}
            You can request it again later if the slot is still open.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='grid grid-cols-2 gap-3 sm:space-x-0'>
          <AlertDialogCancel className='mt-0 h-10 rounded-lg border-none bg-[#1E1E1E] font-inter-tight text-sm font-semibold text-white hover:bg-black hover:text-white sm:mt-0'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='h-10 rounded-lg bg-light-red font-inter-tight text-sm font-semibold text-white hover:bg-light-red/85'>
            Withdraw
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ContactOrganizerButton({ email, className }: { email?: string; className?: string }) {
  const classes = cn(
    'flex h-9 items-center justify-center rounded-md bg-[#4A4A4A] font-inter-tight text-sm font-semibold text-white transition-colors',
    email ? 'hover:bg-[#555]' : 'cursor-not-allowed opacity-50',
    className,
  )

  if (!email) {
    return (
      <span className={classes} title='The organizer hasn’t added a contact email'>
        Contact organizer
      </span>
    )
  }

  return (
    <a href={`mailto:${email}`} className={classes}>
      Contact organizer
    </a>
  )
}

interface ISlotSummaryCard {
  application: VendorApplications
  event?: EventDetailData
  status: SlotStatus
  onWithdraw: () => void
  isWithdrawing: boolean
  onPay: () => void
  isPaying: boolean
}

