/**
 * Report definition shared by the reports page and the company-level
 * "Export Report" action. The payload shape is what a future report-generation
 * service (PDF/DOCX) will receive.
 */
import type { CompanyAnalysis } from "@/types/finance";

export const REPORT_SECTIONS = [
  { key: "overview", label: "Company overview", description: "Profile, size and key figures." },
  {
    key: "performance",
    label: "Financial performance",
    description: "Revenue, net income, EBITDA and free cash flow history.",
  },
  {
    key: "profitability",
    label: "Profitability",
    description: "Margin stack with ROA, ROE and ROIC.",
  },
  { key: "growth", label: "Growth", description: "Revenue, EPS, EBITDA and book value trends." },
  { key: "liquidity", label: "Liquidity", description: "Current, quick and cash ratios." },
  { key: "leverage", label: "Leverage", description: "Debt ratios and interest coverage." },
  { key: "cashflow", label: "Cash flow", description: "Operating, investing and financing flows." },
  { key: "valuation", label: "Valuation", description: "Multiples versus history and peers." },
  {
    key: "health",
    label: "Financial health score",
    description: "Six-dimension scoring and overall rating.",
  },
  {
    key: "analysis",
    label: "Generated analysis",
    description: "Narrative assessment, strengths and risks.",
  },
] as const;

export interface ReportPayload {
  ticker: string;
  generatedAt: string;
  sections: string[];
  dataMode: "demo" | "live";
}

export function buildReportPayload(
  analysis: CompanyAnalysis,
  sections: string[] = REPORT_SECTIONS.map((s) => s.key),
): ReportPayload {
  return {
    ticker: analysis.company.ticker,
    generatedAt: new Date().toISOString(),
    sections,
    dataMode: "demo",
  };
}
