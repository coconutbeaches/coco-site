import { createServerSupabaseClient } from "@/lib/supabase-server";

export type RoomCatalogItem = {
  room_code: string;
  room_name: string | null;
  room_group_code: string;
  max_adults: number | null;
  max_kids: number | null;
  max_total_guests: number | null;
  tags: string[];
  view_type: string | null;
  child_friendly: boolean | null;
  active_from: string;
  active_to: string | null;
};

export type NightlyRate = {
  date: string;
  rate_thb: number | null;
};

export type AvailableRoomQuote = {
  room_code: string;
  room_group_code: string;
  room_name: string | null;
  max_adults: number | null;
  max_children: number | null;
  max_total_guests: number | null;
  tags: string[];
  view_type: string | null;
  child_friendly: boolean | null;
  active_from: string;
  active_to: string | null;
  available: true;
  minimum_stay_nights: number | null;
  minimum_stay_met: boolean;
  price_complete: boolean;
  nightly_rates: NightlyRate[];
  total_thb: number | null;
};

export type AvailabilityResponse = {
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  rooms: AvailableRoomQuote[];
};

export async function getRoomCatalog(): Promise<RoomCatalogItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("coco_site_room_catalog");

  if (error) {
    throw new Error(`Unable to load room catalog: ${error.message}`);
  }

  return (data ?? []) as RoomCatalogItem[];
}

export async function searchAvailableRooms(input: {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}): Promise<AvailabilityResponse> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("coco_site_search_rooms", {
    p_check_in: input.checkIn,
    p_check_out: input.checkOut,
    p_adults: input.adults,
    p_children: input.children,
  });

  if (error) {
    throw new Error(`Unable to search availability: ${error.message}`);
  }

  return data as AvailabilityResponse;
}
