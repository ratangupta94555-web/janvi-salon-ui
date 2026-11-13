import { apiRequest } from "./services";

export type GalleryMediaType = "IMAGE" | "VIDEO";

export type GalleryMedia = {
  id: number;
  mediaType: GalleryMediaType;
  secureUrl: string;
  title: string;
  category: string;
  createdAt: string;
};

export type GalleryCategory = "Makeup" | "Hair" | "Bridal" | "Studio";

export const MAX_GALLERY_IMAGES_PER_UPLOAD = 5;
export const MAX_GALLERY_VIDEOS_PER_UPLOAD = 1;
export const MAX_GALLERY_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_GALLERY_VIDEO_BYTES = 100 * 1024 * 1024;

export function validateGallerySelection(
  images: File[],
  videos: File[],
): string | undefined {
  if (images.length > MAX_GALLERY_IMAGES_PER_UPLOAD) {
    return "Select no more than 5 images at a time.";
  }
  if (images.some((image) => !image.type.startsWith("image/"))) {
    return "Every selected image must be an image file.";
  }
  if (images.some((image) => image.size > MAX_GALLERY_IMAGE_BYTES)) {
    return "Each image must be 10 MB or smaller.";
  }
  if (videos.length > MAX_GALLERY_VIDEOS_PER_UPLOAD) {
    return "Select no more than 1 video at a time.";
  }
  if (videos.some((video) => !video.type.startsWith("video/"))) {
    return "Select a valid video file.";
  }
  if (videos.some((video) => video.size > MAX_GALLERY_VIDEO_BYTES)) {
    return "The video must be 100 MB or smaller.";
  }
  if (!images.length && !videos.length) {
    return "Choose at least one image or a video to upload.";
  }
  return undefined;
}

export const galleryApi = {
  list: (signal?: AbortSignal) =>
    apiRequest<GalleryMedia[]>(
      "/api/gallery",
      { signal },
      { allowRawArray: true },
    ),

  upload: (
    images: File[],
    video: File | null,
    category: GalleryCategory,
    adminToken: string,
  ) => {
    const body = new FormData();
    images.forEach((image) => body.append("images", image));
    if (video) body.append("video", video);
    body.append("category", category);

    return apiRequest<GalleryMedia[]>(
      "/api/gallery/admin/upload",
      {
        method: "POST",
        headers: { "X-Gallery-Admin-Token": adminToken },
        body,
      },
      { allowRawArray: true },
    );
  },
};
