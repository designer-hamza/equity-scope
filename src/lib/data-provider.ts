/**
 * Data access layer.
 *
 * Every screen reads through these functions — never from the demo fixtures
 * directly. When a real financial-data provider is connected, replace the
 * bodies here with `createServerFn` calls (frontend -> API layer -> provider ->
 * cache/database -> analysis engine -> AI layer). Signatures and return types
 * stay the same, so no UI component needs to change.
 */
import { queryOptions } from "@tanstack/react-query";
import {
  DEMO_ANALYSES,
  DEMO_COMPANIES,
  DEMO_MARKET,
  DEMO_PROVENANCE,
  DEMO_SAVED_ANALYSES,
  DEMO_USER,
} from "@/data/demo-companies";
import type {
  Company,
  CompanyAnalysis,
  MarketOverview,
  SavedAnalysis,
  UserProfile,
} from "@/types/finance";

export const DATA_MODE: "demo" | "live" = "demo";

export const PROVENANCE = DEMO_PROVENANCE;

export async function listCompanies(): Promise<Company[]> {
  return DEMO_COMPANIES;
}

export interface CompanyFilter {
  query?: string;
  exchange?: string;
  sector?: string;
}

export async function searchCompanies(filter: CompanyFilter): Promise<Company[]> {
  const q = (filter.query ?? "").trim().toLowerCase();
  return DEMO_COMPANIES.filter((c) => {
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.ticker.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q);
    const matchesExchange =
      !filter.exchange || filter.exchange === "all" || c.exchange === filter.exchange;
    const matchesSector =
      !filter.sector || filter.sector === "all" || c.sector === filter.sector;
    return matchesQuery && matchesExchange && matchesSector;
  });
}

export async function getCompanyAnalysis(ticker: string): Promise<CompanyAnalysis | null> {
  return DEMO_ANALYSES[ticker.toUpperCase()] ?? null;
}

export async function getMarketOverview(): Promise<MarketOverview> {
  return DEMO_MARKET;
}

export async function listSavedAnalyses(): Promise<SavedAnalysis[]> {
  return DEMO_SAVED_ANALYSES;
}

export async function getCurrentUser(): Promise<UserProfile> {
  return DEMO_USER;
}

export const companiesQuery = () =>
  queryOptions({ queryKey: ["companies"], queryFn: listCompanies });

export const companySearchQuery = (filter: CompanyFilter) =>
  queryOptions({
    queryKey: ["companies", "search", filter],
    queryFn: () => searchCompanies(filter),
  });

export const companyAnalysisQuery = (ticker: string) =>
  queryOptions({
    queryKey: ["company", ticker.toUpperCase()],
    queryFn: () => getCompanyAnalysis(ticker),
  });

export const marketOverviewQuery = () =>
  queryOptions({ queryKey: ["market"], queryFn: getMarketOverview });

export const savedAnalysesQuery = () =>
  queryOptions({ queryKey: ["saved-analyses"], queryFn: listSavedAnalyses });

export const currentUserQuery = () =>
  queryOptions({ queryKey: ["user"], queryFn: getCurrentUser });

export const EXCHANGES = Array.from(new Set(DEMO_COMPANIES.map((c) => c.exchange))).sort();
export const SECTORS = Array.from(new Set(DEMO_COMPANIES.map((c) => c.sector))).sort();
