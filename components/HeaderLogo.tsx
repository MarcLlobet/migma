// Inline copy of public/migma-logo.svg for the header.
// It sits in the first screen, and a logo that animates forever keeps the
// screen "changing", which inflates Speed Index. Here the animation is paused
// by default and plays on hover/focus of the brand link (see .brand in styles.css).
// Inline (rather than <img>) so page CSS can control it; ids are prefixed to stay unique.
export function HeaderLogo({ size }: { size: number }) {
  return (
    <svg className="header-logo" viewBox="0 0 90 87" width={size} height={Math.round(size * 0.97)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hl-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f58a1f" /><stop offset=".5" stopColor="#f2503a" /><stop offset="1" stopColor="#ec1858" />
        </linearGradient>
        <radialGradient id="hl-k">
          <stop offset=".5" stopColor="#0e0e0e" /><stop offset=".85" stopColor="#3a0a14" stopOpacity=".6" /><stop offset="1" stopColor="#0e0e0e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hl-r">
          <stop offset=".3" stopColor="#c8123e" /><stop offset="1" stopColor="#c8123e" stopOpacity="0" />
        </radialGradient>
        <filter id="hl-n" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0" />
        </filter>
        <mask id="hl-s">
          <path d="M3 3L45 26L87 3V84H3Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        </mask>
      </defs>
      <g mask="url(#hl-s)">
        <rect width="90" height="87" fill="url(#hl-g)" />
        <ellipse className="lg-b" cx="28" cy="50" rx="13" ry="60" fill="url(#hl-k)" />
        <ellipse className="lg-b lg-b2" cx="70" cy="36" rx="11" ry="56" fill="url(#hl-k)" />
        <ellipse className="lg-b lg-b3" cx="45" cy="80" rx="60" ry="12" fill="url(#hl-k)" />
        <ellipse className="lg-b lg-b2 lg-b3" cx="50" cy="40" rx="20" ry="34" fill="url(#hl-r)" />
        <rect width="90" height="87" filter="url(#hl-n)" opacity=".2" style={{ mixBlendMode: "overlay" }} />
        <path d="M3 3L45 26L87 3V84H3Z" fill="none" stroke="#f47a2c" strokeWidth="1.4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
