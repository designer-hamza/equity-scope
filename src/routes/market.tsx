import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { FinChart } from "@/components/charts/FinChart";
import {
  ChangeText,
  DataBadge,
  DemoNotice,
  SectionHeading,
} from "@/components/finance/primitives";
import { marketOverviewQuery } from "@/lib/data-provider";
import { formatPercent, formatPrice } from "@/lib/format";
import type { MarketMover } from "@/types/finance";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Overview — EquityScope" },
      {
        name: "description",
        content:
          "Index levels, sector performance and the day's largest gainers and losers across the coverage universe.",
      },
      { property: "og:title", content: "Market Overview — EquityScope" },
      {
        property: "og:description",
        content: "Indices, sector dispersion and daily movers at a glance.",
      },
    ],
  }),
  component: MarketPage,
});

function MoverList({ title, movers }: { title: string; movers: MarketMover[] }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3 text-sm font-semibold">{title}</div>
      <ul className="divide-y divide-border">
        {movers.map((m) => (
          <li key={m.ticker}>
            <Link
              to="/company/$ticker"
              params={{ ticker: m.ticker }}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{m.name}</span>
                <span className="block text-xs text-muted-foreground num">{m.ticker}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm num">{formatPrice(m.price)}</span>
                <ChangeText value={m.changePct} className="text-xs" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketPage() {
  const { data: market } = useSuspenseQuery(marketOverviewQuery());

  return (
    <AppShell title="Market Overview" subtitle="Index, sector and single-stock context.">
      <DataBadge provenance={market.provenance} />

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {market.indices.map((idx) => (
          <div key={idx.symbol} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">{idx.name}</span>
              <span className="label-xs">{idx.symbol}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-semibold num">
                {idx.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
              <ChangeText value={idx.changePct} className="text-xs" />
            </div>
            <FinChart
              data={idx.series}
              xKey="period"
              kind="area"
              height={90}
              series={[{ key: "value", label: idx.name }]}
              valueFormatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            />
          </div>
        ))}
      </section>

      <section className="mt-8">
        <SectionHeading
          title="Sector performance"
          description="Daily percentage change by GICS-style sector grouping."
        />
        <div className="rounded-lg border border-border bg-card p-4">
          <FinChart
            data={market.sectors as unknown as Record<string, string | number>[]}
            xKey="sector"
            kind="bar"
            layout="vertical"
            height={340}
            colorByValue
            series={[{ key: "changePct", label: "Change" }]}
            valueFormatter={(v) => formatPercent(v, 2, true)}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <MoverList title="Top gainers" movers={market.gainers} />
        <MoverList title="Top losers" movers={market.losers} />
      </section>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
