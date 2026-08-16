import { Link } from "@tanstack/react-router";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChangeText, CompanyLogo, ScoreBar } from "@/components/finance/primitives";
import {
  formatCurrencyCompact,
  formatMultiple,
  formatPercent,
  formatPrice,
  formatRatio,
  formatTimestamp,
} from "@/lib/format";
import type { ScreenRow } from "@/lib/screening";

export function ScreenTable({
  rows,
  onToggleWatch,
  watched,
}: {
  rows: ScreenRow[];
  onToggleWatch?: (ticker: string) => void;
  watched?: (ticker: string) => boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[190px]">Company</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Rev. Growth</TableHead>
            <TableHead className="text-right">EPS Growth</TableHead>
            <TableHead className="text-right">P/E</TableHead>
            <TableHead className="text-right">ROE</TableHead>
            <TableHead className="text-right">D/E</TableHead>
            <TableHead className="min-w-[130px]">Health Score</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            {onToggleWatch && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.ticker}>
              <TableCell>
                <Link
                  to="/company/$ticker"
                  params={{ ticker: r.ticker }}
                  className="flex items-center gap-2.5"
                >
                  <CompanyLogo monogram={r.logoMonogram} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium hover:text-primary">
                      {r.name}
                    </span>
                    <span className="block text-xs text-muted-foreground num">{r.ticker}</span>
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <div className="num text-sm">{formatPrice(r.price, r.currency)}</div>
                <ChangeText value={r.changePct} className="text-xs" />
              </TableCell>
              <TableCell className="text-right num text-sm">
                {formatCurrencyCompact(r.marketCap)}
              </TableCell>
              <TableCell className="text-right num text-sm">
                <ChangeText value={r.revenueGrowth} />
              </TableCell>
              <TableCell className="text-right num text-sm">
                <ChangeText value={r.epsGrowth} />
              </TableCell>
              <TableCell className="text-right num text-sm">{formatMultiple(r.pe)}</TableCell>
              <TableCell className="text-right num text-sm">{formatPercent(r.roe)}</TableCell>
              <TableCell className="text-right num text-sm">
                {formatRatio(r.debtToEquity)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="num text-sm">{r.healthScore}</span>
                  <ScoreBar score={r.healthScore} />
                </div>
                <span className="text-[11px] text-muted-foreground">{r.healthRating}</span>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {formatTimestamp(r.lastUpdated)}
              </TableCell>
              {onToggleWatch && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={watched?.(r.ticker) ? "Remove from watchlist" : "Add to watchlist"}
                    onClick={() => onToggleWatch(r.ticker)}
                  >
                    {watched?.(r.ticker) ? (
                      <Star className="size-4 fill-current text-warn" />
                    ) : (
                      <StarOff className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="py-10 text-center text-sm text-muted-foreground">
                No companies tracked yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
