import { FinChart } from "@/components/charts/FinChart";
import { KpiCard, SectionHeading } from "@/components/finance/primitives";
import { formatMultiple, formatPercent } from "@/lib/format";
import type { CompanyAnalysis } from "@/types/finance";

export function ValuationSection({ analysis }: { analysis: CompanyAnalysis }) {
  const v = analysis.valuation;

  const cards = [
    { label: "P/E", value: formatMultiple(v.pe) },
    { label: "Forward P/E", value: formatMultiple(v.forwardPe) },
    { label: "Price / Sales", value: formatMultiple(v.priceToSales) },
    { label: "Price / Book", value: formatMultiple(v.priceToBook) },
    { label: "EV / EBITDA", value: formatMultiple(v.evToEbitda) },
    { label: "EV / Sales", value: formatMultiple(v.evToSales) },
    { label: "PEG Ratio", value: v.peg.toFixed(2) },
    { label: "Dividend Yield", value: formatPercent(v.dividendYield, 2) },
  ];

  const comparison = [
    { metric: "P/E", current: v.pe, history: v.history.pe, industry: v.industryAverage.pe, sector: v.sectorAverage.pe },
    {
      metric: "EV/EBITDA",
      current: v.evToEbitda,
      history: v.history.evToEbitda,
      industry: v.industryAverage.evToEbitda,
      sector: v.sectorAverage.evToEbitda,
    },
    {
      metric: "P/S",
      current: v.priceToSales,
      history: v.history.priceToSales,
      industry: v.industryAverage.priceToSales,
      sector: v.sectorAverage.priceToSales,
    },
    {
      metric: "P/B",
      current: v.priceToBook,
      history: v.history.priceToBook,
      industry: v.industryAverage.priceToBook,
      sector: v.sectorAverage.priceToBook,
    },
  ];

  return (
    <section>
      <SectionHeading
        title="Valuation analysis"
        description="Current multiples benchmarked against the company's five-year average, industry and sector."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <KpiCard key={c.label} label={c.label} value={c.value} hint="Trailing, demo dataset" />
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Multiple comparison</h3>
        <FinChart
          data={comparison}
          xKey="metric"
          kind="bar"
          showLegend
          height={300}
          series={[
            { key: "current", label: "Current" },
            { key: "history", label: "5Y average" },
            { key: "industry", label: "Industry avg" },
            { key: "sector", label: "Sector avg" },
          ]}
          valueFormatter={(x) => formatMultiple(x)}
        />
      </div>
    </section>
  );
}
