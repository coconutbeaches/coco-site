import Link from "next/link";
import { roomTypes } from "@/content/rooms";
import { getHeroMedia } from "@/lib/media";

export const metadata = {
  title: "Stays | Coconut Beach",
  description: "Compare Coconut Beach bungalows and houses with honest room facts, live availability, and exact pricing by date.",
};

export default function StaysPage() {
  return (
    <main>
      <section className="page-hero compact-hero">
        <div className="section">
          <p className="eyebrow">Stay your way</p>
          <h1>Rooms and houses</h1>
          <p className="lead">Distinct guest choices, honest limitations, and live pricing from the same operating calendar used by Coconut Beach.</p>
        </div>
      </section>

      <section className="section">
        <div className="stay-grid">
          {roomTypes.map((room) => {
            const hero = room.mediaCategory ? getHeroMedia(room.mediaCategory) : null;
            return (
              <article className="stay-card" key={room.slug}>
                {hero ? (
                  <img className="stay-card-image" src={hero.publicUrl} alt={`${room.name} provisional gallery image`} />
                ) : (
                  <div className="media-placeholder">Photography coming soon</div>
                )}
                <div className="stay-card-body">
                  {room.opening && <p className="opening-badge">{room.opening}</p>}
                  <h2>{room.name}</h2>
                  <p>{room.summary}</p>
                  <p className="room-facts">
                    {room.bedrooms !== null ? `${room.bedrooms} bed` : "Details coming"}
                    {room.bathrooms !== null ? ` · ${room.bathrooms} bath` : ""}
                    {room.sleeps !== null ? ` · Sleeps ${room.sleeps}` : ""}
                    {` · ${room.sizeSqm} m²`}
                  </p>
                  <Link className="button" href={`/stays/${room.slug}`}>View this stay</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
