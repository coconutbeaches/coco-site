import AvailabilitySearch from "@/components/AvailabilitySearch";
import HomeHero from "@/components/HomeHero";

const whatsappUrl = "https://wa.me/66926025572?text=Hello%20Coconut%20Beach%2C%20I%27d%20like%20to%20check%20availability.";
const bookingReviews = "https://www.booking.com/hotel/th/coconut-beach-bungalows.html#tab-reviews";
const airbnbReviews = "https://www.airbnb.com/users/show/766649";
const whatsappLogo = "https://media.coconut.holiday/Services/WALOGO.png";
const bookingLogo = "https://media.coconut.holiday/Services/bookinglogo.png";
const airbnbLogo = "https://media.coconut.holiday/Services/airbnblogo.png";

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      <AvailabilitySearch />

      <section className="section review-section" id="reviews">
        <p className="eyebrow">Please see our guest reviews</p>
        <div className="review-links">
          <a href={bookingReviews} target="_blank" rel="noreferrer" aria-label="Booking.com Reviews">
            <img src={bookingLogo} alt="Booking.com Reviews" />
          </a>
          <a href={airbnbReviews} target="_blank" rel="noreferrer" aria-label="Airbnb Reviews">
            <img src={airbnbLogo} alt="Airbnb Reviews" />
          </a>
        </div>
      </section>

      <section className="section help-section">
        <div className="help-card">
          <p className="eyebrow">Need help?</p>
          <a className="button whatsapp-help-button" href={whatsappUrl}>
            <span>Message us on WhatsApp</span>
            <img src={whatsappLogo} alt="" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
