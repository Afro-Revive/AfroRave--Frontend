import { formatNaira } from '@/lib/format-price'
import { Link } from 'react-router-dom'
import { BarList, DonutChart, SERIES, TrendChart } from '../components/analytics-charts'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import { AnalyticsCard, EmptyNote, ProgressBar, StatTile, SummaryCard } from '../components/analytics-ui'
import { countBuyers, countOrders, formatDay, salesByDay, salesByTicket, vendorStageCounts } from '../lib/analytics-data'
import { audienceFrom, countBars, genderSlices } from '../lib/audience'

const plural = (count: number, one: string, other: string) =>
  `${count.toLocaleString()} ${count === 1 ? one : other}`

export default function OverviewTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const orders = data.orderList ?? []
        const days = salesByDay(orders)
        const tickets = salesByTicket(orders)
        const vendors = data.vendorList ?? []
        const stages = vendorStageCounts(vendors)
        const { genders, ages, locations } = audienceFrom(data)
        const soldPercent = data.totalTicketsCreated
          ? Math.round((data.totalTicketsSold / data.totalTicketsCreated) * 100)
          : 0

        return (
          <>
            <SummaryCard description='The headline numbers for this event so far.'>
              <StatTile
                label='Net Revenue'
                value={formatNaira(data.totalNetRevenue)}
                caption={
                  data.totalRevenueFromVendors > 0
                    ? `${formatNaira(data.totalRevenueFromVendors)} from vendors`
                    : 'From ticket sales'
                }
              />
              <StatTile
                label='Tickets Sold'
                value={`${data.totalTicketsSold.toLocaleString()} / ${data.totalTicketsCreated.toLocaleString()}`}
                caption={`${soldPercent}% sold`}>
                <ProgressBar
                  value={data.totalTicketsSold}
                  max={data.totalTicketsCreated}
                  label='Tickets sold out of tickets on sale'
                />
              </StatTile>
              <StatTile
                label='Orders'
                value={countOrders(orders).toLocaleString()}
                caption={plural(countBuyers(orders), 'buyer', 'buyers')}
              />
              <StatTile
                label='Vendors Secured'
                value={stages.Secured.toLocaleString()}
                caption={`of ${plural(vendors.length || data.totalVendors, 'application', 'applications')}`}
              />
            </SummaryCard>

            <div className='grid gap-6 xl:grid-cols-3'>
              <AnalyticsCard
                className='xl:col-span-2'
                title='Ticket Sales'
                description='Tickets sold to date, day by day.'>
                {days.length === 0 ? (
                  <EmptyNote>No tickets sold yet. Sales will show here day by day.</EmptyNote>
                ) : (
                  <TrendChart
                    data={days}
                    xKey='day'
                    valueKey='totalTickets'
                    label='Tickets sold to date'
                    formatX={formatDay}
                    formatValue={(value) => value.toLocaleString()}
                    tooltip={(day) => [
                      { label: 'Sold that day', value: day.tickets.toLocaleString() },
                      { label: 'Sold to date', value: day.totalTickets.toLocaleString(), color: SERIES[0] },
                    ]}
                  />
                )}
              </AnalyticsCard>

              <AnalyticsCard title='Sales by Ticket' description='What buyers paid, by ticket type.'>
                {tickets.length === 0 ? (
                  <EmptyNote>No orders yet.</EmptyNote>
                ) : (
                  <BarList
                    items={tickets.map((ticket) => ({
                      label: ticket.ticketName,
                      value: ticket.revenue,
                      display: formatNaira(ticket.revenue),
                      detail: plural(ticket.tickets, 'ticket', 'tickets'),
                    }))}
                  />
                )}
              </AnalyticsCard>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
              <AnalyticsCard
                title='Gender'
                description='Share of buyers.'
                action={<InsightsLink />}>
                {genders.length === 0 ? (
                  <EmptyNote>No buyer details yet.</EmptyNote>
                ) : (
                  <DonutChart slices={genderSlices(genders)} totalLabel='Buyers' layout='column' />
                )}
              </AnalyticsCard>

              <AnalyticsCard title='Age Range' description='Buyers by age group.'>
                {ages.length === 0 ? (
                  <EmptyNote>No age details yet.</EmptyNote>
                ) : (
                  <BarList items={countBars(ages, { one: 'buyer', other: 'buyers' })} />
                )}
              </AnalyticsCard>

              <AnalyticsCard title='Top Locations' description='Where buyers are from.'>
                {locations.length === 0 ? (
                  <EmptyNote>No location details yet.</EmptyNote>
                ) : (
                  <BarList
                    items={countBars(locations.slice(0, 5), { one: 'buyer', other: 'buyers' })}
                  />
                )}
              </AnalyticsCard>
            </div>
          </>
        )
      }}
    </AnalyticsGate>
  )
}

function InsightsLink() {
  return (
    <Link
      to='?tab=insights'
      className='shrink-0 font-inter-tight text-xs font-semibold text-tech-blue hover:underline'>
      View all
    </Link>
  )
}
