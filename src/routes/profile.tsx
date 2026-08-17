import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoNotice, SectionHeading } from "@/components/finance/primitives";
import { currentUserQuery, savedAnalysesQuery } from "@/lib/data-provider";
import { useWatchlist } from "@/hooks/use-watchlist";
import { formatTimestamp } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "User Profile — EquityScope" },
      {
        name: "description",
        content:
          "Your analyst profile: tracked companies, saved analyses and account status on the research workspace.",
      },
      { property: "og:title", content: "User Profile — EquityScope" },
      {
        property: "og:description",
        content: "Analyst profile with watchlist and saved research summary.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user } = useSuspenseQuery(currentUserQuery());
  const { data: saved } = useSuspenseQuery(savedAnalysesQuery());
  const { tickers } = useWatchlist();

  return (
    <AppShell title="User Profile" subtitle="Account overview for the demo analyst session.">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <section className="h-fit rounded-lg border border-border bg-card p-5 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary text-lg font-semibold">
            {user.initials}
          </span>
          <h2 className="mt-3 text-base font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-3">
            {user.plan}
          </Badge>
          <div className="mt-4 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-md border border-border p-3">
              <div className="label-xs">Tracked</div>
              <div className="mt-1 text-lg font-semibold num">{tickers.length}</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="label-xs">Analyses</div>
              <div className="mt-1 text-lg font-semibold num">{saved.length}</div>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/settings">Account settings</Link>
          </Button>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <SectionHeading
            title="Recent analysis history"
            description="Saved work is scoped to your account once authentication is connected."
          />
          <ul className="divide-y divide-border">
            {saved.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.kind} · {formatTimestamp(s.createdAt)}
                  </span>
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/company/$ticker" params={{ ticker: s.ticker }}>
                    Open
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
