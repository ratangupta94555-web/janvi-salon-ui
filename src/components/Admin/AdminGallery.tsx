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

export default function AdminGallery() {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [category, setCategory] = useState<GalleryCategory>("Makeup");
  const [adminToken, setAdminToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [notice, setNotice] = useState("");
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
    const validationError = validateGallerySelection(images, video ? [video] : []);
    if (validationError) {
      setUploadError(validationError);
      return;
    }
    if (!adminToken.trim()) {
      setUploadError("Enter the gallery admin token configured on the backend.");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const uploaded = await galleryApi.upload(
        images,
        video,
        category,
        adminToken.trim(),
      );
      setMedia((current) => [...uploaded, ...current]);
      setImages([]);
      setVideo(null);
      if (imageInput.current) imageInput.current.value = "";
      if (videoInput.current) videoInput.current.value = "";
      setNotice(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} uploaded to Cloudinary and added to the gallery.`);
    } catch (error) {
      setReload((current) => current + 1);
      setUploadError(
        error instanceof Error ? error.message : "The files could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="admin-gallery">
      <div className="admin-gallery-panel">
        <div className="admin-gallery-heading">
          <div>
            <span className="admin-gallery-kicker">CLOUDINARY MEDIA</span>
            <h2>Upload to your gallery</h2>
            <p>
              Add up to 5 images and 1 video in one upload. New media appears
              on the public Gallery page after upload.
            </p>
          </div>
          <span className="admin-gallery-limit">5 images · 1 video</span>
        </div>

        <form className="admin-gallery-form" onSubmit={submitUpload}>
          <label className="admin-gallery-field">
            Gallery admin token
            <input
              type="password"
              autoComplete="off"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="Enter the token configured on the backend"
              required
            />
            <small>
              Set <code>GALLERY_ADMIN_TOKEN</code> on the backend. This value is
              only kept in this page’s memory.
            </small>
          </label>

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
            <label className="admin-gallery-field">
              Images <span>Up to 5 · 10 MB each</span>
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
                  ? `${images.length} image${images.length === 1 ? "" : "s"} selected`
                  : "JPG, PNG, WebP or another supported image format"}
              </small>
            </label>
            <label className="admin-gallery-field">
              Video <span>One · 100 MB max</span>
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
              <small>{video?.name ?? "MP4, MOV or another supported video format"}</small>
            </label>
          </div>

          {(images.length > 0 || video) && (
            <ul className="admin-gallery-selected">
              {images.map((image, index) => (
                <li key={`${image.name}-${image.lastModified}-${index}`}>
                  <span>Image</span>
                  {image.name}
                  <small>{(image.size / (1024 * 1024)).toFixed(1)} MB</small>
                </li>
              ))}
              {video && (
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
            disabled={uploading || !adminToken.trim()}
          >
            {uploading ? "Uploading…" : "Upload selected media"}
          </button>
        </form>
      </div>

      <div className="admin-gallery-panel">
        <div className="admin-gallery-heading">
          <div>
            <span className="admin-gallery-kicker">PUBLISHED MEDIA</span>
            <h2>Gallery items</h2>
            <p>Media already stored in Cloudinary and shown to visitors.</p>
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
        ) : media.length ? (
          <div className="admin-gallery-media-grid">
            {media.map((item) => (
              <article className="admin-gallery-media-card" key={item.id}>
                {item.mediaType === "VIDEO" ? (
                  <video src={item.secureUrl} controls preload="metadata" />
                ) : (
                  <img src={item.secureUrl} alt={item.title} loading="lazy" />
                )}
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category} · {item.mediaType.toLowerCase()}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-gallery-empty">
            No Cloudinary media has been uploaded yet.
          </p>
        )}
      </div>
    </section>
  );
}
