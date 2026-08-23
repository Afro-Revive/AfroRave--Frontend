import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'

export default function PromoCodesTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => (
        <div className='w-full flex flex-col gap-6'>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            <Figure
              label='Promo codes created'
              value={data.totalPromoCodesCreated.toLocaleString()}
            />
            <Figure
              label='Codes used'
              value={data.promoCodesUsed.toLocaleString()}
              caption={`of ${data.totalPromoCodesCreated.toLocaleString()} created`}
            />
            <Figure label='Total discount given' value={formatNaira(data.discountTotal)} />
          </div>

          <div className='flex flex-col gap-4 rounded-[4px] border border-light-gray bg-white px-5 py-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-[11px] uppercase tracking-wider text-mid-dark-gray font-sf-pro-text'>
                Top partner
              </span>
              <span className='text-lg font-medium text-black font-sf-pro-display'>
                {data.topPartner || '—'}
              </span>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              <Figure
                label='Partner net sales'
                value={formatNaira(data.topPartnerNetSales)}
                className='border-0 px-0 py-0'
              />
              <Figure
                label='Partner commission'
                value={formatNaira(data.topPartnerComission)}
                className='border-0 px-0 py-0'
              />
            </div>
          </div>
        </div>
      )}
    </AnalyticsGate>
  )
}

function Figure({
  label,
  value,
  caption,
  className,
}: {
  label: string
  value: string
  caption?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-[4px] border border-light-gray bg-white px-5 py-4',
        className,
      )}>
      <span className='text-[11px] uppercase tracking-wider text-mid-dark-gray font-sf-pro-text'>
        {label}
      </span>
      <span className='text-2xl font-medium text-black font-sf-pro-display tabular-nums'>
        {value}
      </span>
      {caption && <span className='text-xs text-mid-dark-gray font-sf-pro-text'>{caption}</span>}
    </div>
  )
}
