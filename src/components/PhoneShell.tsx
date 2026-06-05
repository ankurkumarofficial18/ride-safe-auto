import type { ReactNode } from "react";
import logoAsset from "@/assets/tuktuk-logo.png.asset.json";

export function PhoneShell({ children }: { children: ReactNode }) {
  return <div className="phone-frame">{children}</div>;
}

export function AutoIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Auto"
      width={size}
      height={size}
      className={`object-contain drop-shadow ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function TourBuddyLogo({ size = 80 }: { size?: number }) {
  return (
    <img
      src={logoAsset.url}
      alt="TourBuddy"
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Google-Maps-style backdrop drawn with SVG. Light & dark palettes via CSS vars.
 */
export function MapBackdrop({ children }: { children?: ReactNode }) {
  return (
    <div className="map-backdrop absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Land blocks / neighborhoods */}
        <g className="map-land">
          <rect x="0" y="0" width="48" height="38" />
          <rect x="52" y="0" width="48" height="32" />
          <rect x="0" y="42" width="40" height="28" />
          <rect x="44" y="36" width="34" height="34" />
          <rect x="82" y="36" width="18" height="34" />
          <rect x="0" y="74" width="55" height="26" />
          <rect x="59" y="74" width="41" height="26" />
        </g>

        {/* Parks */}
        <g className="map-park">
          <rect x="6" y="6" width="18" height="14" rx="1.5" />
          <rect x="72" y="78" width="22" height="16" rx="1.5" />
          <rect x="60" y="10" width="14" height="10" rx="1.5" />
        </g>

        {/* River / water */}
        <path
          d="M-2,55 Q22,50 40,57 T72,55 T102,60 L102,66 Q78,71 56,64 T22,66 T-2,62 Z"
          className="map-water"
        />

        {/* Road casings (darker outline) */}
        <g className="map-road-casing" fill="none" strokeLinecap="round">
          <path d="M-2,40 Q35,42 60,52 T102,62" strokeWidth="5.6" />
          <path d="M48,-2 Q50,40 60,60 T70,102" strokeWidth="5" />
          <path d="M-2,82 L102,72" strokeWidth="4.2" />
          <path d="M20,-2 L22,102" strokeWidth="3.4" />
          <path d="M78,-2 L80,102" strokeWidth="3.4" />
        </g>
        {/* Road fills */}
        <g className="map-road" fill="none" strokeLinecap="round">
          <path d="M-2,40 Q35,42 60,52 T102,62" strokeWidth="4" />
          <path d="M48,-2 Q50,40 60,60 T70,102" strokeWidth="3.4" />
          <path d="M-2,82 L102,72" strokeWidth="2.8" />
          <path d="M20,-2 L22,102" strokeWidth="2.2" />
          <path d="M78,-2 L80,102" strokeWidth="2.2" />
        </g>
        {/* Minor streets */}
        <g className="map-street" fill="none" strokeLinecap="round" strokeWidth="1.1">
          <path d="M0,20 L100,18" />
          <path d="M0,30 L48,32" />
          <path d="M52,28 L100,30" />
          <path d="M0,68 L100,68" />
          <path d="M0,90 L100,92" />
          <path d="M35,0 L36,40" />
          <path d="M62,40 L64,100" />
          <path d="M88,40 L90,100" />
        </g>
        {/* Center line on main road */}
        <path
          d="M-2,40 Q35,42 60,52 T102,62"
          className="map-road-dash"
          fill="none"
          strokeWidth="0.5"
          strokeDasharray="1.5 1.5"
        />
      </svg>
      {children}
    </div>
  );
}
