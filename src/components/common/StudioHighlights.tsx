import React from "react";

type StudioHighlightItem = {
  label: string;
  title: string;
  detail: string;
};

export type StudioHighlightPage =
  | "landing"
  | "about"
  | "services"
  | "gallery"
  | "contact"
  | "appointments"
  | "faq";

const pageHighlights: Record<StudioHighlightPage, StudioHighlightItem[]> = {
  landing: [
    {
      label: "HAIR & STYLING",
      title: "A fresh shape, your way",
      detail: "Cuts, colour and occasion styling",
    },
    {
      label: "SKIN & BEAUTY",
      title: "Time to feel looked after",
      detail: "Facials, makeup and finishing touches",
    },
    {
      label: "BEAUTY ACADEMY",
      title: "Learn beauty skills",
      detail: "Practical courses at Janvi",
    },
  ],
  about: [
    {
      label: "OUR STUDIOS",
      title: "Two welcoming locations",
      detail: "Varanasi & Rihand Nagar",
    },
    {
      label: "OUR SERVICES",
      title: "Makeup, hair & beauty",
      detail: "For everyday and special days",
    },
    {
      label: "OUR ACADEMY",
      title: "Learn beauty skills",
      detail: "Practical courses at Janvi",
    },
  ],
  services: [
    {
      label: "MAKEUP ARTISTRY",
      title: "From party to bridal",
      detail: "Looks tailored to your occasion",
    },
    {
      label: "SALON SERVICES",
      title: "Hair, skin & self-care",
      detail: "Explore the full service menu",
    },
    {
      label: "BEAUTY ACADEMY",
      title: "Courses & training",
      detail: "Practical learning at Janvi",
    },
  ],
  gallery: [
    {
      label: "JANVI PORTFOLIO",
      title: "Real studio work",
      detail: "Makeup, hair & bridal looks",
    },
    {
      label: "FIND YOUR STYLE",
      title: "Browse by category",
      detail: "Makeup, hair or studio moments",
    },
    {
      label: "YOUR TURN",
      title: "Make it your own",
      detail: "Bring your inspiration to Janvi",
    },
  ],
  contact: [
    {
      label: "CHITAIPUR",
      title: "Janvi Makeover & Academy",
      detail: "Central Bank Building, Varanasi",
    },
    {
      label: "RIHAND NAGAR",
      title: "Janvi Makeover",
      detail: "Mansarovar Shopping Complex",
    },
    {
      label: "SAY HELLO",
      title: "Call 98387 32382",
      detail: "For appointments and questions",
    },
  ],
  appointments: [
    {
      label: "01 · SERVICE",
      title: "Choose your visit",
      detail: "Select the service you want",
    },
    {
      label: "02 · TIME",
      title: "Pick a time",
      detail: "Choose a day and available slot",
    },
    {
      label: "03 · DETAILS",
      title: "You’re nearly there",
      detail: "Share your contact details",
    },
  ],
  faq: [
    {
      label: "BEFORE YOUR VISIT",
      title: "Booking & cancellations",
      detail: "A few details to help you plan",
    },
    {
      label: "AT THE STUDIO",
      title: "Walk-ins & accessibility",
      detail: "Know what to expect",
    },
    {
      label: "NEED MORE HELP?",
      title: "We’re happy to help",
      detail: "Contact the Janvi team",
    },
  ],
};

type StudioHighlightsProps = { page: StudioHighlightPage };

export default function StudioHighlights({ page }: StudioHighlightsProps) {
  return (
    <section
      className={`studio-highlights${page === "landing" ? " studio-highlights-landing" : ""}`}
      aria-label="Janvi Makeover highlights"
    >
      {pageHighlights[page].map((item) => (
        <div className="studio-highlight" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.title}</strong>
          <small>{item.detail}</small>
        </div>
      ))}
    </section>
  );
}
