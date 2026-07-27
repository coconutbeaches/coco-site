import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase
      .from("cococal_rooms_v1")
      .select("room_code", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ ok: false, database: "unavailable", error: error.message }, { status: 503 });
    }

    return NextResponse.json({ ok: true, database: "connected", rooms: count ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, database: "not_configured", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 503 },
    );
  }
}
