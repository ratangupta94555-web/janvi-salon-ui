import React, { useState } from "react";
import "./CustomerPages.css";
import "./GalleryPortfolio.css";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import StudioHighlights from "../components/common/StudioHighlights";
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
const portfolioNames = [
  "09.50.18 (1)",
  "09.50.18",
  "09.50.19 (1)",
  "09.50.19 (2)",
  "09.50.19",
  "09.50.20 (1)",
  "09.50.20 (2)",
  "09.50.20",
  "09.50.21 (1)",
  "09.50.21 (2)",
  "09.50.21",
  "09.50.22 (2)",
  "09.50.22",
  "09.50.23",
  "09.50.24 (2)",
  "09.50.25 (1)",
  "09.50.25",
  "09.50.24 (1)",
  "09.50.26 (1)",
  "09.50.26",
  "09.50.27 (1)",
  "09.50.27",
  "09.51.54",
  "09.52.10",
  "09.52.12",
  "09.52.18 (1)",
  "09.52.18",
  "09.52.19",
  "09.52.20",
  "09.52.21",
  "09.52.22 (1)",
  "09.52.22",
  "09.52.23",
  "09.52.24 (1)",
  "09.52.24",
  "09.52.27 (1)",
  "09.52.27",
  "09.52.28 (1)",
  "09.52.28",
  "09.52.29 (1)",
  "09.52.29",
  "09.52.30 (1)",
  "09.52.30 (2)",
  "09.52.30",
  "09.52.31 (1)",
  "09.52.31 (2)",
  "09.52.31",
  "09.52.32 (1)",
  "09.52.32",
  "09.52.33 (1)",
  "09.52.33",
];
const portfolioPhotos = portfolioNames.map((stamp) => {
  const time = stamp.split(" ")[0];
  const file = `WhatsApp Image 2026-09-30 at ${stamp}.jpeg`;
  const category =
    stamp === "09.50.25" || stamp === "09.50.27" || time.startsWith("09.52.28")
      ? "Hair"
      : time.startsWith("09.52.10") ||
          time.startsWith("09.52.12") ||
          time.startsWith("09.52.20") ||
          time.startsWith("09.52.31") ||
          time.startsWith("09.52.32") ||
          time.startsWith("09.52.33")
        ? "Studio"
        : time.startsWith("09.52") || time.startsWith("09.51")
          ? "Bridal"
          : "Makeup";
  return [category, `/images/janvi-portfolio/${encodeURIComponent(file)}`] as [
    string,
    string,
  ];
});
photos.push(...portfolioPhotos);
export default function GalleryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("All");
  const visible = photos.filter(([cat]) => filter === "All" || cat === filter);
  return (
    <main className="customer-page">
      <PublicEditorialHero
        kicker="A LITTLE INSPIRATION"
        title={
          <>
            Made here.
            <br />
            <em>Worn everywhere.</em>
          </>
        }
        description="Real people, real lovely hair, and the moments in between."
        image="/images/janvi-bridal-finish.jpeg"
        imageAlt="A finished bridal makeup look by Janvi"
        secondaryImage="/images/janvi-hair-styling.jpeg"
        secondaryImageAlt="Janvi styling a client's hair"
        secondaryCaption="Hair, with care"
        caption="Beauty, made personal"
        index="02"
        imageLabel="THE PORTFOLIO"
        note={
          <>
            Hair <i>·</i> Makeup <i>·</i> Studio
          </>
        }
        actionLabel="Book your visit"
        onAction={() => navigate("/appointments")}
      />
      <StudioHighlights page="gallery" />
      <section className="gallery-content">
        <div className="gallery-filters">
          {["All", "Hair", "Makeup", "Bridal", "Studio"].map((f) => (
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
