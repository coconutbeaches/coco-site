import { defineTool } from "@nekuda/webmcp-sdk";
import { roomTypes } from "@/content/rooms";
import { searchSiteContent } from "@/webmcp/content";
import {
  showAgentAvailabilityNotice,
  type AgentAvailabilityNotice,
  type AgentAvailabilityOption,
} from "@/webmcp/events";

type AskSiteInput = {
  question: string;
};

type GetAccommodationsInput = {
  slug?: string;
};

type StayInput = {
  check_in: string;
  check_out: string;
  guest_ages: number[];
};

type PrepareBookingInquiryInput = StayInput & {
  room_type: string;
};

type AvailabilityRoom = {
  room_code: string;
  room_group_code: string;
  room_name: string | null;
  max_adults: number | null;
  max_children: number | null;
  max_total_guests: number | null;
  tags: string[];
  view_type: string | null;
  child_friendly: boolean | null;
  available: true;
  minimum_stay_nights: number | null;
  minimum_stay_met: boolean;
  price_complete: boolean;
  total_thb: number | null;
};

type AvailabilityResponse = {
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  rooms: AvailabilityRoom[];
};

const bookingLabels: Record<string, string> = {
  "ab-bungalow": "1 Bedroom",
  "beach-house": "Beach House",
  "double-house": "Double House",
  "jungle-house": "Jungle House",
  "new-house": "New House",
  "c-bungalow": "C Bungalow",
  "tree-house": "Tree House",
};

function roomTypeForUnit(roomCode: string) {
  return roomTypes.find((room) => room.units.includes(roomCode)) ?? null;
}

function validateStayInput(input: StayInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.check_in) || !/^\d{4}-\d{2}-\d{2}$/.test(input.check_out)) {
    throw new Error("check_in and check_out must use YYYY-MM-DD format");
  }

  if (input.check_out <= input.check_in) {
    throw new Error("check_out must be after check_in");
  }

  if (!Array.isArray(input.guest_ages) || input.guest_ages.length < 1 || input.guest_ages.length > 8) {
    throw new Error("guest_ages must contain between 1 and 8 ages");
  }

  if (input.guest_ages.some((age) => !Number.isInteger(age) || age < 0 || age > 85)) {
    throw new Error("each guest age must be a whole number from 0 to 85");
  }

  if (!input.guest_ages.some((age) => age >= 18)) {
    throw new Error("at least one guest must be 18 or older");
  }
}

async function fetchAvailability(input: StayInput): Promise<AvailabilityResponse> {
  validateStayInput(input);
  const adults = input.guest_ages.filter((age) => age >= 18).length;
  const children = input.guest_ages.length - adults;
  const params = new URLSearchParams({
    checkIn: input.check_in,
    checkOut: input.check_out,
    adults: String(adults),
    children: String(children),
  });

  const response = await fetch(`/api/availability?${params.toString()}`, { cache: "no-store" });
  const payload = await response.json();

  if (!response.ok) {
    const message = typeof payload?.error === "string" ? payload.error : "Unable to search availability";
    throw new Error(message);
  }

  return payload as AvailabilityResponse;
}

