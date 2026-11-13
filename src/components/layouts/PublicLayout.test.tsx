import React from "react";
import { render, screen } from "@testing-library/react";
import PublicLayout from "./PublicLayout";

test("shows a WhatsApp contact link for the salon", () => {
  render(
    <PublicLayout path="/" navigate={jest.fn()}>
      <main>Home</main>
    </PublicLayout>,
  );

  const whatsappLink = screen.getByRole("link", {
    name: "Chat with Janvi Makeover on WhatsApp",
  });

  expect(whatsappLink).toHaveAttribute(
    "href",
    "https://wa.me/919838732382?text=Namaste%2C%20mujhe%20aapki%20services%20ke%20baare%20mein%20jaankari%20chahiye.",
  );
  expect(whatsappLink).toHaveAttribute("target", "_blank");
});
