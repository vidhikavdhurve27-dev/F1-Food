import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Building2,
  CloudRain,
  HeartHandshake,
  Leaf,
  Map,
  Route as RouteIcon,
  ScanEye,
  Sparkles,
  Timer,
  Users,
  Utensils,
} from "lucide-react";
import heroImage from "@/assets/hero-donation.jpg";
import { Logo } from "@/components/Logo";
import { StatCard } from "@/components/StatCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "F1+Food — Predict • Rescue • Feed" },
      {
        name: "description",
        content:
          "F1+Food is an AI-powered food rescue platform connecting restaurants with NGOs. Predict surplus, verify freshness and feed families before food is wasted.",
      },
      { property: "og:title", content: "F1+Food — Predict • Rescue • Feed" },
      {
        property: "og:description",
        content:
          "AI food rescue: surplus prediction, freshness scoring, NGO matching and route optimization.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: ScanEye, title: "Computer Vision", copy: "Detect dishes and estimate meal counts from one photo." },
  { icon: Leaf, title: "Freshness AI", copy: "Score safety and set a strict donation window." },
  { icon: Brain, title: "Surplus Prediction", copy: "Forecast leftovers from sales, weather and events." },
  { icon: RouteIcon, title: "Rescue Routing", copy: "Rank NGOs and optimize the fastest pickup route." },
];

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-surface">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full gradient-fresh opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full gradient-warm opacity-20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <Badge variant="accentSoft" className="mb-6">
              <Sparkles /> AI Food Rescue · Hackathon Demo
            </Badge>
            <Logo size={72} showText={false} className="mb-6 animate-float" />
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              <span className="text-gradient-brand">F1+Food</span>
              <br />
              rescues meals before
              <br />
              they become waste.
            </h1>
            <p className="mt-4 text-lg font-semibold uppercase tracking-[0.3em] text-accent">
              Predict • Rescue • Feed
            </p>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Restaurants log their kitchen in seconds. Our AI predicts surplus, verifies freshness
              and instantly matches the nearest NGO with capacity — with an optimized pickup route.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/restaurant">
                  <Building2 /> Restaurant Login
                </Link>
              </Button>
              <Button asChild variant="warm" size="xl">
                <Link to="/ngo">
                  <HeartHandshake /> NGO Login
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" /> 12 min average pickup
              </span>
              <span className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-accent" /> Weather-aware forecasting
              </span>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="card-surface overflow-hidden p-2 shadow-lift">
              <img
                src={heroImage}
                alt="Volunteers packing surplus restaurant meals and handing food boxes to an NGO delivery rider"
                width={1280}
                height={960}
                className="w-full rounded-2xl object-cover"
              />
            </div>
            <div className="glass absolute -bottom-6 left-4 rounded-2xl p-4 shadow-lift sm:left-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Live rescue
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">22 meals</p>
              <p className="text-xs text-muted-foreground">Confirmed · pickup 7:15 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          icon={Sparkles}
          eyebrow="Impact so far"
          title="Real plates, measured impact"
          description="Every rescue is tracked from kitchen to community kitchen table."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Utensils} label="Meals Saved" value="520" hint="Across 42 partner kitchens" />
          <StatCard icon={Leaf} label="Food Waste Reduced" value="180" unit="kg" tone="accent" />
          <StatCard icon={CloudRain} label="CO₂ Saved" value="300" unit="kg" />
          <StatCard icon={Users} label="NGOs Connected" value="18" tone="accent" hint="Active in 6 zones" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeading
          icon={Brain}
          eyebrow="How F1+Food works"
          title="Four AI stages, one confirmed rescue"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card-surface hover-lift p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-sm font-bold text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg">
            <Link to="/about">
              See the AI workflow <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/impact">
              <Map /> Impact dashboard
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
