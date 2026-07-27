import type { MediaCategory } from "@/lib/media";

export type RoomType = {
  slug: string;
  name: string;
  units: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  sleeps: number | null;
  sizeSqm: number;
  summary: string;
  limitations: string[];
  mediaCategory?: MediaCategory;
  opening?: string;
};

export const roomTypes: RoomType[] = [
  {
    slug: "ab-bungalow",
    name: "A/B Bungalow",
    units: ["A3", "A4", "A5", "A6", "A7", "A8", "A9", "B6", "B7", "B8", "B9"],
    bedrooms: 1,
    bathrooms: 1,
    sleeps: 2,
    sizeSqm: 25,
    summary: "Simple one-bedroom bungalows sharing the same layout, with each physical unit tracked separately for availability and rates.",
    limitations: ["Open-air tropical design", "Nature sounds and wildlife may be present", "Representative photos are shared across identical units"],
    mediaCategory: "ab-bungalow",
  },
  {
    slug: "beach-house",
    name: "Beach House",
    units: ["BH"],
    bedrooms: 1,
    bathrooms: 1,
    sleeps: 2,
    sizeSqm: 65,
    summary: "A spacious one-bedroom house directly on the beachfront.",
    limitations: ["Tropical beachfront setting", "Natural sounds and wildlife may be present"],
    mediaCategory: "beach-house",
  },
  {
    slug: "double-house",
    name: "Double House",
    units: ["DH"],
    bedrooms: 2,
    bathrooms: 2,
    sleeps: 4,
    sizeSqm: 42,
    summary: "A two-bedroom house with two bathrooms, suited to guests who value extra bathroom space.",
    limitations: ["Photography is still being prepared"],
  },
  {
    slug: "jungle-house",
    name: "Jungle House",
    units: ["JH"],
    bedrooms: 2,
    bathrooms: 1,
    sleeps: 4,
    sizeSqm: 42,
    summary: "A two-bedroom sea-view house with an open-air design close to the surrounding jungle.",
    limitations: ["No air-conditioning", "Open-air design", "Natural sounds, insects and wildlife may be present"],
    mediaCategory: "jungle-house",
  },
  {
    slug: "new-house",
    name: "New House",
    units: ["NH"],
    bedrooms: 2,
    bathrooms: 1,
    sleeps: 4,
    sizeSqm: 42,
    summary: "A two-bedroom sea-view house with generous indoor-outdoor living space.",
    limitations: ["No air-conditioning", "Open-air design", "Food must be secured because monkeys may visit"],
    mediaCategory: "new-house",
  },
  {
    slug: "c-bungalow",
    name: "C Bungalow",
    units: ["C1", "C2", "C3"],
    bedrooms: null,
    bathrooms: null,
    sleeps: 4,
    sizeSqm: 34,
    summary: "New sea-view bungalows planned to open for December 2026 stays.",
    limitations: ["Currently being finished and furnished", "Finished photography is planned before bookings open"],
    opening: "Opening December 2026",
  },
  {
    slug: "tree-house",
    name: "Tree House",
    units: ["TH"],
    bedrooms: null,
    bathrooms: null,
    sleeps: 8,
    sizeSqm: 98,
    summary: "A large, distinctive house planned to open for December 2026 stays.",
    limitations: ["Currently being finished and furnished", "Finished photography is planned before bookings open"],
    opening: "Opening December 2026",
  },
];

export function getRoomType(slug: string) {
  return roomTypes.find((room) => room.slug === slug) ?? null;
}
