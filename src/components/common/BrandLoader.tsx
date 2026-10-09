import React from "react";
import "./BrandLoader.css";

type Props = {
  message?: string;
  detail?: string;
  variant?: "inline" | "overlay" | "compact";
};

export default function BrandLoader({
  message = "A little moment…",
  detail = "Preparing something lovely for you.",
  variant = "inline",
}: Props) {
  return (
    <div
      className={`brand-loader brand-loader-${variant}`}
      role="status"
      aria-live="polite"
    >
      <div className="brand-loader-mark" aria-hidden="true">
        <span className="brand-loader-orbit" />
        <img src="/jaya-makeover-logo.svg" alt="" />
        <span className="brand-loader-spark">✳</span>
      </div>
      <strong>{message}</strong>
      {variant !== "compact" && <span>{detail}</span>}
      <span className="brand-loader-progress" aria-hidden="true">
        <i />
      </span>
    </div>
  );
}
