import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { mockHistory, type RideHistoryItem } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Ride history — TourBuddy" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<RideHistoryItem | null>(null);

  return (
    <PhoneShell>
      <div className="min-h-[100dvh] bg-background pb-6">
        <div className="flex items-center gap-3 px-4 pt-10">
          <button onClick={() => navigate({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Ride history</h1>
        </div>

        <div className="mt-4 space-y-2 px-4">
          {mockHistory.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpen(r)}
              className="w-full rounded-2xl border bg-card p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{r.date}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    r.status === "completed" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-medium">{r.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{r.to}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Driver · {r.driver}</span>
                <span className="font-display text-base font-bold text-primary">₹{r.fare}</span>
              </div>
            </button>
          ))}
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setOpen(null)}>
            <div
              className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              <h2 className="font-display text-xl font-bold">Receipt</h2>
              <p className="text-xs text-muted-foreground">{open.date}</p>

              <div className="mt-4 space-y-2 text-sm">
                <Row label="From" value={open.from} />
                <Row label="To" value={open.to} />
                <Row label="Driver" value={open.driver} />
                <Row label="Status" value={open.status} />
                <div className="my-2 border-t" />
                <Row label="Total" value={`₹${open.fare}`} bold />
              </div>

              <Button variant="outline" className="mt-6 w-full" onClick={() => alert("PDF download (demo).")}>
                <Download className="mr-2 h-4 w-4" /> Download receipt
              </Button>
              <Button className="mt-2 w-full" onClick={() => setOpen(null)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`capitalize ${bold ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}