import { NextRequest, NextResponse } from "next/server";
import { searchAvailableRooms } from "@/lib/site-data";

function parseGuestCount(value: string | null, fallback: number): number | null {
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function isIsoDate(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = parseGuestCount(params.get("adults"), 2);
  const children = parseGuestCount(params.get("children"), 0);

  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) {
    return NextResponse.json(
      { error: "checkIn and checkOut are required in YYYY-MM-DD format" },
      { status: 400 },
    );
  }

  if (adults === null || adults < 1 || children === null || children < 0) {
    return NextResponse.json(
      { error: "adults must be at least 1 and children cannot be negative" },
      { status: 400 },
    );
  }

  try {
    const result = await searchAvailableRooms({
      checkIn,
      checkOut,
      adults,
      children,
    });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to search availability";
    const isValidationError = /required|after check-in|longer than 90|invalid/i.test(message);

    return NextResponse.json(
      { error: message },
      { status: isValidationError ? 400 : 503 },
    );
  }
}
