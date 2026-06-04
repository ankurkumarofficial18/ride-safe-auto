import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoLink — Shared autos for Patna" },
      { name: "description", content: "Find shared auto-rickshaws on fixed routes. Privacy-first, fixed fares." },
      { property: "og:title", content: "AutoLink" },
      { property: "og:description", content: "Shared auto-rickshaws made simple." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"splash" | "onboard">("splash");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("onboard"), 1800);
    return () => clearTimeout(t);
  }, []);

  const slides = [
    { icon: MapPin, title: "Find your auto", body: "See every shared auto near you in real time." },
    { icon: Users, title: "See seats & fare", body: "Know the destination, available seats and fare before boarding." },
    { icon: ShieldCheck, title: "Ride safely", body: "Driver numbers are masked. SOS is one tap away." },
  ];

  if (phase === "splash") {
    return (
      <PhoneShell>
        <div className="flex min-h-[100dvh] items-center justify-center bg-primary text-primary-foreground">
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-primary-foreground/15 backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Zm-1 1v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h8v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2a2 2 0 0 0 2-2v-3a4 4 0 0 0-1-2.65L17.5 6.34A5 5 0 0 0 13.85 5h-3.7A5 5 0 0 0 6.5 6.34L5 8.35A4 4 0 0 0 4 11v3a2 2 0 0 0 2 2H4Zm3-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm10 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">AutoLink</h1>
            <p className="mt-2 text-sm opacity-80">Shared autos. Fair fares.</p>
          </div>
        </div>
      </PhoneShell>
    );
  }

  const S = slides[slide];
  const Icon = S.icon;
  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-background px-6 pt-12 pb-8">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mb-8 grid h-32 w-32 place-items-center rounded-full bg-accent text-primary">
            <Icon className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{S.title}</h2>
          <p className="mt-3 max-w-xs text-muted-foreground">{S.body}</p>
        </div>
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {slide > 0 && (
            <Button variant="outline" className="flex-1" onClick={() => setSlide(slide - 1)}>
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={() => {
              if (slide < slides.length - 1) setSlide(slide + 1);
              else navigate({ to: "/auth" });
            }}
          >
            {slide < slides.length - 1 ? "Next" : "Get Started"}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}
