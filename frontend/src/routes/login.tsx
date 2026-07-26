import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoOrgs, orgTypeMap } from "@/data/organizations";
import { saveOrg } from "@/lib/org-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Partner Login — F1+Food Verified Food Rescue" },
      {
        name: "description",
        content:
          "Log in to your F1+Food organization dashboard to predict surplus, confirm donations or accept NGO pickups.",
      },
      { property: "og:title", content: "Partner Login — F1+Food" },
      {
        property: "og:description",
        content: "Access your verified organization dashboard on F1+Food.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (targetEmail: string) => {
    const org = demoOrgs.find((o) => o.email === targetEmail.trim().toLowerCase());
    if (!org) {
      toast.error("Organization not found", { description: "Pick a demo partner below or register." });
      return;
    }
    if (org.status !== "verified") {
      toast.warning("Verification pending", {
        description: "Only verified organizations can donate or receive food.",
      });
    }
    saveOrg(org);
    toast.success(`Welcome back, ${org.name}`);
    navigate({ to: orgTypeMap[org.type].role === "receiver" ? "/ngo" : "/restaurant" });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <div className="card-surface p-6 sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-fresh text-primary-foreground">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Partner Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your organization dashboard.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@spiceroute.in"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button variant="hero" size="lg" className="mt-6 w-full" onClick={() => signIn(email)}>
          <LogIn /> Sign in
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          New organization?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register and get verified
          </Link>
        </p>
      </div>

      <div className="card-surface p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          <ShieldCheck className="h-4 w-4 shrink-0" /> Demo partners
        </div>
        <h2 className="mt-2 text-xl font-extrabold">Sign in with one click</h2>
        <div className="mt-5 space-y-3">
          {demoOrgs.map((o) => (
            <button
              key={o.email}
              type="button"
              onClick={() => signIn(o.email)}
              className="hover-lift w-full rounded-2xl border p-4 text-left"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = orgTypeMap[o.type].icon;
                  return <Icon className="h-4 w-4 shrink-0 text-primary" />;
                })()}
                <span className="min-w-0 truncate font-bold">{o.name}</span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">{o.email}</p>
              <VerifiedBadge type={o.type} status={o.status} className="mt-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
