/**
 * The analytics charts. Colours come from a validated categorical palette
 * (blue, orange, aqua: colour-blind safe as adjacent pairs on white), and the
 * marks follow one spec: thin bars with 4px rounded data ends, 2px lines, a
 * 2px white gap between touching fills, hairline grid, and a tooltip on hover.
 * Values are printed beside the marks wherever they fit, so colour is never
 * the only way to read them.
 */
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { useId } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'

/** Categorical slots, in this order and never cycled. Colour follows the entity. */
export const SERIES = ['#2a78d6', '#eb6834', '#1baf7a'] as const
/** Unknown and "everything else": grey, so it never competes with real answers. */
export const MUTED_FILL = '#c3c2b7'
/** Reserved for states (vendor stages), always shown with a label. */
export const STATUS = { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b', info: '#2a78d6' } as const

const GRID = '#e1e0d9'
const AXIS = '#c3c2b7'
const AXIS_INK = '#898781'
const TICK = { fill: AXIS_INK, fontSize: 11, fontFamily: 'inter-tight, Inter, sans-serif' }

export interface TooltipRow {
  label: string
  value: string
  color?: string
}

function TooltipCard({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return (
    <div className='min-w-[150px] rounded-lg border border-black/10 bg-white px-3 py-2 font-inter-tight text-xs shadow-lg'>
      {title && <p className='mb-1.5 font-semibold text-black'>{title}</p>}
      <div className='flex flex-col gap-1'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center justify-between gap-4'>
            <span className='flex items-center gap-1.5 text-mid-dark-gray'>
              {row.color && (
                <span className='size-2 shrink-0 rounded-full' style={{ backgroundColor: row.color }} />
              )}
              {row.label}
            </span>
            <span className='font-semibold tabular-nums text-black'>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * A single line over time, with a soft fill under it. The crosshair follows
 * the pointer and the tooltip names the day.
 */
export function TrendChart<Row extends object>({
  data,
  xKey,
  valueKey,
  formatX,
  formatValue,
  tooltip,
  label,
  className,
}: {
  data: Row[]
  xKey: string
  valueKey: string
  formatX: (value: string) => string
  formatValue: (value: number) => string
  tooltip: (row: Row) => TooltipRow[]
  /** Names the line for screen readers. */
  label: string
  className?: string
}) {
  const gradientId = `trend-${useId().replace(/:/g, '')}`
  const color = SERIES[0]

  return (
    <ChartContainer
      config={{ [valueKey]: { label, color } }}
      className={cn('aspect-auto h-[260px] w-full', className)}
      role='img'
      aria-label={label}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={color} stopOpacity={0.2} />
            <stop offset='100%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis
          dataKey={xKey}
          tickFormatter={formatX}
          tickLine={false}
          axisLine={{ stroke: AXIS }}
          tick={TICK}
          minTickGap={28}
          tickMargin={8}
        />
        <YAxis
          tickFormatter={(value: number) => formatValue(value)}
          tickLine={false}
          axisLine={false}
          tick={TICK}
          allowDecimals={false}
          width={56}
        />
        <ChartTooltip
          cursor={{ stroke: AXIS, strokeWidth: 1 }}
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as Row | undefined
            if (!active || !row) return null
            return <TooltipCard title={formatX(String(row[xKey as keyof Row]))} rows={tooltip(row)} />
          }}
        />
        <Area
          type='monotone'
          dataKey={valueKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          // A lone day has no line to draw, so it gets a point instead.
          dot={data.length === 1 ? { r: 4, fill: color, stroke: '#fff', strokeWidth: 2 } : false}
          activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

/** Upright bars, one per category, for ordered categories like age ranges or days. */
export function ColumnChart<Row extends object>({
  data,
  xKey,
  valueKey,
  formatX = String,
  formatValue,
  colorOf = () => SERIES[0],
  tooltip,
  label,
  className,
}: {
  data: Row[]
  xKey: string
  valueKey: string
  formatX?: (value: string) => string
  formatValue: (value: number) => string
  /** A bar's colour, e.g. grey for Unknown. */
  colorOf?: (row: Row) => string
  tooltip: (row: Row) => TooltipRow[]
  label: string
  className?: string
}) {
  return (
    <ChartContainer
      config={{ [valueKey]: { label, color: SERIES[0] } }}
      className={cn('aspect-auto h-[260px] w-full', className)}
      role='img'
      aria-label={label}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barCategoryGap='30%'>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis
          dataKey={xKey}
          tickFormatter={(value) => formatX(String(value))}
          tickLine={false}
          axisLine={{ stroke: AXIS }}
          tick={TICK}
          interval='preserveStartEnd'
          minTickGap={16}
          tickMargin={8}
        />
        <YAxis
          tickFormatter={(value: number) => formatValue(value)}
          tickLine={false}
          axisLine={false}
          tick={TICK}
          allowDecimals={false}
          width={56}
        />
        <ChartTooltip
          cursor={{ fill: 'rgba(11,11,11,0.04)' }}
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as Row | undefined
            if (!active || !row) return null
            return <TooltipCard title={formatX(String(row[xKey as keyof Row]))} rows={tooltip(row)} />
          }}
        />
        <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
          {data.map((row, index) => (
            <Cell key={index} fill={colorOf(row)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export interface DonutSlice {
  label: string
  value: number
  color: string
}

/** Part of a whole, for a handful of slices. The legend carries every value. */
export function DonutChart({
  slices,
  totalLabel,
  formatValue = (value) => value.toLocaleString(),
  layout = 'row',
}: {
  slices: DonutSlice[]
  /** Under the total in the middle, e.g. "Buyers". */
  totalLabel: string
  formatValue?: (value: number) => string
  /** Legend beside the ring on wider screens, or always under it for a narrow card. */
  layout?: 'row' | 'column'
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const percent = (value: number) => (total ? `${Math.round((value / total) * 100)}%` : '0%')

  return (
    <div className={cn('flex flex-col items-center gap-6', layout === 'row' && 'sm:flex-row')}>
      <div className='relative size-[190px] shrink-0'>
        <ChartContainer config={{}} className='aspect-square size-full' role='img' aria-label={totalLabel}>
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => {
                const slice = payload?.[0]?.payload as DonutSlice | undefined
                if (!active || !slice) return null
                return (
                  <TooltipCard
                    rows={[
                      {
                        label: slice.label,
                        value: `${formatValue(slice.value)} · ${percent(slice.value)}`,
                        color: slice.color,
                      },
                    ]}
                  />
                )
              }}
            />
            <Pie
              data={slices}
              dataKey='value'
              nameKey='label'
              innerRadius='68%'
              outerRadius='100%'
              // The white stroke is the 2px gap between slices.
              stroke='#fff'
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}>
              {slices.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
          <span className='font-inter-tight text-2xl font-bold text-black'>{formatValue(total)}</span>
          <span className='font-inter-tight text-xs text-mid-dark-gray'>{totalLabel}</span>
        </div>
      </div>

      <ul className='flex w-full flex-col gap-3'>
        {slices.map((slice) => (
          <li key={slice.label} className='flex items-center justify-between gap-4 font-inter-tight text-sm'>
            <span className='flex items-center gap-2 text-black'>
              <span className='size-2.5 shrink-0 rounded-full' style={{ backgroundColor: slice.color }} />
              {slice.label}
            </span>
            <span className='tabular-nums text-black'>
              {formatValue(slice.value)}
              <span className='ml-2 inline-block w-10 text-right text-mid-dark-gray'>
                {percent(slice.value)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface BarListItem {
  label: string
  value: number
  /** The value as printed, e.g. "₦80,000". */
  display: string
  /** A smaller second line, e.g. "5 tickets". */
  detail?: string
  color?: string
}

/**
 * A ranked list with a bar under each name: long labels stay readable, and the
 * value is printed on every row, so it doubles as its own table.
 */
export function BarList({ items }: { items: BarListItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 0)

  return (
    <ul className='flex flex-col gap-4'>
      {items.map((item) => (
        <li key={item.label} className='flex flex-col gap-1.5 font-inter-tight'>
          <div className='flex items-baseline justify-between gap-4 text-sm'>
            <span className='truncate text-black'>{item.label}</span>
            <span className='shrink-0 tabular-nums text-black'>
              {item.display}
              {item.detail && <span className='ml-2 text-xs text-mid-dark-gray'>{item.detail}</span>}
            </span>
          </div>
          <div className='h-2 w-full'>
            <div
              className='h-full rounded-r-[4px] transition-[width] duration-500'
              style={{
                width: max ? `${Math.max((item.value / max) * 100, item.value ? 2 : 0)}%` : '0%',
                backgroundColor: item.color ?? SERIES[0],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export interface Segment {
  label: string
  value: number
  color: string
}

/** One bar split into its parts, with a 2px gap between them and a legend below. */
export function SegmentedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const shown = segments.filter((segment) => segment.value > 0)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex h-3 w-full gap-[2px] overflow-hidden rounded-[4px]' role='img' aria-label='Share by status'>
        {shown.map((segment) => (
          <div
            key={segment.label}
            title={`${segment.label}: ${segment.value}`}
            className='h-full first:rounded-l-[4px] last:rounded-r-[4px]'
            style={{ flexGrow: segment.value, backgroundColor: segment.color }}
          />
        ))}
      </div>

      <ul className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {segments.map((segment) => (
          <li key={segment.label} className='flex flex-col gap-0.5 font-inter-tight'>
            <span className='flex items-center gap-1.5 text-xs text-mid-dark-gray'>
              <span className='size-2 shrink-0 rounded-full' style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className='text-lg font-semibold tabular-nums text-black'>
              {segment.value}
              <span className='ml-1.5 text-xs font-normal text-mid-dark-gray'>
                {total ? `${Math.round((segment.value / total) * 100)}%` : '0%'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
