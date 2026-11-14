/**
 * The building blocks the analytics tabs share, styled like the rest of the
 * organizer pages: white rounded cards with an Inter Tight title and a grey
 * line under it, and grey stat tiles like the Promo Codes summary.
 */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function AnalyticsCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string
  description?: string
  /** Sits top right, e.g. a link to the full tab. */
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('flex min-w-0 flex-col gap-5 rounded-xl bg-white p-5', className)}>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='font-inter-tight text-xl font-semibold text-black'>{title}</h2>
          {description && (
            <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

/** The Summary card every tab opens with: two to four stat tiles. */
export function SummaryCard({ description, children }: { description: string; children: React.ReactNode }) {
  return (
    <AnalyticsCard title='Summary' description={description}>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>{children}</div>
    </AnalyticsCard>
  )
}

export function StatTile({
  label,
  value,
  caption,
  children,
}: {
  label: string
  value: React.ReactNode
  /** A line under the value, e.g. "of 50 tickets". */
  caption?: React.ReactNode
  /** Extra content under the caption, e.g. a progress bar. */
  children?: React.ReactNode
}) {
  return (
    <div className='flex min-w-0 flex-col gap-1 rounded-lg bg-[#F2F2F2] px-4 py-3'>
      <p className='font-inter-tight text-sm text-black'>{label}</p>
      <p className='truncate font-inter-tight text-xl font-bold text-black'>{value}</p>
      {caption && <p className='font-inter-tight text-xs text-mid-dark-gray'>{caption}</p>}
      {children}
    </div>
  )
}

/** How full something is, e.g. tickets sold of tickets on sale. */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div
      role='progressbar'
      aria-label={label}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className='mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10'>
      <div className='h-full rounded-full bg-[#2a78d6]' style={{ width: `${percent}%` }} />
    </div>
  )
}

/** A short message in place of a chart or table that has nothing to show. */
export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className='flex min-h-[160px] items-center justify-center px-4 text-center font-inter-tight text-sm text-mid-dark-gray'>
      {children}
    </p>
  )
}

const STATUS_STYLES: Record<string, string> = {
  good: 'bg-[#00AD2E]/15 text-[#00862A]',
  warning: 'bg-[#FF9500]/15 text-[#B86B00]',
  critical: 'bg-deep-red/10 text-deep-red',
  neutral: 'bg-black/5 text-mid-dark-gray',
  info: 'bg-tech-blue/10 text-tech-blue',
}

export function StatusPill({
  tone,
  children,
}: {
  tone: keyof typeof STATUS_STYLES
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded-full px-2.5 py-1 font-inter-tight text-xs font-medium',
        STATUS_STYLES[tone],
      )}>
      {children}
    </span>
  )
}

export interface AnalyticsColumn<Row> {
  header: string
  cell: (row: Row) => React.ReactNode
  /** Right-aligns numbers so they line up. */
  numeric?: boolean
  className?: string
}

export function AnalyticsTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  /** Read by screen readers only. */
  caption: string
  columns: AnalyticsColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row, index: number) => string
}) {
  return (
    <div className='w-full overflow-x-auto'>
      <Table className='w-full'>
        <TableCaption className='sr-only'>{caption}</TableCaption>
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            {columns.map((column) => (
              <TableHead
                key={column.header}
                className={cn(
                  'font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]',
                  column.numeric && 'text-right',
                )}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={rowKey(row, index)} className='font-inter-tight text-sm text-black'>
              {columns.map((column) => (
                <TableCell
                  key={column.header}
                  className={cn(
                    'whitespace-nowrap',
                    column.numeric && 'text-right tabular-nums',
                    column.className,
                  )}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
