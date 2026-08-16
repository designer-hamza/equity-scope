import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { FinChart } from "@/components/charts/FinChart";
import {
  ChangeText,
  DataBadge,
  DemoNotice,
  KpiCard,
  SectionHeading,
} from "@/components/finance/primitives";
import { ScreenTable } from "@/components/finance/ScreenTable";
import { useWatchlist } from "@/hooks/use-watchlist";
import { marketOverviewQuery, PROVENANCE } from "@/lib/data-provider";
import { screenRows, summarize } from "@/lib/screening";
import { formatMultiple, formatPercent, formatRatio } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EquityScope" },
      {
        name: "description",
        content:
          "Overview of tracked companies: aggregate growth, margins, returns, leverage and valuation with a live watchlist table.",
      },
      { property: "og:title", content: "Dashboard — EquityScope" },
      {
        property: "og:description",
        content: "Watchlist summary, screening table and market overview in one workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tickers, toggle, has } = useWatchlist();
  const rows = screenRows(tickers);
  const summary = summarize(tickers);
  const { data: market } = useSuspenseQuery(marketOverviewQuery());

  return (
    <AppShell
      title="Dashboard"
      subtitle="Aggregate view of the companies you track."
      actions={
        <Button asChild variant="outline">
          <Link to="/search">
            Add companies <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <DataBadge provenance={PROVENANCE} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Companies tracked" value={String(summary.count)} hint="In watchlist" />
        <KpiCard
          label="Avg revenue growth"
          value={formatPercent(summary.avgRevenueGrowth)}
          hint="Latest fiscal year"
        />
        <KpiCard
          label="Avg profit margin"
          value={formatPercent(summary.avgNetMargin)}
          hint="Net margin"
        />
        <KpiCard label="Avg ROE" value={formatPercent(summary.avgRoe)} hint="Return on equity" />
        <KpiCard
          label="Avg debt / equity"
          value={formatRatio(summary.avgDebtToEquity)}
          hint="Balance sheet"
        />
        <KpiCard
          label="Avg valuation"
          value={formatMultiple(summary.avgPe)}
          hint="Trailing P/E"
        />
      </div>

      <section className="mt-8">
        <SectionHeading
          title="Watchlist"
          description="Key screening metrics for every company you follow."
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/watchlist">Manage watchlist</Link>
            </Button>
          }
        />
        <ScreenTable rows={rows} onToggleWatch={toggle} watched={has} />
      </section>

      <section className="mt-8">
        <SectionHeading
          title="Market overview"
          description="Index levels, sector dispersion and daily movers."
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/market">Full market view</Link>
            </Button>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {market.indices.map((idx) => (
            <div key={idx.symbol} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{idx.name}</span>
                <ChangeText value={idx.changePct} className="text-xs" />
              </div>
              <div className="mt-1 text-xl font-semibold num">
                {idx.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
              <FinChart
                data={idx.series}
                xKey="period"
                kind="area"
                height={70}
                series={[{ key: "value", label: idx.name }]}
                valueFormatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              />
            </div>
          ))}
        </div>
      </section>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
