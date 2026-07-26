import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChefHat,
  CloudRain,
  Flame,
  ImagePlus,
  Leaf,
  Loader2,
  MapPin,
  PartyPopper,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Timer,
  TrendingDown,
  Truck,
  Users,
  Utensils,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import sampleFood from "@/assets/sample-food.jpg";
import {
  emptySafety,
  FoodSafetyChecklist,
  isSafetyComplete,
  type SafetyState,
} from "@/components/FoodSafetyChecklist";
import { SectionHeading } from "@/components/SectionHeading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ngos, urgencyVariant } from "@/data/ngos";

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Restaurant Dashboard — F1+Food Surplus Prediction" },
      {
        name: "description",
        content:
          "Log meals prepared and sold, upload a food photo, and let F1+Food AI predict tonight's surplus with freshness scoring and explainable insights.",
      },
      { property: "og:title", content: "Restaurant Dashboard — F1+Food" },
      {
        property: "og:description",
        content: "AI surplus prediction, freshness check and NGO matching for restaurant kitchens.",
      },
    ],
  }),
  component: RestaurantDashboard,
});

const stages = [
  "Reading kitchen inputs",
  "Running computer vision",
  "Scoring freshness",
  "Forecasting surplus",
  "Ranking NGOs",
];

const explanations = [
  {
    icon: CloudRain,
    title: "Rainy Weather",
    delta: "+6 Meals",
    weight: 27,
    copy: "Walk-in footfall drops sharply during rain, leaving prepared meals unsold.",
  },
  {
    icon: Users,
    title: "Weekend Pattern",
    delta: "+8 Meals",
    weight: 36,
    copy: "Historic weekend data shows larger batch cooking than actual demand.",
  },
  {
    icon: TrendingDown,
    title: "Lower Sales",
    delta: "+8 Meals",
    weight: 37,
    copy: "Meals sold are trailing the prepared count by a wide margin tonight.",
  },
];

