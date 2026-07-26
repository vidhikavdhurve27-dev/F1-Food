import { useEffect, useState } from "react";
import type { OrgProfile } from "@/data/organizations";

const KEY = "f1food.org";

export function readOrg(): OrgProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrgProfile) : null;
  } catch {
    return null;
  }
}

export function saveOrg(org: OrgProfile) {
  window.localStorage.setItem(KEY, JSON.stringify(org));
  window.dispatchEvent(new Event("f1food-org"));
}

export function clearOrg() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("f1food-org"));
}

/** Client-only session hook — returns null during SSR and first paint. */
export function useOrg() {
  const [org, setOrg] = useState<OrgProfile | null>(null);

  useEffect(() => {
    const sync = () => setOrg(readOrg());
    sync();
    window.addEventListener("f1food-org", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("f1food-org", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return org;
}
