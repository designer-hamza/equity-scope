/**
 * Analysis engine. Pure functions that turn financial statements into ratios,
 * growth figures, trend classifications and a financial-health score.
 * Presentation components must not perform financial math themselves.
 */
import type {
  BalanceSheet,
  CashFlowStatement,
  FinancialStatements,
  GrowthProfile,
  HealthAssessment,
  HealthCategory,
  IncomeStatement,
  RatioSnapshot,
  TrendDirection,
  ValuationSnapshot,
} from "@/types/finance";

export function pctChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function cagr(first: number, last: number, years: number): number {
  if (first <= 0 || years <= 0) return 0;
  return (Math.pow(last / first, 1 / years) - 1) * 100;
}

export function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export function trendOf(series: number[], higherIsBetter = true): TrendDirection {
  if (series.length < 3) return "stable";
  const recent = series.slice(-3);
  const delta = recent[recent.length - 1]! - recent[0]!;
  const scale = Math.max(Math.abs(recent[0]!), 1e-6);
  const rel = (delta / scale) * 100;
  const threshold = 3;
  if (Math.abs(rel) < threshold) return "stable";
  const positive = rel > 0;
  return positive === higherIsBetter ? "improving" : "declining";
}

export function computeRatios(statements: FinancialStatements): RatioSnapshot[] {
  const { income, balance } = statements;
  return income.map((inc, i) => {
    const bs = (balance[i] ?? balance[balance.length - 1])!;
    const prevBs = balance[i - 1] ?? bs;
    const avgAssets = (bs.totalAssets + prevBs.totalAssets) / 2;
    const avgEquity = (bs.shareholdersEquity + prevBs.shareholdersEquity) / 2;
    const investedCapital = bs.shareholdersEquity + bs.totalDebt - bs.cash;
    const nopat = inc.operatingIncome * (1 - safeDiv(inc.taxes, inc.pretaxIncome));
    return {
      period: inc.period,
      grossMargin: safeDiv(inc.grossProfit, inc.revenue) * 100,
      operatingMargin: safeDiv(inc.operatingIncome, inc.revenue) * 100,
      ebitdaMargin: safeDiv(inc.ebitda, inc.revenue) * 100,
      netMargin: safeDiv(inc.netIncome, inc.revenue) * 100,
      roa: safeDiv(inc.netIncome, avgAssets) * 100,
      roe: safeDiv(inc.netIncome, avgEquity) * 100,
      roic: safeDiv(nopat, investedCapital) * 100,
      currentRatio: safeDiv(bs.totalCurrentAssets, bs.currentLiabilities),
      quickRatio: safeDiv(bs.totalCurrentAssets - bs.inventory, bs.currentLiabilities),
      cashRatio: safeDiv(bs.cash, bs.currentLiabilities),
      debtToEquity: safeDiv(bs.totalDebt, bs.shareholdersEquity),
      debtToEbitda: safeDiv(bs.totalDebt, inc.ebitda),
      interestCoverage: safeDiv(inc.operatingIncome, Math.max(inc.interestExpense, 1)),
      assetTurnover: safeDiv(inc.revenue, avgAssets),
      inventoryTurnover: safeDiv(inc.costOfRevenue, Math.max(bs.inventory, 1)),
    } satisfies RatioSnapshot;
  });
}

export interface GrowthMetric {
  key: string;
  label: string;
  latestGrowth: number;
  cagr5y: number;
  trend: TrendDirection;
  series: { period: string; value: number }[];
}

