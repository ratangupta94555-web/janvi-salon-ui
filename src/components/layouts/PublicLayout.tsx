import React, { useState } from "react";
import "./PublicLayout.css";
import StudioIcon, { type StudioIconName } from "../StudioIcon";

type PublicLayoutProps = {
  children: React.ReactNode;
  path: string;
  navigate: (to: string) => void;
};
const links: [string, string, StudioIconName][] = [
  ["/", "Home", "home"],
  ["/services", "Services", "sparkles"],
  ["/about", "Our story", "story"],
  ["/gallery", "Gallery", "gallery"],
  ["/contact", "Contact", "mail"],
];
export default function PublicLayout({
  children,
  path,
  navigate,
}: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const go = (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="public-site">
      <div className="announcement">
        <span>✦</span> A little time for you. Now taking appointments.{" "}
        <a href="/appointments" onClick={go("/appointments")}>
          Find your moment <span>→</span>
        </a>
      </div>
      <header className="public-header">
        <a
          href="/"
          className="public-brand"
          aria-label="Janvi Makeover home"
          onClick={go("/")}
        >
          <img
            src="/jaya-makeover-logo.svg"
            alt="Janvi Makeover"
            className="brand-logo"
          />
        </a>
        <button
          className="public-menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
        <nav className={menuOpen ? "public-nav open" : "public-nav"}>
          {links.map(([to, label, icon]) => (
            <a
              key={to}
              href={to}
              className={path === to ? "selected" : ""}
              onClick={go(to)}
            >
              <StudioIcon name={icon} />
              {label}
            </a>
          ))}
        </nav>
        <a
          className="public-book-button"
          href="/appointments"
          onClick={go("/appointments")}
        >
          <StudioIcon name="calendar" />
          Book your visit <span>↗</span>
        </a>
      </header>
      {children}
      <div className="public-social-dock">
        <nav
          id="public-social-panel"
          className="public-social-panel"
          aria-label="Follow Janvi Makeover"
          hidden={!socialOpen}
        >
          <a
            href="https://youtube.com/@janvi_makeup_artist?si=iZIWZR2ZGQdLIUlM"
            aria-label="YouTube"
            title="YouTube"
            target="_blank"
            rel="noreferrer"
          >
            <StudioIcon name="youtube" />
          </a>
          <a
            href="https://www.instagram.com/janvi123makeupartist?utm_source=qr&stkn=MTNqbmRtZWU4MjFueg=="
            aria-label="Instagram"
            title="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <StudioIcon name="instagram" />
          </a>
          <a
            href="https://www.facebook.com/share/19ondN1tk8/"
            aria-label="Facebook"
            title="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <StudioIcon name="facebook" />
          </a>
        </nav>
        <button
          className="public-social-toggle"
          type="button"
          aria-label={socialOpen ? "Hide social links" : "Show social links"}
          aria-expanded={socialOpen}
          aria-controls="public-social-panel"
          title={socialOpen ? "Hide social links" : "Show social links"}
          onClick={() => setSocialOpen((open) => !open)}
        >
          <StudioIcon name="instagram" />
          <span aria-hidden="true">{socialOpen ? "×" : "+"}</span>
        </button>
      </div>
      <footer className="public-footer">
        <div className="footer-main">
          <div className="footer-brand-col">
            <a
              href="/"
              className="public-brand footer-brand"
              aria-label="Janvi Makeover home"
              onClick={go("/")}
            >
              <img
                src="/jaya-makeover-logo.svg"
                alt="Janvi Makeover"
                className="brand-logo footer-brand-logo"
              />
            </a>
            <p>
              A neighborhood beauty studio for feeling like yourself, only a
              little more so.
            </p>
            <div className="social-links" aria-label="Follow Janvi Makeover">
              <a
                href="https://youtube.com/@janvi_makeup_artist?si=iZIWZR2ZGQdLIUlM"
                aria-label="YouTube"
                title="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <StudioIcon name="youtube" />
              </a>
              <a
                href="https://www.instagram.com/janvi123makeupartist?utm_source=qr&stkn=MTNqbmRtZWU4MjFueg=="
                aria-label="Instagram"
                title="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <StudioIcon name="instagram" />
              </a>
              <a
                href="https://www.facebook.com/share/19ondN1tk8/"
                aria-label="Facebook"
                title="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <StudioIcon name="facebook" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <strong>Explore</strong>
            {[
              ["/services", "Our services", "sparkles"],
              ["/about", "Our story", "story"],
              ["/gallery", "The gallery", "gallery"],
              ["/faq", "FAQs", "help"],
            ].map(([to, label, icon]) => (
              <a key={to} href={to} onClick={go(to)}>
                <StudioIcon name={icon as StudioIconName} />
                {label}
              </a>
            ))}
          </div>
          <div className="footer-col">
            <strong>Say hello</strong>
            <a href="/contact" onClick={go("/contact")}>
              <StudioIcon name="mail" />
              Contact us
            </a>
            <a href="tel:+919838732382">
              <StudioIcon name="phone" />
              9838732382
            </a>
            <a href="mailto:janviratan007@gmail.com">
              <StudioIcon name="mail" />
              janviratan007@gmail.com
            </a>
            <span className="footer-contact-line">
              <StudioIcon name="pin" />
              <span>
                Central Bank Building, opposite Gyandeep Academy
                <br />
                Vishwakarma Nagar, Mohanpuri Colony, Chitaipur, Varanasi
              </span>
            </span>
            <span className="footer-contact-line">
              <StudioIcon name="pin" />
              <span>
                Mansarovar Shopping Complex, NTPC Campus, Bijpur
                <br />
                Rihand Nagar, Uttar Pradesh 231223
              </span>
            </span>
          </div>
          <div className="footer-newsletter">
            <strong>A good hair day starts here.</strong>
            <p>Notes from the studio, plus the occasional little treat.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.alert("Thanks for joining our list!");
              }}
            >
              <input
                aria-label="Email address"
                type="email"
                placeholder="Your email address"
                required
              />
              <button aria-label="Subscribe">→</button>
            </form>
            <small>
              By subscribing, you agree to receive our studio notes.
            </small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Janvi Makeover. Made with care.
          </span>
          <a href="/admin" onClick={go("/admin")}>
            Studio team login
          </a>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
