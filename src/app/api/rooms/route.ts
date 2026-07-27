import { NextResponse } from "next/server";
import { getRoomCatalog } from "@/lib/site-data";

export async function GET() {
  try {
    const rooms = await getRoomCatalog();

    return NextResponse.json(
      { rooms },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load rooms" },
      { status: 503 },
    );
  }
}
