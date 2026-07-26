import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { foodEvents, levelMeta, type FoodEvent } from "@/data/events";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Festival & Event Calendar — High-Surplus Days | F1+Food" },
      {
        name: "description",
        content:
          "AI-forecasted festival, wedding and campus events that create food surplus in Chennai, with expected meal volumes and NGO readiness alerts.",
      },
      { property: "og:title", content: "Festival & Event Calendar — F1+Food" },
      {
        property: "og:description",
        content:
          "See which upcoming festivals and events will generate surplus meals, and alert NGOs in advance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventCalendar,
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function EventCalendar() {
  const [cursor, setCursor] = useState({ year: 2026, month: 7 }); // August 2026
  const [selected, setSelected] = useState<FoodEvent | null>(foodEvents[0]);

  const monthEvents = useMemo(
    () =>
      foodEvents.filter((e) => {
        const d = new Date(e.date + "T00:00:00");
        return d.getFullYear() === cursor.year && d.getMonth() === cursor.month;
      }),
    [cursor],
  );

  const eventByDay = useMemo(() => {
    const map = new Map<number, FoodEvent>();
    monthEvents.forEach((e) => map.set(new Date(e.date + "T00:00:00").getDate(), e));
    return map;
  }, [monthEvents]);

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shift = (delta: number) =>
    setCursor((c) => {
      const m = c.month + delta;
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  const totalMeals = monthEvents.reduce((s, e) => s + e.expectedMeals, 0);
  const highDays = monthEvents.filter((e) => e.level === "high").length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionHeading
        icon={CalendarDays}
        eyebrow="Feature 09 · Predictive planning"
        title="Festival & Event Calendar"
        description="Our forecasting model scans festival dates, muhurtham wedding clusters, campus schedules and weather to flag days that will produce large food surplus — so NGOs and volunteers are staffed before the surge."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: TrendingUp,
            label: "Forecast surplus this month",
            value: `${totalMeals.toLocaleString("en-IN")} meals`,
          },
          { icon: Sparkles, label: "High-surplus days flagged", value: `${highDays} days` },
          { icon: Truck, label: "Suggested extra vehicles", value: `${highDays * 2} pickups` },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl border p-5">
            <s.icon className="mb-3 h-5 w-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Calendar grid */}
        <div className="glass rounded-2xl border p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-extrabold">
              {MONTHS[cursor.month]} {cursor.year}
            </h3>
            <Button variant="ghost" size="icon" aria-label="Next month" onClick={() => shift(1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground">
            {WEEKDAYS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <span key={`e${i}`} />;
              const ev = eventByDay.get(day);
              const meta = ev ? levelMeta[ev.level] : null;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => ev && setSelected(ev)}
                  disabled={!ev}
                  aria-label={ev ? `${day} — ${ev.name}` : `${day}`}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                    ev
                      ? `cursor-pointer hover:scale-[1.04] ${meta!.chip} ${
                          selected?.date === ev.date ? `ring-2 ${meta!.ring}` : ""
                        }`
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {day}
                  {ev && <span className={`mt-1 h-1.5 w-1.5 rounded-full ${meta!.dot}`} />}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4 text-xs font-semibold text-muted-foreground">
            {(["high", "medium", "low"] as const).map((l) => (
              <span key={l} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${levelMeta[l].dot}`} />
                {levelMeta[l].label}
              </span>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="glass rounded-2xl border p-6">
              <Badge variant="accentSoft">{selected.category}</Badge>
              <h3 className="mt-3 text-xl font-extrabold">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(selected.date + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-card/60 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Expected surplus</p>
                  <p className="text-lg font-extrabold">
                    {selected.expectedMeals.toLocaleString("en-IN")} meals
                  </p>
                </div>
                <div className="rounded-xl border bg-card/60 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Intensity</p>
                  <p className="text-lg font-extrabold">{levelMeta[selected.level].label}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{selected.note}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.sources.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>

              <Button
                variant="hero"
                className="mt-5 w-full"
                onClick={() =>
                  toast.success("NGOs alerted", {
                    description: `${selected.name}: advance notice sent to nearby NGOs and volunteers.`,
                  })
                }
              >
                <Bell className="h-4 w-4" />
                Alert NGOs in advance
              </Button>
            </div>
          ) : (
            <div className="glass rounded-2xl border p-6 text-sm text-muted-foreground">
              Select a highlighted day to see the AI surplus forecast.
            </div>
          )}

          <div className="glass rounded-2xl border p-6">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Upcoming flagged days
            </h4>
            <ul className="space-y-3">
              {foodEvents.slice(0, 5).map((e) => (
                <li key={e.date}>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(e.date + "T00:00:00");
                      setCursor({ year: d.getFullYear(), month: d.getMonth() });
                      setSelected(e);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-secondary"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${levelMeta[e.level].dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{e.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        · {e.expectedMeals.toLocaleString("en-IN")} meals
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
