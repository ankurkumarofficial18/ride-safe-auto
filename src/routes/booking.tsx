import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Navigation, Banknote, Clock, BadgeCheck, Timer } from "lucide-react";
import { findAuto, type Auto } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Confirm booking — TourBuddy" }] }),
  component: BookingPage,
});

function BookingPage() {
  const navigate = useNavigate();
  const [auto, setAuto] = useState<Auto | null>(null);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const id = sessionStorage.getItem("autolink:autoId");
    setAuto((id && findAuto(id)) || null);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!auto) {
    return (
      <PhoneShell>
        <div className="flex min-h-[100dvh] items-center justify-center bg-background p-6 text-center">
          <div>
            <p className="text-muted-foreground">No auto selected.</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/home" })}>Back to home</Button>
          </div>
        </div>
      </PhoneShell>
    );
  }

  const total = auto.fare;

  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-background pb-6">
        <div className="flex items-center gap-3 px-4 pt-10">
          <button onClick={() => navigate({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Confirm booking</h1>
        </div>

        <div className="mx-4 mt-4 flex items-center justify-between rounded-2xl border border-secondary/30 bg-secondary/5 p-3">
          <div className="flex items-center gap-2 text-secondary">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-medium">Pre-booking window</p>
          </div>
          <p className="font-display text-lg font-bold text-secondary">{seconds}s</p>
        </div>

        {/* Driver card */}
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border bg-card p-3">
          <img src={auto.avatar} alt={auto.driverFirst} className="h-14 w-14 rounded-xl border bg-accent" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold">{auto.driverFirst}</p>
              <BadgeCheck className="h-4 w-4 text-secondary" />
            </div>
            <p className="font-mono text-xs tracking-wide text-muted-foreground">{auto.plate}</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-center">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-primary"><Timer className="h-3 w-3" /> ETA</div>
            <p className="font-display text-base font-bold text-primary leading-none">{auto.etaMin} min</p>
          </div>
        </div>

        {/* Locations */}
        <div className="mx-4 mt-4 rounded-2xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Pickup (auto-detected)</p>
              <p className="text-sm font-medium">Income Tax Roundabout, Patna</p>
            </div>
            <button className="text-xs font-medium text-secondary">Edit</button>
          </div>
          <div className="my-3 ml-2.5 h-4 border-l-2 border-dashed border-muted-foreground/30" />
          <div className="flex items-start gap-3">
            <Navigation className="mt-1 h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Drop</p>
              <p className="text-sm font-medium">{auto.destination}, Patna</p>
            </div>
          </div>
        </div>

        {/* Fare — fixed govt-approved */}
        <div className="mx-4 mt-4 rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold">Fixed fare</p>
              <p className="text-xs text-muted-foreground">Standard auto rate · no surge</p>
            </div>
            <p className="font-display text-2xl font-bold text-primary">₹{total}</p>
          </div>
        </div>

        {/* Payment — cash only */}
        <div className="mx-4 mt-4">
          <p className="mb-2 font-display font-semibold">Payment method</p>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-primary bg-accent p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Banknote className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Cash</p>
              <p className="text-xs text-muted-foreground">Pay the driver directly in cash</p>
            </div>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">ONLY</span>
          </div>
        </div>

        <div className="mt-auto px-4 pt-6">
          <Button
            className="h-12 w-full text-base"
            onClick={() => {
              sessionStorage.setItem("autolink:fare", String(total));
              sessionStorage.setItem("autolink:pay", "cash");
              toast.success("Ride booked!", {
                description: `${auto.driverFirst} (${auto.plate}) arriving in ${auto.etaMin} min.`,
              });
              navigate({ to: "/ride" });
            }}
          >
            <Banknote className="mr-2 h-5 w-5" />
            Confirm Booking · ₹{total} cash
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}