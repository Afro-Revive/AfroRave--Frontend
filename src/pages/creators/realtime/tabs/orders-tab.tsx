import { Pagination } from '@/components/shared/pagination'
import { Input } from '@/components/ui/input'
import { formatNaira } from '@/lib/format-price'
import { formatShortDate } from '@/lib/helper-func'
import type { AnalyticsOrder, EventAnalyticsData } from '@/types'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ColumnChart, SERIES } from '../components/analytics-charts'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import {
  AnalyticsCard,
  AnalyticsTable,
  EmptyNote,
  ProgressBar,
  StatTile,
  StatusPill,
  SummaryCard,
} from '../components/analytics-ui'
import { countBuyers, countOrders, formatDay, salesByDay } from '../lib/analytics-data'

const ORDERS_PER_PAGE = 20

export default function OrdersTab(props: IAnalyticsTabProps) {
  return <AnalyticsGate {...props}>{(data) => <Orders data={data} />}</AnalyticsGate>
}

function Orders({ data }: { data: EventAnalyticsData }) {
  const orders = useMemo(() => data.orderList ?? [], [data])
  const days = salesByDay(orders)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [search])

  // The whole list is already here, so search and paging happen in the browser.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const newestFirst = [...orders].sort((a, b) => b.date.localeCompare(a.date))
    if (!query) return newestFirst
    return newestFirst.filter((order) =>
      [order.orderId, order.name, order.email, order.ticketName].some((field) =>
        field?.toLowerCase().includes(query),
      ),
    )
  }, [orders, search])

  const totalPages = Math.max(Math.ceil(filtered.length / ORDERS_PER_PAGE), 1)
  const pageRows = filtered.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE)
  const buyers = countBuyers(orders)

  return (
    <>
      <SummaryCard description='Ticket sales for this event so far.'>
        <StatTile label='Net Sales' value={formatNaira(data.totalNetRevenue)} />
        <StatTile
          label='Tickets Sold'
          value={`${data.totalTicketsSold.toLocaleString()} / ${data.totalTicketsCreated.toLocaleString()}`}
          caption='Sold of tickets on sale'>
          <ProgressBar
            value={data.totalTicketsSold}
            max={data.totalTicketsCreated}
            label='Tickets sold out of tickets on sale'
          />
        </StatTile>
        <StatTile
          label='Orders'
          value={countOrders(orders).toLocaleString()}
          caption={`${buyers.toLocaleString()} ${buyers === 1 ? 'buyer' : 'buyers'}`}
        />
        <StatTile label='Resales' value={data.totalResales.toLocaleString()} caption='Tickets resold by fans' />
      </SummaryCard>

      <AnalyticsCard title='Sales by Day' description='What buyers paid each day.'>
        {days.length === 0 ? (
          <EmptyNote>No orders yet. Each day’s sales will show here.</EmptyNote>
        ) : (
          <ColumnChart
            data={days}
            xKey='day'
            valueKey='revenue'
            label='Sales by day'
            formatX={formatDay}
            formatValue={(value) => formatNaira(value, { aproximate: true })}
            tooltip={(day) => [
              { label: 'Sales', value: formatNaira(day.revenue), color: SERIES[0] },
              { label: 'Orders', value: day.orders.toLocaleString() },
              { label: 'Tickets', value: day.tickets.toLocaleString() },
            ]}
          />
        )}
      </AnalyticsCard>

      <AnalyticsCard title='All Orders' description='Newest first.'>
        <div className='relative'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mid-dark-gray' />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search by name, email, order ID or ticket'
            aria-label='Search orders'
            className='h-11 rounded-lg border border-[#595959]/50 pl-9 font-inter-tight'
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyNote>{search ? `No orders match “${search.trim()}”.` : 'No orders yet.'}</EmptyNote>
        ) : (
          <AnalyticsTable<AnalyticsOrder>
            caption='Ticket orders for this event'
            rows={pageRows}
            rowKey={(order, index) => `${order.orderId}-${index}`}
            columns={[
              { header: 'Order', cell: (order) => order.orderId },
              {
                header: 'Buyer',
                cell: (order) => (
                  <span className='flex flex-col'>
                    <span>{order.name || '—'}</span>
                    <span className='text-xs text-mid-dark-gray'>{order.email}</span>
                  </span>
                ),
              },
              {
                header: 'Ticket',
                cell: (order) => (
                  <>
                    {order.ticketName || '—'}
                    {order.quantity > 1 && <span className='text-mid-dark-gray'> × {order.quantity}</span>}
                  </>
                ),
              },
              { header: 'Amount', numeric: true, cell: (order) => formatNaira(order.amount) },
              { header: 'Date', cell: (order) => formatShortDate(order.date) },
              {
                header: 'Status',
                cell: (order) => (
                  <StatusPill tone={order.status?.toLowerCase() === 'successful' ? 'good' : 'neutral'}>
                    {order.status || '—'}
                  </StatusPill>
                ),
              },
            ]}
          />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={filtered.length}
          onPageChange={setPage}
          itemLabel={{ one: 'order', other: 'orders' }}
        />
      </AnalyticsCard>
    </>
  )
}
