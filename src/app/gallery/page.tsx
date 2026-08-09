const atmosphereImages = [
  "https://media.coconut.holiday/Atmosphere/18f18e1e-2e59-4578-a72d-57839a1af04a.jpg",
  "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png",
  "https://media.coconut.holiday/Atmosphere/IMG_2425.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_2578.jpeg",
];

export default function GalleryPage() {
  return (
    <main>
      <section className="content-photo-hero cinematic-page-hero">
        <img src={atmosphereImages[0]} alt="Coconut Beach atmosphere on Koh Phangan" />
        <div className="content-photo-hero-shade" />
        <div className="content-photo-hero-copy">
          <a className="back-link" href="/">← Back to booking</a>
          <p className="eyebrow">Koh Phangan · Thailand</p>
          <h1 className="site-wordmark">Gallery</h1>
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Coconut Beach</p>
            <h2>Beach, jungle and island life</h2>
          </div>
        </div>
        <div className="photo-grid atmosphere-gallery-grid">
          {atmosphereImages.map((src, index) => (
            <img key={src} src={src} alt={`Coconut Beach atmosphere ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
          ))}
        </div>
      </section>
    </main>
  );
}
