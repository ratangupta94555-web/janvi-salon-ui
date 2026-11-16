import React, { useEffect, useRef, useState } from "react";
import {
  GalleryCategory,
  GalleryMedia,
  galleryApi,
  MAX_GALLERY_IMAGES_PER_UPLOAD,
  validateGallerySelection,
} from "../../api/gallery";
import BrandLoader from "../common/BrandLoader";
import "./AdminGallery.css";

const categories: GalleryCategory[] = ["Makeup", "Hair", "Bridal", "Studio"];

type AdminGalleryProps = {
  view: "photos" | "videos";
  notify: (message: string) => void;
};

export default function AdminGallery({ view, notify }: AdminGalleryProps) {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [category, setCategory] = useState<GalleryCategory>("Makeup");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
  const [reload, setReload] = useState(0);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    galleryApi
      .list(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setMedia(items);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : "Gallery media could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    setImages([]);
    setVideo(null);
    setUploadError("");
    setNotice("");
    if (imageInput.current) imageInput.current.value = "";
    if (videoInput.current) videoInput.current.value = "";
  }, [view]);

  const selectImages = (files: File[]) => {
    if (files.length > MAX_GALLERY_IMAGES_PER_UPLOAD) {
      setImages([]);
      if (imageInput.current) imageInput.current.value = "";
      setUploadError("Select no more than 5 images at a time.");
      return;
    }
    setImages(files);
    setUploadError("");
    setNotice("");
  };

  const submitUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    const uploadImages = view === "photos" ? images : [];
    const uploadVideo = view === "videos" ? video : null;
    const validationError = validateGallerySelection(
      uploadImages,
      uploadVideo ? [uploadVideo] : [],
    );
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const uploaded = await galleryApi.upload(
        uploadImages,
        uploadVideo,
        category,
      );
      setMedia((current) => [...uploaded, ...current]);
      setImages([]);
      setVideo(null);
      if (imageInput.current) imageInput.current.value = "";
      if (videoInput.current) videoInput.current.value = "";
      setNotice(
        `${uploaded.length} ${view === "photos" ? "photo" : "video"}${uploaded.length === 1 ? "" : "s"} uploaded to Cloudinary and added to the gallery.`,
      );
    } catch (error) {
      setReload((current) => current + 1);
      setUploadError(
        error instanceof Error ? error.message : "The files could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  };
  const deleteMedia = async (item: GalleryMedia) => {
    if (
      !window.confirm(
        `Permanently delete "${item.title}" from the gallery and Cloudinary? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingMediaId(item.id);
    try {
      await galleryApi.remove(item.id);
      setMedia((current) => current.filter((mediaItem) => mediaItem.id !== item.id));
      notify("Media permanently deleted from the gallery and Cloudinary.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gallery media could not be permanently deleted.",
      );
    } finally {
      setDeletingMediaId(null);
    }
  };
  const visibleMedia = media.filter((item) =>
    view === "photos" ? item.mediaType === "IMAGE" : item.mediaType === "VIDEO",
  );
  const selectedMediaCount = view === "photos" ? images.length : video ? 1 : 0;

  return (
    <section className="admin-gallery">
      <div className="admin-gallery-panel">
        <div className="admin-gallery-heading">
          <div>
            <span className="admin-gallery-kicker">CLOUDINARY MEDIA</span>
            <h2>Upload {view === "photos" ? "photos" : "videos"}</h2>
            <p>
              {view === "photos"
                ? "Choose up to 5 photos for your public gallery."
                : "Choose one video for your public gallery."}
            </p>
          </div>
          <span className="admin-gallery-limit">
            {view === "photos" ? "Up to 5 photos · 10 MB each" : "1 video · up to 100 MB"}
          </span>
        </div>

        <form className="admin-gallery-form" onSubmit={submitUpload}>
          <label className="admin-gallery-field">
            Category
            <select
              value={category}
              onChange={(event) => {
                const selectedCategory = categories.find(
                  (item) => item === event.target.value,
                );
                if (selectedCategory) setCategory(selectedCategory);
              }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-gallery-file-fields">
            {view === "photos" ? (
              <label className="admin-gallery-field">
                Choose photos <span>Up to 5 · 10 MB each</span>
                <input
                  ref={imageInput}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    selectImages(Array.from(event.currentTarget.files ?? []))
                  }
                />
                <small>
                  {images.length
                    ? `${images.length} photo${images.length === 1 ? "" : "s"} selected`
                    : "JPG, PNG, WebP or another supported image format"}
                </small>
              </label>
            ) : (
              <label className="admin-gallery-field">
                Choose a video <span>One · 100 MB max</span>
                <input
                  ref={videoInput}
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    setVideo(event.currentTarget.files?.[0] ?? null);
                    setUploadError("");
                    setNotice("");
                  }}
                />
                <small>
                  {video?.name ?? "MP4, MOV or another supported video format"}
                </small>
              </label>
            )}
          </div>

          {selectedMediaCount > 0 && (
            <ul className="admin-gallery-selected">
              {view === "photos" && images.map((image, index) => (
                <li key={`${image.name}-${image.lastModified}-${index}`}>
                  <span>Photo</span>
                  {image.name}
                  <small>{(image.size / (1024 * 1024)).toFixed(1)} MB</small>
                </li>
              ))}
              {view === "videos" && video && (
                <li>
                  <span>Video</span>
                  {video.name}
                  <small>{(video.size / (1024 * 1024)).toFixed(1)} MB</small>
                </li>
              )}
            </ul>
          )}

          {uploadError && (
            <p className="admin-gallery-message error" role="alert">
              {uploadError}
            </p>
          )}
          {notice && (
            <p className="admin-gallery-message success" role="status">
              {notice}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={uploading || selectedMediaCount === 0}
          >
            {uploading
              ? "Uploading…"
              : `Upload ${view === "photos" ? "photos" : "video"}`}
          </button>
        </form>
      </div>

      <div className="admin-gallery-panel">
        <div className="admin-gallery-heading">
          <div>
            <span className="admin-gallery-kicker">PUBLISHED MEDIA</span>
            <h2>{view === "photos" ? "Published photos" : "Published videos"}</h2>
            <p>
              {visibleMedia.length} {view === "photos" ? "photo" : "video"}
              {visibleMedia.length === 1 ? "" : "s"} stored in Cloudinary.
            </p>
          </div>
          <button
            className="admin-gallery-refresh"
            type="button"
            onClick={() => setReload((current) => current + 1)}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <BrandLoader message="Loading gallery media" variant="compact" />
        ) : loadError ? (
          <div className="admin-gallery-message error" role="alert">
            {loadError}
          </div>
        ) : visibleMedia.length ? (
          <div className="admin-gallery-media-grid">
            {visibleMedia.map((item) => (
              <article className="admin-gallery-media-card" key={item.id}>
                {item.mediaType === "VIDEO" ? (
                  <video src={item.secureUrl} controls preload="metadata" />
                ) : (
                  <img src={item.secureUrl} alt={item.title} loading="lazy" />
                )}
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category} · {item.mediaType.toLowerCase()}</span>
                  <button
                    className="admin-gallery-delete"
                    type="button"
                    disabled={deletingMediaId === item.id}
                    onClick={() => void deleteMedia(item)}
                  >
                    {deletingMediaId === item.id ? "Deleting…" : "Permanently delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-gallery-empty">
            No {view === "photos" ? "photos" : "videos"} have been uploaded yet.
          </p>
        )}
      </div>
    </section>
  );
}
