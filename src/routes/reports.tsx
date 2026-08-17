import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataBadge, DemoNotice, SectionHeading } from "@/components/finance/primitives";
import { DEMO_COMPANIES } from "@/data/demo-companies";
import { PROVENANCE } from "@/lib/data-provider";
import { REPORT_SECTIONS } from "@/lib/report";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Financial Reports — EquityScope" },
      {
        name: "description",
        content:
          "Assemble a professional company analysis report covering performance, profitability, growth, leverage, cash flow, valuation and health scoring.",
      },
      { property: "og:title", content: "Financial Reports — EquityScope" },
      {
        property: "og:description",
        content: "Configure and export structured company analysis reports.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [sections, setSections] = useState<string[]>(REPORT_SECTIONS.map((s) => s.key));

  const toggleSection = (key: string) =>
    setSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  return (
    <AppShell
      title="Financial Reports"
      subtitle="Build a structured analysis report from the sections you need."
    >
      <DataBadge provenance={PROVENANCE} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-border bg-card p-5">
          <SectionHeading
            title="Report contents"
            description="Select the sections to include in the generated document."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {REPORT_SECTIONS.map((s) => (
              <label
                key={s.key}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/40"
              >
                <Checkbox
                  checked={sections.includes(s.key)}
                  onCheckedChange={() => toggleSection(s.key)}
                  aria-label={s.label}
                />
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Report settings</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select value={ticker} onValueChange={setTicker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_COMPANIES.map((c) => (
                    <SelectItem key={c.ticker} value={c.ticker}>
                      {c.ticker} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
              <FileText className="mb-1.5 size-4" />
              {sections.length} of {REPORT_SECTIONS.length} sections selected. Export renders the
              report payload; document generation is wired up once the backend report service is
              connected.
            </div>
            <Button
              className="w-full"
              disabled={sections.length === 0}
              onClick={() =>
                toast("Report queued (demo)", {
                  description: `${ticker} · ${sections.length} sections. Document generation requires the backend report service.`,
                })
              }
            >
              <Download className="size-4" /> Export report
            </Button>
          </div>
        </aside>
      </div>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
