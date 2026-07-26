import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CloudRain,
  Leaf,
  LineChart as LineChartIcon,
  TrendingUp,
  Users,
  Utensils,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Dashboard — Meals Saved & CO₂ Avoided | F1+Food" },
      {
        name: "description",
        content:
          "Track F1+Food impact: 520 meals saved, 170 families fed, 180 kg food waste reduced and 300 kg CO₂ avoided across partner restaurants and NGOs.",
      },
      { property: "og:title", content: "Impact Dashboard — F1+Food" },
      {
        property: "og:description",
        content: "Live analytics on rescued meals, families fed, waste reduced and CO₂ saved.",
      },
    ],
  }),
  component: ImpactDashboard,
});

const weekly = [
  { day: "Mon", meals: 48, co2: 26 },
  { day: "Tue", meals: 62, co2: 34 },
  { day: "Wed", meals: 55, co2: 30 },
  { day: "Thu", meals: 78, co2: 44 },
  { day: "Fri", meals: 96, co2: 54 },
  { day: "Sat", meals: 112, co2: 62 },
  { day: "Sun", meals: 69, co2: 38 },
];

const categories = [
  { name: "Prepared Meals", value: 58 },
  { name: "Rice & Grains", value: 22 },
  { name: "Curries", value: 13 },
  { name: "Bakery", value: 7 },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

const goals = [
  { label: "Monthly meal goal (700)", value: 74 },
  { label: "Waste reduction target", value: 62 },
  { label: "NGO network coverage", value: 81 },
  { label: "On-time pickups", value: 93 },
];

function ImpactDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        icon={TrendingUp}
        eyebrow="Impact Dashboard"
        title="Rescue analytics"
        description="Aggregated results across every confirmed surplus on the F1+Food network."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Utensils} label="Meals Saved" value="520" />
        <StatCard icon={Users} label="Families Fed" value="170" tone="accent" />
        <StatCard icon={Leaf} label="Food Waste Reduced" value="180" unit="kg" />
        <StatCard icon={CloudRain} label="CO₂ Saved" value="300" unit="kg" tone="accent" />
        <StatCard icon={Building2} label="Restaurants Connected" value="42" />
        <StatCard icon={Users} label="NGOs Connected" value="18" tone="accent" />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold">Meals rescued this week</h2>
          <p className="mt-1 text-sm text-muted-foreground">Daily confirmed surplus volume</p>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="mealsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 14,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="meals"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  fill="url(#mealsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold">Rescued food mix</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share by detected category</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88}>
                  {categories.map((c, i) => (
                    <Cell key={c.name} fill={pieColors[i]} stroke="var(--color-card)" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 14,
                    color: "var(--color-card-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {categories.map((c, i) => (
              <li key={c.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: pieColors[i] }}
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{c.name}</span>
                <span className="font-bold">{c.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="card-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold">Progress against targets</h2>
          <div className="mt-6 space-y-5">
            {goals.map((g) => (
              <div key={g.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-semibold">{g.label}</span>
                  <span className="shrink-0 font-bold text-primary">{g.value}%</span>
                </div>
                <Progress value={g.value} />
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 shrink-0 text-accent" />
            <h2 className="text-lg font-bold">CO₂ avoided (kg)</h2>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 14,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Bar dataKey="co2" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
