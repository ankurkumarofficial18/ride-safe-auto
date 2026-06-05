import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { GoogleMapView } from "@/components/GoogleMap";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  Star,
  BadgeCheck,
  ShieldAlert,
  User,
  ChevronUp,
  ChevronDown,
  X,
  LocateFixed,
  Phone,
  MapPin,
} from "lucide-react";
import { mockAutos, mockStands, DEFAULT_CENTER, haversineKm, type Stand } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — TourBuddy" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("there");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [standInfo, setStandInfo] = useState<{ stand: Stand; distanceKm: number | null } | null>(null);

  useEffect(() => {
    const n = localStorage.getItem("autolink:name");
    if (n) setName(n.split(" ")[0]);
  }, []);

  // Live location
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setUserLoc(DEFAULT_CENTER);
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        toast("Using demo location", { description: "Enable location for live tracking." });
        setUserLoc(DEFAULT_CENTER);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const selected = mockAutos.find((a) => a.id === selectedId) ?? null;

  const handleSelectStand = (stand: Stand, distanceKm: number | null) => {
    const km = distanceKm ?? (userLoc ? haversineKm(userLoc, stand) : null);
    setStandInfo({ stand, distanceKm: km });
  };

  return (
    <PhoneShell>
      <div className="relative min-h-[100dvh] overflow-hidden bg-background">
        {/* Google Map */}
        <GoogleMapView
          autos={mockAutos}
          stands={mockStands}
          selectedAutoId={selectedId}
          onSelectAuto={(id) => {
            setSelectedId(id);
            setSheetOpen(false);
            setStandInfo(null);
          }}
          onSelectStand={handleSelectStand}
          userLocation={userLoc}
        />

        {/* Top bar */}
        <div className="pointer-events-none relative z-10 px-4 pt-10">
          <div className="flex items-center justify-between">
            <div className="pointer-events-auto rounded-2xl bg-card/95 px-3 py-1.5 shadow-md backdrop-blur">
              <p className="text-[10px] text-muted-foreground">Good day</p>
              <p className="font-display text-base font-semibold text-foreground">Hi, {name} 👋</p>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-md">
                <Bell className="h-5 w-5" />
              </button>
              <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-md">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="pointer-events-auto mt-3 flex items-center gap-2 rounded-2xl bg-card p-3 shadow-md">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Recenter / SOS */}
        <button
          onClick={() => {
            if (userLoc) toast("Centered on your location");
          }}
          className="absolute right-3 top-[42%] z-10 grid h-10 w-10 place-items-center rounded-xl bg-card shadow-lg"
          aria-label="Recenter"
        >
          <LocateFixed className="h-4 w-4 text-secondary" />
        </button>
        <button
          onClick={() => toast.error("SOS triggered", { description: "Emergency contacts would be notified." })}
          className="absolute right-3 top-[52%] z-10 grid h-12 w-12 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
          aria-label="SOS"
        >
          <ShieldAlert className="h-5 w-5" />
        </button>

        {/* Stand info popup */}
        {standInfo && (
          <div
            className="absolute inset-x-3 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200"
            style={{ bottom: sheetOpen ? "calc(50dvh + 8px)" : "84px" }}
          >
            <div className="relative rounded-2xl border bg-card p-3 shadow-2xl">
              <button
                onClick={() => setStandInfo(null)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-accent"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-3 pr-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-500/15 text-amber-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{standInfo.stand.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {standInfo.distanceKm != null
                      ? `${standInfo.distanceKm.toFixed(2)} km from your location`
                      : "Enable location to see distance"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected auto popup */}
        {selected && (
          <div
            className="absolute inset-x-3 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200"
            style={{ bottom: sheetOpen ? "calc(50dvh + 8px)" : "84px" }}
          >
            <div className="relative rounded-2xl border bg-card p-3 shadow-2xl">
              <button
                onClick={() => setSelectedId(null)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-accent"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <img
                  src={selected.avatar}
                  alt={selected.driverFirst}
                  className="h-14 w-14 shrink-0 rounded-xl border bg-accent object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold">{selected.driverFirst}</p>
                    {selected.verified && <BadgeCheck className="h-4 w-4 text-secondary" />}
                    <span className="ml-auto flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {selected.rating}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground">{selected.plate}</p>
                  <p className="truncate text-sm">
                    → <span className="font-medium">{selected.destination}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      ETA {selected.etaMin} min
                    </span>
                    <span className="text-muted-foreground">{selected.seatsAvailable} seats free</span>
                    <span className="font-semibold text-foreground">₹{selected.fare}</span>
                    {userLoc && (
                      <span className="text-muted-foreground">
                        {haversineKm(userLoc, selected).toFixed(2)} km away
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast("Calling via masked number…", { description: "Driver's real number is hidden." })}
                >
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  Masked call
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    sessionStorage.setItem("autolink:autoId", selected.id);
                    navigate({ to: "/booking" });
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-card shadow-2xl transition-[max-height] duration-300 ${
            sheetOpen ? "max-h-[55dvh]" : "max-h-[64px]"
          } overflow-hidden`}
        >
          <button
            onClick={() => setSheetOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 pt-3 pb-2"
          >
            <div className="flex flex-col items-start">
              <div className="mb-1 h-1.5 w-12 self-center rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-semibold">Nearby autos</h2>
                <span className="text-xs text-muted-foreground">{mockAutos.length} available</span>
              </div>
            </div>
            {sheetOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div className="max-h-[calc(55dvh-56px)] space-y-2 overflow-y-auto px-3 pb-5">
            {mockAutos.map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  setSelectedId(a.id);
                  setStandInfo(null);
                  setSheetOpen(false);
                }}
                className={`w-full cursor-pointer rounded-2xl border bg-background p-3 text-left transition-all ${
                  selectedId === a.id ? "border-primary ring-2 ring-primary/30" : "hover:bg-accent"
                }`}
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
                    <p className="truncate text-sm">
                      → <span className="font-medium">{a.destination}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                        ETA {a.etaMin} min
                      </span>
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
