import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataBadge, DemoNotice, SectionHeading } from "@/components/finance/primitives";
import { useTheme } from "@/hooks/use-theme";
import { DEMO_USER } from "@/data/demo-companies";
import { PROVENANCE } from "@/lib/data-provider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EquityScope" },
      {
        name: "description",
        content:
          "Manage account details, appearance, data preferences and the financial data provider connection.",
      },
      { property: "og:title", content: "Settings — EquityScope" },
      {
        property: "og:description",
        content: "Account, appearance and data-source configuration.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShell title="Settings" subtitle="Account, appearance and data configuration.">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <SectionHeading title="Account" description="Profile details used across reports." />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={DEMO_USER.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={DEMO_USER.email} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan">Plan</Label>
              <Input id="plan" defaultValue={DEMO_USER.plan} readOnly />
            </div>
            <Button>Save changes</Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <SectionHeading title="Appearance" description="Theme and display density." />
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
              <span>
                <span className="block text-sm font-medium">Theme</span>
                <span className="block text-xs text-muted-foreground">
                  Light and dark are both tuned for long reading sessions.
                </span>
              </span>
              <div className="flex gap-1">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="icon"
                  aria-label="Light theme"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="size-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="icon"
                  aria-label="Dark theme"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
              <span>
                <span className="block text-sm font-medium">Compact tables</span>
                <span className="block text-xs text-muted-foreground">
                  Tighter row height for data-dense screens.
                </span>
              </span>
              <Switch aria-label="Compact tables" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <SectionHeading
            title="Data sources"
            description="Where financial information is retrieved from."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Market data provider</Label>
              <Select defaultValue="demo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Demo dataset (no external calls)</SelectItem>
                  <SelectItem value="api" disabled>
                    Financial Data API (not connected)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Reporting currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR" disabled>
                    EUR (requires FX service)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataBadge provenance={PROVENANCE} className="mt-4" />
        </section>
      </div>

      <DemoNotice className="mt-8" />
    </AppShell>
  );
}
