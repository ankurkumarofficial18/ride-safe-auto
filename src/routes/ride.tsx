import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell, MapBackdrop } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ShieldAlert, Star, BadgeCheck } from "lucide-react";
import { findAuto, type Auto } from "@/lib/mock-data";

export const Route = createFileRoute("/ride")({
  head: () => ({ meta: [{ title: "On ride — AutoLink" }] }),
  component: RidePage,
});

const stages = [
  { key: "arriving", label: "Auto arriving" },
  { key: "onboard", label: "You're on board" },
  { key: "approaching", label: "Arriving at destination" },
] as const;

function RidePage() {
  const navigate = useNavigate();
  const [auto, setAuto] = useState<Auto | null>(null);
  const [stage, setStage] = useState(0);
  const [meter, setMeter] = useState(0);

  useEffect(() => {
    const id = sessionStorage.getItem("autolink:autoId");
    setAuto((id && findAuto(id)) || null);
    const base = Number(sessionStorage.getItem("autolink:fare") || 35);
    setMeter(Math.round(base * 0.3));
  }, []);

  useEffect(() => {
    if (stage >= stages.length - 1) return;
    const t = setTimeout(() => setStage((s) => s + 1), 4500);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    const t = setInterval(() => setMeter((m) => m + 1), 1500);
    return () => clearInterval(t);
  }, []);

  if (!auto) return null;

  return (
    <PhoneShell>
      <div className="relative min-h-[100dvh] overflow-hidden bg-background">
        {/* Map clamped to ~500m */}
        <div className="absolute inset-0">
          <MapBackdrop>
            {/* 500m radius cap visual */}
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2">
              <div className="h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-dashed border-primary/40 bg-primary/5" />
            </div>
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-secondary shadow-lg" />
            </div>
            {/* moving auto */}
            <div
              className="absolute transition-all duration-1000"
              style={{ left: `${50 + 18 - stage * 9}%`, top: `${28 + stage * 5}%` }}
            >
              <div className="grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Z" /></svg>
              </div>
            </div>
          </MapBackdrop>
        </div>

        {/* Top status */}
        <div className="relative z-10 px-4 pt-10">
          <div className="rounded-2xl bg-card p-3 text-center shadow-md">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-display text-base font-semibold text-primary">{stages[stage].label}</p>
            <div className="mx-auto mt-2 flex gap-1">
              {stages.map((_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded ${i <= stage ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Map locked to 500 m around you for privacy
          </p>
        </div>

        {/* SOS */}
        <button
          onClick={() => alert("SOS triggered (demo).")}
          className="absolute right-4 top-[38%] z-10 grid h-14 w-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
        >
          <ShieldAlert className="h-6 w-6" />
        </button>

        {/* Driver card */}
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-card p-5 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-primary text-lg font-bold">
              {auto.driverFirst[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-semibold">{auto.driverFirst}</p>
                <BadgeCheck className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto · •••• {auto.plateLast4}
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {auto.rating}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Live fare</p>
              <p className="font-display text-xl font-bold text-primary">₹{meter}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-11"
              onClick={() => alert("Connecting via masked number (demo). Real number is never shown.")}
            >
              <Phone className="mr-2 h-4 w-4" /> Call
            </Button>
            <Button
              variant="outline"
              className="h-11"
              onClick={() => alert("In-app chat (demo).")}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat
            </Button>
          </div>

          <Button
            className="mt-3 h-12 w-full"
            disabled={stage < stages.length - 1}
            onClick={() => navigate({ to: "/payment" })}
          >
            {stage < stages.length - 1 ? "Trip in progress…" : "Complete trip"}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}