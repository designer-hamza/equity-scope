import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinChart } from "@/components/charts/FinChart";
import {
  CompanyLogo,
  DataBadge,
  DemoNotice,
  SectionHeading,
} from "@/components/finance/primitives";
import { DEMO_COMPANIES } from "@/data/demo-companies";
import { PROVENANCE } from "@/lib/data-provider";
import { buildComparison, relativeRevenueIndex } from "@/lib/screening";
import {
  formatCurrencyCompact,
  formatMultiple,
  formatPercent,
  formatRatio,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Company Comparison — EquityScope" },
      {
        name: "description",
        content:
          "Compare up to five companies across market cap, growth, margins, returns, leverage, cash flow and valuation multiples.",
      },
      { property: "og:title", content: "Company Comparison — EquityScope" },
      {
        property: "og:description",
        content: "Side-by-side metric tables and relative performance charts for peer analysis.",
      },
    ],
  }),
  component: ComparePage,
});

const MAX = 5;

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return formatCurrencyCompact(value * 1e6);
    case "percent":
      return formatPercent(value);
    case "multiple":
      return formatMultiple(value);
    default:
      return formatRatio(value);
  }
}

function ComparePage() {
  const [tickers, setTickers] = useState<string[]>(["AAPL", "MSFT", "NVDA"]);
  const { companies, metrics } = buildComparison(tickers);
  const relative = relativeRevenueIndex(tickers);

  const add = (t: string) => {
    if (tickers.includes(t) || tickers.length >= MAX) return;
    setTickers([...tickers, t]);
  };

  return (
    <AppShell
      title="Company Comparisons"
      subtitle={`Compare up to ${MAX} companies across twelve fundamental metrics.`}
    >
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {companies.map((c) => (
            <span
              key={c.company.ticker}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-2 py-1.5 text-sm"
            >
              <CompanyLogo monogram={c.company.logoMonogram} size="sm" />
              <span className="num">{c.company.ticker}</span>
              <button
                type="button"
                aria-label={`Remove ${c.company.ticker}`}
                onClick={() => setTickers(tickers.filter((t) => t !== c.company.ticker))}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          <Select value="" onValueChange={add} disabled={tickers.length >= MAX}>
            <SelectTrigger className="w-56" aria-label="Add company">
              <SelectValue
                placeholder={tickers.length >= MAX ? "Maximum reached" : "Add company..."}
              />
            </SelectTrigger>
            <SelectContent>
              {DEMO_COMPANIES.filter((c) => !tickers.includes(c.ticker)).map((c) => (
                <SelectItem key={c.ticker} value={c.ticker}>
                  {c.ticker} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tickers.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setTickers([])}>
              Clear all
            </Button>
          )}
        </div>
        <DataBadge provenance={PROVENANCE} className="mt-3" />
      </div>

      {companies.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Add companies to start a comparison.
        </div>
      ) : (
        <>
          <section className="mt-8">
            <SectionHeading
              title="Metric comparison"
              description="Best value in each row is highlighted green, weakest red."
            />
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[160px]">Metric</TableHead>
                    {companies.map((c) => (
                      <TableHead key={c.company.ticker} className="text-right num">
                        {c.company.ticker}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((m) => {
                    const values = Object.values(m.values);
                    const best = m.higherIsBetter ? Math.max(...values) : Math.min(...values);
                    const worst = m.higherIsBetter ? Math.min(...values) : Math.max(...values);
                    return (
                      <TableRow key={m.key}>
                        <TableCell className="text-sm font-medium">{m.label}</TableCell>
                        {companies.map((c) => {
                          const v = m.values[c.company.ticker] ?? 0;
                          return (
                            <TableCell
                              key={c.company.ticker}
                              className={cn(
                                "text-right num text-sm",
                                values.length > 1 && v === best && "bg-gain-soft text-gain",
                                values.length > 1 && v === worst && "bg-loss-soft text-loss",
                              )}
                            >
                              {formatValue(v, m.format)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">Profitability comparison</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                EBITDA margin, net margin and ROE, latest fiscal year.
              </p>
              <FinChart
                kind="bar"
                xKey="ticker"
                height={280}
                showLegend
                data={companies.map((c) => {
                  const r = c.ratios.annual[c.ratios.annual.length - 1]!;
                  return {
                    ticker: c.company.ticker,
                    ebitdaMargin: r.ebitdaMargin,
                    netMargin: r.netMargin,
                    roe: r.roe,
                  };
                })}
                series={[
                  { key: "ebitdaMargin", label: "EBITDA margin" },
                  { key: "netMargin", label: "Net margin" },
                  { key: "roe", label: "ROE" },
                ]}
                valueFormatter={(v) => formatPercent(v)}
              />
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">Relative revenue performance</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Revenue indexed to 100 at the start of the ten-year window.
              </p>
              <FinChart
                kind="line"
                xKey="period"
                height={280}
                showLegend
                data={relative}
                series={companies.map((c) => ({
                  key: c.company.ticker,
                  label: c.company.ticker,
                }))}
                valueFormatter={(v) => v.toFixed(0)}
              />
            </div>
          </section>
        </>
      )}

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
