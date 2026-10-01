import React from "react";
import "./ServicesPage.css";
import "./ServicesPageRedesign.css";
import StudioHighlights from "../components/common/StudioHighlights";
type Props = { navigate: (to: string) => void };
type Item = { name: string; price: string };
const servicePhotos: Record<string, string[]> = {
  makeup: [
    "WhatsApp Image 2026-09-30 at 09.50.19.jpeg",
    "WhatsApp Image 2026-09-30 at 09.50.21.jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.30.jpeg",
  ],
  facials: [
    "WhatsApp Image 2026-09-30 at 09.52.30 (1).jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.31 (1).jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.18.jpeg",
  ],
  hair: [
    "WhatsApp Image 2026-09-30 at 09.50.25.jpeg",
    "WhatsApp Image 2026-09-30 at 09.50.27.jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.28 (1).jpeg",
  ],
  waxing: [],
  "hands-feet": [],
  mehndi: [
    "WhatsApp Image 2026-09-30 at 09.52.30 (2).jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.19.jpeg",
    "WhatsApp Image 2026-09-30 at 09.52.27.jpeg",
  ],
};
const categories: {
  id: string;
  icon: string;
  title: string;
  note: string;
  items: Item[];
}[] = [
  {
    id: "makeup",
    icon: "✦",
    title: "Makeup artistry",
    note: "From soft party glam to your once-in-a-lifetime bridal look.",
    items: [
      { name: "Party makeup", price: "₹2,000" },
      { name: "Graphic design makeup", price: "₹4,000" },
      { name: "Engagement makeup", price: "₹5,000" },
      { name: "Reception makeup", price: "₹5,000" },
      { name: "Smooth makeup + hair", price: "₹10,000" },
      { name: "3D makeup + hair", price: "₹11,000" },
      { name: "HD makeup + hair", price: "₹15,000" },
      { name: "Silicone makeup + hair", price: "₹9,000" },
      { name: "Airbrush makeup + hair", price: "₹21,000" },
      { name: "Reception · normal + hair", price: "₹5,000" },
      { name: "Reception · 3D + hair", price: "₹6,000" },
      { name: "Reception · HD + hair", price: "₹9,000" },
      { name: "Reception · smooth + hair", price: "₹6,500" },
    ],
  },
  {
    id: "facials",
    icon: "◉",
    title: "Facials & skin rituals",
    note: "A fresh, considered treatment for the skin you’re in.",
    items: [
      { name: "O3+ Plus · clean-up / facial", price: "₹1,350 / ₹2,600" },
      { name: "Shahnaz Gold · clean-up / facial", price: "₹900 / ₹1,800" },
      { name: "Derma N Plus · clean-up / facial", price: "₹700 / ₹1,300" },
      {
        name: "O3+ Skin Whitening · clean-up / facial",
        price: "₹750 / ₹1,280",
      },
      {
        name: "O3+ Suntan Remover · clean-up / facial",
        price: "₹800 / ₹1,300",
      },
      { name: "Ozone Whitening · clean-up / facial", price: "₹700 / ₹1,250" },
      { name: "Lotus Green Tea · clean-up / facial", price: "₹670 / ₹1,270" },
      { name: "Lotus Diamond · clean-up / facial", price: "₹730 / ₹1,100" },
      { name: "Lotus Gold · clean-up / facial", price: "₹570 / ₹950" },
      { name: "Lotus Pearl · clean-up / facial", price: "₹700 / ₹1,050" },
      { name: "Nature’s Gold · clean-up / facial", price: "₹550 / ₹860" },
      { name: "Aroma Magic · clean-up / facial", price: "₹360 / ₹699" },
      { name: "Organic Rice Oil · clean-up / facial", price: "₹450 / ₹899" },
      { name: "Mix Fruit · clean-up / facial", price: "₹390 / ₹550" },
      { name: "O3+ D-Tan · face / hands", price: "₹500 / ₹850" },
      { name: "Raga D-Tan · face / hands", price: "₹300 / ₹750" },
      { name: "O3+ facial + Hydra treatment", price: "₹3,000" },
      { name: "Hydra facial", price: "₹3,500" },
      { name: "Korean Glass facial", price: "₹4,999" },
      { name: "Aroma Magic treatment", price: "₹2,000" },
    ],
  },
  {
    id: "hair",
    icon: "〰",
    title: "Hair cuts & styling",
    note: "A little refresh, a whole new shape, or a style for the occasion.",
    items: [
      { name: "Hair wash only", price: "₹250" },
      { name: "Hair wash + cutting", price: "₹150" },
      { name: "Straight cut", price: "₹100" },
      { name: "U-shape cut", price: "₹150" },
      { name: "Deep U-shape cut", price: "₹170" },
      { name: "2-step cut", price: "₹200" },
      { name: "3-step cut", price: "₹300" },
      { name: "Layer cut", price: "₹350" },
      { name: "Multi-step cut", price: "₹400" },
      { name: "Layer + step cut", price: "₹450" },
      { name: "Laser cut", price: "₹250" },
      { name: "Front layer", price: "₹60" },
      { name: "Front layer flicks", price: "₹50" },
      { name: "Baby cut", price: "₹160" },
      { name: "Boy cut", price: "₹250" },
      { name: "Diana cut", price: "₹350" },
      { name: "Advance cut", price: "₹450" },
      { name: "Trimming", price: "₹150" },
      { name: "Full curls", price: "₹700" },
      { name: "Shoulder curls", price: "₹300" },
    ],
  },
  {
    id: "waxing",
    icon: "✧",
    title: "Waxing & threading",
    note: "Choose your wax and treatment area. Face waxing uses bean wax.",
    items: [
      {
        name: "Rica wax · hand / leg / half leg / armpit",
        price: "₹550 / 1,000 / 550 / 150",
      },
      {
        name: "Chocolate wax · hand / leg / half leg / armpit",
        price: "₹350 / 700 / 350 / 150",
      },
      {
        name: "Honey wax · hand / leg / half leg / armpit",
        price: "₹250 / 600 / 300 / 100",
      },
      { name: "V-Wax · hand", price: "₹1,200" },
      { name: "Bean wax · armpit", price: "₹200" },
      { name: "Bean wax · upper / lower lips", price: "₹40 / ₹40" },
      { name: "Bean wax · forehead / cheeks", price: "₹40 / ₹80" },
      { name: "Bean wax · nose / eyebrows", price: "₹40 / ₹60" },
      { name: "Bean wax · full cheeks / full face", price: "₹80 / ₹550" },
    ],
  },
  {
    id: "hands-feet",
    icon: "❀",
    title: "Manicure & pedicure",
    note: "A little care for hands and feet, finished with your choice of add-on.",
    items: [
      { name: "Manicure · pack", price: "₹800" },
      { name: "Manicure · de-tan", price: "₹1,000" },
      { name: "Pedicure · pack", price: "₹800" },
      { name: "Pedicure · de-tan", price: "₹1,000" },
    ],
  },
  {
    id: "mehndi",
    icon: "❋",
    title: "Mehndi",
    note: "Intricate henna for celebrations, big and small.",
    items: [
      { name: "Boota style mehndi", price: "₹400" },
      { name: "Arabic mehndi", price: "₹500" },
      { name: "Foot mehndi · ankle length", price: "₹1,000" },
      { name: "Engagement mehndi", price: "₹1,500" },
      { name: "Bridal mehndi", price: "₹4,000" },
    ],
  },
];
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
export default function ServicesPage({ navigate }: Props) {
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
      <nav className="sp-jump" aria-label="Service categories">
        {categories.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            <span>{category.icon}</span>
            {category.title}
          </a>
        ))}
        <a href="#courses">
          <span>✺</span>Beauty courses
        </a>
      </nav>
      {categories.map((category, index) => (
        <section className="sp-category" id={category.id} key={category.id}>
          <div className="sp-cat-head">
            <span className="sp-cat-icon">{category.icon}</span>
            <div>
              <span className="sp-kicker">0{index + 1} / JANVI SALON</span>
              <h2>{category.title}</h2>
              <p>{category.note}</p>
            </div>
            <button onClick={() => navigate("/appointments")}>
              Book <span>↗</span>
            </button>
          </div>
          {servicePhotos[category.id].length > 0 && (
            <div className="sp-work-gallery">
              {servicePhotos[category.id].map((photo, photoIndex) => (
                <img
                  key={photo}
                  src={`/images/janvi-portfolio/${encodeURIComponent(photo)}`}
                  alt={`${category.title} portfolio example ${photoIndex + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
          <div className="sp-price-list">
            {category.items.map((item, itemIndex) => (
              <div className="sp-price-row" key={item.name}>
                <span className="sp-row-num">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="sp-item-name">{item.name}</span>
                <span className="sp-item-price">{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
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
