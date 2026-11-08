import { formatNaira } from '@/lib/format-price'
import { formatShortDate, stripUnderscores } from '@/lib/helper-func'
import { useVendorSlotsByType } from '@/hooks/use-vendor-mutation'
import { useEventSelectorStore } from '@/stores'
import type { AnalyticsVendor } from '@/types'
import { BarList, SegmentedBar, STATUS } from '../components/analytics-charts'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import {
  AnalyticsCard,
  AnalyticsTable,
  EmptyNote,
  StatTile,
  StatusPill,
  SummaryCard,
} from '../components/analytics-ui'
import {
  VENDOR_STAGES,
  vendorKind,
  vendorStage,
  vendorStageCounts,
  vendorsByCategory,
  type VendorStage,
} from '../lib/analytics-data'
import { countBars } from '../lib/audience'

const STAGE_COLORS: Record<VendorStage, string> = {
  Secured: STATUS.good,
  Pending: STATUS.warning,
  Requested: STATUS.info,
  Rejected: STATUS.critical,
}

const STAGE_TONES = {
  Secured: 'good',
  Pending: 'warning',
  Requested: 'info',
  Rejected: 'critical',
} as const

/** What each stage means, in the organizer's words. */
const STAGE_LABELS: Record<VendorStage, string> = {
  Secured: 'Secured',
  Pending: 'Awaiting payment',
  Requested: 'To review',
  Rejected: 'Rejected',
}

export default function VendorsTab(props: IAnalyticsTabProps) {
  // The event's slots, to tell stalls from service offers. The sidebar loads
  // them too, so this is usually already cached.
  const { selectedEventId } = useEventSelectorStore()
  const { slots, isPending: isLoadingSlots } = useVendorSlotsByType(selectedEventId ?? '')

  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const vendors = data.vendorList ?? []
        const stages = vendorStageCounts(vendors)
        // Only stalls bring in money: the organizer pays service vendors outside the app.
        const stallRevenue = vendors
          .filter(
            (vendor) =>
              vendorStage(vendor.status) === 'Secured' && vendorKind(vendor, slots) === 'Revenue',
          )
          .reduce((sum, vendor) => sum + vendor.amount, 0)
        const categories = vendorsByCategory(vendors)
        // Newest first: the ones most likely to need a look.
        const rows = [...vendors].sort((a, b) => b.date.localeCompare(a.date))

        return (
          <>
            <SummaryCard description='Every vendor who applied to this event, and where they’ve got to.'>
              <StatTile label='Applications' value={(vendors.length || data.totalVendors).toLocaleString()} />
              <StatTile label='Secured' value={stages.Secured.toLocaleString()} caption='Paid, or a free slot accepted' />
              <StatTile
                label='Waiting on You'
                value={stages.Requested.toLocaleString()}
                caption={`${stages.Pending.toLocaleString()} more accepted, awaiting payment`}
              />
              <StatTile
                label='Revenue from Stalls'
                value={isLoadingSlots ? '…' : formatNaira(stallRevenue)}
                caption='Secured stalls only'
              />
            </SummaryCard>

            {vendors.length === 0 ? (
              <AnalyticsCard title='Applications' description='Vendors who applied for your stalls and offers.'>
                <EmptyNote>No vendor applications yet. They’ll show here as vendors apply.</EmptyNote>
              </AnalyticsCard>
            ) : (
              <>
                <div className='grid gap-6 xl:grid-cols-5'>
                  <AnalyticsCard
                    className='xl:col-span-3'
                    title='Applications by Status'
                    description='How far each application has got.'>
                    <SegmentedBar
                      segments={VENDOR_STAGES.map((stage) => ({
                        label: STAGE_LABELS[stage],
                        value: stages[stage],
                        color: STAGE_COLORS[stage],
                      }))}
                    />
                  </AnalyticsCard>

                  <AnalyticsCard className='xl:col-span-2' title='By Category' description='What vendors offer.'>
                    <BarList items={countBars(categories, { one: 'application', other: 'applications' })} />
                  </AnalyticsCard>
                </div>

                <AnalyticsCard title='All Applications' description='Newest first.'>
                  <AnalyticsTable<AnalyticsVendor>
                    caption='Vendor applications for this event'
                    rows={rows}
                    rowKey={(vendor, index) => `${vendor.name}-${vendor.stallName}-${index}`}
                    columns={[
                      {
                        header: 'Vendor',
                        cell: (vendor) => (
                          <span className='flex flex-col'>
                            <span>{vendor.name || '—'}</span>
                            <span className='text-xs text-mid-dark-gray'>
                              {stripUnderscores(vendor.category ?? '') || '—'}
                            </span>
                          </span>
                        ),
                      },
                      { header: 'Slot', cell: (vendor) => vendor.stallName || '—' },
                      {
                        header: 'Type',
                        cell: (vendor) => {
                          const kind = vendorKind(vendor, slots)
                          return kind === 'Revenue' ? 'Stall' : kind === 'Service' ? 'Service' : '—'
                        },
                      },
                      { header: 'Qty', numeric: true, cell: (vendor) => vendor.quantity },
                      { header: 'Amount', numeric: true, cell: (vendor) => formatNaira(vendor.amount) },
                      { header: 'Applied', cell: (vendor) => formatShortDate(vendor.date) },
                      {
                        header: 'Status',
                        cell: (vendor) => {
                          const stage = vendorStage(vendor.status)
                          return <StatusPill tone={STAGE_TONES[stage]}>{STAGE_LABELS[stage]}</StatusPill>
                        },
                      },
                    ]}
                  />
                </AnalyticsCard>
              </>
            )}
          </>
        )
      }}
    </AnalyticsGate>
  )
}
