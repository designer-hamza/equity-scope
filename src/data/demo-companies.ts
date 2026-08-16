/**
 * DEMO DATASET — deterministic, illustrative figures only.
 *
 * Nothing in this file is live or delayed market data. It exists so the UI can
 * be developed against the same shapes a real financial-data provider will
 * return. Replace `src/lib/data-provider.ts` internals with API calls and this
 * file can be deleted without touching a single component.
 */
import type {
  BalanceSheet,
  CashFlowStatement,
  CompanyAnalysis,
  Company,
  FinancialStatements,
  IncomeStatement,
  MarketOverview,
  Period,
  Quote,
  SavedAnalysis,
  UserProfile,
  ValuationSnapshot,
} from "@/types/finance";
import {
  assessHealth,
  computeRatios,
  growthMetrics,
  growthProfileFrom,
} from "@/lib/metrics";

export const DEMO_LAST_UPDATED = "2026-08-16T16:05:00.000Z";

export const DEMO_PROVENANCE = {
  kind: "demo" as const,
  source: "Demo dataset — not market data",
  lastUpdated: DEMO_LAST_UPDATED,
};

interface CompanySpec extends Omit<Company, "id" | "logoMonogram"> {
  price: number;
  changePct: number;
  /** Diluted shares outstanding, millions. */
  shares: number;
  /** Latest fiscal-year revenue, millions. */
  revenue: number;
  revenueCagr: number;
  grossMargin: number;
  operatingMargin: number;
  ebitdaMargin: number;
  netMargin: number;
  cashOfRevenue: number;
  debtOfRevenue: number;
  assetsOfRevenue: number;
  equityShare: number;
  capexOfRevenue: number;
  dividendYield: number;
  volatility: number;
}

