import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  tone = "primary",
  hint,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  tone?: "primary" | "accent";
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("card-surface hover-lift relative overflow-hidden p-6", className)}>
      <div
        className={cn(
          "absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-xl",
          tone === "primary" ? "gradient-fresh" : "gradient-warm",
        )}
      />
      <div
        className={cn(
          "mb-4 grid h-11 w-11 shrink-0 place-items-center rounded-xl",
          tone === "primary"
            ? "bg-primary/12 text-primary"
            : "bg-accent/12 text-accent",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-3xl font-extrabold tracking-tight">
        {value}
        {unit && <span className="ml-1 text-base font-semibold text-muted-foreground">{unit}</span>}
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
      {hint && <p className="mt-3 text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}
