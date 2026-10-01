import React from "react";
import "./CustomerPages.css";
import "./AppointmentsComingSoon.css";

type Props = { navigate: (to: string) => void };

export default function AppointmentsComingSoon({ navigate }: Props) {
  return (
    <main className="customer-page booking-page appointment-coming-soon">
      <section
        className="coming-soon-layout"
        aria-labelledby="coming-soon-title"
      >
        <div className="coming-soon-copy">
          <p className="coming-soon-kicker">
            JANVI MAKEOVER <span>·</span> APPOINTMENTS
          </p>
          <p className="construction-label">
            <span /> UNDER CONSTRUCTION
          </p>
          <h1 id="coming-soon-title">
            COMING
            <br />
            <em>SOON</em>
            <span className="coming-title-spark" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="coming-soon-description">
            We’re creating a lovely new way to book your visit. Online
            appointments will be ready soon. Until then, we’d be happy to help
            you find a time by phone or message.
          </p>
          <div className="coming-soon-actions">
            <button
              className="coming-contact-button"
              onClick={() => navigate("/contact")}
            >
              Contact the studio <span aria-hidden="true">↗</span>
            </button>
            <button
              className="coming-home-button"
              onClick={() => navigate("/")}
            >
              Back to home
            </button>
          </div>
          <p className="coming-soon-footnote">
            A little time for you is on its way.
          </p>
        </div>

        <div className="coming-soon-art" aria-hidden="true">
          <span className="art-spark art-spark-one">✳</span>
          <span className="art-spark art-spark-two">✦</span>
          <span className="art-spark art-spark-three">✳</span>
          <div className="appointment-calendar">
            <div className="calendar-binding">
              <i />
              <i />
              <i />
            </div>
            <div className="calendar-heading">
              <span>YOUR NEXT</span>
              <strong>little moment</strong>
            </div>
            <div className="calendar-month">
              <span>JANVI MAKEOVER</span>
              <b>SOON</b>
            </div>
            <div className="calendar-weekdays">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <div className="calendar-days">
              {Array.from({ length: 28 }, (_, index) => (
                <span
                  key={index}
                  className={index === 18 ? "calendar-highlight" : ""}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="calendar-footer">
              <span /> BOOKING WITH A LITTLE MORE YOU
            </div>
          </div>
          <div className="coming-note-card">
            <span className="note-card-mark">✦</span>
            <span>
              Make time
              <br />
              <em>for you</em>
            </span>
          </div>
          <div className="art-pencil">
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
