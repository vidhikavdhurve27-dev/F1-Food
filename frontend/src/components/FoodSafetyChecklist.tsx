import { ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const safetyItems = [
  { id: "today", label: "Food prepared today" },
  { id: "stored", label: "Properly stored (covered / temperature controlled)" },
  { id: "packed", label: "Hygienically packed for transport" },
  { id: "safe", label: "Safe for donation — no spoilage or odour" },
] as const;

export type SafetyState = Record<string, boolean>;

export const emptySafety: SafetyState = {
  today: false,
  stored: false,
  packed: false,
  safe: false,
  declaration: false,
};

export function isSafetyComplete(state: SafetyState) {
  return safetyItems.every((i) => state[i.id]) && state.declaration;
}

export function FoodSafetyChecklist({
  state,
  onChange,
}: {
  state: SafetyState;
  onChange: (next: SafetyState) => void;
}) {
  const toggle = (id: string) => (v: boolean | "indeterminate") =>
    onChange({ ...state, [id]: v === true });

  return (
    <div className="rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        <ShieldCheck className="h-4 w-4 shrink-0" /> Food safety checklist
      </div>
      <div className="mt-4 space-y-3">
        {safetyItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Checkbox
              id={`safety-${item.id}`}
              checked={!!state[item.id]}
              onCheckedChange={toggle(item.id)}
              className="mt-0.5"
            />
            <Label htmlFor={`safety-${item.id}`} className="text-sm font-medium leading-snug">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/8 p-4">
        <Checkbox
          id="safety-declaration"
          checked={!!state.declaration}
          onCheckedChange={toggle("declaration")}
          className="mt-0.5"
        />
        <Label htmlFor="safety-declaration" className="text-sm font-semibold leading-snug">
          “I certify that this food is safe for donation.”
        </Label>
      </div>
    </div>
  );
}
