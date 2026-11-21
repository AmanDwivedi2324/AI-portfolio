/** Red tile with an agent cursor — the site's mark (same as the favicon). */
export default function LogoMark({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#f2242f" />
      <path
        d="M20 14 L46 36 L34 37.5 L41 51 L35.5 53.5 L28.8 40 L20 48 Z"
        fill="#fff"
        stroke="#0a0a0b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
