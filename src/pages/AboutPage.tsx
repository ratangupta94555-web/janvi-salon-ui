import React from "react";
import "./CustomerPages.css";
type Props = { navigate: (to: string) => void };
export default function AboutPage({ navigate }: Props) {
  return (
    <main className="customer-page">
      <section className="inner-hero about-hero">
        <div>
          <span className="page-kicker">A LITTLE ABOUT US</span>
          <h1>
            Beauty with
            <br />
            <em>room to breathe.</em>
          </h1>
          <p>
            We made the kind of salon we always wished existed: warm, unhurried,
            and full of people who really listen.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1100&q=85"
          alt="Sunlit, welcoming salon studio"
        />
      </section>
      <section className="story-block">
        <span className="page-kicker">OUR WAY OF DOING THINGS</span>
        <h2>
          Good work starts
          <br />
          with a <em>good feeling.</em>
        </h2>
        <p>
          Atelier began with a simple idea: the best beauty work happens when
          you feel comfortable enough to be yourself. So we built a neighborhood
          studio around that feeling. There’s no rush, no pressure to be anyone
          else, and always time for one more question.
        </p>
        <p>
          Our artists bring thoughtful technique and a gentle point of view to
          every appointment. We’ll help you find what feels right today, and
          make a plan that still feels like you tomorrow.
        </p>
        <button
          className="underlined-link"
          onClick={() => navigate("/appointments")}
        >
          Come meet us <span>↗</span>
        </button>
      </section>
      <section className="values-row">
        <article>
          <span>01</span>
          <h3>Listen first</h3>
          <p>
            Your story, your routine, your comfort. It all belongs in the
            conversation.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Keep it thoughtful</h3>
          <p>
            Considered products, gentle practices, and care that lasts beyond
            the chair.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Make room</h3>
          <p>
            For all people, all hair, and all the ways of feeling beautiful.
          </p>
        </article>
      </section>
      <section className="team-feature">
        <img
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=760&q=85"
          alt="Atelier stylist Isabella"
        />
        <div>
          <span className="page-kicker">THE PEOPLE BEHIND THE MIRROR</span>
          <h2>
            Good hands.
            <br />
            <em>Good hearts.</em>
          </h2>
          <p>
            Our small team of artists brings different specialties and one
            shared belief: you should leave feeling cared for, not just styled.
          </p>
          <button
            className="underlined-link"
            onClick={() => navigate("/appointments")}
          >
            Meet us in the studio <span>↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}
