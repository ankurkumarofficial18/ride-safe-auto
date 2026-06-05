import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneShell, MapBackdrop } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ShieldAlert, Star, BadgeCheck, Timer, ShieldCheck, X, Mic, MicOff, Send } from "lucide-react";
import { findAuto, type Auto } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/ride")({
  head: () => ({ meta: [{ title: "On ride — AutoLink" }] }),
  component: RidePage,
});

const stages = [
  { key: "arriving", label: "Auto arriving" },
  { key: "onboard", label: "You're on board" },
  { key: "approaching", label: "Arriving at destination" },
] as const;

type Msg = { from: "me" | "driver"; text: string; t: string };

function RidePage() {
  const navigate = useNavigate();
  const [auto, setAuto] = useState<Auto | null>(null);
  const [stage, setStage] = useState(0);
  const [eta, setEta] = useState(5);
  const [fare, setFare] = useState(0);
  const [callOpen, setCallOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "driver", text: "Namaste! I'm on my way 🛺", t: "now" },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("autolink:autoId");
    const a = (id && findAuto(id)) || null;
    setAuto(a);
    setFare(Number(sessionStorage.getItem("autolink:fare") || a?.fare || 35));
    setEta(a?.etaMin ?? 5);
  }, []);

  useEffect(() => {
    if (stage >= stages.length - 1) return;
    const t = setTimeout(() => setStage((s) => s + 1), 4500);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    const t = setInterval(() => setEta((m) => (m > 1 ? m - 1 : 1)), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!callOpen) {
      setCallSeconds(0);
      return;
    }
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "me", text, t: "now" }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "driver", text: "Ok, 2 min 👍", t: "now" }]);
    }, 1200);
  };

  if (!auto) return null;

  const mm = String(Math.floor(callSeconds / 60)).padStart(2, "0");
  const ss = String(callSeconds % 60).padStart(2, "0");

  return (
    <PhoneShell>
      <div className="relative min-h-[100dvh] overflow-hidden bg-background">
        {/* Map clamped to ~500m */}
        <div className="absolute inset-0">
          <MapBackdrop>
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2">
              <div className="h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/40 bg-primary/5" />
              <div className="absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-primary/5" />
              <span className="absolute left-1/2 top-32 -translate-x-1/2 rounded bg-card/90 px-2 py-0.5 text-[10px] font-medium text-foreground shadow">500 m radius</span>
            </div>
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute -inset-3 animate-ping rounded-full bg-secondary/40" />
              <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-secondary shadow-lg" />
            </div>
            {/* route line */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={`M${50 + 18 - stage * 9},${28 + stage * 5} Q50,32 50,34`}
                className="stroke-primary"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="3 2"
              />
            </svg>
            {/* moving auto */}
            <div
              className="absolute transition-all duration-1000"
              style={{ left: `${50 + 18 - stage * 9}%`, top: `${28 + stage * 5}%` }}
            >
              <div className="grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M5 17h14l-1.5-6.5a3 3 0 0 0-2.93-2.34H9.43A3 3 0 0 0 6.5 10.5L5 17Z" /></svg>
              </div>
              <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background shadow">
                {auto.plate}
              </span>
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
          onClick={() => toast.error("SOS triggered", { description: "Emergency contacts notified." })}
          className="absolute right-4 top-[38%] z-10 grid h-14 w-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
        >
          <ShieldAlert className="h-6 w-6" />
        </button>

        {/* Driver card */}
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-card p-5 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-3">
            <img src={auto.avatar} alt={auto.driverFirst} className="h-14 w-14 rounded-full border-2 border-primary/30 bg-accent object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-semibold">{auto.driverFirst}</p>
                <BadgeCheck className="h-4 w-4 text-secondary" />
              </div>
              <p className="font-mono text-xs tracking-wide text-foreground">{auto.plate}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {auto.rating}
                <span className="ml-2 text-muted-foreground">·  ₹{fare} fixed</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                <Timer className="h-3 w-3" /> ETA
              </div>
              <p className="font-display text-xl font-bold text-primary leading-none">{eta} min</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-11" onClick={() => setCallOpen(true)}>
              <Phone className="mr-2 h-4 w-4" /> Call
            </Button>
            <Button variant="outline" className="h-11" onClick={() => setChatOpen(true)}>
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

        {/* Masked Call Modal */}
        {callOpen && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-between bg-gradient-to-b from-primary to-primary/80 px-6 pb-10 pt-20 text-primary-foreground">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur">
                <ShieldCheck className="h-3 w-3" /> Masked call · driver number hidden
              </div>
              <img src={auto.avatar} alt={auto.driverFirst} className="mt-8 h-32 w-32 rounded-full border-4 border-white/30 bg-white/10 object-cover" />
              <h2 className="mt-5 font-display text-2xl font-bold">{auto.driverFirst}</h2>
              <p className="font-mono text-xs opacity-80">{auto.plate}</p>
              <p className="mt-4 text-sm opacity-80">+91 80•••• ••34</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">{mm}:{ss}</p>
              <p className="mt-1 text-[11px] opacity-70">Routed through TourBuddy secure relay</p>
            </div>
            <div className="flex w-full items-center justify-around">
              <button
                onClick={() => setMuted((m) => !m)}
                className="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-primary-foreground backdrop-blur"
              >
                {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setCallOpen(false)}
                className="grid h-16 w-16 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xl"
                aria-label="Hang up"
              >
                <Phone className="h-7 w-7 rotate-[135deg]" />
              </button>
              <button
                onClick={() => {
                  setCallOpen(false);
                  setChatOpen(true);
                }}
                className="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-primary-foreground backdrop-blur"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* In-app Chat Sheet */}
        {chatOpen && (
          <div className="absolute inset-0 z-30 flex flex-col bg-background">
            <div className="flex items-center gap-3 border-b bg-card px-4 pt-10 pb-3 shadow-sm">
              <button onClick={() => setChatOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
              <img src={auto.avatar} alt={auto.driverFirst} className="h-10 w-10 rounded-full border bg-accent" />
              <div className="flex-1">
                <p className="font-semibold leading-tight">{auto.driverFirst}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{auto.plate}</p>
              </div>
              <button onClick={() => { setChatOpen(false); setCallOpen(true); }} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 bg-secondary/10 px-3 py-1.5 text-[10px] font-medium text-secondary">
              <ShieldCheck className="h-3 w-3" /> Messages routed privately · phone numbers hidden
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card border"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t bg-card p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["I'm at the gate", "Coming in 1 min", "Please wait"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); }}
                    className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                <button onClick={sendMessage} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50" disabled={!chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}