export function growthMetrics(statements: FinancialStatements): GrowthMetric[] {
  const { income, balance, cashFlow } = statements;
  const build = (
    key: string,
    label: string,
    values: { period: string; value: number }[],
  ): GrowthMetric => {
    const n = values.length;
    const latestGrowth = n > 1 ? pctChange(values[n - 1]!.value, values[n - 2]!.value) : 0;
    const span = Math.min(5, n - 1);
    const c = cagr(values[n - 1 - span]?.value ?? values[0]!.value, values[n - 1]!.value, span);
    const growthSeries = values
      .slice(1)
      .map((v, i) => pctChange(v.value, values[i]!.value));
    return { key, label, latestGrowth, cagr5y: c, trend: trendOf(growthSeries), series: values };
  };

  return [
    build("revenue", "Revenue", income.map((i) => ({ period: i.period, value: i.revenue }))),
    build("eps", "EPS", income.map((i) => ({ period: i.period, value: i.eps }))),
    build("ebitda", "EBITDA", income.map((i) => ({ period: i.period, value: i.ebitda }))),
    build(
      "fcf",
      "Free Cash Flow",
      cashFlow.map((c) => ({ period: c.period, value: c.freeCashFlow })),
    ),
    build(
      "bookValue",
      "Book Value",
      balance.map((b) => ({ period: b.period, value: b.shareholdersEquity })),
    ),
  ];
}

export function growthProfileFrom(metrics: GrowthMetric[]): GrowthProfile {
  const avg = metrics.reduce((s, m) => s + m.cagr5y, 0) / Math.max(metrics.length, 1);
  if (avg >= 15) return "Strong Growth";
  if (avg >= 7) return "Moderate Growth";
  if (avg >= 0) return "Stable";
  return "Declining";
}

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const scale = (v: number, low: number, high: number) => clamp(((v - low) / (high - low)) * 100);

function ratingFor(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Adequate";
  if (score >= 40) return "Watch";
  return "Weak";
}

/**
 * Rule-based health scoring. This is the deterministic layer that a future
 * AI analysis service will annotate with narrative text — the shape of the
 * returned object stays identical.
 */
export function assessHealth(
  statements: FinancialStatements,
  ratios: RatioSnapshot[],
  valuation: ValuationSnapshot,
  metrics: GrowthMetric[],
  lastUpdated: string,
): HealthAssessment {
  const r = ratios[ratios.length - 1]!;
  const cf = statements.cashFlow[statements.cashFlow.length - 1]!;
  const inc = statements.income[statements.income.length - 1]!;

  const profitability = clamp(
    0.4 * scale(r.netMargin, 0, 30) + 0.3 * scale(r.roe, 5, 60) + 0.3 * scale(r.roic, 5, 45),
  );
  const growth = clamp(
    0.5 * scale(metrics[0]!.cagr5y, -5, 25) + 0.5 * scale(metrics[1]!.cagr5y, -5, 30),
  );
  const liquidity = clamp(
    0.5 * scale(r.currentRatio, 0.6, 2.5) + 0.5 * scale(r.quickRatio, 0.4, 2),
  );
  const leverage = clamp(
    0.5 * (100 - scale(r.debtToEquity, 0, 3)) + 0.5 * scale(r.interestCoverage, 2, 40),
  );
  const cashFlowScore = clamp(
    0.6 * scale(safeDiv(cf.freeCashFlow, inc.revenue) * 100, 0, 30) +
      0.4 * scale(safeDiv(cf.freeCashFlow, cf.operatingCashFlow) * 100, 40, 95),
  );
  const valuationScore = clamp(
    0.5 * (100 - scale(valuation.pe, 8, 55)) + 0.5 * (100 - scale(valuation.evToEbitda, 5, 35)),
  );

  const categories: HealthCategory[] = [
    {
      key: "profitability",
      label: "Profitability",
      score: profitability,
      rating: ratingFor(profitability),
      explanation: `Net margin of ${r.netMargin.toFixed(1)}% with ROE at ${r.roe.toFixed(1)}% and ROIC at ${r.roic.toFixed(1)}%.`,
    },
    {
      key: "growth",
      label: "Growth",
      score: growth,
      rating: ratingFor(growth),
      explanation: `Revenue compounding at ${metrics[0]!.cagr5y.toFixed(1)}% and EPS at ${metrics[1]!.cagr5y.toFixed(1)}% over five years.`,
    },
    {
      key: "liquidity",
      label: "Liquidity",
      score: liquidity,
      rating: ratingFor(liquidity),
      explanation: `Current ratio ${r.currentRatio.toFixed(2)}, quick ratio ${r.quickRatio.toFixed(2)}.`,
    },
    {
      key: "leverage",
      label: "Leverage",
      score: leverage,
      rating: ratingFor(leverage),
      explanation: `Debt/equity ${r.debtToEquity.toFixed(2)} with interest coverage of ${r.interestCoverage.toFixed(1)}x.`,
    },
    {
      key: "cashFlow",
      label: "Cash Flow",
      score: cashFlowScore,
      rating: ratingFor(cashFlowScore),
      explanation: `Free cash flow converts ${(safeDiv(cf.freeCashFlow, cf.operatingCashFlow) * 100).toFixed(0)}% of operating cash flow.`,
    },
    {
      key: "valuation",
      label: "Valuation",
      score: valuationScore,
      rating: ratingFor(valuationScore),
      explanation: `Trading at ${valuation.pe.toFixed(1)}x earnings and ${valuation.evToEbitda.toFixed(1)}x EV/EBITDA.`,
    },
  ];

  const weights: Record<string, number> = {
    profitability: 0.24,
    growth: 0.2,
    liquidity: 0.12,
    leverage: 0.14,
    cashFlow: 0.2,
    valuation: 0.1,
  };
  const overallScore = clamp(
    categories.reduce((s, c) => s + c.score * weights[c.key]!, 0),
  );

  const ranked = [...categories].sort((a, b) => b.score - a.score);
  const strengths = ranked.slice(0, 3).map((c) => `${c.label}: ${c.explanation}`);
  const risks = ranked
    .slice(-3)
    .reverse()
    .map((c) => `${c.label}: ${c.explanation}`);

  return {
    overallScore,
    rating: ratingFor(overallScore),
    summary: `Rule-based assessment across six dimensions. ${ratingFor(overallScore)} overall profile driven by ${ranked[0]!.label.toLowerCase()} and constrained by ${ranked[ranked.length - 1]!.label.toLowerCase()}.`,
    categories,
    strengths,
    risks,
    provenance: {
      kind: "ai",
      source: "Demo analysis engine (no AI model connected yet)",
      lastUpdated,
    },
  };
}

