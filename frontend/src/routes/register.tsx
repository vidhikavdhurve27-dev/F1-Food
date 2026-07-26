import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileCheck2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orgTypes, type OrgProfile, type OrgTypeId } from "@/data/organizations";
import { saveOrg } from "@/lib/org-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register Your Organization — F1+Food Verified Partners" },
      {
        name: "description",
        content:
          "Register a restaurant, temple, college mess, caterer, hotel, corporate cafeteria or NGO on F1+Food and get verified to donate or receive rescued food.",
      },
      { property: "og:title", content: "Register Your Organization — F1+Food" },
      {
        property: "og:description",
        content: "Verified partner onboarding with FSSAI, identity and organization proof checks.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<OrgTypeId>("restaurant");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    mapsLink: "",
    govRegistration: "",
    fssai: "",
    identityProof: "",
    orgProof: "",
  });

  const selected = orgTypes.find((t) => t.id === type)!;
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.contactPerson.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Organization name, contact person, phone and email are required.");
      return;
    }
    if (selected.needsFssai && !form.fssai.trim()) {
      toast.error(`FSSAI license is mandatory for ${selected.label}.`);
      return;
    }
    const org: OrgProfile = { ...form, type, status: "pending" };
    saveOrg(org);
    setSubmitted(true);
    toast.success("Registration submitted", {
      description: "Documents are under review — status: Verification Pending.",
    });
  };

  const approve = () => {
    const org: OrgProfile = { ...form, type, status: "verified" };
    saveOrg(org);
    toast.success("Verification approved", { description: "You are now a Verified Partner." });
    navigate({ to: selected.role === "receiver" ? "/ngo" : "/restaurant" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-fresh text-primary-foreground">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Register Your Organization</h1>
          <p className="text-sm text-muted-foreground">
            Only verified organizations can donate or receive food.
          </p>
        </div>
      </div>

      {/* Org type */}
      <section className="mt-10">
        <SectionHeading
          icon={Building2}
          eyebrow="Step 1"
          title="Organization Type"
          description="Every organization type gets its own tailored dashboard."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "card-surface hover-lift p-5 text-left transition-colors",
                type === t.id && "ring-2 ring-primary",
              )}
            >
              <div className="flex items-center gap-3">
                <t.icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0 truncate font-bold">{t.label}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.blurb}</p>
              <Badge variant={t.role === "receiver" ? "accentSoft" : "primarySoft"} className="mt-3">
                {t.role === "receiver" ? "Receives food" : "Donates food"}
              </Badge>
            </button>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="mt-14">
        <SectionHeading
          icon={UserRound}
          eyebrow="Step 2"
          title="Organization Details"
          description="Contact and location details used for routing and pickup coordination."
        />
        <div className="card-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <Field label="Organization Name" value={form.name} onChange={set("name")} placeholder="Spice Route Kitchen" />
          <Field
            label="Contact Person"
            value={form.contactPerson}
            onChange={set("contactPerson")}
            placeholder="Anitha R"
          />
          <Field label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+91 98400 11223" />
          <Field label="Email" value={form.email} onChange={set("email")} placeholder="owner@example.in" />
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              className="mt-2"
              rows={2}
              value={form.address}
              onChange={(e) => set("address")(e.target.value)}
              placeholder="12 Gandhi Salai, T. Nagar, Chennai"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="maps" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" /> Google Maps Location
            </Label>
            <Input
              id="maps"
              className="mt-2"
              value={form.mapsLink}
              onChange={(e) => set("mapsLink")(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="mt-14">
        <SectionHeading
          icon={FileCheck2}
          eyebrow="Step 3"
          title="Verification Documents"
          description="Uploaded proofs are reviewed before your organization is activated."
        />
        <div className="card-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <Field
            label="Government Registration (if applicable)"
            value={form.govRegistration}
            onChange={set("govRegistration")}
            placeholder="TN-REG-88213"
          />
          <Field
            label={`FSSAI License${selected.needsFssai ? " (required)" : " (optional)"}`}
            value={form.fssai}
            onChange={set("fssai")}
            placeholder="12419004000123"
          />
          <FileField label="Identity Proof" value={form.identityProof} onChange={set("identityProof")} />
          <FileField label="Organization Proof" value={form.orgProof} onChange={set("orgProof")} />
        </div>
      </section>

      {/* Status */}
      <section className="mt-14">
        <SectionHeading
          icon={ClipboardCheck}
          eyebrow="Step 4"
          title="Verification Status"
          description="Verification moves from pending to verified once documents are approved."
        />
        <div className="card-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <VerifiedBadge status="pending" />
            <span className="text-muted-foreground">↓</span>
            <VerifiedBadge type={type} status={submitted ? "verified" : "pending"} />
          </div>

          {!submitted ? (
            <Button variant="hero" size="xl" className="mt-6 w-full sm:w-auto" onClick={submit}>
              <ShieldCheck /> Submit for verification
            </Button>
          ) : (
            <div className="mt-6 animate-rise rounded-2xl border p-6 gradient-surface">
              <p className="font-display text-xl font-extrabold">Documents received</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your organization is in review. In this demo you can approve instantly to explore the
                verified dashboard.
              </p>
              <Button variant="warm" className="mt-4" onClick={approve}>
                <BadgeCheck /> Approve verification (demo)
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className="mt-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FileField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        className="mt-2"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            onChange(f.name);
            toast.success(`${label} uploaded`, { description: f.name });
          }
        }}
      />
      {value && <p className="mt-2 truncate text-xs font-semibold text-primary">{value}</p>}
    </div>
  );
}
