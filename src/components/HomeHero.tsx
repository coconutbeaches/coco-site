"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "https://media.coconut.holiday/Atmosphere/18f18e1e-2e59-4578-a72d-57839a1af04a.jpg",
  "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png",
  "https://media.coconut.holiday/Atmosphere/IMG_2425.jpeg",
  "https://media.coconut.holiday/Atmosphere/IMG_2578.jpeg",
];

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 10_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero home-hero">
      <div className="hero-slides" aria-hidden="true">
        {heroImages.map((src, index) => (
          <img
            key={src}
            className={`hero-slide${index === activeIndex ? " active" : ""}`}
            src={src}
            alt=""
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-inner">
        <h1 className="site-wordmark">Coconut Beach</h1>
        <p className="eyebrow">Koh Phangan · Thailand</p>
      </div>
    </section>
  );
}