const specs: CompanySpec[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    country: "United States",
    currency: "USD",
    description:
      "Designs and sells smartphones, personal computers, wearables and services, with an increasingly software- and subscription-weighted revenue mix.",
    employees: 164000,
    founded: 1976,
    website: "apple.com",
    price: 241.32,
    changePct: 0.84,
    shares: 14850,
    revenue: 402500,
    revenueCagr: 0.072,
    grossMargin: 0.463,
    operatingMargin: 0.317,
    ebitdaMargin: 0.351,
    netMargin: 0.268,
    cashOfRevenue: 0.16,
    debtOfRevenue: 0.24,
    assetsOfRevenue: 0.92,
    equityShare: 0.19,
    capexOfRevenue: 0.031,
    dividendYield: 0.44,
    volatility: 0.02,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software — Infrastructure",
    country: "United States",
    currency: "USD",
    description:
      "Cloud infrastructure, productivity software and enterprise platforms, with AI services increasingly embedded across the portfolio.",
    employees: 228000,
    founded: 1975,
    website: "microsoft.com",
    price: 486.9,
    changePct: -0.42,
    shares: 7430,
    revenue: 298000,
    revenueCagr: 0.14,
    grossMargin: 0.695,
    operatingMargin: 0.446,
    ebitdaMargin: 0.53,
    netMargin: 0.358,
    cashOfRevenue: 0.25,
    debtOfRevenue: 0.21,
    assetsOfRevenue: 1.75,
    equityShare: 0.53,
    capexOfRevenue: 0.19,
    dividendYield: 0.68,
    volatility: 0.03,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    country: "United States",
    currency: "USD",
    description:
      "Accelerated computing platforms spanning data-center GPUs, networking and software for AI training and inference workloads.",
    employees: 33000,
    founded: 1993,
    website: "nvidia.com",
    price: 178.24,
    changePct: 2.31,
    shares: 24400,
    revenue: 196500,
    revenueCagr: 0.52,
    grossMargin: 0.742,
    operatingMargin: 0.612,
    ebitdaMargin: 0.638,
    netMargin: 0.531,
    cashOfRevenue: 0.29,
    debtOfRevenue: 0.05,
    assetsOfRevenue: 0.68,
    equityShare: 0.75,
    capexOfRevenue: 0.023,
    dividendYield: 0.03,
    volatility: 0.06,
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    country: "United States",
    currency: "USD",
    description:
      "Electric vehicles, energy storage and solar generation, with growing exposure to autonomy software and grid-scale storage.",
    employees: 141000,
    founded: 2003,
    website: "tesla.com",
    price: 322.15,
    changePct: -1.64,
    shares: 3350,
    revenue: 108400,
    revenueCagr: 0.29,
    grossMargin: 0.178,
    operatingMargin: 0.079,
    ebitdaMargin: 0.132,
    netMargin: 0.071,
    cashOfRevenue: 0.31,
    debtOfRevenue: 0.12,
    assetsOfRevenue: 1.28,
    equityShare: 0.66,
    capexOfRevenue: 0.105,
    dividendYield: 0,
    volatility: 0.08,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Internet Retail",
    country: "United States",
    currency: "USD",
    description:
      "E-commerce marketplaces, logistics, advertising and AWS cloud infrastructure across North America and international markets.",
    employees: 1560000,
    founded: 1994,
    website: "amazon.com",
    price: 214.68,
    changePct: 0.29,
    shares: 10700,
    revenue: 712000,
    revenueCagr: 0.115,
    grossMargin: 0.492,
    operatingMargin: 0.114,
    ebitdaMargin: 0.183,
    netMargin: 0.082,
    cashOfRevenue: 0.11,
    debtOfRevenue: 0.13,
    assetsOfRevenue: 0.95,
    equityShare: 0.48,
    capexOfRevenue: 0.11,
    dividendYield: 0,
    volatility: 0.04,
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    sector: "Financial Services",
    industry: "Banks — Diversified",
    country: "United States",
    currency: "USD",
    description:
      "Diversified banking franchise spanning consumer banking, corporate and investment banking, commercial banking and asset management.",
    employees: 317000,
    founded: 1799,
    website: "jpmorganchase.com",
    price: 268.4,
    changePct: 0.11,
    shares: 2760,
    revenue: 182000,
    revenueCagr: 0.078,
    grossMargin: 0.61,
    operatingMargin: 0.412,
    ebitdaMargin: 0.44,
    netMargin: 0.316,
    cashOfRevenue: 1.6,
    debtOfRevenue: 2.4,
    assetsOfRevenue: 22,
    equityShare: 0.09,
    capexOfRevenue: 0.02,
    dividendYield: 2.1,
    volatility: 0.03,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    sector: "Communication Services",
    industry: "Internet Content & Information",
    country: "United States",
    currency: "USD",
    description:
      "Search, advertising, YouTube, Android and Google Cloud, alongside longer-horizon bets in AI research and autonomous mobility.",
    employees: 187000,
    founded: 1998,
    website: "abc.xyz",
    price: 198.72,
    changePct: 1.06,
    shares: 12100,
    revenue: 412000,
    revenueCagr: 0.135,
    grossMargin: 0.582,
    operatingMargin: 0.335,
    ebitdaMargin: 0.401,
    netMargin: 0.277,
    cashOfRevenue: 0.25,
    debtOfRevenue: 0.07,
    assetsOfRevenue: 1.15,
    equityShare: 0.68,
    capexOfRevenue: 0.13,
    dividendYield: 0.42,
    volatility: 0.03,
  },
  {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    exchange: "NASDAQ",
    sector: "Communication Services",
    industry: "Internet Content & Information",
    country: "United States",
    currency: "USD",
    description:
      "Social and messaging platforms monetised through advertising, plus substantial investment in AI infrastructure and reality labs.",
    employees: 74000,
    founded: 2004,
    website: "meta.com",
    price: 612.35,
    changePct: -0.75,
    shares: 2520,
    revenue: 198000,
    revenueCagr: 0.165,
    grossMargin: 0.813,
    operatingMargin: 0.405,
    ebitdaMargin: 0.512,
    netMargin: 0.348,
    cashOfRevenue: 0.32,
    debtOfRevenue: 0.15,
    assetsOfRevenue: 1.35,
    equityShare: 0.63,
    capexOfRevenue: 0.19,
    dividendYield: 0.34,
    volatility: 0.045,
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    exchange: "NYSE",
    sector: "Healthcare",
    industry: "Drug Manufacturers — General",
    country: "United States",
    currency: "USD",
    description:
      "Pharmaceutical and medical-technology portfolio with a broad therapeutic footprint and long-dated dividend record.",
    employees: 138000,
    founded: 1886,
    website: "jnj.com",
    price: 164.21,
    changePct: 0.32,
    shares: 2410,
    revenue: 92500,
    revenueCagr: 0.045,
    grossMargin: 0.685,
    operatingMargin: 0.262,
    ebitdaMargin: 0.318,
    netMargin: 0.212,
    cashOfRevenue: 0.24,
    debtOfRevenue: 0.4,
    assetsOfRevenue: 1.85,
    equityShare: 0.42,
    capexOfRevenue: 0.045,
    dividendYield: 3.05,
    volatility: 0.015,
  },
  {
    ticker: "XOM",
    name: "Exxon Mobil Corporation",
    exchange: "NYSE",
    sector: "Energy",
    industry: "Oil & Gas Integrated",
    country: "United States",
    currency: "USD",
    description:
      "Integrated energy major spanning upstream production, refining, chemicals and low-carbon solutions.",
    employees: 61000,
    founded: 1870,
    website: "corporate.exxonmobil.com",
    price: 118.9,
    changePct: -0.58,
    shares: 4320,
    revenue: 348000,
    revenueCagr: 0.035,
    grossMargin: 0.318,
    operatingMargin: 0.128,
    ebitdaMargin: 0.187,
    netMargin: 0.096,
    cashOfRevenue: 0.08,
    debtOfRevenue: 0.12,
    assetsOfRevenue: 1.25,
    equityShare: 0.55,
    capexOfRevenue: 0.075,
    dividendYield: 3.4,
    volatility: 0.05,
  },
  {
    ticker: "WMT",
    name: "Walmart Inc.",
    exchange: "NYSE",
    sector: "Consumer Defensive",
    industry: "Discount Stores",
    country: "United States",
    currency: "USD",
    description:
      "Global omnichannel retailer combining supercentres, marketplace, fulfilment services and a growing advertising business.",
    employees: 2100000,
    founded: 1962,
    website: "walmart.com",
    price: 96.42,
    changePct: 0.47,
    shares: 8030,
    revenue: 705000,
    revenueCagr: 0.052,
    grossMargin: 0.248,
    operatingMargin: 0.045,
    ebitdaMargin: 0.072,
    netMargin: 0.031,
    cashOfRevenue: 0.015,
    debtOfRevenue: 0.09,
    assetsOfRevenue: 0.36,
    equityShare: 0.35,
    capexOfRevenue: 0.032,
    dividendYield: 0.95,
    volatility: 0.02,
  },
  {
    ticker: "ASML",
    name: "ASML Holding N.V.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductor Equipment",
    country: "Netherlands",
    currency: "USD",
    description:
      "Sole supplier of extreme-ultraviolet lithography systems used to manufacture leading-edge logic and memory chips.",
    employees: 44000,
    founded: 1984,
    website: "asml.com",
    price: 742.6,
    changePct: 1.42,
    shares: 393,
    revenue: 34500,
    revenueCagr: 0.16,
    grossMargin: 0.518,
    operatingMargin: 0.325,
    ebitdaMargin: 0.362,
    netMargin: 0.281,
    cashOfRevenue: 0.28,
    debtOfRevenue: 0.15,
    assetsOfRevenue: 1.4,
    equityShare: 0.45,
    capexOfRevenue: 0.06,
    dividendYield: 0.9,
    volatility: 0.05,
  },
];

