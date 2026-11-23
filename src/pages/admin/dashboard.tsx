import { getRoutePath } from '@/config/get-route-path'
import { useAdminAnalytics, useSalesByMonth, type MonthSales } from '@/hooks/use-admin'
import { formatNaira } from '@/lib/format-price'
import type { AdminAnalytics } from '@/types/admin'
import { RiErrorWarningLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from './components/page-header'

const BAR_COLOR = '#38bdf8'

/** The API's role names, by the names the app uses, in this order. */
const ROLE_LABELS: [string, string][] = [
  ['User', 'Fans'],
  ['Organizer', 'Organizers'],
  ['Vendor', 'Vendors'],
  ['Admin', 'Admins'],
]

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminAnalytics()
  const analytics = data?.data

  return (
    <>
      <PageHeader title='Dashboard' description='Platform totals, all time.' />

      {isError && <ErrorNote>Couldn&rsquo;t load the totals. Try again in a moment.</ErrorNote>}

      {isLoading && (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className='h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]' />
          ))}
        </div>
      )}

      {analytics && <Totals analytics={analytics} />}
    </>
  )
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className='flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'>
      <RiErrorWarningLine className='size-5 shrink-0' aria-hidden />
      {children}
    </p>
  )
}

function Totals({ analytics }: { analytics: AdminAnalytics }) {
  const { users, usersByRole, events, ticketOrders: orders } = analytics
  const roleCount = (role: string) => usersByRole.find((row) => row.role === role)?.total ?? 0

  return (
    <>
      <section aria-label='Sales' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Tile
          label='Ticket sales'
          value={formatNaira(orders.grossCompletedAmount)}
          note='Completed orders, tax included. Not platform profit.'
          title={orders.amountDefinition}
        />
        <Tile label='Tax collected' value={formatNaira(orders.completedTax)} note='Included in ticket sales' />
        <Tile
          label='Completed orders'
          value={orders.completed.toLocaleString()}
          note={`of ${orders.total.toLocaleString()} orders`}
          to={getRoutePath('admin_orders')}
        />
        <Tile
          label='Refunded orders'
          value={orders.refunded.toLocaleString()}
          note={orders.other > 0 ? `${orders.other.toLocaleString()} in another state` : undefined}
          to={getRoutePath('admin_orders')}
        />
      </section>

      <section aria-label='Accounts and events' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Tile
          label='Users'
          value={users.total.toLocaleString()}
          note={`${users.active.toLocaleString()} active · ${users.inactive.toLocaleString()} inactive`}
          title='Inactive counts unfinished sign-ups as well as suspended accounts.'
          to={getRoutePath('admin_users')}
          breakdown={ROLE_LABELS.map(([role, label]) => [label, roleCount(role)])}
        />
        <Tile
          label='Events'
          value={events.total.toLocaleString()}
          to={getRoutePath('admin_events')}
          breakdown={[
            ['Published', events.published],
            ['Drafts', events.draft],
            ['Suspended', events.suspended],
          ]}
        />
        <SalesByMonth />
      </section>
    </>
  )
}

function Tile({
  label,
  value,
  note,
  title,
  to,
  breakdown,
}: {
  label: string
  value: string
  note?: string
  /** More detail on hover. */
  title?: string
  to?: string
  breakdown?: [string, number][]
}) {
  const body = (
    <>
      <p className='text-xs font-medium uppercase tracking-wide text-white/50'>{label}</p>
      <p className='text-2xl font-bold tabular-nums text-white'>{value}</p>
      {note && <p className='text-xs text-white/50'>{note}</p>}
      {breakdown && (
        <dl className='mt-1 flex flex-col gap-1 text-xs'>
          {breakdown.map(([name, count]) => (
            <div key={name} className='flex justify-between gap-3 text-white/60'>
              <dt>{name}</dt>
              <dd className='tabular-nums text-white'>{count.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )
  const className = 'flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-5'

  return to ? (
    <Link to={to} title={title} className={`${className} transition-colors hover:border-white/25`}>
      {body}
    </Link>
  ) : (
    <div title={title} className={className}>
      {body}
    </div>
  )
}

function SalesByMonth() {
  const { data, isLoading, isError } = useSalesByMonth()

  return (
    <figure className='flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2'>
      <figcaption className='text-xs font-medium uppercase tracking-wide text-white/50'>
        Ticket sales, last 6 months
      </figcaption>
      {isLoading && <div className='h-48 animate-pulse rounded-lg bg-white/5' />}
      {isError && <p className='flex h-48 items-center justify-center text-sm text-white/60'>Couldn&rsquo;t load the chart.</p>}
      {data && <MonthChart months={data.months} />}
      {data && !data.complete && (
        <p className='text-xs text-amber-200'>Only the latest 5,000 orders are counted here.</p>
      )}
    </figure>
  )
}

function MonthChart({ months }: { months: MonthSales[] }) {
  return (
    <>
      <div className='h-48' aria-hidden>
        <ResponsiveContainer width='100%' height='100%' initialDimension={{ width: 600, height: 192 }}>
          <BarChart data={months} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap='30%'>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.08)' />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
            <YAxis
              width={56}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value: number) => formatNaira(value, { aproximate: true })}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
              formatter={(value) => [formatNaira(Number(value)), 'Sales']}
            />
            <Bar dataKey='sales' fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* The same numbers for screen readers. */}
      <table className='sr-only'>
        <thead>
          <tr>
            <th>Month</th>
            <th>Sales</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {months.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{formatNaira(row.sales)}</td>
              <td>{row.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
