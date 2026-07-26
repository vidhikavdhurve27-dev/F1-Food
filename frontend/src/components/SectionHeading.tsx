import type { LucideIcon } from "lucide-react";

export function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span className="truncate">{eyebrow}</span>
        </div>
      )}
      <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}
