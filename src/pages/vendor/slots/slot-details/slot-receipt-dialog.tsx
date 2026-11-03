import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatNaira } from '@/lib/format-price'
import type { VendorApplications } from '@/types/vendor'
import type { ReactNode } from 'react'
import { formatShortDate } from '../../lib/format-date'
import { getAmountDue, getSlotFee, getSlotName } from '../slot-status'

/**
 * Receipt for a secured revenue slot, built from the application. The API has no
 * vendor receipt endpoint yet, so the amounts are the slot fee and platform fee as
 * the dashboard works them out, not the Paystack record.
 */
export function SlotReceiptDialog({ application }: { application: VendorApplications }) {
  const slotFee = getSlotFee(application)
  const total = getAmountDue(application)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type='button'
          className='flex h-9 items-center justify-center rounded-md border border-[#4A4A4A] font-sf-pro-text text-sm font-medium text-white transition-colors hover:bg-white/10'>
          View receipt
        </button>
      </DialogTrigger>
      <DialogContent className='w-[92vw] max-w-[420px] gap-5 rounded-xl border border-[#3A3A3A] bg-[#262626] p-6 text-white'>
        <div className='flex flex-col gap-1'>
          <DialogTitle className='font-inter-tight text-lg font-bold'>Receipt</DialogTitle>
          <DialogDescription className='font-sf-pro-text text-xs text-[#9A9A9A]'>
            Application #{application.id}
          </DialogDescription>
        </div>

        <dl className='flex flex-col font-sf-pro-text text-sm'>
          <ReceiptRow name='Event' value={application.eventName} />
          <ReceiptRow name='Slot' value={getSlotName(application)} />
          <ReceiptRow name='Slots' value={application.requestedSlots} />
          <ReceiptRow name='Slot fee' value={formatNaira(slotFee)} />
          <ReceiptRow name='Platform fee' value={formatNaira(total - slotFee)} />
          <ReceiptRow name='Paid on' value={formatShortDate(application.updatedDate) || '—'} />
          <div className='mt-2 flex items-center justify-between border-t border-[#3A3A3A] pt-4'>
            <dt className='font-semibold'>Total paid</dt>
            <dd className='font-inter-tight text-lg font-bold'>{formatNaira(total)}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  )
}

function ReceiptRow({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-6 py-1.5'>
      <dt className='text-[#9A9A9A]'>{name}</dt>
      <dd className='text-right'>{value}</dd>
    </div>
  )
}
