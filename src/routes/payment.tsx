import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, CreditCard, Banknote, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment — AutoLink" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const [fare, setFare] = useState(35);
  const [method, setMethod] = useState<"upi" | "card" | "cash">("upi");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFare(Number(sessionStorage.getItem("autolink:fare") || 35));
    const p = sessionStorage.getItem("autolink:pay");
    if (p === "upi" || p === "card" || p === "cash") setMethod(p);
  }, []);

  if (done) {
    return (
      <PhoneShell>
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-primary animate-in zoom-in duration-500">
            <CheckCircle2 className="h-14 w-14" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Payment successful</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ₹{fare} paid via {method.toUpperCase()}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate({ to: "/rating" })}>
            Rate your ride
          </Button>
        </div>
      </PhoneShell>
    );
  }

  const icon = method === "upi" ? Smartphone : method === "card" ? CreditCard : Banknote;
  const Icon = icon;

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
          <p className="mt-1 text-xs opacity-80">Trip · Income Tax → destination</p>
        </div>

        <div className="mx-4 mt-6">
          <p className="mb-2 text-sm font-semibold">Pay with</p>
          <div className="space-y-2">
            {(["upi", "card", "cash"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
                  method === m ? "border-primary bg-accent" : "border-border bg-card"
                }`}
              >
                {m === "upi" && <Smartphone className="h-5 w-5" />}
                {m === "card" && <CreditCard className="h-5 w-5" />}
                {m === "cash" && <Banknote className="h-5 w-5" />}
                <span className="font-medium capitalize">{m === "upi" ? "UPI" : m}</span>
                {method === m && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-4 pt-6">
          <Button className="h-12 w-full text-base" onClick={() => setDone(true)}>
            <Icon className="mr-2 h-5 w-5" />
            Pay ₹{fare}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}