/** Auto-generated narrative highlights for the cash-flow section. */
export function cashFlowHighlights(cashFlow: CashFlowStatement[]): string[] {
  if (cashFlow.length < 4) return [];
  const last = cashFlow[cashFlow.length - 1]!;
  const threeAgo = cashFlow[cashFlow.length - 4]!;
  const fcfChange = pctChange(last.freeCashFlow, threeAgo.freeCashFlow);
  const capexChange = pctChange(Math.abs(last.capex), Math.abs(threeAgo.capex));
  const out: string[] = [];
  out.push(
    fcfChange >= 15
      ? `Free cash flow has improved significantly over the last three years (${fcfChange.toFixed(0)}%).`
      : fcfChange <= -15
        ? `Free cash flow has contracted over the last three years (${fcfChange.toFixed(0)}%).`
        : `Free cash flow has been broadly stable over the last three years (${fcfChange.toFixed(0)}%).`,
  );
  out.push(
    `Capital expenditure is ${capexChange >= 0 ? "up" : "down"} ${Math.abs(capexChange).toFixed(0)}% versus three years ago.`,
  );
  out.push(
    `Free cash flow conversion currently stands at ${(safeDiv(last.freeCashFlow, last.operatingCashFlow) * 100).toFixed(0)}% of operating cash flow.`,
  );
  return out;
}

export function overviewDeltas(
  income: IncomeStatement[],
  balance: BalanceSheet[],
  cashFlow: CashFlowStatement[],
) {
  const i = income[income.length - 1]!;
  const ip = income[income.length - 2]!;
  const b = balance[balance.length - 1]!;
  const bp = balance[balance.length - 2]!;
  const c = cashFlow[cashFlow.length - 1]!;
  const cp = cashFlow[cashFlow.length - 2]!;
  return { i, ip, b, bp, c, cp };
}
