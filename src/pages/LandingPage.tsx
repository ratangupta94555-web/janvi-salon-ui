import React, { useEffect, useState } from 'react';
import './CustomerPages.css';

type Props = { navigate: (to: string) => void };
const testimonials = [
  { quote: 'She listened to exactly what I wanted, and the result feels like me on my very best day.', name: 'Maya C.', initials: 'MC', detail: 'Hair & styling guest' },
  { quote: 'The whole visit felt calm and thoughtful. I walked out glowing and already looking forward to coming back.', name: 'Rina P.', initials: 'RP', detail: 'Skin treatment guest' },
  { quote: 'The color is soft, beautiful, and so easy to wear. I felt cared for from the first hello.', name: 'Anika S.', initials: 'AS', detail: 'Color guest' },
];
const heroImages = [
  '/images/janvi-hero-editorial-01.png',
  '/images/janvi-hero-editorial-02.png',
  '/images/janvi-hero-editorial-03.png',
];
const galleryPhotos = [
  { category: 'Bridal Makeup', image: '/images/janvi-bridal-makeup.jpeg', alt: 'Janvi applying bridal makeup to a client' },
  { category: 'Artist at Work', image: '/images/janvi-makeup-action.jpeg', alt: 'Janvi applying makeup with a brush' },
  { category: 'Hair Styling', image: '/images/janvi-hair-styling.jpeg', alt: 'Janvi styling a client’s hair' },
  { category: 'Makeup Artistry', image: '/images/janvi-makeup-portrait.jpeg', alt: 'Janvi with her makeup brush' },
  { category: 'A Special Finish', image: '/images/janvi-bridal-finish.jpeg', alt: 'Bridal makeup by Janvi' },
];

function RitualArtwork({ kind }: { kind: 'hair' | 'face' | 'color' | 'nails' }) {
  return (
    <svg className={`ritual-art ritual-art-${kind}`} viewBox="0 0 180 130" aria-hidden="true">
      {kind === 'hair' && <>
        <path d="M37 32c18-12 44-12 62 0v52H37Z" fill="#f1dfd6" />
        <path d="M47 39v38m10-38v38m10-38v38m10-38v38m10-38v38" stroke="#b87869" strokeWidth="2" strokeLinecap="round" />
        <path d="M107 38c16 16 21 31 13 49-8-12-12-22-13-49Zm14 47c9-18 17-25 29-27-4 16-13 25-29 27Z" fill="#8b9b76" />
        <circle cx="47" cy="28" r="5" fill="#d6a17f"/><circle cx="65" cy="26" r="5" fill="#d6a17f"/><circle cx="83" cy="28" r="5" fill="#d6a17f"/>
      </>}
      {kind === 'face' && <>
        <path d="M43 81h90c-5 17-19 25-45 25S49 98 43 81Z" fill="#d8b48e" />
        <path d="M57 79c9-13 53-13 62 0" fill="none" stroke="#a8785c" strokeWidth="3" />
        <rect x="64" y="36" width="19" height="41" rx="5" fill="#e7c9a6" />
        <rect x="68" y="27" width="11" height="12" rx="2" fill="#bb8665" />
        <rect x="91" y="46" width="17" height="31" rx="5" fill="#f0d8bb" />
        <rect x="95" y="38" width="9" height="10" rx="2" fill="#b57d61" />
        <path d="M116 70c7-12 13-16 21-17m-11 18 14-2" fill="none" stroke="#8d9b78" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'color' && <>
        <path d="M35 93h111" stroke="#d9c6ae" strokeWidth="5" strokeLinecap="round" />
        <path d="M49 42h31l5 50H44Z" fill="#d9a18a" />
        <rect x="56" y="31" width="17" height="13" rx="3" fill="#9d5e58" />
        <path d="M95 51h28l5 41H90Z" fill="#e8c79e" />
        <rect x="101" y="40" width="16" height="13" rx="3" fill="#b77e5d" />
        <path d="M39 35c8-10 17-13 25-13m-4 18c9-13 19-17 30-16" fill="none" stroke="#8d9b78" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'nails' && <>
        <path d="M59 45h42l-5 52H64Z" fill="#d88891" />
        <rect x="67" y="32" width="27" height="15" rx="3" fill="#a84f67" />
        <path d="M80 24v9" stroke="#88654f" strokeWidth="4" strokeLinecap="round" />
        <path d="M111 85c5-20 16-33 31-39m-23 49c8-16 20-23 34-23" fill="none" stroke="#8b9b76" strokeWidth="3" strokeLinecap="round" />
        <circle cx="132" cy="40" r="8" fill="#f1c5c4"/><circle cx="147" cy="66" r="7" fill="#f1c5c4"/>
        <path d="M42 93h88" stroke="#ddc8af" strokeWidth="5" strokeLinecap="round" />
      </>}
    </svg>
  );
}

