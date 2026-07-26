import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t gradient-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo size={44} withTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            AI Powered Food Rescue Platform connecting restaurants with NGOs to turn surplus meals
            into served plates.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Platform
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/restaurant" className="text-muted-foreground hover:text-primary">
                Restaurant Dashboard
              </Link>
            </li>
            <li>
              <Link to="/ngo" className="text-muted-foreground hover:text-primary">
                NGO Dashboard
              </Link>
            </li>
            <li>
              <Link to="/impact" className="text-muted-foreground hover:text-primary">
                Impact Dashboard
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-primary">
                About & AI Workflow
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            The mission
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Every confirmed surplus becomes a rescued meal. Nothing is dispatched to an NGO until a
            restaurant confirms the final count.
          </p>
        </div>
      </div>
      <div className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} F1+Food · Predict • Rescue • Feed
      </div>
    </footer>
  );
}
