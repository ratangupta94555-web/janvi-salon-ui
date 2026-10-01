import React, { useState } from "react";
import "./CustomerPages.css";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import StudioHighlights from "../components/common/StudioHighlights";
type Props = { navigate: (to: string) => void };
export default function AppointmentsPage({ navigate }: Props) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [stylist, setStylist] = useState("Anyone who’s lovely");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const services = [
    "The good cut · from ₹7,200",
    "Color, your way · from ₹13,900",
    "A softer reset · from ₹4,300",
    "Little color moment · from ₹5,300",
    "The going-out feeling · from ₹5,800",
  ];
  const slots = [
    "9:00 am",
    "10:30 am",
    "12:00 pm",
    "1:30 pm",
    "3:00 pm",
    "4:30 pm",
  ];
  const dayList = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return (
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d) +
      " · " +
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d)
    );
  });
  const next = () => {
    if ((step === 1 && !service) || (step === 2 && (!date || !time))) return;
    if (
      step === 3 &&
      (!name.trim() || !email.includes("@") || !email.includes("."))
    )
      return;
    if (step < 3) setStep(step + 1);
    else setDone(true);
  };
  return (
    <main className="customer-page booking-page">
      <PublicEditorialHero
        className="appointment-hero"
        kicker="A LITTLE TIME FOR YOU"
        title={
          done ? (
            "You’re on our calendar."
          ) : (
            <>
              Let’s find your <em>moment.</em>
            </>
          )
        }
        description={
          done
            ? "We’ve sent your appointment details to your inbox. We can’t wait to see you."
            : "A few little details and your chair will be waiting."
        }
        image="/images/janvi-bridal-finish.jpeg"
        imageAlt="Janvi finishing a bridal makeup look"
        secondaryImage="/images/janvi-makeup-portrait.jpeg"
        secondaryImageAlt="A finished makeup look by Janvi"
        secondaryCaption="Your look, your way"
        caption="Your moment, just for you"
        index="04"
        imageLabel="YOUR VISIT"
        note={
          <>
            Make time <i>·</i> for you
          </>
        }
        actionLabel={done ? "Back to the studio" : "Choose your service"}
        onAction={() =>
          done
            ? navigate("/")
            : document
                .getElementById("booking-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />
      {!done && <StudioHighlights page="appointments" />}
      {done ? (
        <section className="booking-success">
          <span className="success-mark">✳</span>
          <h2>We can’t wait to see you, {name.split(" ")[0]}.</h2>
          <p>
            {service.split(" ·")[0]}
            <br />
            {date} · {time} · {stylist}
          </p>
          <button className="underlined-link" onClick={() => navigate("/")}>
            Back to the studio <span>↗</span>
          </button>
        </section>
      ) : (
        <div className="booking-layout">
          <section className="booking-form-card" id="booking-form">
            <div className="booking-steps">
              <span className={step >= 1 ? "current" : ""}>
                <i>01</i> Service
              </span>
              <b />
              <span className={step >= 2 ? "current" : ""}>
                <i>02</i> Time
              </span>
              <b />
              <span className={step >= 3 ? "current" : ""}>
                <i>03</i> Your details
              </span>
            </div>
            {step === 1 && (
              <div className="booking-step">
                <h2>What are you in the mood for?</h2>
                <p>Choose a service to get started.</p>
                <div className="choice-list">
                  {services.map((s) => (
                    <button
                      key={s}
                      className={
                        service === s ? "choice-card chosen" : "choice-card"
                      }
                      onClick={() => setService(s)}
                    >
                      <span className="choice-circle">
                        {service === s ? "✓" : ""}
                      </span>
                      <strong>{s.split(" ·")[0]}</strong>
                      <small>{s.split(" · ")[1]}</small>
                      <span className="choice-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="booking-step">
                <h2>Pick a day that feels good.</h2>
                <p>
                  All times are India Standard Time. A little flexibility goes a
                  long way.
                </p>
                <div className="date-options">
                  {dayList.map((d) => (
                    <button
                      key={d}
                      className={date === d ? "selected" : ""}
                      onClick={() => setDate(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <h3>Available times</h3>
                <div className="time-options">
                  {slots.map((t) => (
                    <button
                      key={t}
                      className={time === t ? "selected" : ""}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="stylist-select">
                  Preferred artist
                  <select
                    value={stylist}
                    onChange={(e) => setStylist(e.target.value)}
                  >
                    <option>Anyone who’s lovely</option>
                    <option>Isabella · Senior stylist</option>
                    <option>Olivia · Color specialist</option>
                    <option>Noah · Nail artist</option>
                    <option>Ava · Esthetician</option>
                  </select>
                </label>
              </div>
            )}
            {step === 3 && (
              <div className="booking-step">
                <h2>Who are we welcoming?</h2>
                <p>We’ll send your appointment details here.</p>
                <label className="booking-input">
                  Your name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and last name"
                    required
                  />
                </label>
                <label className="booking-input">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="booking-input">
                  Anything you’d like us to know? <small>Optional</small>
                  <textarea
                    rows={3}
                    placeholder="A little note for your artist…"
                  />
                </label>
                <p className="booking-recap">
                  <strong>{service.split(" ·")[0]}</strong>
                  <br />
                  {date} · {time} · {stylist}
                </p>
              </div>
            )}
            <div className="booking-actions">
              {step > 1 && (
                <button
                  className="back-button"
                  onClick={() => setStep(step - 1)}
                >
                  ← Back
                </button>
              )}
              <button className="editorial-button" onClick={next}>
                {step === 3 ? "Confirm appointment" : "Continue"} <span>→</span>
              </button>
            </div>
          </section>
          <aside className="booking-aside">
            <span className="page-kicker">A NOTE FROM US</span>
            <blockquote>
              “You deserve a little time that’s just for you.”
            </blockquote>
            <p>
              Need a hand choosing? We’re happy to help you figure out what
              feels right.
            </p>
            <a href="tel:+919838732382">Call us · 9838732382</a>
            <a href="mailto:janviratan007@gmail.com">janviratan007@gmail.com</a>
            <div className="booking-aside-hours">
              Central Bank Building, opposite Gyandeep Academy
              <br />
              Vishwakarma Nagar, Mohanpuri Colony, Chitaipur, Varanasi
              <br />
              <br />
              Mansarovar Shopping Complex, NTPC Campus, Bijpur
              <br />
              Rihand Nagar, Uttar Pradesh 231223
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
