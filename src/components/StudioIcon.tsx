import React from "react";

export type StudioIconName =
  | "home"
  | "sparkles"
  | "story"
  | "gallery"
  | "help"
  | "mail"
  | "phone"
  | "pin"
  | "calendar"
  | "instagram"
  | "facebook"
  | "youtube"
  | "pinterest"
  | "arrow";

const paths: Record<StudioIconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </>
  ),
  story: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8M8 10h6" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.1-2.4 3.8M12 17h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <>
      <path d="M7 3h3l2 5-2 1.5a15 15 0 0 0 4.5 4.5L16 12l5 2v3a3 3 0 0 1-3 3A17 17 0 0 1 4 6a3 3 0 0 1 3-3Z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: (
    <>
      <path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4A25 25 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8h4Z" />
    </>
  ),
  youtube: (
    <>
      <path d="M22 8.1a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.5A3 3 0 0 0 2 8.1 31 31 0 0 0 1.5 12 31 31 0 0 0 2 15.9a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.9 31 31 0 0 0-.5-3.9Z" />
      <path d="m10 15 5-3-5-3v6Z" />
    </>
  ),
  pinterest: (
    <>
      <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-1.5 0-3.2.4-4.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.7-4-3.7-2.9 0-4.7 2.2-4.7 4.6 0 .8.2 1.4.6 1.9.2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.6.3-1.3-.5-1.9-1.9-1.9-3.5 0-2.6 2.2-5.8 6.7-5.8 3.6 0 6 2.6 6 5.4 0 3.7-2.1 6.5-5.3 6.5-1.1 0-2.1-.6-2.5-1.2l-.7 2.7c-.3 1-.8 2-1.3 2.8A9 9 0 1 0 12 3Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
};

export default function StudioIcon({
  name,
  className = "",
}: {
  name: StudioIconName;
  className?: string;
}) {
  return (
    <svg
      className={`studio-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
