import React, { useState } from "react";
import "./CustomerPages.css";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import StudioHighlights from "../components/common/StudioHighlights";
type Props = { navigate: (to: string) => void };
const questions = [
  [
    "What should I book if I’m not sure?",
    "Book a consultation or choose the service that feels closest. We’ll chat through your ideas before we begin, and your artist will help find the right plan.",
  ],
  [
    "How do I change or cancel my appointment?",
    "Give us a call or reply to your confirmation email at least 24 hours ahead. Life happens; we’ll help find a better time.",
  ],
  [
    "Do you take walk-ins?",
    "We love a spontaneous visit, but our artists are often with clients. Call us first and we’ll let you know if there’s room for you.",
  ],
  [
    "Can I bring a reference photo?",
    "Absolutely. Photos are a lovely place to start. We’ll talk about what you like in them and adapt the idea for your hair and routine.",
  ],
  [
    "What products do you use?",
    "We choose professional products with thoughtful ingredients and reliable results. Your artist can share the details and recommend a simple at-home routine.",
  ],
  [
    "Is the studio accessible?",
    "The studio is on the ground floor. If you have a particular access need, call or message us before your visit and we’ll make a plan together.",
  ],
];
export default function FAQPage({ navigate }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main className="customer-page faq-page">
      <PublicEditorialHero
        className="faq-page-hero"
        kicker="THE LITTLE DETAILS"
        title={
          <>
            A few things
            <br />
            you might <em>wonder.</em>
          </>
        }
        description="And if we missed your question, we’re just a note away."
        image="/images/jaya-bridal-makeup.png"
        imageAlt="Janvi applying makeup for a bride"
        secondaryImage="/images/jaya-makeup-training.png"
        secondaryImageAlt="A makeup artist learning a new technique"
        secondaryCaption="Here to help"
        caption="Your questions, answered"
        index="06"
        imageLabel="GOOD TO KNOW"
        note={
          <>
            Your visit <i>·</i> made easier
          </>
        }
        actionLabel="Get in touch"
        onAction={() => navigate("/contact")}
      />
      <StudioHighlights page="faq" />
      <section className="faq-layout">
        <div className="faq-list">
          {questions.map(([q, a], i) => (
            <article
              key={q}
              className={`faq-item ${open === i ? "expanded" : ""}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{q}</span>
                <i>{open === i ? "−" : "+"}</i>
              </button>
              {open === i && <p>{a}</p>}
            </article>
          ))}
        </div>
        <aside className="faq-aside">
          <span className="page-kicker">STILL CURIOUS?</span>
          <h2>
            We’re real people.
            <br />
            <em>Ask us anything.</em>
          </h2>
          <p>Drop us a line and someone from our team will get back to you.</p>
          <button
            className="underlined-link"
            onClick={() => navigate("/contact")}
          >
            Get in touch <span>↗</span>
          </button>
        </aside>
      </section>
      <section className="faq-book">
        <span className="page-kicker">WHEN YOU’RE READY</span>
        <h2>Your chair is waiting.</h2>
        <button
          className="editorial-button"
          onClick={() => navigate("/appointments")}
        >
          Book a visit <span>↗</span>
        </button>
      </section>
    </main>
  );
}
