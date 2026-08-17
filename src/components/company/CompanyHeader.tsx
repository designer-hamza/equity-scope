import { BarChart3, Download, Star, StarOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChangeText, CompanyLogo, DataBadge } from "@/components/finance/primitives";
import { formatCurrencyCompact, formatPrice } from "@/lib/format";
import { buildReportPayload } from "@/lib/report";
import type { CompanyAnalysis } from "@/types/finance";

export function CompanyHeader({
  analysis,
  watched,
  onToggleWatch,
}: {
  analysis: CompanyAnalysis;
  watched: boolean;
  onToggleWatch: () => void;
}) {
  const { company, quote } = analysis;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <CompanyLogo monogram={company.logoMonogram} size="lg" />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{company.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="num font-medium text-foreground">
                {company.exchange}: {company.ticker}
              </span>
              <span>·</span>
              <span>{company.sector}</span>
              <span>·</span>
              <span>{company.industry}</span>
              <span>·</span>
              <span>{company.country}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{company.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-2xl font-semibold num">
              {formatPrice(quote.price, company.currency)}
            </div>
            <div className="text-sm">
              <ChangeText value={quote.changePct} />
              <span className="ml-2 text-xs text-muted-foreground num">
                {formatCurrencyCompact(quote.marketCap)} mkt cap
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant={watched ? "secondary" : "default"} size="sm" onClick={onToggleWatch}>
              {watched ? <Star className="size-4 fill-current" /> : <StarOff className="size-4" />}
              {watched ? "In watchlist" : "Add to watchlist"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/compare">
                <BarChart3 className="size-4" /> Compare
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const payload = buildReportPayload(analysis);
                toast("Report queued (demo)", {
                  description: `${payload.ticker} · ${payload.sections.length} sections. Document generation requires the backend report service.`,
                });
              }}
            >
              <Download className="size-4" /> Export report
            </Button>
          </div>
        </div>
      </div>

      <DataBadge provenance={quote.provenance} className="mt-4 border-t border-border pt-3" />
    </div>
  );
}
