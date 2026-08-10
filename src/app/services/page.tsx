const servicesHero = "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png";

const services = [
  {
    title: "Beachfront Massage",
    body: "Guests enjoy our beachfront massage from 9am to 7pm each day, with the sounds of the beach and boats passing by, and one of the best views on Koh Phangan.",
    image: "https://media.coconut.holiday/Massage/IMG_1783.jpeg",
  },
  {
    title: "Snorkel and Kayak",
    body: "Coconut Beach is blessed with one of the best snorkeling spots on Koh Phangan. Tour boats and even boats from large Koh Samui resorts regularly bring guests to our beach. Paddle boards are also available for our guests.",
    image: "https://media.coconut.holiday/Services/snorkle.jpg",
  },
  {
    title: "Mini Gym / Office Space",
    body: "Each bungalow can reserve the mini gym / office space for private use. It includes dumbbells, massage chair, treadmill, gym bench with leg curl and extensions, barbell and plates, resistance bands, full-length mirror and a 65-inch smart TV.",
    image: "https://media.coconut.holiday/Services/minigym.jpg",
  },
  {
    title: "Motorbikes Available",
    body: "Scooters are the easiest way to get around Koh Phangan. We make it simple for our guests, with bikes available onsite and local friends who can help when ours are all in use.",
    image: "https://media.coconut.holiday/Services/bike2.jpeg",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="content-photo-hero cinematic-page-hero">
        <img src={servicesHero} alt="Coconut Beach on Koh Phangan" />
        <div className="content-photo-hero-shade" />
        <div className="content-photo-hero-copy">
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
              {service.image && (
                <img
                  className="service-card-image"
                  src={service.image}
                  alt={`${service.title} at Coconut Beach`}
                  loading="lazy"
                />
              )}
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
