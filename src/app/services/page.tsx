// Deployment sync: ensures latest Services and Gallery navigation reaches production.
const servicesHero = "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png";

const services = [
  {
    title: "Beachfront Massage",
    body: "Guests enjoy our beachfront massage from 8am to 6pm each day, with the sounds of the beach and boats passing by, and one of the best views on Koh Phangan.",
  },
  {
    title: "Snorkeling and Paddle Boarding",
    body: "Coconut Beach is blessed with one of the best snorkeling spots on Koh Phangan. Tour boats and even boats from large Koh Samui resorts regularly bring guests to our beach. Paddle boards are also available for our guests.",
  },
  {
    title: "Mini Gym / Office Space",
    body: "Each bungalow can reserve the mini gym / office space for one hour each day for private use. It includes dumbbells, massage chair, treadmill, ice bath, gym bench with leg curl and extensions, barbell and plates, resistance bands, full-length mirror and a 65-inch smart TV.",
  },
  {
    title: "Motorbikes",
    body: "Scooters are the easiest way to get around Koh Phangan. We make it simple for our guests, with bikes available onsite and local friends who can help when ours are all in use.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="content-photo-hero cinematic-page-hero">
        <img src={servicesHero} alt="Coconut Beach on Koh Phangan" />
        <div className="content-photo-hero-shade" />
        <div className="content-photo-hero-copy">
          <p className="eyebrow">Koh Phangan · Thailand</p>
          <h1 className="site-wordmark">Services</h1>
          <nav className="hero-nav eyebrow" aria-label="Site sections">
            <a href="/">Book</a><span aria-hidden="true">·</span>
            <a href="/about">About</a><span aria-hidden="true">·</span>
            <a href="/gallery">Gallery</a>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="grid service-grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
