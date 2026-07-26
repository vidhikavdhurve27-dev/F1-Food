import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Hotel,
  Landmark,
  PartyPopper,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type OrgTypeId =
  | "restaurant"
  | "temple"
  | "college"
  | "caterer"
  | "hotel"
  | "corporate"
  | "ngo";

export type OrgType = {
  id: OrgTypeId;
  label: string;
  emoji: string;
  icon: LucideIcon;
  role: "donor" | "receiver";
  blurb: string;
  needsFssai: boolean;
};

export const orgTypes: OrgType[] = [
  {
    id: "restaurant",
    label: "Restaurant",
    emoji: "🍽",
    icon: Utensils,
    role: "donor",
    blurb: "Daily surplus prediction and rescue dispatch",
    needsFssai: true,
  },
  {
    id: "temple",
    label: "Temple / Annadhanam Center",
    emoji: "🛕",
    icon: Landmark,
    role: "donor",
    blurb: "Recurring annadhanam and festival prasadam surplus",
    needsFssai: false,
  },
  {
    id: "college",
    label: "College / Hostel Mess",
    emoji: "🎓",
    icon: GraduationCap,
    role: "donor",
    blurb: "Mess batch cooking and weekend low-occupancy surplus",
    needsFssai: true,
  },
  {
    id: "caterer",
    label: "Caterer / Event Organizer",
    emoji: "🎉",
    icon: PartyPopper,
    role: "donor",
    blurb: "Weddings and large functions with high leftover volume",
    needsFssai: true,
  },
  {
    id: "hotel",
    label: "Hotel",
    emoji: "🏨",
    icon: Hotel,
    role: "donor",
    blurb: "Buffet and banquet surplus across multiple outlets",
    needsFssai: true,
  },
  {
    id: "corporate",
    label: "Corporate Cafeteria",
    emoji: "🏢",
    icon: Building2,
    role: "donor",
    blurb: "Weekday cafeteria surplus with predictable patterns",
    needsFssai: true,
  },
  {
    id: "ngo",
    label: "NGO",
    emoji: "🤝",
    icon: HeartHandshake,
    role: "receiver",
    blurb: "Receive AI-ranked rescue offers and optimized routes",
    needsFssai: false,
  },
];

export const orgTypeMap = Object.fromEntries(orgTypes.map((t) => [t.id, t])) as Record<
  OrgTypeId,
  OrgType
>;

export type VerificationStatus = "pending" | "verified";

export type OrgProfile = {
  name: string;
  type: OrgTypeId;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  mapsLink: string;
  govRegistration: string;
  fssai: string;
  identityProof: string;
  orgProof: string;
  status: VerificationStatus;
};

/** Demo directory used for the login screen and partner listings. */
export const demoOrgs: OrgProfile[] = [
  {
    name: "Spice Route Kitchen",
    type: "restaurant",
    contactPerson: "Anitha R",
    phone: "+91 98400 11223",
    email: "owner@spiceroute.in",
    address: "12 Gandhi Salai, T. Nagar, Chennai",
    mapsLink: "https://maps.google.com/?q=T+Nagar+Chennai",
    govRegistration: "TN-REG-88213",
    fssai: "12419004000123",
    identityProof: "aadhaar-anitha.pdf",
    orgProof: "gst-certificate.pdf",
    status: "verified",
  },
  {
    name: "Sri Kapaleeswarar Annadhanam",
    type: "temple",
    contactPerson: "Ramesh Iyer",
    phone: "+91 90030 44521",
    email: "seva@kapaleeswarar.org",
    address: "Mylapore, Chennai",
    mapsLink: "https://maps.google.com/?q=Mylapore+Chennai",
    govRegistration: "TR-TN-2291",
    fssai: "",
    identityProof: "trustee-id.pdf",
    orgProof: "trust-deed.pdf",
    status: "verified",
  },
  {
    name: "Smile Foundation",
    type: "ngo",
    contactPerson: "Divya N",
    phone: "+91 91760 55810",
    email: "ops@smilefoundation.org",
    address: "Adyar, Chennai",
    mapsLink: "https://maps.google.com/?q=Adyar+Chennai",
    govRegistration: "80G-AAATS1234",
    fssai: "",
    identityProof: "director-id.pdf",
    orgProof: "12a-registration.pdf",
    status: "verified",
  },
  {
    name: "Grand Sterling Caterers",
    type: "caterer",
    contactPerson: "Farhan A",
    phone: "+91 99620 77410",
    email: "events@grandsterling.in",
    address: "Porur, Chennai",
    mapsLink: "https://maps.google.com/?q=Porur+Chennai",
    govRegistration: "TN-REG-40119",
    fssai: "12419004009981",
    identityProof: "pan-farhan.pdf",
    orgProof: "shop-license.pdf",
    status: "pending",
  },
];
