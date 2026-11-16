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

afterEach(() => {
  jest.restoreAllMocks();
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
