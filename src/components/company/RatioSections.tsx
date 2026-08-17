import { FinChart } from "@/components/charts/FinChart";
import {
  KpiCard,
  SectionHeading,
  TrendPill,
} from "@/components/finance/primitives";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyCompact, formatPercent, formatRatio } from "@/lib/format";
import { growthMetrics, trendOf } from "@/lib/metrics";
import type { CompanyAnalysis } from "@/types/finance";

const M = 1e6;

export function ProfitabilitySection({ analysis }: { analysis: CompanyAnalysis }) {
  const ratios = analysis.ratios.annual;
  const last = ratios[ratios.length - 1]!;
  const prev = ratios[ratios.length - 2]!;

  const metrics = [
    { key: "grossMargin", label: "Gross Margin" },
    { key: "operatingMargin", label: "Operating Margin" },
    { key: "ebitdaMargin", label: "EBITDA Margin" },
    { key: "netMargin", label: "Net Profit Margin" },
    { key: "roa", label: "ROA" },
    { key: "roe", label: "ROE" },
    { key: "roic", label: "ROIC" },
  ] as const;

  return (
    <section>
      <SectionHeading
        title="Profitability analysis"
        description="Margin structure and returns on capital, with three-year trend classification."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const series = ratios.map((r) => r[m.key]);
          return (
            <KpiCard
              key={m.key}
              label={m.label}
              value={formatPercent(last[m.key])}
              delta={last[m.key] - prev[m.key]}
              previous={formatPercent(prev[m.key])}
              trend={trendOf(series)}
            />
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Margin history</h3>
          <FinChart
            data={ratios.map((r) => ({
              period: r.period,
              grossMargin: r.grossMargin,
              operatingMargin: r.operatingMargin,
              netMargin: r.netMargin,
            }))}
            xKey="period"
            kind="line"
            showLegend
            height={250}
            series={[
              { key: "grossMargin", label: "Gross" },
              { key: "operatingMargin", label: "Operating" },
              { key: "netMargin", label: "Net" },
            ]}
            valueFormatter={(v) => formatPercent(v)}
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Returns on capital</h3>
          <FinChart
            data={ratios.map((r) => ({ period: r.period, roa: r.roa, roe: r.roe, roic: r.roic }))}
            xKey="period"
            kind="bar"
            showLegend
            height={250}
            series={[
              { key: "roa", label: "ROA" },
              { key: "roe", label: "ROE" },
              { key: "roic", label: "ROIC" },
            ]}
            valueFormatter={(v) => formatPercent(v)}
          />
        </div>
      </div>
    </section>
  );
}

export function GrowthSection({ analysis }: { analysis: CompanyAnalysis }) {
  const metrics = growthMetrics(analysis.statements.annual);
  const profileTone =
    analysis.growthProfile === "Strong Growth"
      ? "bg-gain-soft text-gain"
      : analysis.growthProfile === "Declining"
        ? "bg-loss-soft text-loss"
        : "bg-muted text-muted-foreground";

  return (
    <section>
      <SectionHeading
        title="Growth analysis"
        description="Compound trajectories across the income statement, cash flow and balance sheet."
        action={
          <span className={`rounded-md px-3 py-1.5 text-sm font-medium ${profileTone}`}>
            Growth Profile: {analysis.growthProfile}
          </span>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((m) => (
          <KpiCard
            key={m.key}
            label={`${m.label} Growth`}
            value={formatPercent(m.latestGrowth)}
            hint={`5Y CAGR ${formatPercent(m.cagr5y)}`}
            trend={m.trend}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {metrics.slice(0, 4).map((m) => (
          <div key={m.key} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{m.label}</h3>
              <TrendPill trend={m.trend} />
            </div>
            <FinChart
              data={m.series}
              xKey="period"
              kind="area"
              height={190}
              series={[{ key: "value", label: m.label }]}
              valueFormatter={(v) => (m.key === "eps" ? v.toFixed(2) : formatCurrencyCompact(v * M))}
              axisFormatter={(v) => (m.key === "eps" ? v.toFixed(1) : formatCurrencyCompact(v * M))}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function BalanceHealthSection({ analysis }: { analysis: CompanyAnalysis }) {
  const ratios = analysis.ratios.annual;
  const r = ratios[ratios.length - 1]!;
  const balance = analysis.statements.annual;
  const b = balance.balance[balance.balance.length - 1]!;
  const netDebt = b.totalDebt - b.cash;

  const groups = [
    {
      title: "Liquidity",
      items: [
        { label: "Current Ratio", value: formatRatio(r.currentRatio), trend: trendOf(ratios.map((x) => x.currentRatio)) },
        { label: "Quick Ratio", value: formatRatio(r.quickRatio), trend: trendOf(ratios.map((x) => x.quickRatio)) },
        { label: "Cash Ratio", value: formatRatio(r.cashRatio), trend: trendOf(ratios.map((x) => x.cashRatio)) },
      ],
    },
    {
      title: "Leverage",
      items: [
        { label: "Debt / Equity", value: formatRatio(r.debtToEquity), trend: trendOf(ratios.map((x) => x.debtToEquity), false) },
        { label: "Debt / EBITDA", value: formatRatio(r.debtToEbitda), trend: trendOf(ratios.map((x) => x.debtToEbitda), false) },
        { label: "Interest Coverage", value: `${r.interestCoverage.toFixed(1)}x`, trend: trendOf(ratios.map((x) => x.interestCoverage)) },
        { label: "Net Debt", value: formatCurrencyCompact(netDebt * M), trend: undefined },
      ],
    },
    {
      title: "Solvency",
      items: [
        { label: "Total Debt", value: formatCurrencyCompact(b.totalDebt * M), trend: undefined },
        { label: "Total Assets", value: formatCurrencyCompact(b.totalAssets * M), trend: undefined },
        { label: "Total Liabilities", value: formatCurrencyCompact(b.totalLiabilities * M), trend: undefined },
        { label: "Shareholders' Equity", value: formatCurrencyCompact(b.shareholdersEquity * M), trend: undefined },
      ],
    },
  ];

  return (
    <section>
      <SectionHeading
        title="Balance sheet & financial health"
        description="Liquidity, leverage and solvency position at the latest reporting date."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">{g.title}</h3>
            <ul className="mt-3 divide-y divide-border">
              {g.items.map((it) => (
                <li key={it.label} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm text-muted-foreground">{it.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="num text-sm font-medium">{it.value}</span>
                    {it.trend && <TrendPill trend={it.trend} />}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Capital structure history</h3>
          <Badge variant="secondary">Cash · debt · equity</Badge>
        </div>
        <FinChart
          data={balance.balance.map((x) => ({
            period: x.period,
            cash: x.cash,
            totalDebt: x.totalDebt,
            equity: x.shareholdersEquity,
          }))}
          xKey="period"
          kind="bar"
          showLegend
          height={280}
          series={[
            { key: "cash", label: "Cash" },
            { key: "totalDebt", label: "Total debt" },
            { key: "equity", label: "Shareholders' equity" },
          ]}
          valueFormatter={(v) => formatCurrencyCompact(v * M)}
          axisFormatter={(v) => formatCurrencyCompact(v * M)}
        />
      </div>
    </section>
  );
}
