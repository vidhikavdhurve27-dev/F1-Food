import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  BarChart3,
  Bell,
  Brain,
  CheckCircle2,
  ClipboardList,
  Leaf,
  LogIn,
  Route as RouteIcon,
  ScanEye,
  Sparkles,
  Upload,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About F1+Food — The AI Food Rescue Workflow" },
      {
        name: "description",
        content:
          "How F1+Food works end to end: restaurant login, computer vision, freshness AI, surplus prediction, explainable AI, confirmation, NGO notification and route optimization.",
      },
      { property: "og:title", content: "About F1+Food — The AI Food Rescue Workflow" },
      {
        property: "og:description",
        content: "The complete 11-step AI workflow behind every rescued meal on F1+Food.",
      },
    ],
  }),
  component: About,
});

const flow = [
  { icon: LogIn, title: "Restaurant Login", copy: "Kitchen team signs in to the daily surplus console." },
  { icon: ClipboardList, title: "Enter Details", copy: "Meals prepared, sold, prep time, storage, weather, festival." },
  { icon: Upload, title: "Upload Food Image", copy: "One photo of the surplus tray is enough." },
  { icon: ScanEye, title: "Computer Vision", copy: "Dishes detected, quantity and category estimated." },
  { icon: Leaf, title: "Freshness AI", copy: "Safety score plus a strict donation window." },
  { icon: Brain, title: "Surplus Prediction", copy: "Forecast of tonight's leftover meals with confidence." },
  { icon: Sparkles, title: "Explainable AI", copy: "Weather, weekday and sales drivers made visible." },
  { icon: CheckCircle2, title: "Confirm Final Surplus", copy: "Human in the loop before anything is dispatched." },
  { icon: Bell, title: "Notify NGO", copy: "Ranked NGOs alerted by distance, capacity and urgency." },
  { icon: RouteIcon, title: "Route Optimization", copy: "Shortest route and live ETA for the pickup." },
  { icon: BarChart3, title: "Impact Dashboard", copy: "Meals, families, waste and CO₂ tracked forever." },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Badge variant="primarySoft" className="mb-4">
        <Sparkles /> About the platform
      </Badge>
      <h1 className="text-3xl font-extrabold sm:text-4xl">
        F1+Food turns kitchen guesswork into <span className="text-gradient-brand">rescued meals</span>
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Most surplus food is wasted because nobody knows how much will be left, whether it is still
        safe, or who nearby can take it in time. F1+Food answers all three questions with AI — and
        never notifies an NGO until the restaurant confirms the real final count.
      </p>

      <section className="mt-14">
        <SectionHeading
          icon={Brain}
          eyebrow="AI Workflow Diagram"
          title="From login to measured impact"
          description="Eleven stages, each one auditable."
        />
        <ol className="relative space-y-1">
          {flow.map((s, i) => (
            <li key={s.title}>
              <div className="card-surface hover-lift flex items-start gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Stage {i + 1}
                  </p>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.copy}</p>
                </div>
              </div>
              {i < flow.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-5 w-5 text-accent" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild variant="hero" size="lg">
          <Link to="/restaurant">Try the restaurant flow</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/impact">View impact</Link>
        </Button>
      </div>
    </div>
  );
}