/** Deterministic pseudo-noise so demo series look organic but never change. */
function wobble(seed: number, index: number, amplitude: number): number {
  return 1 + Math.sin(seed * 12.9898 + index * 4.1414) * amplitude;
}

function seedOf(ticker: string): number {
  return [...ticker].reduce((s, c) => s + c.charCodeAt(0), 0) / 100;
}

const ANNUAL_YEARS = 10;

function buildAnnual(spec: CompanySpec): FinancialStatements {
  const seed = seedOf(spec.ticker);
  const income: IncomeStatement[] = [];
  const balance: BalanceSheet[] = [];
  const cashFlow: CashFlowStatement[] = [];

  for (let k = ANNUAL_YEARS - 1; k >= 0; k--) {
    const idx = ANNUAL_YEARS - 1 - k;
    const year = 2025 - k;
    const growthFactor = Math.pow(1 + spec.revenueCagr, -k);
    const revenue = spec.revenue * growthFactor * wobble(seed, idx, spec.volatility);
    const marginDrift = 1 + (idx - (ANNUAL_YEARS - 1)) * 0.004;
    const grossProfit = revenue * spec.grossMargin * marginDrift;
    const operatingIncome = revenue * spec.operatingMargin * marginDrift;
    const ebitda = revenue * spec.ebitdaMargin * marginDrift;
    const netIncome = revenue * spec.netMargin * marginDrift;
    const costOfRevenue = revenue - grossProfit;
    const operatingExpenses = grossProfit - operatingIncome;
    const interestExpense = revenue * spec.debtOfRevenue * 0.035;
    const pretaxIncome = operatingIncome - interestExpense * 0.5;
    const taxes = pretaxIncome - netIncome;
    const shares = spec.shares * (1 + k * 0.008);

    income.push({
      period: `FY${year}`,
      revenue,
      costOfRevenue,
      grossProfit,
      operatingExpenses,
      operatingIncome,
      ebitda,
      interestExpense,
      pretaxIncome,
      taxes,
      netIncome,
      eps: netIncome / shares,
    });

    const totalAssets = revenue * spec.assetsOfRevenue * wobble(seed + 1, idx, 0.02);
    const cash = revenue * spec.cashOfRevenue;
    const receivables = revenue * 0.11;
    const inventory = revenue * (spec.sector === "Technology" ? 0.03 : 0.09);
    const currentAssets = cash + receivables + inventory + revenue * 0.05;
    const ppe = totalAssets * 0.31;
    const equity = totalAssets * spec.equityShare;
    const totalLiabilities = totalAssets - equity;
    const totalDebt = revenue * spec.debtOfRevenue;
    const longTermDebt = totalDebt * 0.78;
    const currentLiabilities = Math.max(totalLiabilities - longTermDebt, currentAssets * 0.45);

    balance.push({
      period: `FY${year}`,
      cash,
      accountsReceivable: receivables,
      inventory,
      totalCurrentAssets: currentAssets,
      ppe,
      totalAssets,
      currentLiabilities,
      longTermDebt,
      totalLiabilities,
      shareholdersEquity: equity,
      totalDebt,
    });

    const operatingCashFlow = netIncome * (1.18 + idx * 0.004);
    const capex = -revenue * spec.capexOfRevenue;
    const freeCashFlow = operatingCashFlow + capex;
    cashFlow.push({
      period: `FY${year}`,
      operatingCashFlow,
      capex,
      investingCashFlow: capex - revenue * 0.02,
      financingCashFlow: -freeCashFlow * 0.72,
      freeCashFlow,
    });
  }

  return { income, balance, cashFlow };
}

