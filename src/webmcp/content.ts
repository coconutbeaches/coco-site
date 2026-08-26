import { roomTypes } from "@/content/rooms";

type SiteContentSection = {
  path: string;
  title: string;
  text: string;
  keywords: string[];
};

const staticSections: SiteContentSection[] = [
  {
    path: "/about",
    title: "Who Coconut Beach is for",
    text: "Coconut Beach is a private collection of modern beach bungalows at Haad Khom on the quiet north side of Koh Phangan. It is intended for quiet, mature independent travelers and couples rather than party groups. The property does not accept groups or young guys/gals coming for the Full Moon Party, and does not accept children under 8 years old.",
    keywords: ["policy", "groups", "party", "full moon", "children", "kids", "quiet", "couples"],
  },
  {
    path: "/about",
    title: "Open-air design and climate",
    text: "The bungalows use an open, windowless tropical design. Air-conditioning is generally not part of the experience. Natural sounds, insects, wildlife and monkeys are part of the setting, and food should be kept secured in rooms where monkeys may visit.",
    keywords: ["air conditioning", "aircon", "ac", "windows", "open air", "monkeys", "wildlife", "insects"],
  },
  {
    path: "/about",
    title: "Location and transport",
    text: "Coconut Beach is on Haad Khom beach on Koh Phangan, accessible by a private road or boat. Chaloklum fishing village is about five kilometers away. Longtail taxi boats operate from the beach, taxis are available in the nearby town, and motorbikes are available for guests. The Bottle Beach hiking trail starts at the top of the property.",
    keywords: ["location", "haad khom", "chaloklum", "taxi", "boat", "motorbike", "bottle beach", "transport"],
  },
  {
    path: "/about",
    title: "Property and sustainability",
    text: "Coconut Beach is family-run, occupied year-round by the family who operate it, and is 100% solar powered and off grid except for fiber internet. Water and energy are generated onsite.",
    keywords: ["solar", "off grid", "internet", "wifi", "family", "sustainability", "power", "water"],
  },
  {
    path: "/services",
    title: "Restaurant and onsite services",
    text: "Guests have access to a beachfront restaurant that uses produce from the organic farm onsite, a beachfront massage studio, guest motorbikes, a pool, showers, beach umbrellas, paddle boards and other guest-only amenities.",
    keywords: ["restaurant", "food", "farm", "massage", "pool", "paddle board", "amenities", "motorbike"],
  },
  {
    path: "/services",
    title: "Beachfront massage",
    text: "Beachfront massage is available from 9am to 7pm each day, with views over the beach.",
    keywords: ["massage", "hours", "9am", "7pm"],
  },
  {
    path: "/services",
    title: "Snorkeling, paddle boards and beach",
    text: "Haad Khom is one of Koh Phangan's notable snorkeling locations. Snorkeling is directly accessible from Coconut Beach, and paddle boards are available for guests. A small hidden beach is next to the property.",
    keywords: ["snorkel", "snorkeling", "kayak", "paddle board", "beach", "swimming"],
  },
  {
    path: "/services",
    title: "Mini gym and office space",
    text: "Each bungalow can reserve the mini gym and office space for private use. It includes dumbbells, a massage chair, treadmill, gym bench with leg curl and extension, barbell and plates, resistance bands, a full-length mirror and a 65-inch smart TV.",
    keywords: ["gym", "office", "work", "treadmill", "weights", "fitness"],
  },
];

const roomSections: SiteContentSection[] = roomTypes.map((room) => ({
  path: `/stays/${room.slug}`,
  title: room.name,
  text: [
    room.summary,
    `${room.bedrooms ?? "TBD"} bedroom${room.bedrooms === 1 ? "" : "s"}, ${room.bathrooms ?? "TBD"} bathroom${room.bathrooms === 1 ? "" : "s"}, sleeps up to ${room.sleeps ?? "TBD"}, ${room.sizeSqm} sqm.`,
    room.limitations.length ? `Important notes: ${room.limitations.join("; ")}.` : "",
    room.opening ?? "",
  ].filter(Boolean).join(" "),
  keywords: [room.name.toLowerCase(), room.slug, ...room.units.map((unit) => unit.toLowerCase())],
}));

export const siteContentSections = [...staticSections, ...roomSections];

const stopWords = new Set([
  "a", "an", "and", "are", "at", "be", "can", "do", "does", "for", "from", "have", "how", "i", "in", "is", "it", "of", "on", "or", "the", "to", "we", "what", "when", "where", "with", "you", "your",
]);

function terms(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1 && !stopWords.has(term));
}

export function searchSiteContent(question: string) {
  const queryTerms = terms(question);
  const ranked = siteContentSections
    .map((section) => {
      const title = section.title.toLowerCase();
      const text = section.text.toLowerCase();
      const keywords = section.keywords.join(" ").toLowerCase();
      const score = queryTerms.reduce((total, term) => {
        if (keywords.includes(term)) return total + 4;
        if (title.includes(term)) return total + 3;
        if (text.includes(term)) return total + 1;
        return total;
      }, 0);
      return { section, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ section }) => section);

  return ranked;
}
