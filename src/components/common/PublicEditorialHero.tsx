import React from "react";
import "./PublicEditorialHero.css";

type PublicEditorialHeroProps = {
  kicker: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  secondaryCaption: string;
  caption: string;
  index: string;
  imageLabel: string;
  note: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  className?: string;
};

export default function PublicEditorialHero({
  kicker,
  title,
  description,
  image,
  imageAlt,
  secondaryImage,
  secondaryImageAlt,
  secondaryCaption,
  caption,
  index,
  imageLabel,
  note,
  actionLabel,
  onAction,
  className = "",
}: PublicEditorialHeroProps) {
  return (
    <section
      className={`inner-hero about-hero public-page-hero ${className}`.trim()}
    >
      <div className="about-hero-copy">
        <span className="page-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="editorial-button" onClick={onAction}>
          {actionLabel} <span>↗</span>
        </button>
        <span className="about-hero-note">{note}</span>
      </div>
      <div className="about-hero-visual">
        <img src={image} alt={imageAlt} />
        <div className="about-detail-photo hero-detail-photo">
          <img src={secondaryImage} alt={secondaryImageAlt} />
          <span>{secondaryCaption}</span>
        </div>
        <span className="about-hero-leaves" aria-hidden="true" />
        <span className="about-hero-caption">
          <i>✳</i> {caption}
        </span>
        <span className="about-image-index">
          {index} <i>/</i> {imageLabel}
        </span>
      </div>
    </section>
  );
}
