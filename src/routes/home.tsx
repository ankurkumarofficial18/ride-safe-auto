import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell, MapBackdrop } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Bell, Search, Star, BadgeCheck, ShieldAlert, User } from "lucide-react";
import { mockAutos, mockStands } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — AutoLink" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("there");
  useEffect(() => {
    const n = localStorage.getItem("autolink:name");
    if (n) setName(n.split(" ")[0]);
  }, []);

  return (
    <PhoneShell>
      <div className="relative min-h-[100dvh] overflow-hidden bg-background">
        {/* Map */}
        <div className="absolute inset-0">
          <MapBackdrop>
            {/* user */}
            <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
              <div className="absolute -inset-6 animate-ping rounded-full bg-secondary/30" />
              <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-secondary shadow-lg" />
            </div>
            {/* stands */}
            {mockStands.map((s) => (
              <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                <div className="flex flex-col items-center">
                  <div className="grid h-8 w-8 -translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Z" /></svg>
                  </div>
                  <span className="rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-medium shadow">{s.name}</span>
                </div>
              </div>
            ))}
          </MapBackdrop>
        </div>

        {/* Top bar */}
        <div className="relative z-10 px-4 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Good evening</p>
              <p className="font-display text-lg font-semibold">Hi, {name} 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow">
                <Bell className="h-5 w-5" />
              </button>
              <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-card p-3 shadow-md">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* SOS FAB */}
        <button
          onClick={() => alert("SOS triggered (demo). Emergency contacts would be notified.")}
          className="absolute right-4 top-[42%] z-10 grid h-14 w-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
          aria-label="SOS"
        >
          <ShieldAlert className="h-6 w-6" />
          <span className="absolute -bottom-5 text-[10px] font-bold text-destructive">SOS</span>
        </button>

        {/* Bottom sheet */}
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-card pb-6 pt-3 shadow-2xl">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display text-base font-semibold">Nearby autos</h2>
            <span className="text-xs text-muted-foreground">{mockAutos.length} available</span>
          </div>
          <div className="mt-2 max-h-[44dvh] space-y-2 overflow-y-auto px-3 pb-2">
            {mockAutos.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate({ to: "/booking", search: { autoId: a.id } as any })}
                className="w-full rounded-2xl border bg-background p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">{a.driverFirst}</p>
                      {a.verified && <BadgeCheck className="h-4 w-4 text-secondary" />}
                      <span className="ml-auto flex items-center gap-0.5 text-xs">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {a.rating}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">→ {a.destination}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <span className="font-medium text-primary">₹{a.fareLow}–₹{a.fareHigh}</span>
                      <span className="text-muted-foreground">{a.seatsAvailable} seats free</span>
                      <span className="text-muted-foreground">{a.etaMin} min away</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button size="sm" className="h-8">Book Now</Button>
                </div>
              </button>
            ))}
            <Link
              to="/history"
              className="block rounded-xl border border-dashed py-2.5 text-center text-xs text-muted-foreground"
            >
              View ride history →
            </Link>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}