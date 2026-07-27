"use client";

import { FormEvent, useMemo, useState } from "react";

type NightlyRate = { date: string; rate_thb: number | null };
type RoomResult = {
  room_code: string;
  room_name: string;
  room_group_code: string;
  available: boolean;
  max_adults: number | null;
  max_children: number | null;
  max_total_guests: number | null;
  view_type: string | null;
  tags: string[];
  minimum_stay_nights: number | null;
  minimum_stay_met: boolean;
  price_complete: boolean;
  nightly_rates: NightlyRate[];
  total_thb: number | null;
};

type SearchResponse = {
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  rooms: RoomResult[];
};

type RoomTypeKey = "ab-bungalow" | "beach-house" | "double-house" | "jungle-house" | "new-house" | "c-bungalow" | "tree-house";

type GroupedRoomResult = {
  key: RoomTypeKey;
  label: string;
  photoUrl: string | null;
  availableUnits: number;
  room: RoomResult;
};

const roomTypeMeta: Record<RoomTypeKey, { label: string; photoUrl: string | null }> = {
  "ab-bungalow": {
    label: "1 Bedroom",
    photoUrl: "https://media.coconut.holiday/1%20Bedroom/CoconutBeachBungalows_02.jpg",
  },
  "beach-house": {
    label: "Beach House",
    photoUrl: "https://media.coconut.holiday/Beachfront%20House/CoconutBeachBungalows_35.jpg",
  },
  "double-house": { label: "Double House", photoUrl: null },
  "jungle-house": {
    label: "Jungle House",
    photoUrl: "https://media.coconut.holiday/Jungle%20House/IMG_0820.jpeg",
  },
  "new-house": {
    label: "New House",
    photoUrl: "https://media.coconut.holiday/New%20House/IMG_1208.jpeg",
  },
  "c-bungalow": { label: "C Bungalow", photoUrl: null },
  "tree-house": { label: "Tree House", photoUrl: null },
};

function roomTypeKey(roomCode: string): RoomTypeKey {
  if (/^[AB]\d+$/.test(roomCode)) return "ab-bungalow";
  if (/^C\d+$/.test(roomCode)) return "c-bungalow";

  const exact: Record<string, RoomTypeKey> = {
    BH: "beach-house",
    DH: "double-house",
    JH: "jungle-house",
    NH: "new-house",
    TH: "tree-house",
  };

  return exact[roomCode] ?? "ab-bungalow";
}

function groupRooms(rooms: RoomResult[]): GroupedRoomResult[] {
  const groups = new Map<RoomTypeKey, GroupedRoomResult>();

  for (const room of rooms) {
    const key = roomTypeKey(room.room_code);
    const existing = groups.get(key);

    if (existing) {
      existing.availableUnits += 1;
      continue;
    }

    groups.set(key, {
      key,
      label: roomTypeMeta[key].label,
      photoUrl: roomTypeMeta[key].photoUrl,
      availableUnits: 1,
      room,
    });
  }

  return Array.from(groups.values());
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatTHB(value: number | null) {
  if (value === null) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AvailabilitySearch() {
  const defaults = useMemo(() => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 30);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 5);
    return { checkIn: isoDate(checkIn), checkOut: isoDate(checkOut) };
  }, []);

  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const groupedRooms = useMemo(() => groupRooms(result?.rooms ?? []), [result]);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
      });
      const response = await fetch(`/api/availability?${params}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not check availability.");
      setResult(payload as SearchResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not check availability.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="availability-section" id="availability">
      <form className="search-form search-form-standalone" onSubmit={search}>
        <label>
          Check-in
          <input type="date" value={checkIn} min={isoDate(new Date())} onChange={(event) => setCheckIn(event.target.value)} required />
        </label>
        <label>
          Check-out
          <input type="date" value={checkOut} min={checkIn || isoDate(new Date())} onChange={(event) => setCheckOut(event.target.value)} required />
        </label>
        <label>
          Adults
          <select value={adults} onChange={(event) => setAdults(Number(event.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          Children
          <select value={children} onChange={(event) => setChildren(Number(event.target.value))}>
            {[0, 1, 2, 3, 4].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button className="button search-button" disabled={loading} type="submit">
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div className="search-message error-message">{error}</div>}

      {result && (
        <div className="results">
          <div className="results-summary">
            <h3>{groupedRooms.length ? `${groupedRooms.length} room types available` : "No exact matches"}</h3>
            <p>{result.nights} nights · {result.adults} adults{result.children ? ` · ${result.children} children` : ""}</p>
          </div>

          {!groupedRooms.length && (
            <div className="card notice">
              <h3>Try different dates</h3>
              <p>No room matches this exact combination yet. WhatsApp us and we can look for alternatives.</p>
            </div>
          )}

          <div className="room-results">
            {groupedRooms.map(({ key, label, photoUrl, availableUnits, room }) => {
              const whatsappText = encodeURIComponent(
                `Hello Coconut Beach, I’m interested in ${label} from ${result.check_in} to ${result.check_out} for ${result.adults} adults and ${result.children} children. The quoted total is ${formatTHB(room.total_thb)}.`,
              );

              return (
                <article className="room-result room-result-card" key={key}>
                  {photoUrl ? (
                    <img className="room-result-image" src={photoUrl} alt={`${label} at Coconut Beach`} />
                  ) : (
                    <div className="room-result-image room-result-placeholder">Photography coming soon</div>
                  )}

                  <div className="room-result-body">
                    <div>
                      <h3>{label}</h3>
                      <p className="room-meta">
                        Up to {room.max_total_guests ?? "—"} guests
                        {room.view_type ? ` · ${room.view_type} view` : ""}
                      </p>
                      {availableUnits > 1 && <p className="available-units">{availableUnits} available</p>}
                    </div>

                    <div className="price-block">
                      <strong>{formatTHB(room.total_thb)}</strong>
                      <span>Total for {result.nights} nights</span>
                    </div>

                    {!room.minimum_stay_met && (
                      <div className="minimum-warning">
                        Minimum stay is {room.minimum_stay_nights} nights for this arrival date.
                      </div>
                    )}

                    {!room.price_complete && (
                      <div className="minimum-warning">Some nightly rates are not yet available.</div>
                    )}

                    <details>
                      <summary>Nightly price breakdown</summary>
                      <ul className="rate-list">
                        {room.nightly_rates.map((night) => (
                          <li key={night.date}><span>{night.date}</span><strong>{formatTHB(night.rate_thb)}</strong></li>
                        ))}
                      </ul>
                    </details>

                    <a className="button room-action" href={`https://wa.me/66926025572?text=${whatsappText}`}>
                      Continue on WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
