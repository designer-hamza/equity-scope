import { Lightbulb } from "lucide-react";
import { FinChart } from "@/components/charts/FinChart";
import { KpiCard, SectionHeading } from "@/components/finance/primitives";
import { formatCurrencyCompact } from "@/lib/format";
import { cashFlowHighlights, pctChange, trendOf } from "@/lib/metrics";
import type { CompanyAnalysis } from "@/types/finance";

const M = 1e6;

export function CashFlowSection({ analysis }: { analysis: CompanyAnalysis }) {
  const cf = analysis.statements.annual.cashFlow;
  const last = cf[cf.length - 1]!;
  const prev = cf[cf.length - 2]!;
  const highlights = cashFlowHighlights(cf);

  const cards = [
    { label: "Operating Cash Flow", key: "operatingCashFlow" },
    { label: "Capital Expenditure", key: "capex" },
    { label: "Free Cash Flow", key: "freeCashFlow" },
    { label: "Financing Cash Flow", key: "financingCashFlow" },
    { label: "Investing Cash Flow", key: "investingCashFlow" },
  ] as const;

  return (
    <section>
      <SectionHeading
        title="Cash flow analysis"
        description="Cash generation, reinvestment and financing across the reported history."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <KpiCard
            key={c.key}
            label={c.label}
            value={formatCurrencyCompact(last[c.key] * M)}
            delta={pctChange(last[c.key], prev[c.key])}
            previous={formatCurrencyCompact(prev[c.key] * M)}
            trend={trendOf(cf.map((x) => x[c.key]))}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Cash flow trend</h3>
          <FinChart
            data={cf.map((x) => ({
              period: x.period,
              operatingCashFlow: x.operatingCashFlow,
              capex: x.capex,
              freeCashFlow: x.freeCashFlow,
            }))}
            xKey="period"
            kind="bar"
            showLegend
            height={300}
            series={[
              { key: "operatingCashFlow", label: "Operating CF" },
              { key: "capex", label: "Capex" },
              { key: "freeCashFlow", label: "Free cash flow" },
            ]}
            valueFormatter={(v) => formatCurrencyCompact(v * M)}
            axisFormatter={(v) => formatCurrencyCompact(v * M)}
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold">Automatically detected changes</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Derived from the underlying statements by the analysis engine.
          </p>
          <ul className="mt-3 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-muted-foreground">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
