import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  DataBadge,
  DemoNotice,
  KpiCard,
  SectionHeading,
} from "@/components/finance/primitives";
import { ScreenTable } from "@/components/finance/ScreenTable";
import { useWatchlist } from "@/hooks/use-watchlist";
import { PROVENANCE } from "@/lib/data-provider";
import { screenRows, summarize } from "@/lib/screening";
import { formatMultiple, formatPercent, formatRatio } from "@/lib/format";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — EquityScope" },
      {
        name: "description",
        content:
          "Track companies and monitor growth, profitability, leverage, valuation and financial health scores side by side.",
      },
      { property: "og:title", content: "Watchlist — EquityScope" },
      {
        property: "og:description",
        content: "Your tracked companies with screening metrics and health scores.",
      },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { tickers, toggle, has } = useWatchlist();
  const rows = screenRows(tickers);
  const summary = summarize(tickers);

  return (
    <AppShell
      title="Watchlist"
      subtitle="Companies saved to your research list."
      actions={
        <Button asChild>
          <Link to="/search">
            Find companies <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <DataBadge provenance={PROVENANCE} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Companies" value={String(summary.count)} />
        <KpiCard label="Avg revenue growth" value={formatPercent(summary.avgRevenueGrowth)} />
        <KpiCard label="Avg ROE" value={formatPercent(summary.avgRoe)} />
        <KpiCard label="Avg health score" value={`${Math.round(summary.avgHealth)} / 100`} />
      </div>

      <section className="mt-8">
        <SectionHeading
          title="Tracked companies"
          description={`Average leverage ${formatRatio(summary.avgDebtToEquity)}x debt/equity · average ${formatMultiple(summary.avgPe)} P/E.`}
        />
        <ScreenTable rows={rows} onToggleWatch={toggle} watched={has} />
      </section>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
