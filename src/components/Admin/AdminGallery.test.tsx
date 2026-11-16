import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { galleryApi, GalleryMedia } from "../../api/gallery";
import AdminGallery from "./AdminGallery";

const makeMedia = (
  id: number,
  mediaType: GalleryMedia["mediaType"],
): GalleryMedia => ({
  id,
  mediaType,
  secureUrl: `https://example.com/${mediaType.toLowerCase()}-${id}`,
  title: `${mediaType.toLowerCase()}-${id}`,
  category: "Makeup",
  createdAt: "2026-11-17T00:00:00",
});
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

afterEach(() => {
  jest.restoreAllMocks();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: originalCreateObjectURL,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: originalRevokeObjectURL,
  });
});

test("paginates gallery media in the admin panel", async () => {
  jest
    .spyOn(galleryApi, "list")
    .mockResolvedValue(
      Array.from({ length: 13 }, (_, index) =>
        makeMedia(index + 1, "IMAGE"),
      ),
    );

  render(<AdminGallery view="photos" notify={jest.fn()} />);

  expect(await screen.findByText("image-1")).toBeInTheDocument();
  expect(screen.queryByText("image-13")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));

  expect(await screen.findByText("image-13")).toBeInTheDocument();
  expect(screen.queryByText("image-1")).not.toBeInTheDocument();
});

test("confirms gallery deletion in an in-app dialog before removing media", async () => {
  const notify = jest.fn();
  const remove = jest.spyOn(galleryApi, "remove").mockResolvedValue();
  jest.spyOn(galleryApi, "list").mockResolvedValue([makeMedia(1, "IMAGE")]);

  render(<AdminGallery view="photos" notify={notify} />);

  fireEvent.click(
    await screen.findByRole("button", { name: "Permanently delete" }),
  );
  expect(
    screen.getByRole("alertdialog", { name: "Delete this photo?" }),
  ).toBeInTheDocument();
  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Keep it" }));
  expect(
    screen.queryByRole("alertdialog", { name: "Delete this photo?" }),
  ).not.toBeInTheDocument();
  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Permanently delete" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Delete permanently" }),
  );

  await waitFor(() => expect(remove).toHaveBeenCalledWith(1));
  expect(notify).toHaveBeenCalledWith(
    "Media permanently deleted from the gallery and Cloudinary.",
  );
  await waitFor(() =>
    expect(screen.queryByText("image-1")).not.toBeInTheDocument(),
  );
});

test("bulk deletes selected photos after confirmation", async () => {
  const notify = jest.fn();
  const remove = jest.spyOn(galleryApi, "remove").mockResolvedValue();
  jest
    .spyOn(galleryApi, "list")
    .mockResolvedValue([makeMedia(1, "IMAGE"), makeMedia(2, "IMAGE")]);

  render(<AdminGallery view="photos" notify={notify} />);

  await screen.findByText("image-1");
  fireEvent.click(screen.getByRole("checkbox", { name: "Select all photos on this page" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete selected" }));

  expect(
    screen.getByRole("alertdialog", { name: "Delete 2 selected photos?" }),
  ).toBeInTheDocument();
  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Delete permanently" }));

  await waitFor(() => expect(remove).toHaveBeenCalledTimes(2));
  await waitFor(() => {
    expect(screen.queryByText("image-1")).not.toBeInTheDocument();
    expect(screen.queryByText("image-2")).not.toBeInTheDocument();
  });
  expect(notify).toHaveBeenCalledWith(
    "2 photos permanently deleted from the gallery and Cloudinary.",
  );
});

test("shows previews for selected photos before upload", async () => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: jest.fn(() => "blob:photo-preview"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: jest.fn(),
  });
  jest.spyOn(galleryApi, "list").mockResolvedValue([]);

  render(<AdminGallery view="photos" notify={jest.fn()} />);
  const photo = new File(["photo"], "bridal-look.png", { type: "image/png" });
  fireEvent.change(screen.getByLabelText(/Choose photos/i), {
    target: { files: [photo] },
  });

  expect(await screen.findByAltText("Preview of bridal-look.png")).toHaveAttribute(
    "src",
    "blob:photo-preview",
  );
});

test("shows a modal before attempting to add an eleventh video", async () => {
  jest
    .spyOn(galleryApi, "list")
    .mockResolvedValue(
      Array.from({ length: 10 }, (_, index) =>
        makeMedia(index + 1, "VIDEO"),
      ),
    );

  render(<AdminGallery view="videos" notify={jest.fn()} />);
  await waitFor(() => expect(screen.getByText("video-10")).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText(/Choose a video/i), {
    target: {
      files: [new File(["video"], "eleventh.mp4", { type: "video/mp4" })],
    },
  });

  expect(
    screen.getByRole("dialog", { name: "Your video collection is full" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Only 10 videos can be stored in the gallery/i),
  ).toBeInTheDocument();
});
