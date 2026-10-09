import React from "react";
import "./ServicesPage.css";
import "./ServicesPageRedesign.css";
import StudioHighlights from "../components/common/StudioHighlights";
import BrandLoader from "../components/common/BrandLoader";
import useServices from "../api/useServices";
import { ApiService, formatPrice } from "../api/services";

type Props = { navigate: (to: string) => void };

const courses = [
  {
    title: "Beauty essentials",
    duration: "3 months",
    price: "₹20,000",
    list: "Threading · Facial · Waxing · Manicure · Pedicure · Hair spa · Haircut · Hair colour · Hair styling · Highlights · Blow-dry · Day, party & bridal makeup · Body polishing",
    foot: "+ 7 days training",
  },
  {
    title: "Professional beauty",
    duration: "6 months",
    price: "₹40,000",
    list: "Everything in the 3-month course, plus mehndi · hair blonding & global colour · nail art · saree draping · HD knowledge",
    foot: "Hands-on professional training",
  },
  {
    title: "Makeup · self course",
    duration: "10 days",
    price: "₹10,000",
    list: "No-makeup look · day & party makeup · 8 eye makeup styles · cocktail look · lip correction · contact lens training · eyebrow filling · bridal makeup",
    foot: "Basic makeup",
  },
  {
    title: "Makeup · professional",
    duration: "15 days",
    price: "₹15,000",
    list: "Day, party, HD, silicone, 3D & airbrush makeup · cocktail look · 15 eye makeup styles · lip correction · contact lens training · eyebrow filling · full bridal makeup",
    foot: "Advanced makeup",
  },
];

function serviceIcon(service: ApiService): string {
  const value = `${service.icon} ${service.name}`.toLowerCase();
  if (value.includes("makeup")) return "✦";
  if (value.includes("facial") || value.includes("skin")) return "◉";
  if (value.includes("hair")) return "〰";
  if (value.includes("wax") || value.includes("thread")) return "✧";
  if (value.includes("hand") || value.includes("foot") || value.includes("nail"))
    return "❀";
  if (value.includes("mehndi") || value.includes("henna")) return "❋";
  return service.icon || "✦";
}

function ServiceUnavailableCard({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <section className="sp-unavailable" role={error ? "alert" : "status"}>
      <img src="/jaya-makeover-logo.svg" alt="Janvi Makeover" />
      <span className="sp-kicker">JANVI SALON · SERVICE MENU</span>
      <h2>Service not available</h2>
      <p>
        Our service menu isn’t available at the moment. Please check back
        shortly or contact us and we’ll be happy to help.
      </p>
      <div className="sp-unavailable-actions">
        {error && (
          <button type="button" onClick={onRetry}>
            Try again <span aria-hidden="true">↻</span>
          </button>
        )}
        <a href="tel:9838732382">Call 98387 32382</a>
      </div>
    </section>
  );
}

