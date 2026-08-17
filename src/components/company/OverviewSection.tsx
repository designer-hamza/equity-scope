import { KpiCard, SectionHeading } from "@/components/finance/primitives";
import { formatCurrencyCompact, formatPrice } from "@/lib/format";
import { overviewDeltas, pctChange } from "@/lib/metrics";
import type { CompanyAnalysis } from "@/types/finance";

const M = 1e6;

export function OverviewSection({ analysis }: { analysis: CompanyAnalysis }) {
  const { income, balance, cashFlow } = analysis.statements.annual;
  const { i, ip, b, bp, c, cp } = overviewDeltas(income, balance, cashFlow);
  const q = analysis.quote;

  const cards = [
    { label: "Market Cap", value: q.marketCap, previous: null as number | null, kind: "currency" },
    { label: "Enterprise Value", value: q.enterpriseValue, previous: null, kind: "currency" },
    { label: "Revenue", value: i.revenue * M, previous: ip.revenue * M, kind: "currency" },
    { label: "EBITDA", value: i.ebitda * M, previous: ip.ebitda * M, kind: "currency" },
    { label: "Net Income", value: i.netIncome * M, previous: ip.netIncome * M, kind: "currency" },
    { label: "EPS", value: i.eps, previous: ip.eps, kind: "price" },
    {
      label: "Free Cash Flow",
      value: c.freeCashFlow * M,
      previous: cp.freeCashFlow * M,
      kind: "currency",
    },
    { label: "Cash", value: b.cash * M, previous: bp.cash * M, kind: "currency" },
    { label: "Total Debt", value: b.totalDebt * M, previous: bp.totalDebt * M, kind: "currency" },
  ];

  const fmt = (v: number, kind: string) =>
    kind === "price" ? formatPrice(v, analysis.company.currency) : formatCurrencyCompact(v);

  return (
    <section>
      <SectionHeading
        title="Company overview"
        description={`Latest reported fiscal year (${i.period}) versus the prior year.`}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {cards.map((card) => {
          const delta =
            card.previous !== null ? pctChange(card.value, card.previous) : undefined;
          const trend =
            delta === undefined ? undefined : delta > 2 ? "improving" : delta < -2 ? "declining" : "stable";
          return (
            <KpiCard
              key={card.label}
              label={card.label}
              value={fmt(card.value, card.kind)}
              {...(delta !== undefined ? { delta } : {})}
              {...(card.previous !== null
                ? { previous: fmt(card.previous, card.kind) }
                : { hint: "Point-in-time, demo dataset" })}
              {...(trend ? { trend } : {})}
            />
          );
        })}
      </div>
    </section>
  );
}
