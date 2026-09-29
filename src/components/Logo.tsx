import { useId } from "react";

type LogoProps = {
  className?: string;
  decorative?: boolean; // true = screen readers skip it (e.g. background watermark)
};

/**
 * Eblendz round badge: barber pole, crossed clippers, fading name.
 * Drawn as inline SVG so it uses the site's real fonts and stays sharp at any size.
 */
export function Logo({ className, decorative = false }: LogoProps) {
  // Unique ids so two logos on one page (nav + hero) don't clash.
  const uid = useId().replace(/:/g, "");
  const ids = {
    pole: `pole-${uid}`,
    fade: `fade-${uid}`,
    clipper: `clipper-${uid}`,
    poleGroup: `polegroup-${uid}`,
  };

  return (
    <svg
      viewBox="0 0 280 280"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Eblendz logo"}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <pattern
          id={ids.pole}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-35)"
        >
          <rect width="22" height="22" fill="#ede6da" />
          <rect width="8" height="22" fill="#c9a227" />
          <rect x="12" width="5" height="22" fill="#0b0b0a" />
        </pattern>

        <linearGradient id={ids.fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ede6da" />
          <stop offset="0.45" stopColor="#ede6da" />
          <stop offset="1" stopColor="#ede6da" stopOpacity="0.1" />
        </linearGradient>

        {/* One clipper, drawn once and reused twice below */}
        <g id={ids.clipper}>
          <rect x="-17" y="-40" width="34" height="96" rx="14" fill="#1c1a18" stroke="#c9a227" strokeWidth="2.5" />
          <rect x="-21" y="-54" width="42" height="16" rx="3" fill="#ede6da" />
          <path
            d="M-21 -54 L-21 -62 L-17 -54 L-13 -62 L-9 -54 L-5 -62 L-1 -54 L3 -62 L7 -54 L11 -62 L15 -54 L19 -62 L21 -54 Z"
            fill="#ede6da"
          />
          <rect x="-6" y="-26" width="12" height="30" rx="6" fill="#c9a227" />
          <rect x="17" y="-20" width="7" height="22" rx="3" fill="#c9a227" />
          <line x1="-9" y1="24" x2="9" y2="24" stroke="#2a2724" strokeWidth="2" />
          <line x1="-9" y1="31" x2="9" y2="31" stroke="#2a2724" strokeWidth="2" />
          <line x1="-9" y1="38" x2="9" y2="38" stroke="#2a2724" strokeWidth="2" />
        </g>

        <g id={ids.poleGroup}>
          <circle cx="0" cy="-62" r="7" fill="#c9a227" />
          <rect x="-20" y="-56" width="40" height="11" rx="5" fill="#c9a227" />
          <rect x="-14" y="-45" width="28" height="100" rx="14" fill={`url(#${ids.pole})`} stroke="#c9a227" strokeWidth="2" />
          <rect x="-20" y="55" width="40" height="11" rx="5" fill="#c9a227" />
        </g>
      </defs>

      <circle cx="140" cy="140" r="130" fill="none" stroke="#c9a227" strokeWidth="3" />

      <use href={`#${ids.clipper}`} transform="translate(100 108) rotate(-28) scale(0.9)" />
      <use href={`#${ids.clipper}`} transform="translate(180 108) rotate(28) scale(0.9)" />
      <use href={`#${ids.poleGroup}`} transform="translate(140 100) scale(0.95)" />

      <text
        x="140"
        y="222"
        textAnchor="middle"
        fontSize="46"
        fill={`url(#${ids.fade})`}
        style={{ fontFamily: "var(--font-anton), Impact, sans-serif" }}
      >
        EBLENDZ
      </text>

      {/* Thin cuts through the bottom of the name = the "fade" */}
      <g stroke="#0b0b0a" strokeWidth="1.6">
        <line x1="60" y1="206" x2="220" y2="206" />
        <line x1="60" y1="211.6" x2="220" y2="211.6" />
        <line x1="60" y1="216.4" x2="220" y2="216.4" />
        <line x1="60" y1="220.4" x2="220" y2="220.4" />
      </g>

      <text
        x="140"
        y="246"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="4"
        fill="#c9a227"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        SHARP CUTZ
      </text>
    </svg>
  );
}
