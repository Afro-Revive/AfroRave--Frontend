import { BaseBarChart } from '@/components/reusable'
import { formatNaira } from '@/lib/format-price'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'

export default function VendorsTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => (
        <div className='w-full flex flex-col gap-6'>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <Figure label='Vendors applied' value={data.totalVendors.toLocaleString()} />
            <Figure
              label='Accepted'
              value={data.totalNumberOfVendorsAccepted.toLocaleString()}
            />
            <Figure label='Onboarded' value={data.allVendorsOnboarded.toLocaleString()} />
            <Figure label='Vendor revenue' value={formatNaira(data.totalRevenueFromVendors)} />
          </div>

          <BaseBarChart
            title='Vendor pipeline'
            description='How applications progress to onboarding'
            data={[
              { stage: 'Applied', count: data.totalVendors },
              { stage: 'Accepted', count: data.totalNumberOfVendorsAccepted },
              { stage: 'Onboarded', count: data.allVendorsOnboarded },
            ]}
            xKey='stage'
            series={[{ key: 'count', label: 'Vendors' }]}
          />

          <div className='flex flex-col gap-3 rounded-[4px] border border-light-gray bg-white px-5 py-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-[11px] uppercase tracking-wider text-mid-dark-gray font-sf-pro-text'>
                Top category
              </span>
              <span className='text-lg font-medium text-black font-sf-pro-display'>
                {data.topVendorCategory || '—'}
              </span>
            </div>

            {data.allVendorCategories?.length > 0 && (
              <ul className='flex flex-wrap gap-2'>
                {data.allVendorCategories.map((category) => (
                  <li
                    key={category}
                    className='rounded-full bg-light-gray px-3 py-1 text-xs text-mid-dark-gray font-sf-pro-text'>
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </AnalyticsGate>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-[4px] border border-light-gray bg-white px-5 py-4'>
      <span className='text-[11px] uppercase tracking-wider text-mid-dark-gray font-sf-pro-text'>
        {label}
      </span>
      <span className='text-2xl font-medium text-black font-sf-pro-display tabular-nums'>
        {value}
      </span>
    </div>
  )
}
