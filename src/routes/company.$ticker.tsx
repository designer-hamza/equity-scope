import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { OverviewSection } from "@/components/company/OverviewSection";
import { PerformanceSection } from "@/components/company/PerformanceSection";
import {
  BalanceHealthSection,
  GrowthSection,
  ProfitabilitySection,
} from "@/components/company/RatioSections";
import { CashFlowSection } from "@/components/company/CashFlowSection";
import { ValuationSection } from "@/components/company/ValuationSection";
import { HealthSection } from "@/components/company/HealthSection";
import { StatementsSection } from "@/components/company/StatementsSection";
import { DemoNotice } from "@/components/finance/primitives";
import { useWatchlist } from "@/hooks/use-watchlist";
import { companyAnalysisQuery, getCompanyAnalysis } from "@/lib/data-provider";

export const Route = createFileRoute("/company/$ticker")({
  loader: async ({ params, context }) => {
    const analysis = await context.queryClient.ensureQueryData(
      companyAnalysisQuery(params.ticker),
    );
    if (!analysis) throw notFound();
    return { name: analysis.company.name, ticker: analysis.company.ticker };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Company unavailable — EquityScope" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} (${loaderData.ticker}) Financial Analysis — EquityScope`;
    const description = `Financial health, profitability, growth, cash flow and valuation analysis for ${loaderData.name} (${loaderData.ticker}), using clearly marked demonstration data.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: CompanyNotFound,
  component: CompanyPage,
});

function CompanyNotFound() {
  return (
    <AppShell title="Company not found">
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          That ticker is not part of the demo coverage universe.
        </p>
        <Button asChild className="mt-4">
          <Link to="/search">Back to company search</Link>
        </Button>
      </div>
    </AppShell>
  );
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "performance", label: "Performance" },
  { value: "profitability", label: "Profitability" },
  { value: "growth", label: "Growth" },
  { value: "health", label: "Balance Sheet" },
  { value: "cashflow", label: "Cash Flow" },
  { value: "valuation", label: "Valuation" },
  { value: "assessment", label: "Health Assessment" },
  { value: "statements", label: "Statements" },
];

function CompanyPage() {
  const { ticker } = Route.useParams();
  const { data } = useSuspenseQuery(companyAnalysisQuery(ticker));
  const { has, toggle } = useWatchlist();

  if (!data) return <CompanyNotFound />;

  return (
    <AppShell>
      <CompanyHeader
        analysis={data}
        watched={has(data.company.ticker)}
        onToggleWatch={() => toggle(data.company.ticker)}
      />

      <Tabs defaultValue="overview" className="mt-6">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6 space-y-10">
          <OverviewSection analysis={data} />
          <HealthSection analysis={data} />
        </TabsContent>
        <TabsContent value="performance" className="mt-6">
          <PerformanceSection analysis={data} />
        </TabsContent>
        <TabsContent value="profitability" className="mt-6">
          <ProfitabilitySection analysis={data} />
        </TabsContent>
        <TabsContent value="growth" className="mt-6">
          <GrowthSection analysis={data} />
        </TabsContent>
        <TabsContent value="health" className="mt-6">
          <BalanceHealthSection analysis={data} />
        </TabsContent>
        <TabsContent value="cashflow" className="mt-6">
          <CashFlowSection analysis={data} />
        </TabsContent>
        <TabsContent value="valuation" className="mt-6">
          <ValuationSection analysis={data} />
        </TabsContent>
        <TabsContent value="assessment" className="mt-6">
          <HealthSection analysis={data} />
        </TabsContent>
        <TabsContent value="statements" className="mt-6">
          <StatementsSection analysis={data} />
        </TabsContent>
      </Tabs>

      <DemoNotice className="mt-10" />
    </AppShell>
  );
}

void getCompanyAnalysis;
