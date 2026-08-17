import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/layout/AppShell";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <BrandMark />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-14">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
          <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            Prototype authentication. No credentials are stored or verified in this demo build.
          </p>
        </div>
      </main>
    </div>
  );
}
