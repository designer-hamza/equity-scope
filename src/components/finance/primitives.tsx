import { ArrowDownRight, ArrowRight, ArrowUpRight, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatPercent, formatTimestamp } from "@/lib/format";
import type { DataProvenance, TrendDirection } from "@/types/finance";

export function CompanyLogo({
  monogram,
  size = "md",
  className,
}: {
  monogram: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-8 text-[11px]",
    md: "size-11 text-sm",
    lg: "size-14 text-base",
  } as const;
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border bg-secondary font-semibold tracking-tight text-secondary-foreground",
        sizes[size],
        className,
      )}
    >
      {monogram.toUpperCase()}
    </div>
  );
}

export function DeltaBadge({
  value,
  suffix = "%",
  digits = 2,
  className,
  invert = false,
}: {
  value: number;
  suffix?: string;
  digits?: number;
  className?: string;
  invert?: boolean;
}) {
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : ArrowRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium num",
        positive && "bg-gain-soft text-gain",
        negative && "bg-loss-soft text-loss",
        !positive && !negative && "bg-muted text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3" />
      {value > 0 ? "+" : ""}
      {value.toFixed(digits)}
      {suffix}
    </span>
  );
}

export function TrendPill({ trend }: { trend: TrendDirection }) {
  const map: Record<TrendDirection, string> = {
    improving: "bg-gain-soft text-gain",
    stable: "bg-muted text-muted-foreground",
    declining: "bg-loss-soft text-loss",
  };
  const label = trend.charAt(0).toUpperCase() + trend.slice(1);
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium capitalize", map[trend])}>
      {label}
    </span>
  );
}

export function DataBadge({
  provenance,
  showTimestamp = true,
  className,
}: {
  provenance: DataProvenance;
  showTimestamp?: boolean;
  className?: string;
}) {
  const labels: Record<DataProvenance["kind"], string> = {
    live: "Live",
    delayed: "Delayed",
    historical: "Historical",
    estimate: "Estimate",
    ai: "Generated analysis",
    demo: "Demo data",
  };
  const tone: Record<DataProvenance["kind"], string> = {
    live: "bg-gain-soft text-gain",
    delayed: "bg-warn-soft text-warn",
    historical: "bg-muted text-muted-foreground",
    estimate: "bg-warn-soft text-warn",
    ai: "bg-accent text-accent-foreground",
    demo: "bg-warn-soft text-warn",
  };
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium uppercase tracking-wide",
          tone[provenance.kind],
        )}
      >
        <Info className="size-3" />
        {labels[provenance.kind]}
      </span>
      <span>Source: {provenance.source}</span>
      {showTimestamp && <span>· Last updated: {formatTimestamp(provenance.lastUpdated)}</span>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  previous,
  trend,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  previous?: string;
  trend?: TrendDirection;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="label-xs">{label}</span>
        {trend && <TrendPill trend={trend} />}
      </div>
      <div className="mt-2 text-xl font-semibold num">{value}</div>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof delta === "number" && <DeltaBadge value={delta} digits={1} />}
        {previous && <span className="num">prev {previous}</span>}
        {hint && !previous && <span>{hint}</span>}
      </div>
    </div>
  );
}

export function ScoreRing({
  score,
  size = 132,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const tone = score >= 70 ? "text-gain" : score >= 50 ? "text-warn" : "text-loss";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={8}
          className="stroke-muted"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("stroke-current transition-[stroke-dashoffset] duration-700", tone)}
          fill="none"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold num">{score}</span>
        <span className="text-[11px] text-muted-foreground">{label ?? "/ 100"}</span>
      </div>
    </div>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const tone = score >= 70 ? "bg-gain" : score >= 50 ? "bg-warn" : "bg-loss";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", tone)} style={{ width: `${score}%` }} />
    </div>
  );
}

export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      Demonstration dataset. Figures are illustrative and are not live or delayed market data.
      Provided for research and educational purposes only — not investment advice.
    </p>
  );
}

export function ChangeText({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "num",
        value > 0 ? "text-gain" : value < 0 ? "text-loss" : "text-muted-foreground",
        className,
      )}
    >
      {formatPercent(value, 2, true)}
    </span>
  );
}
