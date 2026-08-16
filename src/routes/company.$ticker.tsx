import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  Download,
  GitCompare,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FinChart } from "@/components/charts/FinChart";
import { Button } from "@/components/ui/button";
import {
  ChangeText,
  CompanyLogo,
  DataBadge,
  DemoNotice,
  KpiCard,
  ScoreBar,
  ScoreRing,
  SectionHeading,
  TrendPill,
} from "@/components/finance/primitives";
import { useWatchlist } from "@/hooks/use-watchlist";
import {
  companyAnalysisQuery,
  PROVENANCE,
} from "@/lib/data-provider";
import {
  cashFlowHighlights,
  growthMetrics,
  overviewDeltas,
} from "@/lib/metrics";
import {
  formatCurrencyCompact,
  formatMultiple,
  formatPercent,
  formatPrice,
  formatRatio,
  formatStatementValue,
} from "@/lib/format";
import type { Period } from "@/types/finance";

export const Route = createFileRoute("/company/$ticker")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.ticker.toUpperCase()} Analysis — EquityScope` },
      {
        name: "description",
        content:
          "Comprehensive financial health, performance, cash flow, valuation and statement analysis.",
      },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  const { ticker } = Route.useParams();
  const navigate = useNavigate();
  const { has, toggle } = useWatchlist();
  const [period, setPeriod] = useState<Period>("annual");

  const { data: analysis } = useSuspenseQuery(companyAnalysisQuery(ticker));

  if (!analysis) {
    return (
      <AppShell title="Company not found" subtitle="This company is outside the current demo coverage universe.">
        <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No analysis is available for <span className="font-medium text-foreground">{ticker.toUpperCase()}</span> yet.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/search">Back to company search</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const statements = analysis.statements[period];
  const ratios = analysis.ratios[period];
  const latestRatio = ratios[ratios.length - 1]!;
  const latestIncome = statements.income[statements.income.length - 1]!;
  const latestBalance = statements.balance[statements.balance.length - 1]!;
  const latestCashFlow = statements.cashFlow[statements.cashFlow.length - 1]!;
  const deltas = overviewDeltas(statements.income, statements.balance, statements.cashFlow);
  const growth = useMemo(() => growthMetrics(statements), [statements]);
  const cashHighlights = useMemo(() => cashFlowHighlights(statements.cashFlow), [statements.cashFlow]);
  const watched = has(analysis.company.ticker);

  const revenueChart = statements.income.map((row) => ({ period: row.period, revenue: row.revenue }));
  const earningsChart = statements.income.map((row) => ({ period: row.period, netIncome: row.netIncome }));
  const ebitdaChart = statements.income.map((row) => ({ period: row.period, ebitda: row.ebitda }));
  const fcfChart = statements.cashFlow.map((row) => ({ period: row.period, freeCashFlow: row.freeCashFlow }));
  const balanceChart = statements.balance.map((row) => ({
    period: row.period,
    cash: row.cash,
    debt: row.totalDebt,
    equity: row.shareholdersEquity,
  }));

  return (
    <AppShell
      title={analysis.company.name}
      subtitle={`${analysis.company.exchange}: ${analysis.company.ticker} · ${analysis.company.sector} · ${analysis.company.industry}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/search" })}>
            <ArrowLeft className="size-4" /> Search
          </Button>
          <Button variant={watched ? "secondary" : "outline"} size="sm" onClick={() => toggle(analysis.company.ticker)}>
            <Bookmark className="size-4" /> {watched ? "Saved" : "Watchlist"}
          </Button>
          <Button variant="outline" size="sm" disabled>
            <GitCompare className="size-4" /> Compare
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="size-4" /> Export
          </Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <DataBadge provenance={analysis.provenance} />
        <span className="text-xs text-muted-foreground">Coverage: {analysis.company.country}</span>
      </div>

      <section className="mt-5 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo monogram={analysis.company.logoMonogram} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{analysis.company.name}</h1>
                <span className="rounded bg-muted px-2 py-1 text-xs font-medium num">{analysis.company.ticker}</span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{analysis.company.description}</p>
            </div>
          </div>
          <div className="lg:text-right">
            <div className="text-3xl font-semibold num">{formatPrice(analysis.quote.price, analysis.company.currency)}</div>
            <ChangeText value={analysis.quote.changePct} className="text-sm" />
            <div className="mt-1 text-xs text-muted-foreground">Market price · demo dataset</div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Market cap" value={formatCurrencyCompact(analysis.quote.marketCap * 1e6, analysis.company.currency)} hint="Equity value" />
        <KpiCard label="Enterprise value" value={formatCurrencyCompact(analysis.quote.enterpriseValue * 1e6, analysis.company.currency)} hint="Market cap + net debt" />
        <KpiCard label="Revenue" value={formatCurrencyCompact(latestIncome.revenue * 1e6, analysis.company.currency)} delta={((latestIncome.revenue - deltas.ip.revenue) / Math.abs(deltas.ip.revenue)) * 100} previous={formatCurrencyCompact(deltas.ip.revenue * 1e6, analysis.company.currency)} />
        <KpiCard label="Net income" value={formatCurrencyCompact(latestIncome.netIncome * 1e6, analysis.company.currency)} delta={((latestIncome.netIncome - deltas.ip.netIncome) / Math.abs(deltas.ip.netIncome)) * 100} previous={formatCurrencyCompact(deltas.ip.netIncome * 1e6, analysis.company.currency)} />
        <KpiCard label="EBITDA" value={formatCurrencyCompact(latestIncome.ebitda * 1e6, analysis.company.currency)} delta={((latestIncome.ebitda - deltas.ip.ebitda) / Math.abs(deltas.ip.ebitda)) * 100} />
        <KpiCard label="EPS" value={formatPrice(latestIncome.eps, analysis.company.currency)} delta={((latestIncome.eps - deltas.ip.eps) / Math.abs(deltas.ip.eps)) * 100} />
        <KpiCard label="Free cash flow" value={formatCurrencyCompact(latestCashFlow.freeCashFlow * 1e6, analysis.company.currency)} delta={((latestCashFlow.freeCashFlow - deltas.cp.freeCashFlow) / Math.abs(deltas.cp.freeCashFlow)) * 100} />
        <KpiCard label="Cash" value={formatCurrencyCompact(latestBalance.cash * 1e6, analysis.company.currency)} delta={((latestBalance.cash - deltas.bp.cash) / Math.abs(deltas.bp.cash)) * 100} />
      </section>

      <section className="mt-8">
        <SectionHeading title="Financial health" description="Deterministic scoring across six financial dimensions. AI narrative will be connected later." />
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-5 text-center">
            <ScoreRing score={analysis.health.overallScore} label="/ 100" />
            <div className="mt-3 text-sm font-semibold">{analysis.health.rating}</div>
            <p className="mt-1 text-xs text-muted-foreground">Overall financial health</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {analysis.health.categories.map((category) => (
              <div key={category.key} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className="num text-sm font-semibold">{category.score}</span>
                </div>
                <ScoreBar score={category.score} />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{category.rating}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{category.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading
          title="Financial performance"
          description="Historical annual financial performance from the demo statement dataset."
          action={
            <div className="flex rounded-md border border-border p-0.5">
              {(["annual", "quarterly"] as Period[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${period === value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Revenue" icon={<TrendingUp className="size-4" />}>
            <FinChart data={revenueChart} xKey="period" series={[{ key: "revenue", label: "Revenue" }]} valueFormatter={(v) => formatCurrencyCompact(v * 1e6, analysis.company.currency)} />
          </ChartCard>
          <ChartCard title="Net income" icon={<BarChart3 className="size-4" />}>
            <FinChart data={earningsChart} xKey="period" series={[{ key: "netIncome", label: "Net income" }]} valueFormatter={(v) => formatCurrencyCompact(v * 1e6, analysis.company.currency)} />
          </ChartCard>
          <ChartCard title="EBITDA" icon={<BarChart3 className="size-4" />}>
            <FinChart data={ebitdaChart} xKey="period" series={[{ key: "ebitda", label: "EBITDA" }]} valueFormatter={(v) => formatCurrencyCompact(v * 1e6, analysis.company.currency)} />
          </ChartCard>
          <ChartCard title="Free cash flow" icon={<BarChart3 className="size-4" />}>
            <FinChart data={fcfChart} xKey="period" kind="area" series={[{ key: "freeCashFlow", label: "Free cash flow" }]} valueFormatter={(v) => formatCurrencyCompact(v * 1e6, analysis.company.currency)} />
          </ChartCard>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Profitability & returns" description="Current margins and returns with the latest historical trend." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricPanel label="Gross margin" value={formatPercent(latestRatio.grossMargin)} trend={trendFrom(ratios.map((r) => r.grossMargin))} />
          <MetricPanel label="Operating margin" value={formatPercent(latestRatio.operatingMargin)} trend={trendFrom(ratios.map((r) => r.operatingMargin))} />
          <MetricPanel label="EBITDA margin" value={formatPercent(latestRatio.ebitdaMargin)} trend={trendFrom(ratios.map((r) => r.ebitdaMargin))} />
          <MetricPanel label="Net margin" value={formatPercent(latestRatio.netMargin)} trend={trendFrom(ratios.map((r) => r.netMargin))} />
          <MetricPanel label="ROE" value={formatPercent(latestRatio.roe)} trend={trendFrom(ratios.map((r) => r.roe))} />
          <MetricPanel label="ROA" value={formatPercent(latestRatio.roa)} trend={trendFrom(ratios.map((r) => r.roa))} />
          <MetricPanel label="ROIC" value={formatPercent(latestRatio.roic)} trend={trendFrom(ratios.map((r) => r.roic))} />
          <MetricPanel label="Asset turnover" value={formatRatio(latestRatio.assetTurnover)} trend={trendFrom(ratios.map((r) => r.assetTurnover))} />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Growth analysis" description="Growth rates and five-year compound annual growth where historical data permits." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {growth.map((metric) => (
            <div key={metric.key} className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              <div className="mt-2 text-xl font-semibold num">{formatPercent(metric.cagr5y)}</div>
              <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">5Y CAGR</span>
                <ChangeText value={metric.latestGrowth} />
              </div>
              <div className="mt-3"><TrendPill trend={metric.trend} /></div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><TrendingUp className="size-4 text-primary" /> Growth profile: {analysis.growthProfile}</div>
          <p className="mt-1 text-xs text-muted-foreground">The profile is calculated from the historical growth metrics, not generated by AI.</p>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Balance sheet & financial health" description="Liquidity, leverage and capital structure indicators." />
        <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricPanel label="Current ratio" value={formatRatio(latestRatio.currentRatio)} />
            <MetricPanel label="Quick ratio" value={formatRatio(latestRatio.quickRatio)} />
            <MetricPanel label="Cash ratio" value={formatRatio(latestRatio.cashRatio)} />
            <MetricPanel label="Debt / equity" value={formatRatio(latestRatio.debtToEquity)} />
            <MetricPanel label="Debt / EBITDA" value={formatMultiple(latestRatio.debtToEbitda)} />
            <MetricPanel label="Interest coverage" value={formatMultiple(latestRatio.interestCoverage)} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 text-sm font-medium">Cash, debt & equity</div>
            <FinChart
              data={balanceChart}
              xKey="period"
              series={[
                { key: "cash", label: "Cash" },
                { key: "debt", label: "Debt" },
                { key: "equity", label: "Equity" },
              ]}
              valueFormatter={(v) => formatCurrencyCompact(v * 1e6, analysis.company.currency)}
              showLegend
            />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Cash flow" description="Operating cash generation, investment and free cash flow." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Operating cash flow" value={formatCurrencyCompact(latestCashFlow.operatingCashFlow * 1e6, analysis.company.currency)} delta={((latestCashFlow.operatingCashFlow - deltas.cp.operatingCashFlow) / Math.abs(deltas.cp.operatingCashFlow)) * 100} />
          <KpiCard label="Capital expenditure" value={formatCurrencyCompact(latestCashFlow.capex * 1e6, analysis.company.currency)} delta={((latestCashFlow.capex - deltas.cp.capex) / Math.max(Math.abs(deltas.cp.capex), 1)) * 100} />
          <KpiCard label="Free cash flow" value={formatCurrencyCompact(latestCashFlow.freeCashFlow * 1e6, analysis.company.currency)} delta={((latestCashFlow.freeCashFlow - deltas.cp.freeCashFlow) / Math.abs(deltas.cp.freeCashFlow)) * 100} />
          <KpiCard label="FCF conversion" value={formatPercent((latestCashFlow.freeCashFlow / Math.max(latestCashFlow.operatingCashFlow, 1)) * 100)} hint="FCF / operating cash flow" />
        </div>
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="size-4 text-primary" /> Cash-flow highlights</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {cashHighlights.map((highlight) => <li key={highlight}>• {highlight}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Valuation" description="Current multiples versus company history, industry and sector reference points." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ValuationCard label="P / E" value={analysis.valuation.pe} history={analysis.valuation.history.pe} industry={analysis.valuation.industryAverage.pe} sector={analysis.valuation.sectorAverage.pe} />
          <ValuationCard label="EV / EBITDA" value={analysis.valuation.evToEbitda} history={analysis.valuation.history.evToEbitda} industry={analysis.valuation.industryAverage.evToEbitda} sector={analysis.valuation.sectorAverage.evToEbitda} />
          <ValuationCard label="Price / Sales" value={analysis.valuation.priceToSales} history={analysis.valuation.history.priceToSales} industry={analysis.valuation.industryAverage.priceToSales} sector={analysis.valuation.sectorAverage.priceToSales} />
          <ValuationCard label="Price / Book" value={analysis.valuation.priceToBook} history={analysis.valuation.history.priceToBook} industry={analysis.valuation.industryAverage.priceToBook} sector={analysis.valuation.sectorAverage.priceToBook} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricPanel label="Forward P / E" value={formatMultiple(analysis.valuation.forwardPe)} />
          <MetricPanel label="EV / Sales" value={formatMultiple(analysis.valuation.evToSales)} />
          <MetricPanel label="PEG" value={formatRatio(analysis.valuation.peg)} />
          <MetricPanel label="Dividend yield" value={formatPercent(analysis.valuation.dividendYield)} />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="Financial statements" description="Detailed statement line items for the selected reporting period." />
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <StatementTable title="Income statement" rows={[
            ["Revenue", latestIncome.revenue], ["Cost of revenue", latestIncome.costOfRevenue], ["Gross profit", latestIncome.grossProfit], ["Operating expenses", latestIncome.operatingExpenses], ["Operating income", latestIncome.operatingIncome], ["EBITDA", latestIncome.ebitda], ["Interest expense", latestIncome.interestExpense], ["Pre-tax income", latestIncome.pretaxIncome], ["Taxes", latestIncome.taxes], ["Net income", latestIncome.netIncome], ["EPS", latestIncome.eps],
          ]} period={latestIncome.period} currency={analysis.company.currency} />
          <StatementTable title="Balance sheet" rows={[
            ["Cash", latestBalance.cash], ["Accounts receivable", latestBalance.accountsReceivable], ["Inventory", latestBalance.inventory], ["Total current assets", latestBalance.totalCurrentAssets], ["PP&E", latestBalance.ppe], ["Total assets", latestBalance.totalAssets], ["Current liabilities", latestBalance.currentLiabilities], ["Long-term debt", latestBalance.longTermDebt], ["Total liabilities", latestBalance.totalLiabilities], ["Shareholders' equity", latestBalance.shareholdersEquity], ["Total debt", latestBalance.totalDebt],
          ]} period={latestBalance.period} currency={analysis.company.currency} />
          <StatementTable title="Cash flow statement" rows={[
            ["Operating cash flow", latestCashFlow.operatingCashFlow], ["Capital expenditure", latestCashFlow.capex], ["Investing cash flow", latestCashFlow.investingCashFlow], ["Financing cash flow", latestCashFlow.financingCashFlow], ["Free cash flow", latestCashFlow.freeCashFlow],
          ]} period={latestCashFlow.period} currency={analysis.company.currency} />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading title="AI financial health assessment" description="Narrative generation will be connected to the AI layer after the data pipeline is live." />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> Overall assessment</div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{analysis.health.summary}</p>
            <DataBadge provenance={analysis.health.provenance} className="mt-4" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InsightList icon={<TrendingUp className="size-4" />} title="Key strengths" items={analysis.health.strengths} />
            <InsightList icon={<ShieldAlert className="size-4" />} title="Key risks" items={analysis.health.risks} />
          </div>
        </div>
      </section>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">{icon}{title}</div>
      {children}
    </div>
  );
}

function MetricPanel({ label, value, trend }: { label: string; value: string; trend?: "improving" | "stable" | "declining" }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xl font-semibold num">{value}</span>
        {trend && <TrendPill trend={trend} />}
      </div>
    </div>
  );
}

function trendFrom(values: number[]): "improving" | "stable" | "declining" {
  if (values.length < 3) return "stable";
  const first = values[values.length - 3]!;
  const last = values[values.length - 1]!;
  const relative = Math.abs(first) < 1e-9 ? 0 : ((last - first) / Math.abs(first)) * 100;
  if (relative > 3) return "improving";
  if (relative < -3) return "declining";
  return "stable";
}

function ValuationCard({ label, value, history, industry, sector }: { label: string; value: number; history: number; industry: number; sector: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold num">{formatMultiple(value)}</div>
      <div className="mt-3 space-y-2 text-xs">
        <ComparisonRow label="5Y history" value={history} current={value} />
        <ComparisonRow label="Industry" value={industry} current={value} />
        <ComparisonRow label="Sector" value={sector} current={value} />
      </div>
    </div>
  );
}

function ComparisonRow({ label, value, current }: { label: string; value: number; current: number }) {
  const difference = current - value;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="num">{value.toFixed(1)}x <span className={difference > 0 ? "text-loss" : "text-gain"}>({difference > 0 ? "+" : ""}{difference.toFixed(1)})</span></span>
    </div>
  );
}

function StatementTable({ title, rows, period, currency }: { title: string; rows: [string, number][]; period: string; currency: string }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">FY {period} · {currency} millions</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 text-sm">
            <span className={label === "Net income" || label === "Free cash flow" || label === "Total assets" || label === "Shareholders' equity" ? "font-medium" : "text-muted-foreground"}>{label}</span>
            <span className="num tabular-nums">{label === "EPS" ? formatPrice(value, currency) : formatStatementValue(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">{icon}{title}</div>
      <ul className="mt-3 space-y-3 text-xs leading-5 text-muted-foreground">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
