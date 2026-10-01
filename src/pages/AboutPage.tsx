import React from "react";
import "./CustomerPages.css";
import StudioHighlights from "../components/common/StudioHighlights";
type Props = { navigate: (to: string) => void };
export default function AboutPage({ navigate }: Props) {
  return (
    <main className="customer-page about-page">
      <section className="inner-hero about-hero public-page-hero">
        <div className="about-hero-copy">
          <span className="page-kicker">MEET JANVI MAKEOVER</span>
          <h1>
            Beauty that feels
            <br />
            <em>like you.</em>
          </h1>
          <p>
            A welcoming beauty studio for thoughtful artistry, personal care,
            and looks that feel completely your own.
          </p>
          <button
            className="editorial-button"
            onClick={() => navigate("/appointments")}
          >
            Book your visit <span>↗</span>
          </button>
          <span className="about-hero-note">
            Hair <i>·</i> Makeup <i>·</i> Beauty
          </span>
        </div>
        <div className="about-hero-visual">
          <img
            src="/images/janvi-stylist-portrait.jpeg"
            alt="Janvi, the artist behind Janvi Makeover"
          />
          <div className="about-detail-photo hero-detail-photo">
            <img
              src="/images/janvi-bridal-closeup.jpeg"
              alt="Janvi applying bridal makeup"
            />
            <span>Artistry, up close</span>
          </div>
          <span className="about-hero-leaves" aria-hidden="true" />
          <span className="about-hero-caption">
            <i>✳</i> Personal beauty, by Janvi
          </span>
          <span className="about-image-index">
            01 <i>/</i> THE STUDIO
          </span>
        </div>
      </section>
      <StudioHighlights page="about" />
      <section className="story-block about-story">
        <div className="about-story-heading">
          <span className="page-kicker">A PERSONAL KIND OF BEAUTY</span>
          <h2>
            It starts with
            <br />
            <em>listening.</em>
          </h2>
        </div>
        <div className="about-story-copy">
          <p>
            At Janvi Makeover, every appointment starts with you: your ideas,
            your comfort, and the look you want to feel good in. We take time to
            understand what you have in mind before we pick up a brush.
          </p>
          <p>
            From everyday beauty to a special occasion, our aim is simple: warm
            care, thoughtful artistry, and a result that still feels like you.
          </p>
          <button
            className="underlined-link"
            onClick={() => navigate("/services")}
          >
            Explore our services <span>↗</span>
          </button>
        </div>
        <figure className="about-story-visual">
          <img
            src="/images/janvi-bridal-closeup.jpeg"
            alt="Janvi carefully applying bridal makeup"
          />
          <figcaption>
            <span>01</span> A look made personal
          </figcaption>
        </figure>
      </section>
      <section
        className="values-row about-values-row"
        aria-label="What matters at Janvi Makeover"
      >
        <article>
          <span>01</span>
          <h3>Listen first</h3>
          <p>Your ideas and comfort shape the appointment from the start.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Care with intention</h3>
          <p>Thoughtful details and artistry, tailored to the look you want.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Feel like yourself</h3>
          <p>Leave feeling cared for, confident, and comfortably you.</p>
        </article>
      </section>
      <section className="team-feature about-team-feature">
        <div className="about-team-visual">
          <img
            src="/images/janvi-bridal-closeup.jpeg"
            alt="Janvi applying bridal makeup with a careful finishing touch"
          />
        </div>
        <div className="about-team-copy">
          <span className="page-kicker">THOUGHTFUL ARTISTRY, EVERY VISIT</span>
          <h2>
            Your moment.
            <br />
            <em>Your kind of beautiful.</em>
          </h2>
          <p>
            Whether you are getting ready for a celebration or treating yourself
            to a little refresh, Janvi brings care and attention to every detail
            of your look.
          </p>
          <button
            className="editorial-button"
            onClick={() => navigate("/appointments")}
          >
            Make an appointment <span>↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}
