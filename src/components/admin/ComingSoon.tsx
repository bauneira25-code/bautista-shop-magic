import { type LucideIcon, Sparkles } from "lucide-react";

export function ComingSoon({
  title, description, icon: Icon, features,
}: { title: string; description: string; icon: LucideIcon; features: string[] }) {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-500/10 text-orange-300">
          <Icon className="h-8 w-8" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-300">
          <Sparkles className="h-3 w-3" /> Fase 2
        </span>
        <h1 className="mt-3 font-display text-3xl text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/60">{description}</p>
        <div className="mt-8 grid gap-2 text-left">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
