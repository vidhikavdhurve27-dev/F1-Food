import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 40,
  showText = true,
  withTagline = false,
}: {
  className?: string;
  size?: number;
  showText?: boolean;
  withTagline?: boolean;
}) {
  return (
    <Link to="/" className={cn("flex min-w-0 items-center gap-3", className)}>
      <img
        src={logo}
        alt="F1+Food logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
      {showText && (
        <span className="min-w-0">
          <span className="block truncate font-display text-xl font-extrabold leading-none">
            <span className="text-primary">F1</span>
            <span className="text-accent">+</span>
            <span className="text-foreground">Food</span>
          </span>
          {withTagline && (
            <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Predict • Rescue • Feed
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
