import "./CustomerPages.css";
import StudioIcon from "../components/StudioIcon";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import StudioHighlights from "../components/common/StudioHighlights";

type Props = { navigate: (to: string) => void };

const locations = [
  {
    name: "Janvi Makeover & Academy · Chitaipur",
    address:
      "Central Bank Building, opposite Gyandeep Academy, Vishwakarma Nagar, Mohanpuri Colony, Chitaipur, Varanasi",
    query:
      "Janvi Makeover And Academy, Central Bank Building, opposite Gyandeep Academy, Vishwakarma Nagar, Mohanpuri Colony, Chitaipur, Varanasi",
  },
  {
    name: "Anu beauty salon & Jaanvi makeover Academy · Rihand Nagar",
    address:
      "Mansarovar Shopping Complex, NTPC Campus, Bijpur, Rihand Nagar, Uttar Pradesh 231223",
    query:
      "Mansarovar Shopping Complex, NTPC Campus, Bijpur, Rihand Nagar, Uttar Pradesh 231223",
  },
];

export default function ContactPage(_props: Props) {
  return (
    <main className="customer-page">
      <PublicEditorialHero
        kicker="VISIT JANVI MAKEOVER"
        title={
          <>
            Come say <em>hello.</em>
          </>
        }
        description="Questions about the studio or your visit? We would love to hear from you."
        image="/images/janvi-stylist-portrait.jpeg"
        imageAlt="Janvi, the artist behind Janvi Makeover"
        secondaryImage="/images/janvi-bridal-closeup.jpeg"
        secondaryImageAlt="Janvi applying bridal makeup"
        secondaryCaption="Care in every detail"
        caption="A warm welcome, by Janvi"
        index="03"
        imageLabel="THE STUDIO"
        note={
          <>
            Two welcoming <i>·</i> locations
          </>
        }
        actionLabel="Find our studios"
        onAction={() =>
          document
            .getElementById("contact-connect")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />
      <StudioHighlights page="contact" />

      <section
        id="contact-connect"
        className="contact-connect"
        aria-labelledby="contact-connect-title"
      >
        <div className="contact-connect-heading">
          <span className="page-kicker">LET’S CONNECT</span>
          <h2 id="contact-connect-title">
            We’d love to <em>welcome you.</em>
          </h2>
          <p>
            Find your nearest studio or get in touch with Janvi’s team. We’re
            always happy to help.
          </p>
        </div>
        <div className="contact-info-grid">
          {locations.map((location, index) => {
            const mapQuery = encodeURIComponent(location.query);
            return (
              <article className="contact-info-card" key={location.name}>
                <span className="contact-info-icon">
                  <StudioIcon name="pin" />
                </span>
                <span className="contact-info-label">STUDIO 0{index + 1}</span>
                <h3>{location.name}</h3>
                <p>{location.address}</p>
                <a
                  className="contact-info-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <StudioIcon name="arrow" />
                </a>
              </article>
            );
          })}
          <article className="contact-info-card contact-reach-card">
            <span className="contact-info-icon">
              <StudioIcon name="sparkles" />
            </span>
            <span className="contact-info-label">SAY HELLO</span>
            <h3>We’re just a call away.</h3>
            <p>For appointments and questions, reach us directly.</p>
            <a className="contact-reach-link" href="tel:+919838732382">
              <StudioIcon name="phone" />
              9838732382
            </a>
            <a
              className="contact-reach-link"
              href="mailto:janviratan007@gmail.com"
            >
              <StudioIcon name="mail" />
              janviratan007@gmail.com
            </a>
          </article>
        </div>
      </section>

      <section
        className="contact-maps"
        aria-label="Find Janvi Makeover locations"
      >
        <div className="contact-maps-heading">
          <span className="page-kicker">COME ON IN</span>
          <h2>
            Find your <em>nearest studio.</em>
          </h2>
          <p>We can’t wait to welcome you.</p>
        </div>
        {locations.map((location) => {
          const mapQuery = encodeURIComponent(location.query);
          return (
            <article className="contact-map-card" key={location.name}>
              <iframe
                title={`Map: ${location.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="contact-map-card-copy">
                <span className="page-kicker">JANVI MAKEOVER</span>
                <h2>{location.name}</h2>
                <p>{location.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <StudioIcon name="pin" />
                  Open in Google Maps <StudioIcon name="arrow" />
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
