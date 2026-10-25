import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import { formatNaira } from '@/lib/format-price'
import type { EventDetailData } from '@/types'
import { TiStarburst } from "react-icons/ti";
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PromocodeSummaryCard({ eventId }: { eventId: string }) {
  // The event's own stats, the same ones its card on the events dashboard shows.
  // The sidebar loads this event too, so it's usually already cached.
  const { data: response, isPending } = useGetEvent(eventId)
  console.log(response)
  const stats = (response?.data as EventDetailData | undefined)?.eventStat

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-work-sans text-base font-bold text-black'>Summary</p>
          <p className='font-work-sans text-sm text-mid-dark-gray'>
            Redemption and revenue performance across all promo and partnership codes.
          </p>
        </div>

        {/* Analytics reads the selected event, which is already this one. */}
        <Button
          asChild
          className='h-10 shrink-0 gap-2 rounded-lg bg-black px-4 font-work-sans text-sm text-white hover:bg-black/90'>
          <Link to={getRoutePath('realtime')}>
            View Analytics
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>


        <SummaryStat label='Total Redemptions' isLoading={isPending} hasData={!!stats}>
          <TiStarburst className='size-6 shrink-0' />
          {stats?.usedPromocode} / {stats?.activePromoCodes}
        </SummaryStat>

        <SummaryStat label='Total Discount Value' isLoading={isPending} hasData={!!stats}>
          {formatNaira(stats?.totalDiscountValue ?? 0)}
        </SummaryStat>

      </div>
    </div>
  )
}

function SummaryStat({
  label,
  isLoading,
  hasData,
  children,
}: {
  label: string
  isLoading: boolean
  /** False when the request failed — shows a dash rather than a made-up zero. */
  hasData: boolean
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1 rounded-lg bg-[#F2F2F2] px-4 py-3'>
      <p className='font-work-sans text-sm text-black'>{label}</p>

      {isLoading ? (
        <span className='h-7 w-28 rounded-md bg-black/10 animate-pulse' />
      ) : (
        <p className='flex items-center gap-2 font-work-sans text-xl font-bold text-black'>
          {hasData ? children : '—'}
        </p>
      )}
    </div>
  )
}
