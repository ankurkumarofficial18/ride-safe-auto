import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell, TourBuddyLogo } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TourBuddy — Live shared-auto tracking" },
      { name: "description", content: "The first live shared-auto tracking system for fixed-route corridors." },
      { property: "og:title", content: "TourBuddy" },
      { property: "og:description", content: "Live shared-auto tracking for fixed-route corridors." },
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
            <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-3xl bg-primary-foreground shadow-xl">
              <TourBuddyLogo size={72} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">TourBuddy</h1>
            <p className="mx-auto mt-3 max-w-[260px] text-sm leading-snug opacity-90">
              The first live shared-auto tracking system for fixed-route corridors.
            </p>
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
