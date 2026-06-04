import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Navigation, Wallet, Smartphone, Banknote, CreditCard, Clock } from "lucide-react";
import { findAuto, type Auto } from "@/lib/mock-data";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Confirm booking — AutoLink" }] }),
  component: BookingPage,
});

type PayMethod = "upi" | "card" | "cash";

function BookingPage() {
  const navigate = useNavigate();
  const [auto, setAuto] = useState<Auto | null>(null);
  const [pay, setPay] = useState<PayMethod>("upi");
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

  const baseFare = 15;
  const km = 3.2;
  const perKm = 8;
  const total = baseFare + Math.round(km * perKm);

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

        {/* Fare */}
        <div className="mx-4 mt-4 rounded-2xl border bg-card p-4">
          <p className="font-display font-semibold">Fare breakdown</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <Row label="Base fare" value={`₹${baseFare}`} />
            <Row label={`Distance (${km} km × ₹${perKm}/km)`} value={`₹${Math.round(km * perKm)}`} />
            <div className="my-2 border-t" />
            <Row label="Total (govt. approved)" value={`₹${total}`} bold />
          </div>
        </div>

        {/* Payment */}
        <div className="mx-4 mt-4">
          <p className="mb-2 font-display font-semibold">Payment method</p>
          <div className="grid grid-cols-3 gap-2">
            <PayBtn icon={Smartphone} label="UPI" active={pay === "upi"} onClick={() => setPay("upi")} />
            <PayBtn icon={CreditCard} label="Card" active={pay === "card"} onClick={() => setPay("card")} />
            <PayBtn icon={Banknote} label="Cash" active={pay === "cash"} onClick={() => setPay("cash")} />
          </div>
        </div>

        <div className="mt-auto px-4 pt-6">
          <Button
            className="h-12 w-full text-base"
            onClick={() => {
              sessionStorage.setItem("autolink:fare", String(total));
              sessionStorage.setItem("autolink:pay", pay);
              navigate({ to: "/ride" });
            }}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Confirm Booking · ₹{total}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "text-foreground" : ""}>{value}</span>
    </div>
  );
}

function PayBtn({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-colors ${
        active ? "border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}