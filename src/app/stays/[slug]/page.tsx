import Link from "next/link";
import { notFound } from "next/navigation";
import AvailabilitySearch from "@/components/AvailabilitySearch";
import { getRoomType, roomTypes } from "@/content/rooms";
import { getMediaByCategory } from "@/lib/media";

export function generateStaticParams() {
  return roomTypes.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoomType(slug);
  return room ? {
    title: `${room.name} | Coconut Beach`,
    description: room.summary,
  } : {};
}

export default async function StayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoomType(slug);
  if (!room) notFound();

  const gallery = room.mediaCategory ? getMediaByCategory(room.mediaCategory, 12) : [];
  const hero = gallery[0] ?? null;

  return (
    <main>
      <section className="stay-detail-hero">
        {hero ? (
          <img src={hero.publicUrl} alt={`${room.name} provisional hero image`} />
        ) : (
          <div className="media-placeholder detail-placeholder">Finished photography coming soon</div>
        )}
        <div className="stay-detail-overlay">
          <Link href="/stays" className="back-link">← All stays</Link>
          {room.opening && <p className="opening-badge">{room.opening}</p>}
          <h1>{room.name}</h1>
          <p>{room.units.join(", ")} · {room.sizeSqm} m²</p>
        </div>
      </section>

      <section className="section stay-intro">
        <div>
          <p className="eyebrow">The honest overview</p>
          <h2>{room.summary}</h2>
          <div className="fact-grid">
            <span><strong>{room.bedrooms ?? "—"}</strong> bedrooms</span>
            <span><strong>{room.bathrooms ?? "—"}</strong> bathrooms</span>
            <span><strong>{room.sleeps ?? "—"}</strong> guests</span>
            <span><strong>{room.sizeSqm}</strong> m²</span>
          </div>
        </div>
        <aside className="card notice">
          <h3>Important before booking</h3>
          <ul className="plain-list">
            {room.limitations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Room gallery</p>
              <h2>A provisional first look</h2>
            </div>
            <p>Visual ordering and captions are still being curated.</p>
          </div>
          <div className="photo-grid">
            {gallery.slice(1).map((asset, index) => (
              <img key={asset.objectKey} src={asset.publicUrl} alt={`${room.name} gallery image ${index + 2}`} loading="lazy" />
            ))}
          </div>
        </section>
      )}

      <AvailabilitySearch />
    </main>
  );
}
