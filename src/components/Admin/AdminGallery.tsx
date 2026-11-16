import React, { useEffect, useRef, useState } from "react";
import {
  GalleryCategory,
  GalleryMedia,
  galleryApi,
  MAX_GALLERY_IMAGES_PER_UPLOAD,
  MAX_GALLERY_VIDEO_BYTES,
  MAX_GALLERY_VIDEOS_TOTAL,
  validateGallerySelection,
} from "../../api/gallery";
import BrandLoader from "../common/BrandLoader";
import AdminPagination from "./AdminPagination";
import "./AdminGallery.css";

const categories: GalleryCategory[] = ["Makeup", "Hair", "Bridal", "Studio"];
const MEDIA_PAGE_SIZE = 12;

type AdminGalleryProps = {
  view: "photos" | "videos";
  notify: (message: string) => void;
};

export default function AdminGallery({ view, notify }: AdminGalleryProps) {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [category, setCategory] = useState<GalleryCategory>("Makeup");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GalleryMedia[] | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [videoLimitModalOpen, setVideoLimitModalOpen] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
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
    const previewUrls = images.map((image) => URL.createObjectURL(image));
    setImagePreviewUrls(previewUrls);
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    setImages([]);
    setVideo(null);
    setSelectedPhotoIds([]);
    setMediaPage(1);
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
    const existingVideoCount = media.filter(
      (item) => item.mediaType === "VIDEO",
    ).length;
    const validationError = validateGallerySelection(
      uploadImages,
      uploadVideo ? [uploadVideo] : [],
      existingVideoCount,
    );
    if (validationError) {
      if (validationError.startsWith("Only 10 videos")) {
        setVideoLimitModalOpen(true);
      } else {
        setUploadError(validationError);
      }
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
      setMediaPage(1);
      setImages([]);
      setVideo(null);
      if (imageInput.current) imageInput.current.value = "";
      if (videoInput.current) videoInput.current.value = "";
      setNotice(
        `${uploaded.length} ${view === "photos" ? "photo" : "video"}${uploaded.length === 1 ? "" : "s"} uploaded to Cloudinary and added to the gallery.`,
      );
    } catch (error) {
      setReload((current) => current + 1);
      const message =
        error instanceof Error ? error.message : "The files could not be uploaded.";
      if (message.startsWith("Only 10 videos")) {
        setVideoLimitModalOpen(true);
      } else {
        setUploadError(message);
      }
    } finally {
      setUploading(false);
    }
  };
  const deleteMedia = async () => {
    if (!deleteTarget || deletingMedia) return;
    setDeletingMedia(true);
    const deletedIds: number[] = [];
    let firstError = "";
    for (const item of deleteTarget) {
      try {
        await galleryApi.remove(item.id);
        deletedIds.push(item.id);
      } catch (error) {
        if (!firstError) {
          firstError =
            error instanceof Error
              ? error.message
              : "Gallery media could not be permanently deleted.";
        }
      }
    }
    setMedia((current) =>
      current.filter((mediaItem) => !deletedIds.includes(mediaItem.id)),
    );
    setSelectedPhotoIds((current) =>
      current.filter((id) => !deletedIds.includes(id)),
    );
    setDeleteTarget(null);
    if (firstError) {
      notify(
        `${deletedIds.length} photo${deletedIds.length === 1 ? "" : "s"} deleted; ${deleteTarget.length - deletedIds.length} could not be deleted. ${firstError}`,
      );
    } else if (deleteTarget.length === 1) {
      notify("Media permanently deleted from the gallery and Cloudinary.");
    } else {
      notify(
        `${deletedIds.length} photos permanently deleted from the gallery and Cloudinary.`,
      );
    }
    setDeletingMedia(false);
  };
  const visibleMedia = media.filter((item) =>
    view === "photos" ? item.mediaType === "IMAGE" : item.mediaType === "VIDEO",
  );
  const mediaPageCount = Math.max(
    1,
    Math.ceil(visibleMedia.length / MEDIA_PAGE_SIZE),
  );
  const currentMediaPage = Math.min(mediaPage, mediaPageCount);
  const paginatedMedia = visibleMedia.slice(
    (currentMediaPage - 1) * MEDIA_PAGE_SIZE,
    currentMediaPage * MEDIA_PAGE_SIZE,
  );
  const pagePhotoIds = paginatedMedia
    .filter((item) => item.mediaType === "IMAGE")
    .map((item) => item.id);
  const allPagePhotosSelected =
    pagePhotoIds.length > 0 &&
    pagePhotoIds.every((id) => selectedPhotoIds.includes(id));
  const selectedPhotos = visibleMedia.filter((item) =>
    selectedPhotoIds.includes(item.id),
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
                : `Choose one video. The gallery holds up to ${MAX_GALLERY_VIDEOS_TOTAL} videos.`}
            </p>
          </div>
          <span className="admin-gallery-limit">
            {view === "photos"
              ? "Up to 5 photos · 10 MB each"
              : `Up to ${MAX_GALLERY_VIDEOS_TOTAL} videos · 50 MB each`}
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
                Choose a video{" "}
                <span>
                  {MAX_GALLERY_VIDEO_BYTES / (1024 * 1024)} MB max · 10 videos
                  total
                </span>
                <input
                  ref={videoInput}
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    setVideo(event.currentTarget.files?.[0] ?? null);
                    setUploadError("");
                    setNotice("");
                    if (
                      media.filter((item) => item.mediaType === "VIDEO").length >=
                      MAX_GALLERY_VIDEOS_TOTAL
                    ) {
                      setVideoLimitModalOpen(true);
                    }
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
              {view === "photos" &&
                images.map((image, index) => (
                  <li
                    className="admin-gallery-selected-photo"
                    key={`${image.name}-${image.lastModified}-${index}`}
                  >
                    {imagePreviewUrls[index] && (
                      <img
                        src={imagePreviewUrls[index]}
                        alt={`Preview of ${image.name}`}
                      />
                    )}
                    <span>Photo</span>
                    <strong>{image.name}</strong>
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
          <>
            {view === "photos" && (
              <div className="admin-gallery-bulk-actions">
                <label>
                  <input
                    type="checkbox"
                    aria-label="Select all photos on this page"
                    checked={allPagePhotosSelected}
                    disabled={deletingMedia}
                    onChange={() =>
                      setSelectedPhotoIds((current) =>
                        allPagePhotosSelected
                          ? current.filter((id) => !pagePhotoIds.includes(id))
                          : Array.from(new Set([...current, ...pagePhotoIds])),
                      )
                    }
                  />
                  Select all photos on this page
                </label>
                {selectedPhotos.length > 0 && (
                  <div>
                    <span>{selectedPhotos.length} selected</span>
                    <button
                      type="button"
                      disabled={deletingMedia}
                      onClick={() => setDeleteTarget(selectedPhotos)}
                    >
                      Delete selected
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="admin-gallery-media-grid">
              {paginatedMedia.map((item) => (
                <article className="admin-gallery-media-card" key={item.id}>
                  {item.mediaType === "VIDEO" ? (
                    <video src={item.secureUrl} controls preload="metadata" />
                  ) : (
                    <img src={item.secureUrl} alt={item.title} loading="lazy" />
                  )}
                  {item.mediaType === "IMAGE" && (
                    <label className="admin-gallery-photo-select">
                      <input
                        type="checkbox"
                        aria-label={`Select photo ${item.title}`}
                        checked={selectedPhotoIds.includes(item.id)}
                        disabled={deletingMedia}
                        onChange={() =>
                          setSelectedPhotoIds((current) =>
                            current.includes(item.id)
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id],
                          )
                        }
                      />
                      Select
                    </label>
                  )}
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.category} · {item.mediaType.toLowerCase()}</span>
                    <button
                      className="admin-gallery-delete"
                      type="button"
                      disabled={deletingMedia}
                      onClick={() => setDeleteTarget([item])}
                    >
                      Permanently delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="admin-gallery-empty">
            No {view === "photos" ? "photos" : "videos"} have been uploaded yet.
          </p>
        )}
        {!loading && !loadError && visibleMedia.length > 0 && (
          <AdminPagination
            currentPage={currentMediaPage}
            pageSize={MEDIA_PAGE_SIZE}
            totalItems={visibleMedia.length}
            itemLabel={view === "photos" ? "photos" : "videos"}
            onPageChange={setMediaPage}
          />
        )}
      </div>
      {deleteTarget && (
        <div
          className="admin-gallery-delete-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingMedia
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="admin-gallery-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="gallery-delete-title"
            aria-describedby="gallery-delete-description"
          >
            <span className="admin-gallery-delete-icon" aria-hidden="true">
              !
            </span>
            <span className="admin-gallery-kicker">CONFIRM DELETION</span>
            <h2 id="gallery-delete-title">
              {deleteTarget.length === 1
                ? `Delete this ${deleteTarget[0].mediaType === "IMAGE" ? "photo" : "video"}?`
                : `Delete ${deleteTarget.length} selected photos?`}
            </h2>
            <p id="gallery-delete-description">
              {deleteTarget.length === 1
                ? `“${deleteTarget[0].title}” will be permanently removed from the gallery and Cloudinary. This action cannot be undone.`
                : `${deleteTarget.length} selected photos will be permanently removed from the gallery and Cloudinary. This action cannot be undone.`}
            </p>
            <div className="admin-gallery-delete-actions">
              <button
                className="admin-gallery-delete-cancel"
                type="button"
                disabled={deletingMedia}
                onClick={() => setDeleteTarget(null)}
              >
                Keep it
              </button>
              <button
                className="admin-gallery-delete-confirm"
                type="button"
                disabled={deletingMedia}
                onClick={() => void deleteMedia()}
              >
                {deletingMedia ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
      {videoLimitModalOpen && (
        <div
          className="admin-gallery-limit-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setVideoLimitModalOpen(false);
            }
          }}
        >
          <section
            className="admin-gallery-limit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-video-limit-title"
          >
            <span className="admin-gallery-limit-icon" aria-hidden="true">
              !
            </span>
            <span className="admin-gallery-kicker">GALLERY VIDEO LIMIT</span>
            <h2 id="gallery-video-limit-title">Your video collection is full</h2>
            <p>
              Only {MAX_GALLERY_VIDEOS_TOTAL} videos can be stored in the
              gallery. Delete an existing video before uploading another.
            </p>
            <small>
              {media.filter((item) => item.mediaType === "VIDEO").length} of{" "}
              {MAX_GALLERY_VIDEOS_TOTAL} videos currently stored
            </small>
            <button
              className="admin-gallery-limit-dismiss"
              type="button"
              onClick={() => setVideoLimitModalOpen(false)}
            >
              Got it
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
