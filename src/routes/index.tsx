import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Coins,
  GaugeCircle,
  LineChart,
  ShieldAlert,
  Sparkles,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataBadge } from "@/components/finance/primitives";
import { DEMO_PROVENANCE } from "@/data/demo-companies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EquityScope — Analyze Companies. Understand Value." },
      {
        name: "description",
        content:
          "A financial analysis platform that turns company data into clear, actionable insights: financial health, valuation, growth and cash-flow analysis.",
      },
      { property: "og:title", content: "EquityScope — Analyze Companies. Understand Value." },
      {
        property: "og:description",
        content:
          "Financial health scoring, interactive statements, valuation and peer comparison for publicly listed companies.",
      },
    ],
  }),
  component: Landing,
});

const CAPABILITIES = [
  {
    icon: GaugeCircle,
    title: "Financial Health Analysis",
    body: "Six-dimension scoring across profitability, growth, liquidity, leverage, cash flow and valuation.",
  },
  {
    icon: LineChart,
    title: "Interactive Financial Charts",
    body: "Ten years of revenue, earnings, EBITDA and cash flow with annual and quarterly views.",
  },
  {
    icon: Coins,
    title: "Valuation Analysis",
    body: "Multiples benchmarked against the company's own history, industry and sector averages.",
  },
  {
    icon: TrendingUp,
    title: "Profitability Analysis",
    body: "Margin stack, ROA, ROE and ROIC with improving, stable or declining classifications.",
  },
  {
    icon: Sparkles,
    title: "Growth Analysis",
    body: "Revenue, EPS, EBITDA, free cash flow and book value trajectories with a growth profile rating.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Analysis",
    body: "Liquidity, leverage and solvency signals surfaced alongside the balance-sheet history.",
  },
  {
    icon: BarChart3,
    title: "Company Comparison",
    body: "Line up to five companies across twelve metrics with best and worst values highlighted.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    body: "A structured assessment surface ready to receive model-generated commentary once connected.",
  },
];

const EXAMPLES = ["Apple", "Microsoft", "NVIDIA", "Tesla", "Amazon", "JPMorgan"];

function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Open platform</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" /> Equity research workspace · demo dataset
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Analyze Companies. Understand Value.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            An intelligent financial analysis platform that turns company data into clear,
            actionable insights.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/search", search: { q: query } });
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company or ticker..."
                aria-label="Search company or ticker"
                className="h-11 pl-9"
              />
            </div>
            <Button type="submit" size="lg" className="h-11">
              Analyze <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLES.map((name) => (
              <Link
                key={name}
                to="/search"
                search={{ q: name }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {name}
              </Link>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground">
            Financial information is provided for research and educational purposes and should not
            be considered investment advice.
          </p>
          <div className="mt-4 flex justify-center">
            <DataBadge provenance={DEMO_PROVENANCE} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-semibold tracking-tight">Platform capabilities</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Built as the frontend foundation for a live financial-data and AI analysis backend.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="rounded-lg border border-border bg-card p-5">
              <c.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-12">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Start with the Apple (AAPL) demo analysis
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Full company dashboard: statements, ratios, valuation, health score and peer
              comparison — all populated with clearly marked demonstration data.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/company/$ticker" params={{ ticker: "AAPL" }}>
              Open AAPL analysis <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground">
          <span>EquityScope — demonstration build. No live market data connected.</span>
          <span>Research and educational use only. Not investment advice.</span>
        </div>
      </footer>
    </div>
  );
}
