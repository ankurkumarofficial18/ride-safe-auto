import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return <div className="phone-frame">{children}</div>;
}

export function MapBackdrop({ children }: { children?: ReactNode }) {
  return (
    <div
      className="map-backdrop absolute inset-0 overflow-hidden"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* parks / blocks */}
        <rect x="5" y="5" width="22" height="18" rx="2" className="fill-primary/10" />
        <rect x="70" y="10" width="25" height="20" rx="2" className="fill-secondary/10" />
        <rect x="10" y="78" width="30" height="16" rx="2" className="fill-primary/10" />
        <rect x="62" y="72" width="32" height="22" rx="2" className="fill-secondary/10" />
        {/* river */}
        <path d="M0,55 Q30,48 55,58 T100,52 L100,68 Q70,72 45,66 T0,72 Z" className="fill-secondary/15" />
        {/* main roads */}
        <path d="M0,40 Q35,42 60,52 T100,62" className="stroke-foreground/30" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M25,0 Q28,40 55,60 T78,100" className="stroke-foreground/25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M0,82 L100,70" className="stroke-foreground/20" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50,0 L48,100" className="stroke-foreground/15" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
      </svg>
      {children}
    </div>
  );
}