const QUARTER_SEASONALITY = [0.92, 0.95, 0.98, 1.15];

function buildQuarterly(spec: CompanySpec, annual: FinancialStatements): FinancialStatements {
  const income: IncomeStatement[] = [];
  const balance: BalanceSheet[] = [];
  const cashFlow: CashFlowStatement[] = [];
  const lastTwo = annual.income.slice(-2);

  lastTwo.forEach((year, yi) => {
    const bs = annual.balance[annual.balance.length - 2 + yi]!;
    const cf = annual.cashFlow[annual.cashFlow.length - 2 + yi]!;
    const label = year.period.replace("FY", "");
    for (let q = 0; q < 4; q++) {
      const f = QUARTER_SEASONALITY[q]! / 4;
      income.push({
        period: `Q${q + 1} ${label}`,
        revenue: year.revenue * f,
        costOfRevenue: year.costOfRevenue * f,
        grossProfit: year.grossProfit * f,
        operatingExpenses: year.operatingExpenses * f,
        operatingIncome: year.operatingIncome * f,
        ebitda: year.ebitda * f,
        interestExpense: year.interestExpense * f,
        pretaxIncome: year.pretaxIncome * f,
        taxes: year.taxes * f,
        netIncome: year.netIncome * f,
        eps: year.eps * f,
      });
      const bf = 1 + (q - 1.5) * 0.012;
      balance.push({
        period: `Q${q + 1} ${label}`,
        cash: bs.cash * bf,
        accountsReceivable: bs.accountsReceivable * bf,
        inventory: bs.inventory * bf,
        totalCurrentAssets: bs.totalCurrentAssets * bf,
        ppe: bs.ppe * bf,
        totalAssets: bs.totalAssets * bf,
        currentLiabilities: bs.currentLiabilities * bf,
        longTermDebt: bs.longTermDebt * bf,
        totalLiabilities: bs.totalLiabilities * bf,
        shareholdersEquity: bs.shareholdersEquity * bf,
        totalDebt: bs.totalDebt * bf,
      });
      cashFlow.push({
        period: `Q${q + 1} ${label}`,
        operatingCashFlow: cf.operatingCashFlow * f,
        capex: cf.capex * f,
        investingCashFlow: cf.investingCashFlow * f,
        financingCashFlow: cf.financingCashFlow * f,
        freeCashFlow: cf.freeCashFlow * f,
      });
    }
  });

  void spec;
  return { income, balance, cashFlow };
}

