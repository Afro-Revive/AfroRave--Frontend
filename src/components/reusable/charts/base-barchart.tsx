/**
 * A reusable bar/column chart built on top of shadcn's chart primitives and recharts.
 * Everything is driven by props — pass the rows, the key holding the category, and the
 * series to plot, and the component derives its own chart config, colours and legend.
 *
 * Keep it to five series or fewer: past that the `--chart-*` ramp repeats and two
 * series end up sharing a colour.
 *
 * @example
 * ```tsx
 * <BaseBarChart
 *   title='Tickets sold'
 *   description='January - June 2024'
 *   data={[
 *     { month: 'January', paid: 186 },
 *     { month: 'February', paid: 305 },
 *   ]}
 *   xKey='month'
 *   series={[{ key: 'paid', label: 'Paid' }]}
 *   xTickFormatter={(value) => String(value).slice(0, 3)}
 * />
 * ```
 */
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

/** Number of `--chart-*` custom properties defined in index.css. */
const CHART_COLOR_COUNT = 5

/** Bars stay thin — the leftover band is breathing room, not more bar. */
const MAX_BAR_SIZE = 24

/** Corner radius on the data end of a bar; the baseline end stays square. */
const BAR_RADIUS = 4

export type IBarChartValue = string | number | null | undefined

export type IBarChartRow = Record<string, IBarChartValue>

export interface IBarChartSeries {
  /** Key holding this series' value on each row */
  key: string
  /** Name shown in the legend and tooltip — defaults to the key */
  label?: string
  /** Optional override for this series' colour (any CSS colour) */
  color?: string
}

export interface IBaseBarChartProps {
  /** Rows to plot, one per category */
  data: IBarChartRow[]
  /** Key holding the category on each row */
  xKey: string
  /** Series to plot — pass keys directly, or objects to set labels and colours */
  series: (string | IBarChartSeries)[]
  /** Card heading — omit along with `description`/`footer` to render the chart bare */
  title?: string
  /** Card sub-heading, e.g. the date range being shown */
  description?: string
  /** Card footer content */
  footer?: React.ReactNode
  /** Wraps the chart in a Card — defaults to true when a title/description/footer is given */
  card?: boolean
  /** Columns grow up from the baseline (default); bars grow right, for long category names */
  orientation?: 'vertical' | 'horizontal'
  /** Stacks series into one bar per category instead of placing them side by side */
  stacked?: boolean
  /** Formats the category axis ticks */
  xTickFormatter?: (value: IBarChartValue) => string
  /** Formats values in the tooltip and on the value axis */
  valueFormatter?: (value: number) => string
  /** Shows the value axis and its ticks */
  showValueAxis?: boolean
  /** Shows the gridlines running across the value axis */
  showGrid?: boolean
  /** Shows the legend — defaults to true when there is more than one series */
  showLegend?: boolean
  /** Caps how thick a bar can get, in pixels */
  maxBarSize?: number
  /** Message shown when there is nothing to plot */
  emptyMessage?: string
  /** Additional CSS classes for the outer element */
  className?: string
  /** Additional CSS classes for the chart container */
  chartClassName?: string
}

interface IResolvedSeries extends IBarChartSeries {
  label: string
  color: string
}

const defaultFormatter = (value: number) => value.toLocaleString()

export function BaseBarChart({
  data,
  xKey,
  series,
  title,
  description,
  footer,
  card,
  orientation = 'vertical',
  stacked = false,
  xTickFormatter,
  valueFormatter = defaultFormatter,
  showValueAxis = true,
  showGrid = true,
  showLegend,
  maxBarSize = MAX_BAR_SIZE,
  emptyMessage = 'No data to display',
  className,
  chartClassName,
}: IBaseBarChartProps) {
  const { bars, chartConfig } = useMemo(() => {
    const resolved = series.map<IResolvedSeries>((item, index) => {
      const entry = typeof item === 'string' ? { key: item } : item

      return {
        ...entry,
        label: entry.label ?? entry.key,
        color: entry.color ?? `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`,
      }
    })

    const config: ChartConfig = Object.fromEntries(
      resolved.map((bar) => [bar.key, { label: bar.label, color: bar.color }]),
    )

    return { bars: resolved, chartConfig: config }
  }, [series])

  const withCard = card ?? Boolean(title || description || footer)
  const withLegend = showLegend ?? bars.length > 1
  const isHorizontal = orientation === 'horizontal'
  const isEmpty = !data.length || !bars.length

  /** Round only the data end, and in a stack only the segment that owns it. */
  function radiusFor(index: number): [number, number, number, number] {
    if (stacked && index !== bars.length - 1) return [0, 0, 0, 0]

    return isHorizontal
      ? [0, BAR_RADIUS, BAR_RADIUS, 0]
      : [BAR_RADIUS, BAR_RADIUS, 0, 0]
  }

  const categoryAxisProps = {
    dataKey: xKey,
    type: 'category' as const,
    tickLine: false,
    axisLine: false,
    tickMargin: 10,
    tickFormatter: xTickFormatter,
  }

  const valueAxisProps = {
    type: 'number' as const,
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tickFormatter: (value: IBarChartValue) => valueFormatter(Number(value)),
  }

  const chart = isEmpty ? (
    <div className='flex min-h-[250px] items-center justify-center text-sm text-mid-dark-gray font-sf-pro-text'>
      {emptyMessage}
    </div>
  ) : (
    <ChartContainer config={chartConfig} className={cn('w-full', chartClassName)}>
      <BarChart
        accessibilityLayer
        data={data}
        layout={isHorizontal ? 'vertical' : 'horizontal'}
        margin={{ left: 12, right: 12 }}>
        {showGrid && <CartesianGrid vertical={isHorizontal} horizontal={!isHorizontal} />}
        {isHorizontal ? (
          <>
            {showValueAxis && <XAxis {...valueAxisProps} />}
            <YAxis {...categoryAxisProps} width={96} />
          </>
        ) : (
          <>
            <XAxis {...categoryAxisProps} />
            {showValueAxis && <YAxis {...valueAxisProps} width={48} />}
          </>
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel={bars.length === 1}
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={`var(--color-${bar.key})`}
            stackId={stacked ? 'stack' : undefined}
            radius={radiusFor(index)}
            maxBarSize={maxBarSize}
          />
        ))}
        {withLegend && <ChartLegend content={<ChartLegendContent />} />}
      </BarChart>
    </ChartContainer>
  )

  if (!withCard) return <div className={cn('w-full', className)}>{chart}</div>

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{chart}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

export default BaseBarChart
