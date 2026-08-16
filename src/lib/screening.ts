/**
 * Derived view models shared by the dashboard, watchlist and comparison
 * screens. Keeps table/chart components free of financial calculations.
 */
import { DEMO_ANALYSES } from "@/data/demo-companies";
import { growthMetrics, pctChange, safeDiv } from "@/lib/metrics";
import type { CompanyAnalysis } from "@/types/finance";

export interface ScreenRow {
  ticker: string;
  name: string;
  logoMonogram: string;
  sector: string;
  price: number;
  changePct: number;
  marketCap: number;
  revenueGrowth: number;
  epsGrowth: number;
  pe: number;
  roe: number;
  debtToEquity: number;
  healthScore: number;
  healthRating: string;
  lastUpdated: string;
  currency: string;
}

export function toScreenRow(a: CompanyAnalysis): ScreenRow {
  const inc = a.statements.annual.income;
  const last = inc[inc.length - 1]!;
  const prev = inc[inc.length - 2]!;
  const ratios = a.ratios.annual;
  const r = ratios[ratios.length - 1]!;
  return {
    ticker: a.company.ticker,
    name: a.company.name,
    logoMonogram: a.company.logoMonogram,
    sector: a.company.sector,
    price: a.quote.price,
    changePct: a.quote.changePct,
    marketCap: a.quote.marketCap,
    revenueGrowth: pctChange(last.revenue, prev.revenue),
    epsGrowth: pctChange(last.eps, prev.eps),
    pe: a.valuation.pe,
    roe: r.roe,
    debtToEquity: r.debtToEquity,
    healthScore: a.health.overallScore,
    healthRating: a.health.rating,
    lastUpdated: a.quote.provenance.lastUpdated,
    currency: a.company.currency,
  };
}

export function screenRows(tickers: string[]): ScreenRow[] {
  return tickers
    .map((t) => DEMO_ANALYSES[t.toUpperCase()])
    .filter((a): a is CompanyAnalysis => Boolean(a))
    .map(toScreenRow);
}

export interface WatchlistSummary {
  count: number;
  avgRevenueGrowth: number;
  avgNetMargin: number;
  avgRoe: number;
  avgDebtToEquity: number;
  avgPe: number;
  avgHealth: number;
}

export function summarize(tickers: string[]): WatchlistSummary {
  const analyses = tickers
    .map((t) => DEMO_ANALYSES[t.toUpperCase()])
    .filter((a): a is CompanyAnalysis => Boolean(a));
  const n = Math.max(analyses.length, 1);
  const avg = (fn: (a: CompanyAnalysis) => number) =>
    analyses.reduce((s, a) => s + fn(a), 0) / n;
  const lastRatio = (a: CompanyAnalysis) => a.ratios.annual[a.ratios.annual.length - 1]!;
  return {
    count: analyses.length,
    avgRevenueGrowth: avg((a) => {
      const inc = a.statements.annual.income;
      return pctChange(inc[inc.length - 1]!.revenue, inc[inc.length - 2]!.revenue);
    }),
    avgNetMargin: avg((a) => lastRatio(a).netMargin),
    avgRoe: avg((a) => lastRatio(a).roe),
    avgDebtToEquity: avg((a) => lastRatio(a).debtToEquity),
    avgPe: avg((a) => a.valuation.pe),
    avgHealth: avg((a) => a.health.overallScore),
  };
}

export interface ComparisonMetric {
  key: string;
  label: string;
  format: "currency" | "percent" | "multiple" | "ratio";
  higherIsBetter: boolean;
  values: Record<string, number>;
}

export function buildComparison(tickers: string[]): {
  companies: CompanyAnalysis[];
  metrics: ComparisonMetric[];
} {
  const companies = tickers
    .map((t) => DEMO_ANALYSES[t.toUpperCase()])
    .filter((a): a is CompanyAnalysis => Boolean(a));

  const defs: Omit<ComparisonMetric, "values">[] = [
    { key: "marketCap", label: "Market Cap", format: "currency", higherIsBetter: true },
    { key: "revenue", label: "Revenue", format: "currency", higherIsBetter: true },
    { key: "revenueGrowth", label: "Revenue Growth", format: "percent", higherIsBetter: true },
    { key: "ebitdaMargin", label: "EBITDA Margin", format: "percent", higherIsBetter: true },
    { key: "netMargin", label: "Net Margin", format: "percent", higherIsBetter: true },
    { key: "roe", label: "ROE", format: "percent", higherIsBetter: true },
    { key: "roic", label: "ROIC", format: "percent", higherIsBetter: true },
    { key: "debtToEquity", label: "Debt / Equity", format: "ratio", higherIsBetter: false },
    { key: "fcf", label: "Free Cash Flow", format: "currency", higherIsBetter: true },
    { key: "pe", label: "P/E", format: "multiple", higherIsBetter: false },
    { key: "evToEbitda", label: "EV / EBITDA", format: "multiple", higherIsBetter: false },
    { key: "dividendYield", label: "Dividend Yield", format: "percent", higherIsBetter: true },
  ];

  const valueFor = (a: CompanyAnalysis, key: string): number => {
    const inc = a.statements.annual.income;
    const cf = a.statements.annual.cashFlow;
    const last = inc[inc.length - 1]!;
    const prev = inc[inc.length - 2]!;
    const r = a.ratios.annual[a.ratios.annual.length - 1]!;
    switch (key) {
      case "marketCap":
        return a.quote.marketCap / 1e6;
      case "revenue":
        return last.revenue;
      case "revenueGrowth":
        return pctChange(last.revenue, prev.revenue);
      case "ebitdaMargin":
        return r.ebitdaMargin;
      case "netMargin":
        return r.netMargin;
      case "roe":
        return r.roe;
      case "roic":
        return r.roic;
      case "debtToEquity":
        return r.debtToEquity;
      case "fcf":
        return cf[cf.length - 1]!.freeCashFlow;
      case "pe":
        return a.valuation.pe;
      case "evToEbitda":
        return a.valuation.evToEbitda;
      case "dividendYield":
        return a.valuation.dividendYield;
      default:
        return 0;
    }
  };

  const metrics: ComparisonMetric[] = defs.map((d) => ({
    ...d,
    values: Object.fromEntries(companies.map((c) => [c.company.ticker, valueFor(c, d.key)])),
  }));

  return { companies, metrics };
}

/** Relative performance: each company's revenue indexed to 100 at the start. */
export function relativeRevenueIndex(tickers: string[]) {
  const analyses = tickers
    .map((t) => DEMO_ANALYSES[t.toUpperCase()])
    .filter((a): a is CompanyAnalysis => Boolean(a));
  if (!analyses.length) return [];
  const periods = analyses[0]!.statements.annual.income.map((i) => i.period);
  return periods.map((period, idx) => {
    const row: Record<string, string | number> = { period };
    analyses.forEach((a) => {
      const inc = a.statements.annual.income;
      const base = inc[0]!.revenue;
      row[a.company.ticker] = safeDiv(inc[idx]!.revenue, base) * 100;
    });
    return row;
  });
}

export function growthOf(a: CompanyAnalysis) {
  return growthMetrics(a.statements.annual);
}