function groupAvailability(result: AvailabilityResponse): AgentAvailabilityOption[] {
  const grouped = new Map<string, AgentAvailabilityOption>();

  for (const room of result.rooms) {
    const roomType = roomTypeForUnit(room.room_code);
    const roomTypeKey = roomType?.slug ?? room.room_group_code;
    const existing = grouped.get(roomTypeKey);

    if (existing) {
      existing.units.push(room.room_code);
      if (existing.totalThb === null && room.total_thb !== null) existing.totalThb = room.total_thb;
      existing.priceComplete = existing.priceComplete && room.price_complete;
      continue;
    }

    grouped.set(roomTypeKey, {
      roomType: roomTypeKey,
      name: bookingLabels[roomTypeKey] ?? roomType?.name ?? room.room_name ?? roomTypeKey,
      units: [room.room_code],
      totalThb: room.total_thb,
      priceComplete: room.price_complete,
    });
  }

  return Array.from(grouped.values());
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function maxNumber(values: Array<number | null | undefined>) {
  const numbers = values.filter((value): value is number => typeof value === "number");
  return numbers.length ? Math.max(...numbers) : null;
}

function childFriendlyValue(rooms: AvailabilityRoom[]) {
  const values = rooms
    .map((room) => room.child_friendly)
    .filter((value): value is boolean => typeof value === "boolean");

  if (!values.length) return null;
  return values.every((value) => value === values[0]) ? values[0] : null;
}

function enrichAvailabilityOption(option: AgentAvailabilityOption, result: AvailabilityResponse) {
  const roomType = roomTypes.find((room) => room.slug === option.roomType) ?? null;
  const liveRooms = result.rooms.filter((room) => option.units.includes(room.room_code));

  return {
    room_type: option.roomType,
    name: option.name,
    available_units: option.units,
    quoted_total_thb: option.totalThb,
    price_complete: option.priceComplete,
    bedrooms: roomType?.bedrooms ?? null,
    bathrooms: roomType?.bathrooms ?? null,
    sleeps: roomType?.sleeps ?? maxNumber(liveRooms.map((room) => room.max_total_guests)),
    size_sqm: roomType?.sizeSqm ?? null,
    summary: roomType?.summary ?? null,
    limitations: roomType?.limitations ?? [],
    view_types: uniqueStrings(liveRooms.map((room) => room.view_type)),
    tags: uniqueStrings(liveRooms.flatMap((room) => room.tags ?? [])),
    child_friendly: childFriendlyValue(liveRooms),
    max_adults: maxNumber(liveRooms.map((room) => room.max_adults)),
    max_children: maxNumber(liveRooms.map((room) => room.max_children)),
    max_total_guests: maxNumber(liveRooms.map((room) => room.max_total_guests)),
    minimum_stay_nights: maxNumber(liveRooms.map((room) => room.minimum_stay_nights)),
    page: roomType ? `/stays/${roomType.slug}` : null,
  };
}

function formatAgeList(ages: number[]) {
  if (ages.length <= 1) return ages.join("");
  if (ages.length === 2) return `${ages[0]} and ${ages[1]}`;
  return `${ages.slice(0, -1).join(", ")}, and ${ages[ages.length - 1]}`;
}

function formatTHB(value: number | null) {
  if (value === null) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export const askSite = defineTool<AskSiteInput>({
  stableKey: "coconut.site_answer",
  name: "ask_site",
  title: "Ask Coconut Beach",
  description: "Find relevant information from Coconut Beach's own website content. Use for questions about who the property is for, age and group policies, rooms, open-air design, air-conditioning, location, transport, services, restaurant, massage, snorkeling, sustainability, gym or amenities. Returns relevant site sections and source paths; it does not invent an answer when the site has no matching content.",
  inputSchema: {
    type: "object",
    properties: {
      question: { type: "string", minLength: 2, description: "The visitor's question about Coconut Beach" },
    },
    required: ["question"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute({ question }) {
    const sections = searchSiteContent(question);
    return {
      sections: sections.map(({ path, title, text }) => ({ path, title, text })),
      note: sections.length
        ? "Use these Coconut Beach website sections to answer the visitor."
        : "The Coconut Beach website content bundle has no matching information for this question.",
    };
  },
});

export const getAccommodations = defineTool<GetAccommodationsInput>({
  stableKey: "coconut.accommodations_get",
  name: "get_accommodations",
  title: "Get accommodations",
  description: "Get structured information about Coconut Beach accommodation types. Use to compare stays or inspect a specific room type before checking dates. Pass a slug for one accommodation type or omit it to list all types. Returns capacity, bedrooms, bathrooms, size, summary, limitations, physical unit codes and opening information.",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        enum: roomTypes.map((room) => room.slug),
        description: "Optional accommodation slug such as jungle-house, beach-house or ab-bungalow",
      },
    },
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute({ slug }) {
    const matches = slug ? roomTypes.filter((room) => room.slug === slug) : roomTypes;
    return {
      accommodations: matches.map((room) => ({
        slug: room.slug,
        name: room.name,
        units: room.units,
        bedrooms: room.bedrooms,
        bathrooms: room.bathrooms,
        sleeps: room.sleeps,
        size_sqm: room.sizeSqm,
        summary: room.summary,
        limitations: room.limitations,
        opening: room.opening ?? null,
        page: `/stays/${room.slug}`,
      })),
      note: matches.length ? null : "No Coconut Beach accommodation matches that slug.",
    };
  },
});

export const searchAvailability = defineTool<StayInput>({
  stableKey: "coconut.availability_search",
  name: "search_availability",
  title: "Search live availability",
  description: "Search Coconut Beach's live availability and direct-booking prices for specific check-in/check-out dates and guest ages. Use when the visitor wants to know what can actually be booked, compare live options, or decide which available accommodation best fits their stated preferences. Returns live room types, physical units, quoted totals in THB, size, bedrooms, bathrooms, capacity, view types, feature tags, child suitability and known limitations so the calling agent can make a preference-aware recommendation. It does not invent missing features or apply a hidden universal ranking, and it visibly shows the live result on the website.",
  inputSchema: {
    type: "object",
    properties: {
      check_in: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Check-in date in YYYY-MM-DD format" },
      check_out: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Check-out date in YYYY-MM-DD format" },
      guest_ages: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: { type: "integer", minimum: 0, maximum: 85 },
        description: "Age of every guest; at least one guest must be 18 or older",
      },
    },
    required: ["check_in", "check_out", "guest_ages"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute(input) {
    const result = await fetchAvailability(input);
    const options = groupAvailability(result);
    const notice: AgentAvailabilityNotice = {
      checkIn: result.check_in,
      checkOut: result.check_out,
      nights: result.nights,
      guestAges: input.guest_ages,
      options,
    };
    showAgentAvailabilityNotice(notice);

    return {
      check_in: result.check_in,
      check_out: result.check_out,
      nights: result.nights,
      guest_ages: input.guest_ages,
      options: options.map((option) => enrichAvailabilityOption(option, result)),
      recommendation_guidance: options.length
        ? "Compare these property-supplied facts against the visitor's stated priorities. Explain why an option fits, distinguish facts from judgment, do not assume unstated preferences, and treat absent fields as unknown rather than false."
        : null,
      note: options.length
        ? "These are live direct-booking results from Coconut Beach enriched with decision-useful accommodation facts."
        : "No Coconut Beach accommodation matches these exact dates and guest ages.",
    };
  },
});

export const prepareBookingInquiry = defineTool<PrepareBookingInquiryInput>({
  stableKey: "coconut.booking_inquiry_prepare",
  name: "prepare_booking_inquiry",
  title: "Prepare WhatsApp booking inquiry",
  description: "Prepare the existing Coconut Beach WhatsApp booking handoff for a chosen accommodation, dates and guest ages. It refreshes live availability and price first, then opens WhatsApp with the same prefilled inquiry format used by the website. It does not send the message, make a reservation or take payment; the visitor must review and send it themselves.",
  inputSchema: {
    type: "object",
    properties: {
      room_type: {
        type: "string",
        enum: roomTypes.map((room) => room.slug),
        description: "Accommodation slug returned by get_accommodations or search_availability",
      },
      check_in: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Check-in date in YYYY-MM-DD format" },
      check_out: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Check-out date in YYYY-MM-DD format" },
      guest_ages: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: { type: "integer", minimum: 0, maximum: 85 },
        description: "Age of every guest",
      },
    },
    required: ["room_type", "check_in", "check_out", "guest_ages"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false },
  async execute(input) {
    const roomType = roomTypes.find((room) => room.slug === input.room_type);
    if (!roomType) throw new Error("Unknown Coconut Beach accommodation type");

    const result = await fetchAvailability(input);
    const room = result.rooms.find((candidate) => roomType.units.includes(candidate.room_code));
    if (!room) throw new Error(`${roomType.name} is not available for those dates and guests`);

    const label = bookingLabels[roomType.slug] ?? roomType.name;
    const guestCount = input.guest_ages.length;
    const guestLabel = guestCount === 1 ? "guest" : "guests";
    const formattedAges = formatAgeList(input.guest_ages);
    const message = `Hello Coconut Beach, I’m interested in ${label} from ${result.check_in} to ${result.check_out} for ${guestCount} ${guestLabel}: ages ${formattedAges}. The quoted total is ${formatTHB(room.total_thb)}.`;
    const whatsappUrl = `https://wa.me/66926025572?text=${encodeURIComponent(message)}`;

    window.location.assign(whatsappUrl);

    return {
      status: "prepared",
      room_type: roomType.slug,
      room_name: label,
      check_in: result.check_in,
      check_out: result.check_out,
      guest_ages: input.guest_ages,
      quoted_total_thb: room.total_thb,
      whatsapp_url: whatsappUrl,
      note: "WhatsApp has been opened with a prefilled Coconut Beach inquiry. The visitor still needs to review and send it.",
    };
  },
});