export default function LandingPage({ navigate }: Props) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setHeroIndex(index => (index + 1) % heroImages.length), 5200);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setTestimonialIndex(index => (index + 1) % testimonials.length), 5500);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setGalleryIndex(index => (index + 1) % galleryPhotos.length), 4500);
    return () => window.clearInterval(timer);
  }, []);
  const showTestimonial = (index: number) => setTestimonialIndex((index + testimonials.length) % testimonials.length);
  const showGallerySlide = (index: number) => setGalleryIndex((index + galleryPhotos.length) % galleryPhotos.length);
  const visibleGalleryPhotos = Array.from({ length: 3 }, (_, offset) => galleryPhotos[(galleryIndex + offset) % galleryPhotos.length]);

  return (
    <main className="customer-page">
      <section className="home-hero">
        <div className="hero-image" aria-hidden="true"><img key={heroIndex} className="hero-slide-photo" src={heroImages[heroIndex]} alt="" /></div>
        <div className="hero-copy">
          <span className="page-kicker">YOUR NEIGHBORHOOD BEAUTY STUDIO</span>
          <h1>Beauty, on<br /><em>your terms.</em></h1>
          <p>Considered beauty, kind people, and a little breathing room to feel more like yourself.</p>
          <button className="editorial-button" onClick={() => navigate('/appointments')}>Explore your look <span>↗</span></button>
          <div className="hero-footnote"><span>✳</span> A little care, just for you.</div>
        </div>
        <div className="hero-scroll">SCROLL TO FEEL GOOD <span>↓</span></div>
      </section>

      <section className="ritual-categories" aria-labelledby="ritual-title">
        <div className="ritual-grid">
          {[
            { kind: 'hair' as const, title: 'The Hair Ritual', text: 'A little care for softer, healthier-looking hair.' },
            { kind: 'face' as const, title: 'Skin Rebalance', text: 'A gentle reset that leaves your skin feeling fresh.' },
            { kind: 'color' as const, title: 'Color Refresh', text: 'A thoughtful touch-up for your favorite shade.' },
            { kind: 'nails' as const, title: 'Nail Finishing', text: 'A polished final touch, chosen just for you.' },
          ].map((ritual, index) => (
            <button className="ritual-card" key={ritual.title} onClick={() => navigate('/services')}>
              <RitualArtwork kind={ritual.kind} />
              <span className="ritual-number">0{index + 1} / JANVI RITUAL</span>
              <strong>{ritual.title}</strong>
              <span className="ritual-description">{ritual.text}</span>
              <span className="ritual-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-about" aria-labelledby="home-about-title">
        <div className="home-about-visual">
          <span className="about-image-frame" />
          <img src="/images/janvi-bridal-closeup.jpeg" alt="Janvi applying bridal makeup for a client" />
          <div className="about-detail-photo"><img src="/images/janvi-stylist-portrait.jpeg" alt="Janvi, the artist behind Janvi Makeover" /><span>Beauty, at your pace</span></div>
          <span className="about-photo-note"><span>✦</span> A softer kind of self-care</span>
        </div>
        <div className="home-about-copy">
          <span className="page-kicker">A LITTLE ABOUT JANVI</span>
          <h2 id="home-about-title">A lovely place<br />to feel <em>like you.</em></h2>
          <p>Janvi Makeover is a neighborhood beauty studio built around the little things that make a visit feel special: a warm welcome, artists who really listen, and thoughtful care from the first hello to the final look.</p>
          <p>Come in as you are. We’ll help you find a style that feels beautiful, comfortable, and completely your own.</p>
          <button className="editorial-button" onClick={() => navigate('/about')}>More about us <span>↗</span></button>
          <div className="about-values"><span><i>✳</i> A team that listens</span><span><i>✳</i> Thoughtful care</span><span><i>✳</i> Your own kind of beautiful</span></div>
        </div>
      </section>

      <section className="home-services">
        <div className="home-services-heading">
          <span className="page-kicker">A LITTLE SOMETHING FOR YOU</span>
          <h2>Find your <em>feel-good.</em></h2>
          <p>Thoughtful beauty rituals, made to fit you.</p>
        </div>
        <div className="service-tiles">
          <button className="service-tile" onClick={() => navigate('/services')}><span className="tile-image tile-hair" /><span className="tile-label">01 / HAIR</span><strong>Cut &amp; styling</strong><span className="tile-description">A fresh shape and an easy, lovely finish.</span><span className="tile-arrow">↗</span></button>
          <button className="service-tile" onClick={() => navigate('/services')}><span className="tile-image tile-color" /><span className="tile-label">02 / COLOR</span><strong>Color, your way</strong><span className="tile-description">Soft dimension and a shade that feels like you.</span><span className="tile-arrow">↗</span></button>
          <button className="service-tile" onClick={() => navigate('/services')}><span className="tile-image tile-facial" /><span className="tile-label">03 / SKIN</span><strong>Facial rituals</strong><span className="tile-description">A restorative moment for your skin and senses.</span><span className="tile-arrow">↗</span></button>
          <button className="service-tile" onClick={() => navigate('/services')}><span className="tile-image tile-nails" /><span className="tile-label">04 / NAILS</span><strong>Little color moment</strong><span className="tile-description">A neat manicure and a color you’ll love.</span><span className="tile-arrow">↗</span></button>
        </div>
        <button className="underlined-link home-all-services" onClick={() => navigate('/services')}>Explore all services <span>↗</span></button>
      </section>

      <section className="home-gallery" aria-labelledby="home-gallery-title">
        <div className="home-gallery-heading">
          <div><span className="page-kicker">A LITTLE INSPIRATION</span><h2 id="home-gallery-title">Made here. <em>Worn everywhere.</em></h2><p>Beauty looks different on everyone. Here are a few of our favorite moments.</p></div>
          <button className="underlined-link" onClick={() => navigate('/gallery')}>Explore the gallery <span>↗</span></button>
        </div>
        <div className="home-gallery-track">
          {visibleGalleryPhotos.map((photo, index) => (
            <button className="home-gallery-card" key={photo.image} onClick={() => navigate('/gallery')} aria-label={`View ${photo.category} in the full gallery`}>
              <img src={photo.image} alt={photo.alt} />
              <span className="home-gallery-caption"><small>JANVI MAKEOVER</small><strong>{photo.category}</strong></span>
              <span className="home-gallery-number">0{(galleryIndex + index) % galleryPhotos.length + 1}</span>
            </button>
          ))}
        </div>
        <div className="home-gallery-controls">
          <div className="gallery-dots" aria-label="Choose gallery slide">
            {galleryPhotos.map((photo, index) => <button key={photo.image} className={index === galleryIndex ? 'active' : ''} aria-label={`Show gallery slide ${index + 1}`} aria-pressed={index === galleryIndex} onClick={() => showGallerySlide(index)} />)}
          </div>
          <div className="gallery-arrows"><button className="testimonial-arrow" aria-label="Previous gallery images" onClick={() => showGallerySlide(galleryIndex - 1)}>←</button><button className="testimonial-arrow" aria-label="Next gallery images" onClick={() => showGallerySlide(galleryIndex + 1)}>→</button></div>
        </div>
      </section>

      <section className="home-quote home-testimonials" aria-label="Client testimonials">
        <div className="testimonial-layout">
          <div className="testimonial-visual">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85" alt="A Janvi Makeover client enjoying a salon visit" />
            <span className="testimonial-image-caption"><i>✳</i> A little time for you</span>
            <span className="testimonial-image-flower" aria-hidden="true">✿</span>
          </div>
          <div className="testimonial-content">
            <span className="page-kicker">KIND WORDS FROM OUR CLIENTS</span>
            <span className="testimonial-quote-mark" aria-hidden="true">“</span>
            <blockquote key={testimonialIndex} className="testimonial-quote">{testimonials[testimonialIndex].quote}</blockquote>
            <div className="testimonial-credit"><span className="testimonial-initials">{testimonials[testimonialIndex].initials}</span><span className="testimonial-person"><strong>{testimonials[testimonialIndex].name}</strong><small>{testimonials[testimonialIndex].detail}</small></span></div>
            <div className="testimonial-controls">
              <div className="testimonial-dots" aria-label="Choose testimonial">
                {testimonials.map((item, index) => <button key={item.name} className={index === testimonialIndex ? 'active' : ''} aria-label={`Show testimonial ${index + 1}`} aria-pressed={index === testimonialIndex} onClick={() => showTestimonial(index)} />)}
              </div>
              <div className="testimonial-arrows">
                <button className="testimonial-arrow" aria-label="Previous testimonial" onClick={() => showTestimonial(testimonialIndex - 1)}>←</button>
                <button className="testimonial-arrow" aria-label="Next testimonial" onClick={() => showTestimonial(testimonialIndex + 1)}>→</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <span className="page-kicker">YOUR CHAIR IS WAITING</span>
        <h2>Your next good hair day<br />starts <em>here.</em></h2>
        <button className="editorial-button light" onClick={() => navigate('/appointments')}>Book your visit <span>↗</span></button>
      </section>
    </main>
  );
}




