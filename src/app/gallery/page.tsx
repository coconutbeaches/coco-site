const atmosphereImages = [
  "https://media.coconut.holiday/Atmosphere/18f18e1e-2e59-4578-a72d-57839a1af04a.jpg",
  "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png",
  "https://media.coconut.holiday/Atmosphere/IMG_2425.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_2578.jpeg",
  "https://media.coconut.holiday/Atmosphere/1c286e8c-5888-47b5-a831-429b9338de79.jpg",
  "https://media.coconut.holiday/Atmosphere/4309A31D-5C49-4546-9D2F-DFD9B22D3298.jpeg",
  "https://media.coconut.holiday/Atmosphere/CE1A3027-396B-44BF-B469-9D98B0A1AA68.jpeg",
  "https://media.coconut.holiday/Atmosphere/CoconutBeachBungalows_01.jpg",
  "https://media.coconut.holiday/Atmosphere/IMG_0189.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0192.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0229.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0234.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0260.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0371.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_0373.jpeg",
  "https://media.coconut.holiday/Massage/IMG_0163.jpeg",
  "https://media.coconut.holiday/Restaurant/FD1CFF48-42D5-454D-B066-BAA27A0850E8.jpeg",
  "https://media.coconut.holiday/Restaurant/IMG_0767.jpeg",
];

export default function GalleryPage() {
  return (
    <main>
      <section className="content-photo-hero cinematic-page-hero">
        <img src={atmosphereImages[0]} alt="Coconut Beach atmosphere on Koh Phangan" />
        <div className="content-photo-hero-shade" />
        <div className="content-photo-hero-copy">
          <h1 className="site-wordmark">Gallery</h1>
          <nav className="hero-nav eyebrow" aria-label="Site sections">
            <a href="/">Book</a><span aria-hidden="true">·</span>
            <a href="/about">About</a><span aria-hidden="true">·</span>
            <a href="/services">Services</a>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="photo-grid atmosphere-gallery-grid">
          {atmosphereImages.map((src, index) => (
            <img key={src} src={src} alt={`Coconut Beach atmosphere ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
          ))}
        </div>
      </section>
    </main>
  );
}
