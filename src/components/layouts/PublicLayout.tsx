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
      <a
        className="whatsapp-float"
        href="https://wa.me/919838732382?text=Namaste%2C%20mujhe%20aapki%20services%20ke%20baare%20mein%20jaankari%20chahiye."
        aria-label="Chat with Janvi Makeover on WhatsApp"
        title="Chat with us on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.26-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.57 0 11.92-5.35 11.92-11.93 0-3.19-1.24-6.19-3.48-8.42ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.91 9.84 9.84 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.93 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" />
        </svg>
        <span>Chat on WhatsApp</span>
      </a>
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
          <a href="/login" onClick={go("/login")}>
            Studio team login
          </a>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
