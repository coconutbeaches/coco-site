import AvailabilitySearch from "@/components/AvailabilitySearch";
import HomeHero from "@/components/HomeHero";

const whatsappUrl = "https://wa.me/66926025572?text=Hello%20Coconut%20Beach%2C%20I%27d%20like%20to%20check%20availability.";

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      <AvailabilitySearch />

      <section className="section" id="fit">
        <div className="grid">
          <article className="card">
            <p>
              Coconut Beach is ideally located on the serene north side of Koh Phangan next to
              Chaloklum village and accessible by our private road or boat. Coconut Beach is proud
              to be 100% solar powered, and completely off grid (except for the fiber internet),
              with all water and energy generated onsite.
            </p>
          </article>
          <article className="card notice">
            <p>
              <strong>WE DO NOT ACCEPT GROUPS OF FRIENDS</strong>, especially if coming for the Full
              Moon Party. We also do not accept children under 8.
            </p>
          </article>
          <article className="card">
            <p>
              Guests enjoy the beachfront restaurant, which makes use of the organic farm onsite,
              as well as the beachfront massage studio. Additionally, our guests take full
              advantage of being located at one of the best snorkeling spots in Thailand and
              directly next to a hidden, unnamed, secret beach.
            </p>
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
