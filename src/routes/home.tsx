import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell, MapBackdrop } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Bell, Search, Star, BadgeCheck, ShieldAlert, User, MapPin } from "lucide-react";
import { mockAutos, mockStands } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — AutoLink" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("there");
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2">
              <div className="absolute -inset-6 animate-ping rounded-full bg-secondary/30" />
              <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-secondary shadow-lg" />
              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-medium shadow">You</span>
            </div>
            {/* stands */}
            {mockStands.map((s) => (
              <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                <div className="flex flex-col items-center">
                  <div className="grid h-7 w-7 -translate-y-2 place-items-center rounded-full bg-card text-primary ring-2 ring-primary/40 shadow">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="rounded bg-card/90 px-1.5 py-0.5 text-[9px] font-medium text-foreground shadow">{s.name}</span>
                </div>
              </div>
            ))}
            {/* nearby autos on map */}
            {mockAutos.map((a) => {
              const sel = selectedId === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
                  style={{ left: `${a.x}%`, top: `${a.y}%`, zIndex: sel ? 20 : 5 }}
                >
                  {sel && <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/40" />}
                  <div className={`relative grid place-items-center rounded-full shadow-lg transition-all ${sel ? "h-11 w-11 bg-primary text-primary-foreground ring-4 ring-primary/30" : "h-8 w-8 bg-card text-primary ring-2 ring-primary/50"}`}>
                    <svg viewBox="0 0 24 24" className={`fill-current ${sel ? "h-6 w-6" : "h-5 w-5"}`}><path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Z" /></svg>
                  </div>
                  {sel && (
                    <span className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background shadow">
                      {a.driverFirst} · {a.etaMin} min
                    </span>
                  )}
                </button>
              );
            })}
          </MapBackdrop>
        </div>

        {/* Top bar */}
        <div className="relative z-10 px-4 pt-10">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-card/95 px-3 py-1.5 shadow-sm backdrop-blur">
              <p className="text-[10px] text-muted-foreground">Good evening</p>
              <p className="font-display text-base font-semibold text-foreground">Hi, {name} 👋</p>
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

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card p-3 shadow-md">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* SOS FAB */}
        <button
          onClick={() => toast.error("SOS triggered", { description: "Emergency contacts would be notified." })}
          className="absolute right-4 top-[40%] z-10 grid h-14 w-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
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
          <div className="mt-2 max-h-[42dvh] space-y-2 overflow-y-auto px-3 pb-2">
            {mockAutos.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full cursor-pointer rounded-2xl border bg-background p-3 text-left transition-all ${selectedId === a.id ? "border-primary ring-2 ring-primary/30" : "hover:bg-accent"}`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={a.avatar}
                    alt={a.driverFirst}
                    className="h-12 w-12 shrink-0 rounded-xl border bg-accent object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">{a.driverFirst}</p>
                      {a.verified && <BadgeCheck className="h-4 w-4 text-secondary" />}
                      <span className="ml-auto flex items-center gap-0.5 text-xs">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {a.rating}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] tracking-wide text-muted-foreground">{a.plate}</p>
                    <p className="truncate text-sm">→ <span className="font-medium">{a.destination}</span></p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">ETA {a.etaMin} min</span>
                      <span className="text-muted-foreground">{a.seatsAvailable} seats free</span>
                      <span className="text-muted-foreground">₹{a.fare} fixed</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionStorage.setItem("autolink:autoId", a.id);
                      navigate({ to: "/booking" });
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
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