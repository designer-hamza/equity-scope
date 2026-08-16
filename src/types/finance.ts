/**
 * Domain model for the platform. These interfaces are the contract between the
 * UI and the data layer (`src/lib/data-provider.ts`). Today they are fulfilled by
 * demo fixtures; later the same shapes will be produced by the backend/API layer
 * (financial data provider -> cache/database -> analysis engine -> AI layer).
 */

export type DataSourceKind =
  | "live"
  | "delayed"
  | "historical"
  | "estimate"
  | "ai"
  | "demo";

export interface DataProvenance {
  /** What kind of data this is, so the UI never implies live prices. */
  kind: DataSourceKind;
  /** Human readable source, e.g. "Demo dataset" or "Financial Data API". */
  source: string;
  /** ISO timestamp of the last refresh. */
  lastUpdated: string;
}

export interface Company {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  description: string;
  employees: number;
  founded: number;
  website: string;
  /** Two-letter monogram used by the logo placeholder. */
  logoMonogram: string;
}

export interface Quote {
  ticker: string;
  price: number;
  changeAbs: number;
  changePct: number;
  marketCap: number;
  enterpriseValue: number;
  volume: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  provenance: DataProvenance;
}

export type Period = "annual" | "quarterly";
export type RangeKey = "5Y" | "10Y";

export interface IncomeStatement {
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  ebitda: number;
  interestExpense: number;
  pretaxIncome: number;
  taxes: number;
  netIncome: number;
  eps: number;
}

export interface BalanceSheet {
  period: string;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  ppe: number;
  totalAssets: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  totalDebt: number;
}

export interface CashFlowStatement {
  period: string;
  operatingCashFlow: number;
  capex: number;
  investingCashFlow: number;
  financingCashFlow: number;
  freeCashFlow: number;
}

export interface FinancialStatements {
  income: IncomeStatement[];
  balance: BalanceSheet[];
  cashFlow: CashFlowStatement[];
}

export interface RatioSnapshot {
  period: string;
  grossMargin: number;
  operatingMargin: number;
  ebitdaMargin: number;
  netMargin: number;
  roa: number;
  roe: number;
  roic: number;
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  debtToEquity: number;
  debtToEbitda: number;
  interestCoverage: number;
  assetTurnover: number;
  inventoryTurnover: number;
}

export interface ValuationSnapshot {
  pe: number;
  forwardPe: number;
  priceToSales: number;
  priceToBook: number;
  evToEbitda: number;
  evToSales: number;
  peg: number;
  dividendYield: number;
  /** Company's own 5-year average, for the "vs history" comparison. */
  history: { pe: number; evToEbitda: number; priceToSales: number; priceToBook: number };
  industryAverage: { pe: number; evToEbitda: number; priceToSales: number; priceToBook: number };
  sectorAverage: { pe: number; evToEbitda: number; priceToSales: number; priceToBook: number };
}

export type TrendDirection = "improving" | "stable" | "declining";
export type GrowthProfile = "Strong Growth" | "Moderate Growth" | "Stable" | "Declining";

export interface HealthCategory {
  key: "profitability" | "growth" | "liquidity" | "leverage" | "cashFlow" | "valuation";
  label: string;
  score: number;
  rating: string;
  explanation: string;
}

export interface HealthAssessment {
  overallScore: number;
  rating: string;
  summary: string;
  categories: HealthCategory[];
  strengths: string[];
  risks: string[];
  provenance: DataProvenance;
}

export interface CompanyAnalysis {
  company: Company;
  quote: Quote;
  statements: Record<Period, FinancialStatements>;
  ratios: Record<Period, RatioSnapshot[]>;
  valuation: ValuationSnapshot;
  growthProfile: GrowthProfile;
  health: HealthAssessment;
  provenance: DataProvenance;
}

export interface WatchlistEntry {
  ticker: string;
  addedAt: string;
}

export interface SavedAnalysis {
  id: string;
  ticker: string;
  title: string;
  createdAt: string;
  kind: "Full report" | "Valuation note" | "Screening";
  note: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  changePct: number;
  series: { period: string; value: number }[];
}

export interface SectorPerformance {
  sector: string;
  changePct: number;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
}

export interface MarketOverview {
  indices: MarketIndex[];
  sectors: SectorPerformance[];
  gainers: MarketMover[];
  losers: MarketMover[];
  provenance: DataProvenance;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: string;
  initials: string;
}
