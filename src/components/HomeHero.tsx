"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "https://media.coconut.holiday/Atmosphere/18f18e1e-2e59-4578-a72d-57839a1af04a.jpg",
  "https://media.coconut.holiday/Atmosphere/69633d3f-afb1-4a3c-9712-a5051117a3b2.png",
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
        <p className="eyebrow">Koh Phangan · Thailand</p>
        <h1>Coconut Beach</h1>
        <p className="lead">
          A quiet, off-grid beachfront stay for independent travelers who want nature,
          simplicity, and the sea directly outside.
        </p>
        <div className="actions">
          <a className="button" href="#availability">Check availability</a>
          <Link className="button secondary" href="/stays">Explore the rooms</Link>
        </div>
      </div>
    </section>
  );
}
