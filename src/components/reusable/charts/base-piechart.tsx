/**
 * A reusable pie/donut chart built on top of shadcn's chart primitives and recharts.
 * Everything is driven by props — pass a `data` array of `{ label, value }` and the
 * component derives its own chart config, colours, legend and tooltip labels.
 *
 * Slices past `maxSlices` are folded into a single "Other" segment, and slices are
 * sorted largest-first so the `--chart-*` ramp reads darkest-to-lightest by size.
 *
 * @example
 * ```tsx
 * <BasePieChart
 *   title='Tickets by type'
 *   description='January - June 2024'
 *   data={[
 *     { label: 'Early Bird', value: 275 },
 *     { label: 'General', value: 200 },
 *     { label: 'VIP', value: 187 },
 *   ]}
 *   variant='donut'
 *   totalLabel='Tickets'
 * />
 * ```
 */
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const CHART_COLOR_COUNT = 5;

export interface IPieChartDatum {
  /** Label shown in the legend and tooltip */
  label: string;
  /** Magnitude of the slice — negative and non-finite values are treated as 0 */
  value: number;
  /** Optional override for this slice's colour (any CSS colour) */
  color?: string;
}

export interface IBasePieChartProps {
  /** Slices to render */
  data: IPieChartDatum[];
  /** Card heading — omit along with `description`/`footer` to render the chart bare */
  title?: string;
  /** Card sub-heading, e.g. the date range being shown */
  description?: string;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Donut leaves a hole for the total; pie (default) is solid */
  variant?: "pie" | "donut";
  /** Wraps the chart in a Card — defaults to true when a title/description/footer is given */
  card?: boolean;
  /** Label for the measure, used as the tooltip's value name */
  valueLabel?: string;
  /** Formats values in the tooltip, legend and donut centre */
  valueFormatter?: (value: number) => string;
  /** Maximum coloured slices before the tail folds into "Other" */
  maxSlices?: number;
  /** Sort slices largest-first before folding the tail */
  sort?: boolean;
  /** Caption under the donut's total */
  totalLabel?: string;
  /** Message shown when there is nothing to plot */
  emptyMessage?: string;
  /** Called when a slice is clicked */
  onSliceClick?: (datum: IPieChartDatum) => void;
  /** Additional CSS classes for the outer element */
  className?: string;
  /** Additional CSS classes for the chart container */
  chartClassName?: string;
}

interface IResolvedSlice extends IPieChartDatum {
  /** Config key derived from the label */
  key: string;
  fill: string;
}

const defaultFormatter = (value: number) => value.toLocaleString();

function toKey(label: string, index: number) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug ? `${slug}-${index}` : `slice-${index}`;
}

export function BasePieChart({
  data,
  title,
  description,
  footer,
  variant = "pie",
  card,
  valueLabel = "Value",
  valueFormatter = defaultFormatter,
  maxSlices = 5,
  sort = true,
  totalLabel = "Total",
  emptyMessage = "No data to display",
  onSliceClick,
  className,
  chartClassName,
}: IBasePieChartProps) {
  const { slices, chartConfig, total } = useMemo(() => {
    const cleaned = data
      .map((item) => ({
        ...item,
        value: Number.isFinite(item.value) ? Math.max(item.value, 0) : 0,
      }))
      .filter((item) => item.value > 0);

    const ordered = sort
      ? [...cleaned].sort((a, b) => b.value - a.value)
      : cleaned;

    const cap = Math.max(maxSlices, 1);
    const folded = ordered
      .slice(cap)
      .reduce((sum, item) => sum + item.value, 0);
    const kept: IPieChartDatum[] = folded
      ? [...ordered.slice(0, cap), { label: "Other", value: folded }]
      : ordered;

    const resolved = kept.map<IResolvedSlice>((item, index) => ({
      ...item,
      key: toKey(item.label, index),
      fill: item.color ?? `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`,
    }));

    const config: ChartConfig = {
      value: { label: valueLabel },
      ...Object.fromEntries(
        resolved.map((slice) => [
          slice.key,
          { label: slice.label, color: slice.fill },
        ]),
      ),
    };

    return {
      slices: resolved,
      chartConfig: config,
      total: resolved.reduce((sum, item) => sum + item.value, 0),
    };
  }, [data, sort, maxSlices, valueLabel]);

  const withCard = card ?? Boolean(title || description || footer);

  const chart = slices.length ? (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square max-h-[250px]", chartClassName)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              nameKey="key"
              className="bg-white border-light-gray text-black shadow-md rounded-sm w-fit"
              hideLabel
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        <Pie
          data={slices}
          dataKey="value"
          nameKey="key"
          stroke="0"
          innerRadius={variant === "donut" ? 60 : 0}
          onClick={(_, index) => onSliceClick?.(slices[index])}
          className={cn(onSliceClick && "cursor-pointer")}
        >
          {variant === "donut" && (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                  return null;

                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-medium"
                    >
                      {valueFormatter(total)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      {totalLabel}
                    </tspan>
                  </text>
                );
              }}
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  ) : (
    <div className="flex min-h-[250px] items-center justify-center text-sm text-mid-dark-gray font-sf-pro-text">
      {emptyMessage}
    </div>
  );

  if (!withCard) return <div className={cn("w-full", className)}>{chart}</div>;

  return (
    <Card className={cn("flex flex-col", className)}>
      {(title || description) && (
        <CardHeader className="items-center pb-0">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">{chart}</CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
      )}
    </Card>
  );
}

export default BasePieChart;
