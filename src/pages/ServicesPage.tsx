import React from "react";
import "./CustomerPages.css";
type Props = { navigate: (to: string) => void };
const services = [
  {
    group: "HAIR",
    title: "The good cut",
    desc: "A considered cut, a little conversation, and styling that works when you’re back home.",
    time: "45–75 min",
    price: "from ₹7,200",
    img: "photo-1562322140-8baeececf3df",
  },
  {
    group: "COLOR",
    title: "Color, your way",
    desc: "Dimensional color, thoughtful refreshes, and lived-in brightness that feels like yours.",
    time: "2–3 hr",
    price: "from ₹13,900",
    img: "photo-1522337360788-8b13dee7a37e",
  },
  {
    group: "TREATMENTS",
    title: "A softer reset",
    desc: "Restorative masks and scalp rituals for hair that needs a deep breath.",
    time: "30–60 min",
    price: "from ₹4,300",
    img: "photo-1519699047748-de8e457a634e",
  },
  {
    group: "NAILS",
    title: "Little color moment",
    desc: "A tidy manicure and a shade you can’t stop looking at.",
    time: "45–60 min",
    price: "from ₹5,300",
    img: "photo-1604654894610-df63bc536371",
  },
  {
    group: "STYLING",
    title: "The going-out feeling",
    desc: "A soft blowout, polished waves, or a little extra something for your plans.",
    time: "45 min",
    price: "from ₹5,800",
    img: "photo-1524250502761-1ac6f2e30d43",
  },
  {
    group: "BROWS",
    title: "The little details",
    desc: "Gentle shaping and tinting to bring out what’s already there.",
    time: "30 min",
    price: "from ₹3,400",
    img: "photo-1516975080664-ed2fc6a32937",
  },
];
export default function ServicesPage({ navigate }: Props) {
  return (
    <main className="customer-page">
      <section className="services-intro">
        <div className="services-intro-copy">
          <span className="page-kicker">GOOD THINGS, DONE THOUGHTFULLY</span>
          <h1>
            A menu made
            <br />
            to <em>feel like you.</em>
          </h1>
          <p>
            Every appointment begins with a conversation and ends with a plan
            that fits your life.
          </p>
          <span className="services-intro-signature">
            A little time, entirely yours <i>✳</i>
          </span>
        </div>
        <div
          className="services-intro-gallery"
          aria-label="Janvi's salon artistry"
        >
          <img
            className="services-intro-main-image"
            src="/images/janvi-team-certificate.jpeg"
            alt="Janvi celebrating her professional makeup artistry training"
          />
          <div className="services-intro-inset">
            <img
              src="/images/janvi-bridal-closeup.jpeg"
              alt="Janvi applying makeup to a bride"
            />
            <span>
              02 <i>/</i> 06
            </span>
          </div>
          <span className="services-intro-caption">Care, made personal</span>
        </div>
      </section>
      <section className="services-grid">
        {services.map((s, i) => (
          <article className="service-detail" key={s.title}>
            <img
              src={`https://images.unsplash.com/${s.img}?auto=format&fit=crop&w=800&q=80`}
              alt=""
            />
            <div className="service-detail-content">
              <span className="page-kicker">
                0{i + 1} / {s.group}
              </span>
              <h2>{s.title}</h2>
              <p>{s.desc}</p>
              <div className="service-meta">
                <span>{s.time}</span>
                <span>{s.price}</span>
              </div>
              <button
                className="underlined-link"
                onClick={() => navigate("/appointments")}
              >
                Book this service <span>↗</span>
              </button>
            </div>
          </article>
        ))}
      </section>
      <section className="service-note">
        <span>✳</span>
        <div>
          <strong>Not sure what to book?</strong>
          <p>
            That’s what the consultation is for. Tell us what you’re hoping for
            and we’ll figure it out together.
          </p>
        </div>
        <button
          className="underlined-link"
          onClick={() => navigate("/contact")}
        >
          Ask us anything <span>↗</span>
        </button>
      </section>
    </main>
  );
}
