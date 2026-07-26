export type SurplusLevel = "high" | "medium" | "low";

export type FoodEvent = {
  date: string; // ISO yyyy-mm-dd
  name: string;
  category: "Festival" | "Wedding Season" | "Campus" | "Corporate" | "Community";
  level: SurplusLevel;
  expectedMeals: number;
  sources: string[];
  note: string;
};

/** Demo AI-forecasted high-surplus calendar for Chennai partners. */
export const foodEvents: FoodEvent[] = [
  {
    date: "2026-08-02",
    name: "Aadi Perukku Annadhanam",
    category: "Festival",
    level: "high",
    expectedMeals: 1450,
    sources: ["Temples", "Community Kitchens"],
    note: "Temple annadhanam peaks; prasadam surplus expected after 1 PM.",
  },
  {
    date: "2026-08-09",
    name: "Campus Weekend Low Occupancy",
    category: "Campus",
    level: "medium",
    expectedMeals: 420,
    sources: ["College Mess", "Hostels"],
    note: "Mess batch cooking stays constant while ~35% of students travel home.",
  },
  {
    date: "2026-08-15",
    name: "Independence Day Corporate Lunches",
    category: "Corporate",
    level: "medium",
    expectedMeals: 380,
    sources: ["Corporate Cafeterias", "Hotels"],
    note: "Half-day offices — pre-ordered buffets often go unclaimed.",
  },
  {
    date: "2026-08-23",
    name: "Muhurtham Wedding Cluster",
    category: "Wedding Season",
    level: "high",
    expectedMeals: 2100,
    sources: ["Caterers", "Banquet Halls"],
    note: "14 auspicious-date weddings in the city; heaviest leftover volume of the month.",
  },
  {
    date: "2026-08-28",
    name: "Onam Sadhya Feasts",
    category: "Festival",
    level: "high",
    expectedMeals: 1780,
    sources: ["Restaurants", "Community Kitchens"],
    note: "Sadhya over-preparation is historically 22% above demand.",
  },
  {
    date: "2026-09-05",
    name: "Teachers' Day Campus Events",
    category: "Campus",
    level: "low",
    expectedMeals: 160,
    sources: ["College Mess"],
    note: "Small snack surplus; single-vehicle pickup is enough.",
  },
  {
    date: "2026-09-14",
    name: "Vinayagar Chaturthi",
    category: "Festival",
    level: "high",
    expectedMeals: 1620,
    sources: ["Temples", "Restaurants"],
    note: "Modak and prasadam distribution; short 4-hour freshness window.",
  },
  {
    date: "2026-09-21",
    name: "Monsoon Dine-in Dip",
    category: "Community",
    level: "medium",
    expectedMeals: 540,
    sources: ["Restaurants", "Hotels"],
    note: "Heavy rain forecast reduces walk-ins ~30% while prep stays planned.",
  },
];

export const levelMeta: Record<
  SurplusLevel,
  { label: string; dot: string; chip: string; ring: string }
> = {
  high: {
    label: "High surplus",
    dot: "bg-destructive",
    chip: "bg-destructive/10 text-destructive border-destructive/30",
    ring: "ring-destructive/40",
  },
  medium: {
    label: "Medium surplus",
    dot: "bg-accent",
    chip: "bg-accent/10 text-accent border-accent/30",
    ring: "ring-accent/40",
  },
  low: {
    label: "Low surplus",
    dot: "bg-primary",
    chip: "bg-primary/10 text-primary border-primary/30",
    ring: "ring-primary/40",
  },
};
