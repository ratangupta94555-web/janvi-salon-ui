import {
  MAX_GALLERY_IMAGES_PER_UPLOAD,
  MAX_GALLERY_IMAGE_BYTES,
  MAX_GALLERY_VIDEO_BYTES,
  MAX_GALLERY_VIDEOS_TOTAL,
  validateGallerySelection,
} from "./gallery";

const imageFile = (name: string, size = 1) => {
  const file = new File(["x"], name, { type: "image/jpeg" });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

test("allows up to five images and one video in the same upload", () => {
  const images = Array.from({ length: MAX_GALLERY_IMAGES_PER_UPLOAD }, (_, index) =>
    imageFile(`image-${index}.jpg`),
  );
  const video = new File(["video"], "studio.mp4", { type: "video/mp4" });

  expect(validateGallerySelection(images, [video])).toBeUndefined();
});

test("rejects more than five images", () => {
  const images = Array.from({ length: MAX_GALLERY_IMAGES_PER_UPLOAD + 1 }, (_, index) =>
    imageFile(`image-${index}.jpg`),
  );

  expect(validateGallerySelection(images, [])).toMatch(/no more than 5/i);
});

test("rejects more than one video", () => {
  const videos = [
    new File(["one"], "one.mp4", { type: "video/mp4" }),
    new File(["two"], "two.mp4", { type: "video/mp4" }),
  ];

  expect(validateGallerySelection([], videos)).toMatch(/no more than 1 video/i);
});

test("allows the tenth gallery video and rejects an eleventh", () => {
  const video = new File(["video"], "studio.mp4", { type: "video/mp4" });

  expect(
    validateGallerySelection([], [video], MAX_GALLERY_VIDEOS_TOTAL - 1),
  ).toBeUndefined();
  expect(
    validateGallerySelection([], [video], MAX_GALLERY_VIDEOS_TOTAL),
  ).toMatch(/only 10 videos/i);
});

test("rejects files that exceed the image or video size limits", () => {
  expect(
    validateGallerySelection(
      [imageFile("large.jpg", MAX_GALLERY_IMAGE_BYTES + 1)],
      [],
    ),
  ).toMatch(/10 MB or smaller/i);

  const largeVideo = new File(["x"], "large.mp4", { type: "video/mp4" });
  const maxSizeVideo = new File(["x"], "max-size.mp4", {
    type: "video/mp4",
  });
  Object.defineProperty(maxSizeVideo, "size", {
    value: MAX_GALLERY_VIDEO_BYTES,
  });
  expect(validateGallerySelection([], [maxSizeVideo])).toBeUndefined();

  Object.defineProperty(largeVideo, "size", {
    value: MAX_GALLERY_VIDEO_BYTES + 1,
  });
  expect(validateGallerySelection([], [largeVideo])).toMatch(/50 MB or smaller/i);
});
