import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyLogo, DataBadge } from "@/components/finance/primitives";
import { companySearchQuery, EXCHANGES, PROVENANCE, SECTORS } from "@/lib/data-provider";

const searchSchema = z.object({
  q: z.string().optional().default(""),
  exchange: z.string().optional().default("all"),
  sector: z.string().optional().default("all"),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Company Search — EquityScope" },
      {
        name: "description",
        content:
          "Search publicly listed companies by name, ticker or exchange and open a full financial analysis dashboard.",
      },
      { property: "og:title", content: "Company Search — EquityScope" },
      {
        property: "og:description",
        content: "Find companies by name, ticker, exchange, sector and industry.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(search.q);
  const { data: results } = useSuspenseQuery(
    companySearchQuery({ query: search.q, exchange: search.exchange, sector: search.sector }),
  );

  const update = (patch: Partial<typeof search>) =>
    navigate({ to: "/search", search: { ...search, ...patch } });

  return (
    <AppShell
      title="Company Search"
      subtitle="Search the coverage universe by company name, ticker, exchange or sector."
    >
      <div className="rounded-lg border border-border bg-card p-4">
        <form
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: term });
          }}
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search company or ticker..."
              className="pl-9"
              aria-label="Search company or ticker"
            />
          </div>
          <Select value={search.exchange} onValueChange={(v) => update({ exchange: v })}>
            <SelectTrigger className="md:w-44" aria-label="Exchange">
              <SelectValue placeholder="Exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All exchanges</SelectItem>
              {EXCHANGES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={search.sector} onValueChange={(v) => update({ sector: v })}>
            <SelectTrigger className="md:w-56" aria-label="Sector">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Search</Button>
        </form>
        <DataBadge provenance={PROVENANCE} className="mt-3" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "company" : "companies"} found
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((c) => (
          <Link
            key={c.ticker}
            to="/company/$ticker"
            params={{ ticker: c.ticker }}
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            <div className="flex items-start gap-3">
              <CompanyLogo monogram={c.logoMonogram} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold group-hover:text-primary">
                  {c.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground num">
                  {c.exchange}: {c.ticker}
                </div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="label-xs">Sector</dt>
                <dd className="mt-0.5 truncate">{c.sector}</dd>
              </div>
              <div>
                <dt className="label-xs">Industry</dt>
                <dd className="mt-0.5 truncate">{c.industry}</dd>
              </div>
              <div>
                <dt className="label-xs">Country</dt>
                <dd className="mt-0.5 truncate">{c.country}</dd>
              </div>
              <div>
                <dt className="label-xs">Currency</dt>
                <dd className="mt-0.5 num">{c.currency}</dd>
              </div>
            </dl>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            No companies match this search in the demo coverage universe.
          </div>
        )}
      </div>
    </AppShell>
  );
}
