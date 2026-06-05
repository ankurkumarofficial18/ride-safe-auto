import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Banknote, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment — TourBuddy" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const [fare, setFare] = useState(35);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFare(Number(sessionStorage.getItem("autolink:fare") || 35));
  }, []);

  if (done) {
    return (
      <PhoneShell>
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-primary animate-in zoom-in duration-500">
            <CheckCircle2 className="h-14 w-14" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Cash paid</h1>
          <p className="mt-1 text-sm text-muted-foreground">₹{fare} handed to the driver</p>
          <Button className="mt-8 w-full" onClick={() => navigate({ to: "/rating" })}>
            Rate your ride
          </Button>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-background pb-6">
        <div className="flex items-center gap-3 px-4 pt-10">
          <button onClick={() => navigate({ to: "/ride" })} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Payment</h1>
        </div>

        <div className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-lg">
          <p className="text-xs opacity-80">Total fare</p>
          <p className="font-display text-5xl font-bold">₹{fare}</p>
          <p className="mt-1 text-xs opacity-80">Trip · Income Tax → destination · Cash only</p>
        </div>

        <div className="mx-4 mt-6 rounded-2xl border-2 border-primary bg-accent p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Banknote className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Pay in cash</p>
              <p className="text-xs text-muted-foreground">Hand exact change to the driver if possible.</p>
            </div>
          </div>
        </div>

        <div className="mt-auto px-4 pt-6">
          <Button className="h-12 w-full text-base" onClick={() => setDone(true)}>
            <Banknote className="mr-2 h-5 w-5" />
            I paid ₹{fare} in cash
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}