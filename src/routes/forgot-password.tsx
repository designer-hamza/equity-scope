import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — EquityScope" },
      {
        name: "description",
        content: "Request a password reset link for your EquityScope research account.",
      },
      { property: "og:title", content: "Reset password — EquityScope" },
      { property: "og:description", content: "Recover access to your research workspace." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout
      title="Reset your password"
      description="We'll send a reset link to your registered email address."
      footer={
        <span>
          Remembered it?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Back to log in
          </Link>
        </span>
      }
    >
      {sent ? (
        <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
          If an account exists for that address, a reset link would be sent. Email delivery is
          inactive in this prototype.
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="analyst@firm.com" required />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
