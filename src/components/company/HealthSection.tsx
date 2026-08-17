import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  DataBadge,
  ScoreBar,
  ScoreRing,
  SectionHeading,
} from "@/components/finance/primitives";
import type { CompanyAnalysis } from "@/types/finance";

export function HealthSection({ analysis }: { analysis: CompanyAnalysis }) {
  const h = analysis.health;

  return (
    <section>
      <SectionHeading
        title="Financial Health Assessment"
        description="Structured assessment surface. Scores come from the rule-based analysis engine; narrative text will be model-generated once the AI layer is connected."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-surface p-4 text-center">
            <ScoreRing score={h.overallScore} />
            <div>
              <div className="text-sm font-semibold">{h.rating}</div>
              <div className="text-xs text-muted-foreground">Overall financial health</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{h.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {h.categories.map((c) => (
                <div key={c.key} className="rounded-md border border-border p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{c.label}</span>
                    <span className="num text-sm">{c.score}</span>
                  </div>
                  <div className="mt-2">
                    <ScoreBar score={c.score} />
                  </div>
                  <div className="mt-2 text-xs font-medium">{c.rating}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="size-4 text-gain" /> Key strengths
            </h3>
            <ul className="mt-3 space-y-2">
              {h.strengths.map((s) => (
                <li key={s} className="text-sm text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-warn" /> Key risks
            </h3>
            <ul className="mt-3 space-y-2">
              {h.risks.map((r) => (
                <li key={r} className="text-sm text-muted-foreground">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DataBadge provenance={h.provenance} className="mt-5 border-t border-border pt-3" />
      </div>
    </section>
  );
}
