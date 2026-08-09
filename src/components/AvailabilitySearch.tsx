"use client";

import { FormEvent, useMemo, useState } from "react";
import DatePicker from "@/components/DatePicker";
import WhatsAppHandoff from "@/components/WhatsAppHandoff";
import RoomGalleryPreview from "@/components/RoomGalleryPreview";
import { roomGalleries } from "@/data/roomGalleries";

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
  room: RoomResult;
};

const videoBase = "https://pub-c96e6d24cc1f4aefa6a13bce49b614d9.r2.dev";
const roomVideos: Partial<Record<RoomTypeKey, string>> = {
  "ab-bungalow": `${videoBase}/1Bedroom.mp4`,
  "beach-house": `${videoBase}/BeachHouse.mp4`,
  "double-house": `${videoBase}/DoubleHouse.mp4`,
  "jungle-house": `${videoBase}/JungleHouse.mp4`,
  "new-house": `${videoBase}/NewHouse.mp4`,
};

const roomTypeMeta: Record<RoomTypeKey, { label: string; photoUrl: string | null }> = {
  "ab-bungalow": { label: "1 Bedroom", photoUrl: "https://media.coconut.holiday/1%20Bedroom/CoconutBeachBungalows_02.jpg" },
  "beach-house": { label: "Beach House", photoUrl: "https://media.coconut.holiday/Beachfront%20House/CoconutBeachBungalows_35.jpg" },
  "double-house": { label: "Double House", photoUrl: "https://media.coconut.holiday/Double%20House/1569940530.428_c23c9867-d6a5-4079-9399-e3a3fd2fe24c.jpg" },
  "jungle-house": { label: "Jungle House", photoUrl: "https://media.coconut.holiday/Jungle%20House/IMG_0820.jpeg" },
  "new-house": { label: "New House", photoUrl: "https://media.coconut.holiday/New%20House/IMG_1208.jpeg" },
  "c-bungalow": { label: "C Bungalow", photoUrl: null },
  "tree-house": { label: "Tree House", photoUrl: null },
};

function roomTypeKey(roomCode: string): RoomTypeKey {
  if (/^[AB]\d+$/.test(roomCode)) return "ab-bungalow";
  if (/^C\d+$/.test(roomCode)) return "c-bungalow";
  const exact: Record<string, RoomTypeKey> = { BH: "beach-house", DH: "double-house", JH: "jungle-house", NH: "new-house", TH: "tree-house" };
  return exact[roomCode] ?? "ab-bungalow";
}

function groupRooms(rooms: RoomResult[]): GroupedRoomResult[] {
  const groups = new Map<RoomTypeKey, GroupedRoomResult>();
  for (const room of rooms) {
    const key = roomTypeKey(room.room_code);
    if (groups.has(key)) continue;
    groups.set(key, { key, label: roomTypeMeta[key].label, photoUrl: roomTypeMeta[key].photoUrl, room });
  }
  return Array.from(groups.values());
}

function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
function nextDayIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return isoDate(date);
}

function formatStayDates(checkIn: string, checkOut: string) {
  const [inYear, inMonth, inDay] = checkIn.split("-").map(Number);
  const [outYear, outMonth, outDay] = checkOut.split("-").map(Number);
  const arrival = new Date(inYear, inMonth - 1, inDay);
  const departure = new Date(outYear, outMonth - 1, outDay);
  const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  if (inYear === outYear && inMonth === outMonth) {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(arrival);
    return `${month} ${inDay}–${outDay}`;
  }
  return `${monthDay.format(arrival)}–${monthDay.format(departure)}`;
}

function formatTHB(value: number | null) {
  if (value === null) return "Price unavailable";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
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
  const today = isoDate(new Date());

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    if (!checkOut || checkOut <= value) setCheckOut(nextDayIso(value));
  }

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
      const params = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children) });
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
          <DatePicker value={checkIn} min={today} onChange={handleCheckInChange} ariaLabel="Choose check-in date" tone="start" />
        </label>
        <label>
          Check-out
          <DatePicker value={checkOut} min={nextDayIso(checkIn || today)} onChange={setCheckOut} ariaLabel="Choose check-out date" tone="end" />
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
        <button className="button search-button" disabled={loading} type="submit">{loading ? "Searching…" : "Search"}</button>
      </form>

      {error && <div className="search-message error-message">{error}</div>}

      {result && (
        <div className="results">
          <div className="results-summary">
            <h3>{groupedRooms.length ? `Available options for ${formatStayDates(result.check_in, result.check_out)}` : "No exact matches"}</h3>
            <p>{result.nights} nights · {result.adults} adults{result.children ? ` · ${result.children} children` : ""}</p>
          </div>

          {!groupedRooms.length && (
            <div className="card notice">
              <h3>Try different dates</h3>
              <p>No room matches this exact combination yet. WhatsApp us and we can look for alternatives.</p>
            </div>
          )}

          <div className="room-results">
            {groupedRooms.map(({ key, label, photoUrl, room }) => {
              const whatsappText = encodeURIComponent(`Hello Coconut Beach, I’m interested in ${label} from ${result.check_in} to ${result.check_out} for ${result.adults} adults and ${result.children} children. The quoted total is ${formatTHB(room.total_thb)}.`);
              const whatsappUrl = `https://wa.me/66926025572?text=${whatsappText}`;
              const handoffSummary = `${label} · ${result.check_in} → ${result.check_out} · ${result.adults} adults${result.children ? ` · ${result.children} children` : ""} · ${formatTHB(room.total_thb)}`;

              return (
                <article className="room-result room-result-card" key={key}>
                  {photoUrl ? (
                    <RoomGalleryPreview
                      label={label}
                      coverUrl={photoUrl}
                      images={roomGalleries[key] ?? [photoUrl]}
                      videoUrl={roomVideos[key] ?? null}
                    />
                  ) : (
                    <div className="room-result-image room-result-placeholder">Photography coming soon</div>
                  )}
                  <div className="room-result-body">
                    <div>
                      <h3>{label}</h3>
                      <p className="room-meta">Up to {room.max_total_guests ?? "—"} guests{room.view_type ? ` · ${room.view_type} view` : ""}</p>
                      {room.minimum_stay_nights !== null && <p className="minimum-stay-inline">Min {room.minimum_stay_nights} nights</p>}
                    </div>
                    <div className="price-block">
                      <strong>{formatTHB(room.total_thb)}</strong>
                      <span>Total for {result.nights} nights</span>
                    </div>
                    {!room.price_complete && <div className="minimum-warning">Some nightly rates are not yet available.</div>}
                    <WhatsAppHandoff url={whatsappUrl} summary={handoffSummary} />
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