export default function ServicesPage({ navigate }: Props) {
  const { services, loading, error, reload } = useServices();
  const [expandedServices, setExpandedServices] = React.useState<number[]>([]);
  const activeServices = services
    .filter((service) => service.active)
    .map((service) => ({
      ...service,
      subServices: service.subServices
        .filter((subService) => subService.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .filter((service) => service.subServices.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <main className="sp-page about-page">
      <section className="sp-hero about-hero public-page-hero">
        <div className="about-hero-copy">
          <span className="sp-kicker">JANVI SALON · SERVICE MENU</span>
          <h1>
            Your moment
            <br />
            <em>to feel beautiful.</em>
          </h1>
          <p>
            From a little refresh to your big day, find the right care for you.
            Take a look around and let’s plan something lovely.
          </p>
          <div className="sp-hero-actions">
            <button onClick={() => navigate("/appointments")}>
              Book an appointment <span>↗</span>
            </button>
            <a href="tel:9838732382">Call 98387 32382</a>
          </div>
          <span className="about-hero-note">
            Hair <i>·</i> Skin <i>·</i> Makeup <i>·</i> Beauty
          </span>
        </div>
        <div className="about-hero-visual sp-hero-visual">
          <img
            src="/images/janvi-bridal-makeup.jpeg"
            alt="Janvi creating a bridal makeup look"
          />
          <div className="sp-hero-secondary">
            <img
              src="/images/janvi-hair-styling.jpeg"
              alt="Janvi styling a client's hair"
            />
            <span>Hair, with care</span>
          </div>
          <span className="about-hero-leaves" aria-hidden="true" />
          <span className="about-hero-caption">
            <i>✳</i> Beauty services, by Janvi
          </span>
          <span className="about-image-index">
            01 <i>/</i> THE SERVICE MENU
          </span>
        </div>
      </section>
      <StudioHighlights page="services" />
      {!loading && activeServices.length > 0 && (
        <nav className="sp-jump" aria-label="Service categories">
          {activeServices.map((service) => (
            <a key={service.id} href={`#service-${service.id}`}>
              <span>{serviceIcon(service)}</span>
              {service.name}
            </a>
          ))}
          <a href="#courses">
            <span>✺</span>Beauty courses
          </a>
        </nav>
      )}
      {loading ? (
        <BrandLoader
          message="Opening the service menu"
          detail="We’re gathering Janvi’s treatments and prices."
        />
      ) : error || activeServices.length === 0 ? (
        <ServiceUnavailableCard error={error} onRetry={reload} />
      ) : (
        <div className="sp-category-grid">
          {activeServices.map((service, index) => {
            const isExpanded = expandedServices.includes(service.id);
            const priceListId = `service-treatments-${service.id}`;

            return (
              <section
                className={`sp-category sp-category-card sp-category-tone-${index % 4}`}
                id={`service-${service.id}`}
                key={service.id}
              >
                <div className="sp-cat-head">
                  <span className="sp-cat-icon">{serviceIcon(service)}</span>
                  <div>
                    <span className="sp-kicker">
                      {String(index + 1).padStart(2, "0")} / JANVI SALON
                    </span>
                    <h2>{service.name}</h2>
                    {service.description && <p>{service.description}</p>}
                  </div>
                  <button
                    className="sp-category-book"
                    type="button"
                    onClick={() => navigate("/appointments")}
                  >
                    Book <span>↗</span>
                  </button>
                </div>
                <button
                  className="sp-treatment-toggle"
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={priceListId}
                  onClick={() =>
                    setExpandedServices((current) =>
                      isExpanded
                        ? current.filter((id) => id !== service.id)
                        : [...current, service.id],
                    )
                  }
                >
                  <span>
                    <span className="sp-treatment-label-icon" aria-hidden="true">
                      ✧
                    </span>
                    {isExpanded ? "Hide treatments" : "Explore treatments"}
                    <small>{service.subServices.length}</small>
                  </span>
                  <span className="sp-treatment-chevron" aria-hidden="true">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="sp-price-list" id={priceListId}>
                    {service.subServices.map((subService, itemIndex) => (
                      <div className="sp-price-row" key={subService.id}>
                        <span className="sp-row-num">
                          {String(itemIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="sp-item-name">
                          {subService.name}
                          {subService.durationMinutes > 0 && (
                            <small>{subService.durationMinutes} min</small>
                          )}
                        </span>
                        <span className="sp-item-price">
                          {subService.offerPrice !== null && (
                            <del>{formatPrice(subService.price)}</del>
                          )}
                          {formatPrice(subService.offerPrice ?? subService.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
      <section className="sp-packages">
        <div className="sp-section-intro" id="courses">
          <span className="sp-kicker">LEARN SOMETHING BEAUTIFUL</span>
          <h2>
            Beauty courses <em>&amp; training.</em>
          </h2>
          <p>
            Build your skills with practical, hands-on learning at Janvi Salon.
          </p>
        </div>
        <div className="sp-course-grid">
          {courses.map((course, index) => (
            <article className="sp-course-card" key={course.title}>
              <span className="sp-course-number">
                0{index + 1} <i>✳</i>
              </span>
              <span className="sp-duration">{course.duration}</span>
              <h3>{course.title}</h3>
              <p className="sp-course-note">{course.foot}</p>
              <p className="sp-course-list">{course.list}</p>
              <div className="sp-course-bottom">
                <strong>{course.price}</strong>
                <button onClick={() => navigate("/contact")}>
                  Enquire <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="sp-special-package">
        <div>
          <span className="sp-kicker">A LITTLE EXTRA MAGIC</span>
          <h2>Celebration packages</h2>
          <p>
            Make your special day feel even more like you. Each package includes
            facial, body waxing, body polishing, manicure &amp; pedicure, and
            nail extension.
          </p>
        </div>
        <div className="sp-special-options">
          {[
            { name: "Silicone makeup", price: "₹25,000" },
            { name: "HD makeup", price: "₹30,000" },
            { name: "Airbrush makeup", price: "₹45,000" },
          ].map((option) => (
            <div key={option.name}>
              <span>{option.name}</span>
              <strong>{option.price}</strong>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/appointments")}>
          Plan your look <span>↗</span>
        </button>
      </section>
      <section className="sp-endnote">
        <span>✿</span>
        <div>
          <span className="sp-kicker">YOUR VISIT, YOUR WAY</span>
          <h2>Not sure where to start?</h2>
          <p>
            Tell us what you have in mind and we’ll help you find a service that
            feels right.
          </p>
        </div>
        <button onClick={() => navigate("/contact")}>
          Let’s talk <span>↗</span>
        </button>
      </section>
      <footer className="sp-footer">
        <span>JANVI SALON</span>
        <span>
          Made with care, just for you <i>✳</i>
        </span>
        <a href="tel:9838732382">98387 32382</a>
      </footer>
    </main>
  );
}
