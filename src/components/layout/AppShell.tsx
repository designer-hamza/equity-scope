import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bookmark,
  FileText,
  Globe2,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  User,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { DEMO_USER } from "@/data/demo-companies";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Company Search", icon: Search },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/compare", label: "Company Comparisons", icon: BarChart3 },
  { to: "/market", label: "Market Overview", icon: Globe2 },
  { to: "/reports", label: "Financial Reports", icon: FileText },
  { to: "/saved", label: "Saved Analyses", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <LineChart className="size-4" />
      </span>
      {!compact && (
        <span className="text-sm font-semibold tracking-tight">
          EquityScope
          <span className="ml-1.5 rounded bg-warn-soft px-1 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warn">
            Demo
          </span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  const { theme, toggle } = useTheme();
  return (
    <div className="space-y-2 border-t border-sidebar-border pt-3">
      <Link
        to="/profile"
        className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-sidebar-accent/60"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
          {DEMO_USER.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{DEMO_USER.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{DEMO_USER.plan}</span>
        </span>
      </Link>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2" asChild>
          <Link to="/settings">
            <User className="size-4" /> Account
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function GlobalSearch() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  return (
    <form
      className="relative w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/search", search: { q: value } });
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search company or ticker..."
        className="pl-9"
        aria-label="Search company or ticker"
      />
    </form>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <BrandMark />
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-4">
                <BrandMark />
                <div className="flex-1 overflow-y-auto">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
                <SidebarFooter />
              </div>
            </SheetContent>
          </Sheet>
          <div className="lg:hidden">
            <BrandMark compact />
          </div>
          <GlobalSearch />
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          {(title || actions) && (
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {actions}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
