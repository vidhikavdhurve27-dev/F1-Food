export type Ngo = {
  name: string;
  distanceKm: number;
  capacity: number;
  urgency: "High" | "Medium" | "Low";
  etaMin: number;
  focus: string;
  matchScore: number;
};

export const ngos: Ngo[] = [
  {
    name: "Smile Foundation",
    distanceKm: 2,
    capacity: 50,
    urgency: "High",
    etaMin: 10,
    focus: "Street children & night shelters",
    matchScore: 97,
  },
  {
    name: "Annapurna Seva Trust",
    distanceKm: 3.4,
    capacity: 80,
    urgency: "High",
    etaMin: 14,
    focus: "Community kitchen · 3 wards",
    matchScore: 93,
  },
  {
    name: "Robin Hood Army",
    distanceKm: 4.8,
    capacity: 35,
    urgency: "Medium",
    etaMin: 18,
    focus: "Volunteer distribution drives",
    matchScore: 88,
  },
  {
    name: "Hope Kitchen NGO",
    distanceKm: 6.2,
    capacity: 60,
    urgency: "Low",
    etaMin: 24,
    focus: "Elderly care homes",
    matchScore: 79,
  },
];

export const urgencyVariant = {
  High: "destructive",
  Medium: "warning",
  Low: "successSoft",
} as const;
