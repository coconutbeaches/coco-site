const bookingReviews = "https://www.booking.com/hotel/th/coconut-beach-bungalows.html#tab-reviews";
const airbnbReviews = "https://www.airbnb.com/users/show/766649";
const aboutHero = "https://media.coconut.holiday/Atmosphere/IMG_2425.jpeg";

export default function AboutPage() {
  return (
    <main>
      <section className="content-photo-hero">
        <img src={aboutHero} alt="Coconut Beach and Haad Khom on Koh Phangan" />
        <div className="content-photo-hero-shade" />
        <div className="content-photo-hero-copy">
          <a className="back-link" href="/">← Back to booking</a>
          <p className="eyebrow">Koh Phangan · Thailand</p>
          <h1 className="site-wordmark">About Coconut Beach</h1>
        </div>
      </section>

      <section className="section about-copy">
        <h2>Coconut Beach is not for everybody</h2>
        <p>
          Coconut Beach is a private collection of modern and stylish beach bungalows ideally located at
          beautiful Haad Khom beach on the serene north side of Koh Phangan, and accessible by our private road or boat.
        </p>
        <p className="about-policy">
          <strong>WE DO NOT ACCEPT GROUPS OR YOUNG GUYS / GALS</strong>, especially if coming to Koh Phangan for the
          Full Moon Party. We also do not accept children under 8 years of age.
        </p>
        <p>
          Our bungalows have a unique, open windowless design that our guests love. No windows needed, and no air
          conditioners needed either. Monkeys also love our design and visit often to see if guests left food in the rooms.
        </p>
        <p>
          Coconut Beach is proud to be 100% solar powered, and completely off grid (except for the fiber internet), with
          all water and energy generated onsite.
        </p>
        <p>
          Guests enjoy the beachfront restaurant, which makes use of the organic farm onsite, as well as the beachfront
          massage studio. Guests also take full advantage of being located at one of the best snorkeling spots in Thailand
          and directly next to a hidden, unnamed, secret beach. Our beachfront parking, pool, showers, beach umbrellas,
          motorbikes, paddle boards and other amenities are reserved for our guests.
        </p>
        <p>
          We are a family who live full time, year round on site. It is our home, so we are always available. In fact, all
          the Thai people on site are one family — Grandfather is the handyman, Grandma cleans rooms, Sister is chef,
          Brother is groundskeeper, and so on.
        </p>
        <p>
          Haad Khom beach is arguably the best beach on Koh Phangan. Locals and long-time visitors who started coming
          20 years ago are trying to keep it a secret because it reminds them of how the island was when they first fell in love with it.
        </p>
        <p>
          Five kilometers away is Chaloklum, a 500-year-old fishing village. Two classic longtail taxi boats park at the
          beach and can take guests around the island. The two men who operate the boats, Kai and Torn, were born on the
          beach, speak decent English and are happy to help.
        </p>
        <p>
          We have motorbikes for guests and a truck available. Taxis are available anytime in the town next door, about
          five minutes away. The popular hiking trail to Bottle Beach starts at the top of our property.
        </p>
      </section>

      <section className="section review-section">
        <p className="eyebrow">Guest reviews</p>
        <h2>Please see our guest reviews</h2>
        <div className="review-links">
          <a href={bookingReviews} target="_blank" rel="noreferrer">Booking.com Reviews</a>
          <a href={airbnbReviews} target="_blank" rel="noreferrer">Airbnb Reviews</a>
        </div>
      </section>
    </main>
  );
}
