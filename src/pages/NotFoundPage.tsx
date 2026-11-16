import React from "react";
import "./NotFoundPage.css";

type Props = { navigate: (to: string) => void };

export default function NotFoundPage({ navigate }: Props) {
  return (
    <main className="not-found-page">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <span className="not-found-flower" aria-hidden="true">
          ✿
        </span>
        <span className="page-kicker">A LITTLE DETOUR</span>
        <p className="not-found-code">404</p>
        <h1 id="not-found-title">This page isn’t in our studio.</h1>
        <p className="not-found-description">
          The link may be incorrect, or the page may have moved. Let’s get you
          back to something lovely.
        </p>
        <div className="not-found-actions">
          <button
            className="not-found-home-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Back to home <span aria-hidden="true">↗</span>
          </button>
          <button
            className="not-found-book-link"
            type="button"
            onClick={() => navigate("/appointments")}
          >
            Book your visit
          </button>
        </div>
      </section>
    </main>
  );
}
