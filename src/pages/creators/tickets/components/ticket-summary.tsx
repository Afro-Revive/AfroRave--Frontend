import { Button } from '@/components/ui/button'
import { formatNaira } from '@/lib/format-price'
import { ArrowRight, Ticket } from 'lucide-react'
import { SUMMARY_PLACEHOLDER } from '../constant'

export function SummaryCard() {
  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-work-sans text-base font-bold text-black'>Summary</p>
          <p className='font-work-sans text-sm text-mid-dark-gray'>
            Sales and ticket performance across all ticket types.
          </p>
        </div>

        <Button
          type='button'
          disabled
          className='h-10 shrink-0 gap-2 rounded-lg bg-black px-4 font-work-sans text-sm text-white hover:bg-black/90'>
          View Analytics
          <ArrowRight className='size-4' />
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SummaryStat label='Total Net Sales'>
          {formatNaira(SUMMARY_PLACEHOLDER.netSales)}
        </SummaryStat>

        <SummaryStat label='Total Tickets Issued'>
          <Ticket className='size-5 shrink-0' />
          {SUMMARY_PLACEHOLDER.ticketsIssued} / {SUMMARY_PLACEHOLDER.totalTickets}
        </SummaryStat>
      </div>
    </div>
  )
}

function SummaryStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg bg-[#F2F2F2] px-4 py-3'>
      <p className='font-work-sans text-sm text-black'>{label}</p>

      <p className='flex items-center gap-2 font-work-sans text-xl font-bold text-black'>
        {children}
      </p>
    </div>
  )
}
