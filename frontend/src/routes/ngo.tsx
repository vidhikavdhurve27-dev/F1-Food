import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  Bell,
  Building2,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Timer,
  Truck,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ngos, urgencyVariant } from "@/data/ngos";

export const Route = createFileRoute("/ngo")({
  head: () => ({
    meta: [
      { title: "NGO Dashboard — Accept Pickups & Optimize Routes | F1+Food" },
      {
        name: "description",
        content:
          "NGOs see AI-ranked surplus offers with distance, capacity and urgency, accept pickups and follow the shortest optimized route.",
      },
      { property: "og:title", content: "NGO Dashboard — F1+Food" },
      {
        property: "og:description",
        content: "AI-ranked rescue offers, pickup acceptance and route optimization for NGOs.",
      },
    ],
  }),
  component: NgoDashboard,
});

function NgoDashboard() {
  const [accepted, setAccepted] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-warm text-accent-foreground">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold sm:text-3xl">NGO Dashboard</h1>
            <p className="truncate text-sm text-muted-foreground">
              AI-ranked rescue offers near you
            </p>
          </div>
        </div>
        <Badge variant="accentSoft">
          <Bell /> 1 new confirmed surplus
        </Badge>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Utensils} label="Meals available now" value="22" hint="Spice Route Kitchen" />
        <StatCard icon={Timer} label="Donate within" value="2" unit="hrs" tone="accent" />
        <StatCard icon={Truck} label="Active pickups" value="3" />
        <StatCard icon={Users} label="Families in queue" value="46" tone="accent" />
      </div>

      {/* NGO ranking */}
      <section className="mt-16">
        <SectionHeading
          icon={Users}
          eyebrow="AI ranking"
          title="NGO Recommendation"
          description="Priority scoring blends proximity, capacity, urgency and estimated arrival."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ngos.map((n, i) => (
            <div key={n.name} className="card-surface hover-lift relative p-6">
              {i === 0 && (
                <Badge variant="default" className="absolute -top-3 left-6">
                  Top match
                </Badge>
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-fresh text-primary-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <Badge variant={urgencyVariant[n.urgency]}>{n.urgency}</Badge>
              </div>
              <h3 className="mt-4 truncate text-lg font-bold">{n.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.focus}</p>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" /> Distance
                  </dt>
                  <dd className="font-bold">{n.distanceKm} km</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Utensils className="h-4 w-4 shrink-0" /> Capacity
                  </dt>
                  <dd className="font-bold">{n.capacity} Meals</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4 shrink-0" /> ETA
                  </dt>
                  <dd className="font-bold">{n.etaMin} min</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Match score</span>
                  <span>{n.matchScore}%</span>
                </div>
                <Progress value={n.matchScore} />
              </div>

              <Button
                variant={accepted === n.name ? "outline" : "warm"}
                className="mt-5 w-full"
                onClick={() => {
                  setAccepted(n.name);
                  toast.success(`Pickup accepted by ${n.name}`, {
                    description: `Route optimized · ETA ${n.etaMin} min`,
                  });
                }}
              >
                {accepted === n.name ? (
                  <>
                    <CheckCircle2 /> Pickup accepted
                  </>
                ) : (
                  <>
                    <Truck /> Accept Pickup
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Route optimization */}
      <section className="mt-16">
        <SectionHeading
          icon={RouteIcon}
          eyebrow="Logistics"
          title="Route Optimization"
          description="Shortest live route from the restaurant to the assigned NGO."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card-surface relative overflow-hidden p-0">
            <div className="relative h-80 w-full gradient-surface sm:h-96">
              {/* map grid */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" fill="none">
                <path
                  d="M60 60 C 140 70, 150 170, 250 180 S 320 230, 340 240"
                  stroke="var(--color-primary)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="10 12"
                  className="animate-[shimmer_1.6s_linear_infinite]"
                />
                <path
                  d="M60 60 C 140 70, 150 170, 250 180 S 320 230, 340 240"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="glass absolute left-4 top-6 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-soft">
                <Building2 className="h-4 w-4 shrink-0 text-primary" /> Restaurant · Spice Route
              </div>
              <div className="glass absolute bottom-6 right-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-soft">
                <HeartHandshake className="h-4 w-4 shrink-0 text-accent" />{" "}
                {accepted ?? ngos[0].name}
              </div>
              <div className="glass absolute bottom-6 left-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-soft">
                <Navigation className="h-4 w-4 shrink-0 text-primary" /> Shortest Route · 4.1 km
              </div>
            </div>
          </div>

          <div className="card-surface p-6 sm:p-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3 rounded-2xl border p-4">
                <Building2 className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate font-bold">Restaurant</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Spice Route Kitchen · 22 meals ready
                  </p>
                </div>
              </div>
              <div className="flex justify-center py-1">
                <ArrowDown className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl border p-4">
                <HeartHandshake className="h-5 w-5 shrink-0 text-accent" />
                <div className="min-w-0">
                  <p className="truncate font-bold">NGO</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {accepted ?? ngos[0].name} · capacity 50 meals
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Shortest Route
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-primary">4.1 km</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  ETA
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-accent">12 Minutes</p>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="mt-6 w-full"
              onClick={() => toast.success("Navigation started", { description: "ETA 12 minutes" })}
            >
              <Navigation /> Start navigation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
