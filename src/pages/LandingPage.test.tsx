import React from "react";
import { render, screen } from "@testing-library/react";
import { galleryApi } from "../api/gallery";
import LandingPage from "./LandingPage";

jest.mock("../components/common/StudioHighlights", () => ({
  __esModule: true,
  default: () => null,
}));

afterEach(() => {
  jest.restoreAllMocks();
});

test("shows uploaded gallery photos on the home page and skips videos", async () => {
  jest.spyOn(galleryApi, "list").mockResolvedValue([
    {
      id: 1,
      mediaType: "IMAGE",
      secureUrl: "https://example.com/bridal.jpg",
      title: "bridal-look",
      category: "Bridal",
      createdAt: "2026-11-17T00:00:00",
    },
    {
      id: 2,
      mediaType: "VIDEO",
      secureUrl: "https://example.com/studio.mp4",
      title: "studio-video",
      category: "Studio",
      createdAt: "2026-11-17T00:00:00",
    },
  ]);

  render(<LandingPage navigate={jest.fn()} />);

  expect(
    await screen.findByRole("button", {
      name: "View Bridal in the full gallery",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByAltText("Uploaded Bridal look at Janvi Makeover"),
  ).toHaveAttribute("src", "https://example.com/bridal.jpg");
  expect(
    screen.queryByRole("button", {
      name: "View Studio in the full gallery",
    }),
  ).not.toBeInTheDocument();
});

test("shows a styled empty gallery state when no photos are uploaded", async () => {
  jest.spyOn(galleryApi, "list").mockResolvedValue([]);

  render(<LandingPage navigate={jest.fn()} />);

  expect(
    await screen.findByRole("heading", {
      name: "A new studio moment is on its way.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /View .* in the full gallery/ }),
  ).not.toBeInTheDocument();
});