function buildQuote(spec: CompanySpec, annual: FinancialStatements): Quote {
  const marketCap = (spec.price * spec.shares) / 1000; // $bn -> keep in millions below
  const capMillions = spec.price * spec.shares;
  const bs = annual.balance[annual.balance.length - 1]!;
  void marketCap;
  return {
    ticker: spec.ticker,
    price: spec.price,
    changeAbs: (spec.price * spec.changePct) / 100,
    changePct: spec.changePct,
    marketCap: capMillions * 1e6,
    enterpriseValue: (capMillions + bs.totalDebt - bs.cash) * 1e6,
    volume: Math.round(capMillions * 120),
    fiftyTwoWeekLow: spec.price * 0.72,
    fiftyTwoWeekHigh: spec.price * 1.19,
    provenance: {
      kind: "demo",
      source: "Demo dataset — not market data",
      lastUpdated: DEMO_LAST_UPDATED,
    },
  };
}

function buildValuation(
  spec: CompanySpec,
  annual: FinancialStatements,
  quote: Quote,
): ValuationSnapshot {
  const inc = annual.income[annual.income.length - 1]!;
  const bs = annual.balance[annual.balance.length - 1]!;
  const capM = quote.marketCap / 1e6;
  const evM = quote.enterpriseValue / 1e6;
  const pe = capM / inc.netIncome;
  const evToEbitda = evM / inc.ebitda;
  const priceToSales = capM / inc.revenue;
  const priceToBook = capM / bs.shareholdersEquity;
  const epsGrowth = spec.revenueCagr * 100 + 3;
  const blend = (v: number, f: number) => v * f;
  return {
    pe,
    forwardPe: pe / (1 + spec.revenueCagr * 0.8),
    priceToSales,
    priceToBook,
    evToEbitda,
    evToSales: evM / inc.revenue,
    peg: pe / Math.max(epsGrowth, 1),
    dividendYield: spec.dividendYield,
    history: {
      pe: blend(pe, 0.88),
      evToEbitda: blend(evToEbitda, 0.9),
      priceToSales: blend(priceToSales, 0.85),
      priceToBook: blend(priceToBook, 0.92),
    },
    industryAverage: {
      pe: blend(pe, 0.79),
      evToEbitda: blend(evToEbitda, 0.82),
      priceToSales: blend(priceToSales, 0.74),
      priceToBook: blend(priceToBook, 0.8),
    },
    sectorAverage: {
      pe: blend(pe, 0.71),
      evToEbitda: blend(evToEbitda, 0.76),
      priceToSales: blend(priceToSales, 0.68),
      priceToBook: blend(priceToBook, 0.73),
    },
  };
}

function buildAnalysis(spec: CompanySpec): CompanyAnalysis {
  const annual = buildAnnual(spec);
  const quarterly = buildQuarterly(spec, annual);
  const quote = buildQuote(spec, annual);
  const valuation = buildValuation(spec, annual, quote);
  const metrics = growthMetrics(annual);
  const ratios: Record<Period, ReturnType<typeof computeRatios>> = {
    annual: computeRatios(annual),
    quarterly: computeRatios(quarterly),
  };

  const company: Company = {
    id: spec.ticker.toLowerCase(),
    ticker: spec.ticker,
    name: spec.name,
    exchange: spec.exchange,
    sector: spec.sector,
    industry: spec.industry,
    country: spec.country,
    currency: spec.currency,
    description: spec.description,
    employees: spec.employees,
    founded: spec.founded,
    website: spec.website,
    logoMonogram: spec.ticker.slice(0, 2),
  };

  return {
    company,
    quote,
    statements: { annual, quarterly },
    ratios,
    valuation,
    growthProfile: growthProfileFrom(metrics),
    health: assessHealth(annual, ratios.annual, valuation, metrics, DEMO_LAST_UPDATED),
    provenance: DEMO_PROVENANCE,
  };
}

