import React, { useState } from "react";
import "./CustomerPages.css";
type Props = { navigate: (to: string) => void };
const photos = [
  ["Makeup", "/images/janvi-bridal-makeup.jpeg"],
  ["Makeup", "/images/janvi-bridal-closeup.jpeg"],
  ["Studio", "/images/janvi-certificate-with-mentor.jpeg"],
  ["Hair", "/images/janvi-stylist-portrait.jpeg"],
  ["Studio", "/images/janvi-team-certificate.jpeg"],
  ["Makeup", "/images/janvi-makeup-action.jpeg"],
  ["Makeup", "/images/janvi-bridal-finish.jpeg"],
  ["Hair", "/images/janvi-hair-styling.jpeg"],
  ["Makeup", "/images/janvi-makeup-portrait.jpeg"],
];
export default function GalleryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("All");
  const visible = photos.filter(([cat]) => filter === "All" || cat === filter);
  return (
    <main className="customer-page">
      <section className="gallery-title-banner">
        <div className="gallery-title-copy">
          <span className="page-kicker">A LITTLE INSPIRATION</span>
          <h1>
            Made here.
            <br />
            <em>Worn everywhere.</em>
          </h1>
          <p>Real people, real lovely hair, and the moments in between.</p>
        </div>
        <div className="gallery-title-photo">
          <img
            src="/images/janvi-bridal-finish.jpeg"
            alt="Janvi finishing a bridal makeup look"
          />
          <span>Beauty, made personal</span>
        </div>
      </section>
      <section className="gallery-content">
        <div className="gallery-filters">
          {["All", "Hair", "Makeup", "Studio"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {visible.map(([cat, img], i) => (
            <figure
              key={img}
              className={`gallery-photo gallery-photo-${i % 6}`}
            >
              <img
                src={img}
                alt={`${cat} portfolio at Janvi Makeover Studio`}
              />
              <figcaption>{cat} · Janvi Makeover Studio</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="gallery-cta">
        <span className="page-kicker">YOUR TURN</span>
        <h2>
          Save the inspiration.
          <br />
          <em>Let’s make it yours.</em>
        </h2>
        <button
          className="editorial-button"
          onClick={() => navigate("/appointments")}
        >
          Book a consultation <span>↗</span>
        </button>
      </section>
    </main>
  );
}
