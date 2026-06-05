import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { findAuto } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/rating")({
  head: () => ({ meta: [{ title: "Rate driver — TourBuddy" }] }),
  component: RatingPage,
});

function RatingPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [driver, setDriver] = useState<{ name: string; avatar?: string; plate?: string }>({ name: "your driver" });
  useEffect(() => {
    const id = sessionStorage.getItem("autolink:autoId");
    const a = id ? findAuto(id) : null;
    if (a) setDriver({ name: a.driverFirst, avatar: a.avatar, plate: a.plate });
  }, []);

  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-background px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Rate your driver</h1>
          <p className="mt-1 text-sm text-muted-foreground">How was your ride with {driver.name}?</p>
          {driver.avatar && (
            <div className="mt-4 flex flex-col items-center">
              <img src={driver.avatar} alt={driver.name} className="h-20 w-20 rounded-full border-2 border-primary/30 bg-accent" />
              {driver.plate && <p className="mt-1 font-mono text-[11px] text-muted-foreground">{driver.plate}</p>}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className="p-1">
              <Star
                className={`h-10 w-10 transition-transform ${
                  n <= rating ? "scale-110 fill-amber-500 text-amber-500" : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {["", "Bad", "Okay", "Good", "Great", "Excellent"][rating]}
          </p>
        )}

        <div className="mt-8">
          <p className="mb-2 text-sm font-medium">Add a note (optional)</p>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What stood out?"
            className="min-h-24"
          />
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="h-12 w-full"
            disabled={rating === 0}
            onClick={() => { toast.success("Thanks for the feedback!"); navigate({ to: "/home" }); }}
          >
            Submit
          </Button>
          <button onClick={() => navigate({ to: "/home" })} className="mt-2 block w-full text-center text-sm text-muted-foreground">
            Skip
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}