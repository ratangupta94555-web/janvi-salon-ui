import React, { useEffect, useRef, useState } from "react";
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
const videoHighlights = [
  {
    category: "THE STUDIO",
    title: "A little time in the chair",
    poster: "/images/janvi-team-certificate.jpeg",
    src: "/videos/janvi-salon-01.mp4",
  },
  {
    category: "BRIDAL",
    title: "The finishing touches",
    poster: "/images/janvi-bridal-finish.jpeg",
    src: "/videos/janvi-salon-02.mp4",
  },
  {
    category: "HAIR",
    title: "Style, made personal",
    poster: "/images/janvi-hair-styling.jpeg",
    src: "/videos/janvi-salon-03.mp4",
  },
  {
    category: "MAKEUP",
    title: "From first brush to final look",
    poster: "/images/janvi-makeup-action.jpeg",
    src: "/videos/janvi-salon-04.mp4",
  },
  {
    category: "SALON MOMENTS",
    title: "Care in every detail",
    poster: "/images/janvi-stylist-portrait.jpeg",
    src: "/videos/janvi-salon-05.mp4",
  },
];
const GALLERY_PAGE_SIZE = 9;

export default function GalleryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("All");
  const visible = photos.filter(([cat]) => filter === "All" || cat === filter);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const [selectedPhoto, setSelectedPhoto] = useState<[string, string] | null>(
    null,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visiblePhotos = visible.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount >= visible.length) return;
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) =>
            Math.min(count + GALLERY_PAGE_SIZE, visible.length),
          );
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [visible.length, visibleCount]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("gallery-modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("gallery-modal-open");
    };
  }, [selectedPhoto]);

  const selectFilter = (nextFilter: string) => {
    setFilter(nextFilter);
    setVisibleCount(GALLERY_PAGE_SIZE);
  };

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
      <section
        className="gallery-video-section"
        aria-labelledby="gallery-video-title"
      >
        <div className="gallery-video-heading">
          <span className="page-kicker">MOVING MOMENTS</span>
          <h2 id="gallery-video-title">
            A little more <em>life</em> in the studio.
          </h2>
          <p>
            Little glimpses of the care, craft, and creativity behind each look.
          </p>
        </div>
        <div className="gallery-video-grid">
          {videoHighlights.map((video) => (
            <article className="gallery-video-card" key={video.title}>
              <div className="gallery-video-frame">
                {video.src ? (
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={video.poster}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                ) : (
                  <div className="gallery-video-placeholder">
                    <img src={video.poster} alt="" />
                    <span className="gallery-video-play" aria-hidden="true">
                      ▶
                    </span>
                    <span className="gallery-video-status">
                      Video coming soon
                    </span>
                  </div>
                )}
              </div>
              <div className="gallery-video-copy">
                <span>{video.category}</span>
                <h3>{video.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="gallery-content">
        <div className="gallery-filters">
          {["All", "Hair", "Makeup", "Bridal", "Studio"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => selectFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {visiblePhotos.map(([cat, img], i) => (
            <figure
              key={img}
              className={`gallery-photo gallery-photo-${i % 6}`}
            >
              <button
                className="gallery-photo-open"
                type="button"
                aria-label={`View ${cat.toLowerCase()} photo`}
                onClick={() => setSelectedPhoto([cat, img])}
              >
                <img
                  src={img}
                  alt={`${cat} portfolio at Janvi Makeover Studio`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <figcaption>{cat} · Janvi Makeover Studio</figcaption>
            </figure>
          ))}
        </div>
        {visibleCount < visible.length && (
          <div
            ref={loadMoreRef}
            className="gallery-load-more"
            aria-live="polite"
          >
            Loading more photos…
          </div>
        )}
      </section>
      {selectedPhoto && (
        <div
          className="gallery-lightbox"
          role="presentation"
          onClick={() => setSelectedPhoto(null)}
        >
          <section
            className="gallery-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPhoto[0]} gallery photo`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="gallery-lightbox-close"
              type="button"
              aria-label="Close photo"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <img
              src={selectedPhoto[1]}
              alt={`${selectedPhoto[0]} portfolio at Janvi Makeover Studio`}
            />
            <p>{selectedPhoto[0]} · Janvi Makeover Studio</p>
          </section>
        </div>
      )}
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
