import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEventAnalytics } from '@/hooks/use-event-mutations'
import { formatNaira } from '@/lib/format-price'
import type { EventAnalyticsData } from '@/types'
import { ArrowRight, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SummaryCard({ eventId }: { eventId: string }) {
  const { data: response, isPending } = useGetEventAnalytics(eventId)
  const analytics = response?.data as EventAnalyticsData | undefined

  // Net revenue counts vendor payments too, so the ticket share is what's left —
  // the same split the analytics Overview tab makes.
  const ticketNetSales = analytics
    ? Math.max(analytics.totalNetRevenue - analytics.totalRevenueFromVendors, 0)
    : 0

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-work-sans text-base font-bold text-black'>Summary</p>
          <p className='font-work-sans text-sm text-mid-dark-gray'>
            Sales and ticket performance across all ticket types.
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
        <SummaryStat label='Total Net Sales' isLoading={isPending} hasData={!!analytics}>
          {formatNaira(ticketNetSales)}
        </SummaryStat>

        <SummaryStat label='Total Tickets Issued' isLoading={isPending} hasData={!!analytics}>
          <Ticket className='size-5 shrink-0' />
          {analytics?.totalTicketsIssued} / {analytics?.totalTicketsCreated}
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
