import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Phone } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — TourBuddy" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");

  const phoneValid = /^\d{10}$/.test(phone);

  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-background px-6 pt-10 pb-8">
        <button
          onClick={() => (step === "phone" ? navigate({ to: "/" }) : setStep(step === "name" ? "otp" : "phone"))}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {step === "phone" && (
          <div className="mt-8 flex-1">
            <h1 className="text-2xl font-bold">Enter your mobile</h1>
            <p className="mt-1 text-sm text-muted-foreground">We'll send you a 6-digit code by SMS.</p>
            <div className="mt-8 flex items-center gap-2 rounded-xl border bg-card p-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">+91</span>
              <Input
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
              />
            </div>
            <Button className="mt-8 w-full" disabled={!phoneValid} onClick={() => setStep("otp")}>
              Send OTP
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="mt-8 flex-1">
            <h1 className="text-2xl font-bold">Enter the code</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sent to +91 {phone}</p>
            <div className="mt-8 grid grid-cols-6 gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const next = [...otp];
                    next[i] = v;
                    setOtp(next);
                    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
                  }}
                  className="h-14 rounded-xl border bg-card text-center text-xl font-semibold focus:border-primary focus:outline-none"
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Demo: any 6 digits work.</p>
            <Button
              className="mt-8 w-full"
              disabled={otp.join("").length !== 6}
              onClick={() => {
                const saved = typeof window !== "undefined" ? localStorage.getItem("autolink:name") : null;
                if (saved) navigate({ to: "/home" });
                else setStep("name");
              }}
            >
              Verify
            </Button>
          </div>
        )}

        {step === "name" && (
          <div className="mt-8 flex-1">
            <h1 className="text-2xl font-bold">What's your name?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Drivers will only see your first name.</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-8 h-14 text-lg"
            />
            <Button
              className="mt-8 w-full"
              disabled={name.trim().length < 2}
              onClick={() => {
                localStorage.setItem("autolink:name", name.trim());
                navigate({ to: "/home" });
              }}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}