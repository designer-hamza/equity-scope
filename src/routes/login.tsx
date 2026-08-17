import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — EquityScope" },
      {
        name: "description",
        content: "Sign in to your EquityScope workspace to access watchlists, comparisons and saved analyses.",
      },
      { property: "og:title", content: "Log in — EquityScope" },
      { property: "og:description", content: "Access your financial research workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Log in"
      description="Access your watchlists, comparisons and saved analyses."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link to="/forgot-password" className="hover:text-foreground">
            Forgot password?
          </Link>
          <span>
            No account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </span>
        </div>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="analyst@firm.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
