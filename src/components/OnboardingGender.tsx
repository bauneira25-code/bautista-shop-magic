import { useEffect, useState } from "react";
import { useUserPrefs, type Gender } from "@/stores/userPrefs";
import { Sparkles } from "lucide-react";

export function OnboardingGender() {
  const { onboarded, setGender } = useUserPrefs();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onboarded) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [onboarded]);

  if (!open || onboarded) return null;

  const pick = (g: Gender) => {
    setGender(g);
    setOpen(false);
  };

  const opts: { id: Gender; label: string; emoji: string }[] = [
    { id: "mujer", label: "Mujer", emoji: "👩" },
    { id: "hombre", label: "Hombre", emoji: "👨" },
    { id: "no-id", label: "Prefiero no decirlo", emoji: "✨" },
  ];

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[400px] rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> Personalizá tu feed
        </div>
        <h2 className="font-display text-2xl">Bienvenida a NEIBA 👋</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ¿Sos…? Lo usamos para mostrarte productos que te van a gustar más.
        </p>
        <div className="mt-5 space-y-2">
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => pick(o.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
            >
              <span className="text-2xl">{o.emoji}</span>
              <span className="font-semibold">{o.label}</span>
              <span className="ml-auto text-muted-foreground">→</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Podés cambiarlo después desde tu perfil
        </p>
      </div>
    </div>
  );
}
