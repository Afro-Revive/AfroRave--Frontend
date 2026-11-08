import { formatNaira } from '@/lib/format-price'
import type { AnalyticsPromoCode } from '@/types'
import { Link } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'
import { BarList } from '../components/analytics-charts'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import { AnalyticsCard, AnalyticsTable, EmptyNote, StatTile, SummaryCard } from '../components/analytics-ui'

const discountLabel = (code: AnalyticsPromoCode) =>
  code.discountType === 'Percentage'
    ? `${code.discountPercentage}% off`
    : `${formatNaira(code.discountPercentage)} off`

export default function PromoCodesTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const codes = data.promoCodes ?? []
        const totalUses = codes.reduce((sum, code) => sum + code.uses, 0)
        const byUses = [...codes].sort((a, b) => b.uses - a.uses)

        return (
          <>
            <SummaryCard description='Redemptions and sales across every promo and partnership code.'>
              <StatTile
                label='Codes Created'
                value={(codes.length || data.totalPromoCodesCreated).toLocaleString()}
              />
              <StatTile
                label='Times Used'
                // The per-code uses, or the API's own total when it sends no list.
                value={(codes.length ? totalUses : data.promoCodesUsed).toLocaleString()}
              />
              <StatTile label='Discount Given' value={formatNaira(data.discountTotal)} />
              <StatTile
                label='Top Partner'
                value={data.topPartner || '—'}
                caption={
                  data.topPartner
                    ? `${formatNaira(data.topPartnerNetSales)} sales · ${formatNaira(data.topPartnerCommission ?? 0)} commission`
                    : 'No partner sales yet'
                }
              />
            </SummaryCard>

            {codes.length === 0 ? (
              <AnalyticsCard title='Codes' description='How each code is doing.'>
                <EmptyNote>
                  <span>
                    No promo codes for this event yet.{' '}
                    <Link to={getRoutePath('promo_codes')} className='font-semibold text-tech-blue hover:underline'>
                      Create one
                    </Link>
                  </span>
                </EmptyNote>
              </AnalyticsCard>
            ) : (
              <div className='grid gap-6 xl:grid-cols-5'>
                {/* Only once a code has been used: until then it would be a card of nothing. */}
                {totalUses > 0 && (
                  <AnalyticsCard className='xl:col-span-2' title='Uses by Code' description='Most used first.'>
                    <BarList
                      items={byUses.map((code) => ({
                        label: code.promoCode,
                        value: code.uses,
                        display: code.uses.toLocaleString(),
                        detail: code.uses === 1 ? 'use' : 'uses',
                      }))}
                    />
                  </AnalyticsCard>
                )}

                <AnalyticsCard
                  className={totalUses > 0 ? 'xl:col-span-3' : 'xl:col-span-5'}
                  title='Codes'
                  description={
                    totalUses > 0
                      ? 'Sales and commission for each code.'
                      : 'None of your codes have been used yet. Sales and commission will show here.'
                  }>
                  <AnalyticsTable<AnalyticsPromoCode>
                    caption='Promo codes for this event'
                    rows={byUses}
                    rowKey={(code) => code.promoCode}
                    columns={[
                      {
                        header: 'Code',
                        cell: (code) => (
                          <span className='flex flex-col'>
                            <span className='font-semibold text-green'>{code.promoCode}</span>
                            {code.partnerName && (
                              <span className='text-xs text-mid-dark-gray'>Partner: {code.partnerName}</span>
                            )}
                          </span>
                        ),
                      },
                      { header: 'Discount', cell: discountLabel },
                      { header: 'Uses', numeric: true, cell: (code) => code.uses.toLocaleString() },
                      { header: 'Gross', numeric: true, cell: (code) => formatNaira(code.grossSales) },
                      { header: 'Net', numeric: true, cell: (code) => formatNaira(code.netSales) },
                      {
                        header: 'Commission',
                        numeric: true,
                        cell: (code) => (code.partnerName ? formatNaira(code.commissions) : '—'),
                      },
                    ]}
                  />
                </AnalyticsCard>
              </div>
            )}
          </>
        )
      }}
    </AnalyticsGate>
  )
}
