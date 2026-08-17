import { useState } from "react";
import { FinChart } from "@/components/charts/FinChart";
import { SectionHeading } from "@/components/finance/primitives";
import { Button } from "@/components/ui/button";
import { formatCurrencyCompact } from "@/lib/format";
import type { CompanyAnalysis, Period, RangeKey } from "@/types/finance";

const M = 1e6;

export function PerformanceSection({ analysis }: { analysis: CompanyAnalysis }) {
  const [period, setPeriod] = useState<Period>("annual");
  const [range, setRange] = useState<RangeKey>("10Y");

  const statements = analysis.statements[period];
  const limit = period === "quarterly" ? statements.income.length : range === "5Y" ? 5 : 10;
  const income = statements.income.slice(-limit);
  const cashFlow = statements.cashFlow.slice(-limit);

  const charts = [
    {
      title: "Revenue",
      data: income.map((i) => ({ period: i.period, value: i.revenue })),
      kind: "bar" as const,
    },
    {
      title: "Net Income",
      data: income.map((i) => ({ period: i.period, value: i.netIncome })),
      kind: "bar" as const,
    },
    {
      title: "EBITDA",
      data: income.map((i) => ({ period: i.period, value: i.ebitda })),
      kind: "area" as const,
    },
    {
      title: "Free Cash Flow",
      data: cashFlow.map((c) => ({ period: c.period, value: c.freeCashFlow })),
      kind: "area" as const,
    },
  ];

  return (
    <section>
      <SectionHeading
        title="Financial performance"
        description="Reported results across the selected window. Hover any point for exact values."
        action={
          <div className="flex flex-wrap gap-1.5">
            {(["5Y", "10Y"] as RangeKey[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r && period === "annual" ? "default" : "outline"}
                disabled={period === "quarterly"}
                onClick={() => setRange(r)}
              >
                {r}
              </Button>
            ))}
            {(["annual", "quarterly"] as Period[]).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "outline"}
                onClick={() => setPeriod(p)}
                className="capitalize"
              >
                {p}
              </Button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {charts.map((c) => (
          <div key={c.title} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <span className="label-xs">{period === "annual" ? `${range} annual` : "Quarterly"}</span>
            </div>
            <FinChart
              data={c.data}
              xKey="period"
              kind={c.kind}
              height={230}
              series={[{ key: "value", label: c.title }]}
              valueFormatter={(v) => formatCurrencyCompact(v * M)}
              axisFormatter={(v) => formatCurrencyCompact(v * M)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
