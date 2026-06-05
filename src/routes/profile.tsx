import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, LogOut, Languages, Moon, MapPin, Camera } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — TourBuddy" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [dark, setDark] = useState(false);
  const [contacts, setContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("autolink:name") || "");
    setLang((localStorage.getItem("autolink:lang") as "en" | "hi") || "en");
    setDark(localStorage.getItem("autolink:dark") === "1");
    setContacts(JSON.parse(localStorage.getItem("autolink:contacts") || "[]"));
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    localStorage.setItem("autolink:dark", v ? "1" : "0");
    document.documentElement.classList.toggle("dark", v);
  };

  const addContact = () => {
    if (!/^\d{10}$/.test(newContact) || contacts.length >= 3) return;
    const next = [...contacts, newContact];
    setContacts(next);
    localStorage.setItem("autolink:contacts", JSON.stringify(next));
    setNewContact("");
  };

  const removeContact = (p: string) => {
    const next = contacts.filter((c) => c !== p);
    setContacts(next);
    localStorage.setItem("autolink:contacts", JSON.stringify(next));
  };

  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);

  return (
    <PhoneShell>
      <div className="min-h-[100dvh] bg-background pb-10">
        <div className="flex items-center gap-3 px-4 pt-10">
          <button onClick={() => navigate({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">{t("Profile", "प्रोफ़ाइल")}</h1>
        </div>

        {/* Avatar */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-accent text-3xl font-bold text-primary">
              {(name || "U")[0].toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              localStorage.setItem("autolink:name", e.target.value);
            }}
            placeholder={t("Your name", "आपका नाम")}
            className="mt-4 max-w-xs text-center"
          />
        </div>

        {/* Emergency contacts */}
        <section className="mx-4 mt-6 rounded-2xl border bg-card p-4">
          <h2 className="font-display font-semibold">{t("Emergency contacts", "आपातकालीन संपर्क")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Notified on SOS. Up to 3.", "SOS पर सूचना। अधिकतम 3।")}</p>

          <div className="mt-3 space-y-2">
            {contacts.map((c) => (
              <div key={c} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
                <span>+91 {c}</span>
                <button onClick={() => removeContact(c)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {contacts.length < 3 && (
              <div className="flex gap-2">
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit number"
                />
                <Button size="icon" onClick={addContact}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Settings */}
        <section className="mx-4 mt-4 divide-y rounded-2xl border bg-card">
          <Setting
            icon={<Languages className="h-5 w-5" />}
            label={t("Language", "भाषा")}
            right={
              <div className="flex rounded-full bg-muted p-0.5 text-xs font-medium">
                {(["en", "hi"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      localStorage.setItem("autolink:lang", l);
                    }}
                    className={`rounded-full px-3 py-1 ${lang === l ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    {l === "en" ? "EN" : "हिं"}
                  </button>
                ))}
              </div>
            }
          />
          <Setting
            icon={<Moon className="h-5 w-5" />}
            label={t("Dark mode", "डार्क मोड")}
            right={<Switch checked={dark} onCheckedChange={toggleDark} />}
          />
          <Setting
            icon={<MapPin className="h-5 w-5" />}
            label={t("Location permission", "स्थान अनुमति")}
            right={<span className="text-xs text-primary">{t("Allowed", "अनुमत")}</span>}
          />
        </section>

        <div className="mx-4 mt-6">
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              localStorage.removeItem("autolink:name");
              navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> {t("Logout", "लॉग आउट")}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}

function Setting({ icon, label, right }: { icon: React.ReactNode; label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {right}
    </div>
  );
}