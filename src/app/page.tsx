import AvailabilitySearch from "@/components/AvailabilitySearch";
import HomeHero from "@/components/HomeHero";

const whatsappUrl = "https://wa.me/66926025572?text=Hello%20Coconut%20Beach%2C%20I%27d%20like%20to%20check%20availability.";
const bookingReviews = "https://www.booking.com/hotel/th/coconut-beach-bungalows.html#tab-reviews";
const airbnbReviews = "https://www.airbnb.com/users/show/766649";

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      <AvailabilitySearch />

      <section className="section review-section" id="reviews">
        <p className="eyebrow">Please see our guest reviews</p>
        <h2>Please see our guest reviews</h2>
        <div className="review-links">
          <a href={bookingReviews} target="_blank" rel="noreferrer">Booking.com Reviews</a>
          <a href={airbnbReviews} target="_blank" rel="noreferrer">Airbnb Reviews</a>
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
    </main>
  );
}