function RestaurantDashboard() {
  const [form, setForm] = useState({
    name: "Spice Route Kitchen",
    prepared: "120",
    sold: "98",
    prepTime: "18:30",
    storage: "refrigerated",
    weather: "rainy",
    festival: "no",
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const [finalMeals, setFinalMeals] = useState("22");
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [safety, setSafety] = useState<SafetyState>(emptySafety);

  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (file?: File) => {
    if (!file) return;
    setImage(URL.createObjectURL(file));
    toast.success("Food image uploaded", { description: file.name });
  };

  const predict = () => {
    if (!form.name.trim() || !form.prepared || !form.sold) {
      toast.error("Please complete restaurant name, meals prepared and meals sold.");
      return;
    }
    setLoading(true);
    setDone(false);
    setConfirmed(null);
    setStage(0);
    stages.forEach((_, i) => {
      setTimeout(() => setStage(i + 1), (i + 1) * 620);
    });
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      toast.success("AI prediction ready", { description: "22 meals surplus · 94% confidence" });
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, stages.length * 620 + 400);
  };

  const confirm = () => {
    const n = Number(finalMeals);
    if (Number.isNaN(n) || n < 0) {
      toast.error("Enter a valid number of remaining meals.");
      return;
    }
    if (n > 0 && !isSafetyComplete(safety)) {
      toast.error("Complete the food safety checklist", {
        description: "All four checks and the safety declaration are mandatory.",
      });
      return;
    }
    setConfirmed(n);
    if (n === 0) {
      toast.info("No Surplus Today — NGOs were not notified.");
    } else {
      toast.success(`${n} meals confirmed`, { description: "Nearby NGOs are being notified now." });
    }
  };


  const shownImage = image ?? sampleFood;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-fresh text-primary-foreground">
            <ChefHat className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold sm:text-3xl">Restaurant Dashboard</h1>
            <p className="truncate text-sm text-muted-foreground">
              Log tonight's kitchen and predict surplus
            </p>
          </div>
        </div>
        <Badge variant="primarySoft">
          <Activity /> AI Online
        </Badge>
      </div>

      {/* Input form */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="card-surface p-6 sm:p-8">
          <SectionHeading icon={Utensils} eyebrow="Step 1" title="Kitchen details" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="rname">Restaurant Name</Label>
              <Input
                id="rname"
                className="mt-2"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="e.g. Spice Route Kitchen"
              />
            </div>
            <div>
              <Label htmlFor="prep">Meals Prepared</Label>
              <Input
                id="prep"
                type="number"
                min={0}
                className="mt-2"
                value={form.prepared}
                onChange={(e) => set("prepared")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sold">Meals Sold</Label>
              <Input
                id="sold"
                type="number"
                min={0}
                className="mt-2"
                value={form.sold}
                onChange={(e) => set("sold")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ptime">Preparation Time</Label>
              <Input
                id="ptime"
                type="time"
                className="mt-2"
                value={form.prepTime}
                onChange={(e) => set("prepTime")(e.target.value)}
              />
            </div>
            <div>
              <Label>Storage Method</Label>
              <Select value={form.storage} onValueChange={set("storage")}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select storage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="room">Room Temperature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Weather</Label>
              <Select value={form.weather} onValueChange={set("weather")}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Festival</Label>
              <Select value={form.festival} onValueChange={set("festival")}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Festival day?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="card-surface flex flex-col p-6 sm:p-8">
          <SectionHeading icon={ImagePlus} eyebrow="Step 2" title="Upload food image" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0]);
            }}
            className="group flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 p-8 text-center transition-colors hover:border-primary hover:bg-primary/10"
          >
            {image ? (
              <img
                src={image}
                alt="Uploaded surplus food"
                className="max-h-56 w-full rounded-xl object-cover"
              />
            ) : (
              <>
                <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-primary-foreground animate-pulse-ring">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <p className="font-display text-lg font-bold">Drop a photo of the surplus tray</p>
                <p className="text-sm text-muted-foreground">
                  PNG or JPG · our vision model detects dishes and counts meals
                </p>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button
            variant="hero"
            size="xl"
            className="mt-6 w-full"
            onClick={predict}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Brain />}
            {loading ? "Predicting…" : "Predict Surplus"}
          </Button>
        </div>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="card-surface mt-8 animate-fade-in p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
            <p className="font-display font-bold">AI pipeline running…</p>
          </div>
          <Progress value={(stage / stages.length) * 100} className="mt-4" />
          <ul className="mt-5 grid gap-2 sm:grid-cols-5">
            {stages.map((s, i) => (
              <li
                key={s}
                className={`rounded-xl border p-3 text-xs font-semibold transition-colors ${
                  i < stage
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {i < stage ? "✓ " : ""}
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={resultsRef} />

      {done && (
        <div className="mt-14 space-y-14 animate-rise">
          {/* Computer vision */}
          <section>
            <SectionHeading
              icon={ScanEye}
              eyebrow="Step 3 · Computer Vision"
              title="AI Food Recognition"
              description="Detected from the uploaded tray image."
            />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
              <div className="card-surface overflow-hidden p-2">
                <img
                  src={shownImage}
                  alt="Analyzed surplus food tray"
                  loading="lazy"
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="card-surface p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Detected Food
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Veg Biryani", "Rice", "Curry"].map((f) => (
                      <Badge key={f} variant="primarySoft">
                        <Utensils /> {f}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="card-surface p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Estimated Quantity
                  </p>
                  <p className="mt-2 font-display text-3xl font-extrabold text-primary">24 Meals</p>
                </div>
                <div className="card-surface p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Food Category
                  </p>
                  <p className="mt-2 font-display text-2xl font-extrabold">Prepared Meal</p>
                </div>
                <div className="card-surface p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-2 font-display text-3xl font-extrabold text-accent">96%</p>
                  <Progress value={96} className="mt-3" />
                </div>
              </div>
            </div>
          </section>

          {/* Freshness */}
          <section>
            <SectionHeading
              icon={Leaf}
              eyebrow="Step 4 · Freshness AI"
              title="Freshness Prediction"
              description="Storage method and preparation time drive the safe donation window."
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="card-surface hover-lift p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-success/12 text-success">
                  <Leaf className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Freshness
                </p>
                <p className="mt-2 font-display text-4xl font-extrabold text-success">96%</p>
                <Progress value={96} className="mt-4" />
              </div>
              <div className="card-surface hover-lift p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-success/12 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Safe to Donate
                </p>
                <Badge variant="success" className="mt-3 text-sm">
                  <CheckCircle2 /> YES
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                  {form.storage === "refrigerated" ? "Refrigerated" : "Room temperature"} storage
                  verified
                </p>
              </div>
              <div className="card-surface hover-lift p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent/12 text-accent">
                  <Timer className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Donate Within
                </p>
                <p className="mt-2 font-display text-4xl font-extrabold text-accent">2 Hours</p>
                <Badge variant="successSoft" className="mt-3">
                  Window open
                </Badge>
              </div>
            </div>
          </section>

          {/* Surplus prediction */}
          <section>
            <SectionHeading
              icon={Brain}
              eyebrow="Step 5 · Prediction"
              title="AI Surplus Prediction"
            />
            <div className="relative overflow-hidden rounded-3xl gradient-brand p-1 shadow-lift">
              <div className="rounded-[calc(var(--radius)+8px)] bg-card p-6 sm:p-10">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Predicted Surplus
                    </p>
                    <p className="mt-2 font-display text-5xl font-extrabold text-gradient-brand">
                      22
                      <span className="ml-2 text-xl text-muted-foreground">Meals</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Confidence
                    </p>
                    <p className="mt-2 font-display text-5xl font-extrabold text-primary">94%</p>
                    <Progress value={94} className="mt-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Pickup Recommendation
                    </p>
                    <p className="mt-2 font-display text-5xl font-extrabold text-accent">7:15 PM</p>
                    <Badge variant="accentSoft" className="mt-4">
                      <Truck /> Within freshness window
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Explainability */}
          <section>
            <SectionHeading
              icon={Sparkles}
              eyebrow="Step 6 · Explainable AI"
              title="Explain My Prediction"
              description="The three strongest drivers behind tonight's forecast."
            />
            <div className="grid gap-5 sm:grid-cols-3">
              {explanations.map((e) => (
                <div key={e.title} className="card-surface hover-lift p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                      <e.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="accent">{e.delta}</Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.copy}</p>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Contribution</span>
                      <span>{e.weight}%</span>
                    </div>
                    <Progress value={e.weight} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final confirmation */}
          <section>
            <SectionHeading
              icon={CheckCircle2}
              eyebrow="Step 7 · Human in the loop"
              title="Final Confirmation"
              description="Review the AI prediction and confirm what is actually left in the kitchen."
            />
            <div className="card-surface p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <div className="max-w-sm">
                  <Label htmlFor="final">Final Remaining Meals</Label>
                  <Input
                    id="final"
                    type="number"
                    min={0}
                    className="mt-2"
                    value={finalMeals}
                    onChange={(e) => setFinalMeals(e.target.value)}
                  />
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-accent">
                    <Flame className="h-4 w-4 shrink-0" />
                    NGOs will only be notified after confirmation.
                  </p>
                </div>
                <Button variant="hero" size="xl" onClick={confirm}>
                  <CheckCircle2 /> Confirm Final Surplus
                </Button>
              </div>

              <div className="mt-6">
                <FoodSafetyChecklist state={safety} onChange={setSafety} />
              </div>



              {confirmed !== null && (
                <div className="mt-6 animate-rise rounded-2xl border p-6 gradient-surface">
                  {confirmed === 0 ? (
                    <>
                      <Badge variant="secondary">
                        <Leaf /> Zero waste
                      </Badge>
                      <p className="mt-3 font-display text-2xl font-extrabold">No Surplus Today</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Nothing was dispatched — no NGO notifications were sent.
                      </p>
                    </>
                  ) : (
                    <>
                      <Badge variant="success">
                        <CheckCircle2 /> Confirmed
                      </Badge>
                      <p className="mt-3 font-display text-2xl font-extrabold">
                        {confirmed} meals released for rescue
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ngos.length} matched NGOs notified · pickup recommended 7:15 PM
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* NGO recommendation */}
          {confirmed !== null && confirmed > 0 && (
            <section>
              <SectionHeading
                icon={Users}
                eyebrow="Step 8 · Matching"
                title="NGO Recommendation"
                description="Ranked by distance, capacity, urgency and delivery time."
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {ngos.map((n) => (
                  <div key={n.name} className="card-surface hover-lift p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-fresh text-primary-foreground">
                        <Users className="h-5 w-5" />
                      </div>
                      <Badge variant={urgencyVariant[n.urgency]}>{n.urgency} urgency</Badge>
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
                    <Button
                      variant="warm"
                      className="mt-5 w-full"
                      onClick={() =>
                        toast.success(`Pickup accepted by ${n.name}`, {
                          description: `ETA ${n.etaMin} min · route optimized`,
                        })
                      }
                    >
                      <Truck /> Accept Pickup
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="brand" size="lg">
                  <Link to="/ngo">
                    Open route optimization <ArrowRight />
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </div>
      )}

      {!done && !loading && (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Thermometer className="h-4 w-4 shrink-0 text-primary" />
          Fill the form, upload a tray photo and hit Predict Surplus to run the full AI pipeline.
        </p>
      )}
      {!done && !loading && form.festival === "yes" && (
        <p className="mt-2 flex items-center gap-2 text-sm text-accent">
          <PartyPopper className="h-4 w-4 shrink-0" /> Festival mode raises expected surplus.
        </p>
      )}
    </div>
  );
}
