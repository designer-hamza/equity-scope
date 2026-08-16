import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartSeries = {
  key: string;
  label: string;
  color?: string;
  type?: "line" | "bar" | "area";
};

const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

interface TooltipPayloadItem {
  name?: string;
  dataKey?: string | number;
  value?: number | string;
  color?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  formatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-1 font-medium text-popover-foreground">{label}</div>
      <div className="space-y-1">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block size-2 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="num text-popover-foreground">
              {typeof item.value === "number" ? formatter(item.value) : String(item.value ?? "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface FinChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  kind?: "line" | "bar" | "area";
  height?: number;
  valueFormatter?: (v: number) => string;
  axisFormatter?: (v: number) => string;
  showLegend?: boolean;
  stacked?: boolean;
  colorByValue?: boolean;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function FinChart({
  data,
  xKey,
  series,
  kind = "line",
  height = 260,
  valueFormatter = (v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 }),
  axisFormatter,
  showLegend = false,
  stacked = false,
  colorByValue = false,
  className,
  layout = "horizontal",
}: FinChartProps) {
  const axisProps = {
    stroke: "var(--color-muted-foreground)",
    tickLine: false,
    axisLine: false,
    fontSize: 11,
  };
  const grid = (
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--color-border)"
      vertical={layout === "vertical"}
      horizontal={layout === "horizontal"}
    />
  );
  const tooltip = (
    <Tooltip
      cursor={{ fill: "var(--color-muted)", opacity: 0.45 }}
      content={<ChartTooltip formatter={valueFormatter} />}
    />
  );
  const legend = showLegend ? (
    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="square" iconSize={8} />
  ) : null;

  const yTick = axisFormatter ?? ((v: number) => valueFormatter(v));

  const content = () => {
    if (kind === "bar") {
      return (
        <BarChart data={data} layout={layout} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          {grid}
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={xKey} {...axisProps} />
              <YAxis {...axisProps} tickFormatter={yTick} width={64} />
            </>
          ) : (
            <>
              <XAxis type="number" {...axisProps} tickFormatter={yTick} />
              <YAxis type="category" dataKey={xKey} {...axisProps} width={110} />
            </>
          )}
          {tooltip}
          {legend}
          <ReferenceLine y={0} stroke="var(--color-border)" />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color ?? PALETTE[i % PALETTE.length]}
              radius={[3, 3, 0, 0]}
              stackId={stacked ? "a" : undefined}
              maxBarSize={44}
            >
              {colorByValue
                ? data.map((d, di) => (
                    <Cell
                      key={di}
                      fill={
                        Number(d[s.key]) >= 0 ? "var(--color-gain)" : "var(--color-loss)"
                      }
                    />
                  ))
                : null}
            </Bar>
          ))}
        </BarChart>
      );
    }
    if (kind === "area") {
      return (
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={s.color ?? PALETTE[i % PALETTE.length]}
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor={s.color ?? PALETTE[i % PALETTE.length]}
                  stopOpacity={0.02}
                />
              </linearGradient>
            ))}
          </defs>
          {grid}
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} tickFormatter={yTick} width={64} />
          {tooltip}
          {legend}
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              stackId={stacked ? "a" : undefined}
              dot={false}
              activeDot={{ r: 3.5 }}
            />
          ))}
        </AreaChart>
      );
    }
    return (
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        {grid}
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} tickFormatter={yTick} width={64} />
        {tooltip}
        {legend}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3.5 }}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {content()}
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({
  data,
  dataKey = "value",
  xKey = "period",
  positive = true,
  height = 44,
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  positive?: boolean;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${dataKey}-${positive}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={positive ? "var(--color-gain)" : "var(--color-loss)"}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={positive ? "var(--color-gain)" : "var(--color-loss)"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey={xKey} hide />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={positive ? "var(--color-gain)" : "var(--color-loss)"}
            strokeWidth={1.6}
            fill={`url(#spark-${dataKey}-${positive})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