export const DEMO_ANALYSES: Record<string, CompanyAnalysis> = Object.fromEntries(
  specs.map((s) => [s.ticker, buildAnalysis(s)]),
);

export const DEMO_COMPANIES: Company[] = specs.map((s) => DEMO_ANALYSES[s.ticker]!.company);

export const DEMO_DEFAULT_WATCHLIST = ["AAPL", "MSFT", "NVDA", "AMZN", "JPM", "ASML"];

export const DEMO_MARKET: MarketOverview = {
  indices: [
    { symbol: "SPX", name: "S&P 500", value: 6412.38, changePct: 0.36 },
    { symbol: "NDX", name: "Nasdaq 100", value: 23841.7, changePct: 0.72 },
    { symbol: "DJI", name: "Dow Jones", value: 45210.6, changePct: -0.12 },
    { symbol: "RUT", name: "Russell 2000", value: 2380.14, changePct: 0.21 },
  ].map((i) => ({
    ...i,
    series: Array.from({ length: 24 }, (_, k) => ({
      period: `M-${24 - k}`,
      value: i.value * (0.78 + k * 0.0096 + Math.sin(k / 2.4) * 0.014),
    })),
  })),
  sectors: [
    { sector: "Technology", changePct: 1.42 },
    { sector: "Communication Services", changePct: 0.87 },
    { sector: "Financial Services", changePct: 0.31 },
    { sector: "Healthcare", changePct: -0.24 },
    { sector: "Consumer Cyclical", changePct: 0.58 },
    { sector: "Consumer Defensive", changePct: -0.11 },
    { sector: "Energy", changePct: -0.92 },
    { sector: "Industrials", changePct: 0.19 },
    { sector: "Utilities", changePct: -0.35 },
    { sector: "Real Estate", changePct: -0.63 },
  ],
  gainers: [
    { ticker: "NVDA", name: "NVIDIA Corporation", price: 178.24, changePct: 2.31 },
    { ticker: "ASML", name: "ASML Holding N.V.", price: 742.6, changePct: 1.42 },
    { ticker: "GOOGL", name: "Alphabet Inc.", price: 198.72, changePct: 1.06 },
    { ticker: "AAPL", name: "Apple Inc.", price: 241.32, changePct: 0.84 },
    { ticker: "WMT", name: "Walmart Inc.", price: 96.42, changePct: 0.47 },
  ],
  losers: [
    { ticker: "TSLA", name: "Tesla, Inc.", price: 322.15, changePct: -1.64 },
    { ticker: "META", name: "Meta Platforms, Inc.", price: 612.35, changePct: -0.75 },
    { ticker: "XOM", name: "Exxon Mobil Corporation", price: 118.9, changePct: -0.58 },
    { ticker: "MSFT", name: "Microsoft Corporation", price: 486.9, changePct: -0.42 },
    { ticker: "JNJ", name: "Johnson & Johnson", price: 164.21, changePct: 0.32 },
  ],
  provenance: DEMO_PROVENANCE,
};

export const DEMO_SAVED_ANALYSES: SavedAnalysis[] = [
  {
    id: "sa-1",
    ticker: "AAPL",
    title: "Apple — services mix and margin durability",
    createdAt: "2026-08-12T09:20:00.000Z",
    kind: "Full report",
    note: "Gross margin expansion tracks the services mix shift; monitor hardware replacement cycle.",
  },
  {
    id: "sa-2",
    ticker: "NVDA",
    title: "NVIDIA — valuation vs growth durability",
    createdAt: "2026-08-09T14:45:00.000Z",
    kind: "Valuation note",
    note: "Multiple assumes sustained data-center capex; sensitivity analysis on 2027 revenue required.",
  },
  {
    id: "sa-3",
    ticker: "JPM",
    title: "Large-cap banks — capital return screen",
    createdAt: "2026-07-28T11:05:00.000Z",
    kind: "Screening",
    note: "Screening for ROE above 15% with CET1 headroom and stable provisioning.",
  },
];

export const DEMO_USER: UserProfile = {
  id: "demo-user",
  name: "Demo Analyst",
  email: "analyst@demo.equityscope.io",
  plan: "Research (demo)",
  initials: "DA",
};
