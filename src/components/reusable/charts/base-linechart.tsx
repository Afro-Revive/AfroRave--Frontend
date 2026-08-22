/**
 * A reusable line chart built on top of shadcn's chart primitives and recharts.
 * Everything is driven by props — pass the rows, the key holding the x value, and the
 * series to plot, and the component derives its own chart config, colours and legend.
 *
 * Keep it to five series or fewer: past that the `--chart-*` ramp repeats and two
 * lines end up sharing a colour.
 *
 * @example
 * ```tsx
 * <BaseLineChart
 *   title='Ticket sales'
 *   description='January - June 2024'
 *   data={[
 *     { month: 'January', paid: 186, comp: 80 },
 *     { month: 'February', paid: 305, comp: 200 },
 *   ]}
 *   xKey='month'
 *   series={[
 *     { key: 'paid', label: 'Paid' },
 *     { key: 'comp', label: 'Complimentary' },
 *   ]}
 *   xTickFormatter={(value) => String(value).slice(0, 3)}
 * />
 * ```
 */
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

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


const CHART_COLOR_COUNT = 5

export type ILineChartValue = string | number | null | undefined

export type ILineChartRow = Record<string, ILineChartValue>

export interface ILineChartSeries {
  /** Key holding this series' value on each row */
  key: string
  /** Name shown in the legend and tooltip — defaults to the key */
  label?: string
  /** Optional override for this series' colour (any CSS colour) */
  color?: string
}

export interface IBaseLineChartProps {
  /** Rows to plot, one per point on the x axis */
  data: ILineChartRow[]
  /** Key holding the x value on each row */
  xKey: string
  /** Series to plot — pass keys directly, or objects to set labels and colours */
  series: (string | ILineChartSeries)[]
  /** Card heading — omit along with `description`/`footer` to render the chart bare */
  title?: string
  /** Card sub-heading, e.g. the date range being shown */
  description?: string
  /** Card footer content */
  footer?: React.ReactNode
  /** Wraps the chart in a Card — defaults to true when a title/description/footer is given */
  card?: boolean
  /** Interpolation between points */
  curve?: 'monotone' | 'linear' | 'step'
  /** Formats the x axis ticks */
  xTickFormatter?: (value: ILineChartValue) => string
  /** Formats values in the tooltip and on the y axis */
  valueFormatter?: (value: number) => string
  /** Shows the y axis and its ticks */
  showYAxis?: boolean
  /** Shows the horizontal gridlines */
  showGrid?: boolean
  /** Shows a marker on every point, not just the hovered one */
  showDots?: boolean
  /** Shows the legend — defaults to true when there is more than one series */
  showLegend?: boolean
  /** Draws through gaps instead of breaking the line at null values */
  connectNulls?: boolean
  /** Message shown when there is nothing to plot */
  emptyMessage?: string
  /** Additional CSS classes for the outer element */
  className?: string
  /** Additional CSS classes for the chart container */
  chartClassName?: string
}

interface IResolvedSeries extends ILineChartSeries {
  label: string
  color: string
}

const defaultFormatter = (value: number) => value.toLocaleString()

export function BaseLineChart({
  data,
  xKey,
  series,
  title,
  description,
  footer,
  card,
  curve = 'monotone',
  xTickFormatter,
  valueFormatter = defaultFormatter,
  showYAxis = true,
  showGrid = true,
  showDots = false,
  showLegend,
  connectNulls = false,
  emptyMessage = 'No data to display',
  className,
  chartClassName,
}: IBaseLineChartProps) {
  const { lines, chartConfig } = useMemo(() => {
    const resolved = series.map<IResolvedSeries>((item, index) => {
      const entry = typeof item === 'string' ? { key: item } : item

      return {
        ...entry,
        label: entry.label ?? entry.key,
        color: entry.color ?? `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`,
      }
    })

    const config: ChartConfig = Object.fromEntries(
      resolved.map((line) => [line.key, { label: line.label, color: line.color }]),
    )

    return { lines: resolved, chartConfig: config }
  }, [series])

  const withCard = card ?? Boolean(title || description || footer)
  const withLegend = showLegend ?? lines.length > 1
  const isEmpty = !data.length || !lines.length

  const chart = isEmpty ? (
    <div className='flex min-h-[250px] items-center justify-center text-sm text-mid-dark-gray font-sf-pro-text'>
      {emptyMessage}
    </div>
  ) : (
    <ChartContainer config={chartConfig} className={cn('w-full', chartClassName)}>
      <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={xTickFormatter}
        />
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={48}
            tickFormatter={(value) => valueFormatter(Number(value))}
          />
        )}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value) => valueFormatter(Number(value))} />}
        />
        {lines.map((line) => (
          <Line
            key={line.key}
            dataKey={line.key}
            type={curve}
            stroke={`var(--color-${line.key})`}
            strokeWidth={2}
            dot={showDots ? { r: 4, strokeWidth: 0 } : false}
            activeDot={{ r: 4, strokeWidth: 2 }}
            connectNulls={connectNulls}
          />
        ))}
        {withLegend && <ChartLegend content={<ChartLegendContent />} />}
      </LineChart>
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

export default BaseLineChart
