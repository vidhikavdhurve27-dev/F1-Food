import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/restaurant", label: "Restaurant Dashboard" },
  { to: "/ngo", label: "NGO Dashboard" },
  { to: "/impact", label: "Impact Dashboard" },
  { to: "/calendar", label: "Event Calendar" },
  { to: "/register", label: "Register" },
  { to: "/about", label: "About" },
] as const;


export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo className="mr-auto" size={36} />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <ThemeToggle />
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
          <Link to="/register">Get Verified</Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {open && (
        <div className="animate-fade-in border-t bg-card px-4 pb-4 pt-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
