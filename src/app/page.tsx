import AvailabilitySearch from "@/components/AvailabilitySearch";
import HomeHero from "@/components/HomeHero";

const whatsappUrl = "https://wa.me/66992598178?text=Hello%20Coconut%20Beach%2C%20I%27d%20like%20to%20check%20availability.";

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      <AvailabilitySearch />

      <section className="section" id="fit">
        <div className="grid">
          <article className="card">
            <h2>A strong fit</h2>
            <p>Quiet couples and mature independent travelers seeking beach, nature, and privacy.</p>
          </article>
          <article className="card notice">
            <h2>Not a conventional resort</h2>
            <p>Access requires planning, services are simple, and some rooms do not have air-conditioning.</p>
          </article>
          <article className="card">
            <h2>Book honestly</h2>
            <p>Every distinct room layout will include clear limitations, representative media, and exact pricing by date.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <p className="eyebrow">Need help deciding?</p>
          <h2>Talk to Coconut Beach directly</h2>
          <p>Share your dates and what kind of stay you want. We’ll help you choose the right room honestly.</p>
          <a className="button" href={whatsappUrl}>Message us on WhatsApp</a>
        </div>
      </section>

      <footer>Early foundation build · Coconut Beach Koh Phangan</footer>
    </main>
  );
}
