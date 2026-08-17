import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Bookmark } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataBadge, DemoNotice } from "@/components/finance/primitives";
import { PROVENANCE, savedAnalysesQuery } from "@/lib/data-provider";
import { formatTimestamp } from "@/lib/format";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Analyses — EquityScope" },
      {
        name: "description",
        content:
          "Your saved company analyses, valuation notes and screening runs, ready to revisit or export.",
      },
      { property: "og:title", content: "Saved Analyses — EquityScope" },
      {
        property: "og:description",
        content: "Revisit stored research notes and analysis history.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { data: analyses } = useSuspenseQuery(savedAnalysesQuery());

  return (
    <AppShell
      title="Saved Analyses"
      subtitle="Research notes stored against companies you follow."
    >
      <DataBadge provenance={PROVENANCE} />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {analyses.map((a) => (
          <article key={a.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-secondary">
                  <Bookmark className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">{a.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.ticker} · saved {formatTimestamp(a.createdAt)}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{a.kind}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{a.note}</p>
            <Button asChild variant="ghost" size="sm" className="mt-3 px-0">
              <Link to="/company/$ticker" params={{ ticker: a.ticker }}>
                Open analysis <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
