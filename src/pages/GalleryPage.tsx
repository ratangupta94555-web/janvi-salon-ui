import React, { useEffect, useRef, useState } from "react";
import "./CustomerPages.css";
import "./GalleryPortfolio.css";
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
      <section className="inner-hero about-hero public-page-hero gallery-page-hero">
        <div className="about-hero-copy">
          <span className="page-kicker">A LITTLE INSPIRATION</span>
          <h1>
            Made here.
            <br />
            <em>Worn everywhere.</em>
          </h1>
          <p>Real people, real lovely hair, and the moments in between.</p>
          <button
            className="editorial-button"
            onClick={() => navigate("/appointments")}
          >
            Book your visit <span>↗</span>
          </button>
          <span className="about-hero-note">
            Hair <i>·</i> Makeup <i>·</i> Studio
          </span>
        </div>
      </section>
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
          <p className="gallery-empty-state" role="status">
            No videos yet.
          </p>
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
          <p className="gallery-empty-state" role="status">
            {galleryPhotos.length
              ? "No photos in this category."
              : "No photos yet."}
          </p>
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
