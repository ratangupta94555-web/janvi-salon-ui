import React, { useEffect, useRef, useState } from "react";
import "./CustomerPages.css";
import "./GalleryPortfolio.css";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import StudioHighlights from "../components/common/StudioHighlights";
import { GalleryMedia, galleryApi } from "../api/gallery";
type Props = { navigate: (to: string) => void };
const GALLERY_PAGE_SIZE = 9;

export default function GalleryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("All");
  const [uploadedMedia, setUploadedMedia] = useState<GalleryMedia[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [mediaLoading, setMediaLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const [selectedPhoto, setSelectedPhoto] = useState<[string, string] | null>(
    null,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const galleryPhotos = uploadedMedia
    .filter((media) => media.mediaType === "IMAGE")
    .map((media) => [media.category, media.secureUrl]);
  const visible = galleryPhotos.filter(
    ([cat]) => filter === "All" || cat === filter,
  );
  const visiblePhotos = visible.slice(0, visibleCount);
  const uploadedVideos = uploadedMedia.filter(
    (media) => media.mediaType === "VIDEO",
  );

  useEffect(() => {
    const controller = new AbortController();
    galleryApi
      .list(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setUploadedMedia(items);
          setMediaError("");
          setMediaLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setMediaError(
            error instanceof Error
              ? error.message
              : "Gallery media could not be loaded.",
          );
          setMediaLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

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
        className="gallery-page-hero"
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
        imageAlt="A bridal makeup look by Janvi Makeover"
        secondaryImage="/images/janvi-makeup-portrait.jpeg"
        secondaryImageAlt="A finished makeup look by Janvi"
        secondaryCaption="Beauty, with care"
        caption="Looks made to feel like you"
        index="02"
        imageLabel="THE GALLERY"
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
        {mediaLoading ? (
          <p className="gallery-empty-state" role="status">
            Loading videos…
          </p>
        ) : mediaError ? null : uploadedVideos.length ? (
          <div className="gallery-video-grid">
            {uploadedVideos.map((video) => (
              <article className="gallery-video-card" key={video.secureUrl}>
                <div className="gallery-video-frame">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    src={video.secureUrl}
                  />
                </div>
                <div className="gallery-video-copy">
                  <span>{video.category.toUpperCase()}</span>
                  <h3>{video.title}</h3>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="gallery-empty-state gallery-empty-card" role="status">
            <span className="gallery-empty-art" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <rect x="9" y="16" width="34" height="32" rx="4" />
                <path d="m43 27 12-7v24l-12-7" />
                <path d="m23 25 10 7-10 7V25Z" />
                <path d="m49 10 1.5 4.5L55 16l-4.5 1.5L49 22l-1.5-4.5L43 16l4.5-1.5L49 10Z" />
              </svg>
            </span>
            <div className="gallery-empty-copy">
              <span className="gallery-empty-kicker">MORE MOMENTS TO COME</span>
              <h2>Our next studio story is on its way.</h2>
              <p>
                We’re getting our behind-the-scenes moments ready for you. Check
                back soon, or come create a moment of your own.
              </p>
            </div>
            <button
              className="gallery-empty-action"
              type="button"
              onClick={() => navigate("/appointments")}
            >
              Book your visit
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        )}
      </section>
      <section className="gallery-content">
        {mediaError && (
          <p className="gallery-media-error" role="status">
            Gallery media could not be loaded ({mediaError}).
          </p>
        )}
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
        {mediaLoading ? (
          <p className="gallery-empty-state" role="status">
            Loading photos…
          </p>
        ) : mediaError ? null : visiblePhotos.length ? (
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
        ) : (
          <div
            className={`gallery-empty-state gallery-empty-card ${galleryPhotos.length ? "filtered" : "no-photos"}`}
            role="status"
          >
            <span className="gallery-empty-art" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <rect x="12" y="15" width="40" height="34" rx="3" />
                <circle cx="25" cy="27" r="4" />
                <path d="m16 44 12-12 8 8 5-5 7 9" />
                <path d="m49 10 1.5 4.5L55 16l-4.5 1.5L49 22l-1.5-4.5L43 16l4.5-1.5L49 10Z" />
              </svg>
            </span>
            <div className="gallery-empty-copy">
              <span className="gallery-empty-kicker">
                {galleryPhotos.length ? "A DIFFERENT LITTLE MOMENT" : "THE GALLERY IS BLOOMING"}
              </span>
              <h2>{galleryPhotos.length ? "No photos in this category." : "No photos yet."}</h2>
              <p>
                {galleryPhotos.length
                  ? "There are no looks in this collection just yet. Explore all our studio moments instead."
                  : "We’re getting the studio’s latest looks ready for you. Check back soon, or come create a moment of your own."}
              </p>
            </div>
            <button
              className="gallery-empty-action"
              type="button"
              onClick={() =>
                galleryPhotos.length ? selectFilter("All") : navigate("/appointments")
              }
            >
              {galleryPhotos.length ? "View all photos" : "Book your visit"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        )}
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
