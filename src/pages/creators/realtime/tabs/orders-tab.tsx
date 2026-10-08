import { formatNaira } from '@/lib/format-price'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'

export default function OrdersTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => (
        <div className='w-full flex flex-col gap-6'>
          <h2 className='font-inter text-3xl font-semibold text-system-black'>Orders</h2>

          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <Figure label='Total net sales' value={formatNaira(data.totalNetRevenue)} />
            <Figure
              label='Total tickets issued'
              value={data.totalTicketsIssued.toLocaleString()}
            />
            <Figure
              label='Total tickets created'
              value={data.totalTicketsCreated.toLocaleString()}
            />
            <Figure label='Total resales' value={data.totalResales.toLocaleString()} />
          </div>
        </div>
      )}
    </AnalyticsGate>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-2xl shadow-lg border border-light-gray bg-white px-5 py-4'>
      <span className='text-[11px] uppercase tracking-wider text-mid-dark-gray font-sf-pro-text'>
        {label}
      </span>
      <span className='text-2xl font-medium text-black font-sf-pro-display tabular-nums'>
        {value}
      </span>
    </div>
  )
}
