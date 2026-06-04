import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return <div className="phone-frame">{children}</div>;
}

export function MapBackdrop({ children }: { children?: ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundColor: "#e8efe6",
        backgroundImage:
          "linear-gradient(rgba(27,138,90,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(27,138,90,0.08) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(21,101,192,0.08), transparent 50%), radial-gradient(circle at 70% 70%, rgba(27,138,90,0.12), transparent 55%)",
        backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%",
      }}
    >
      {/* fake roads */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,30 Q40,35 60,55 T100,75" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
        <path d="M20,0 Q25,40 55,60 T80,100" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
        <path d="M0,80 L100,60" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
      </svg>
      {children}
    </div>
  );
}