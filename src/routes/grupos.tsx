import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Clock, Eye, Flame } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos en vivo — NEIBA" },
      { name: "description", content: "Sumate a un grupo y ahorrá hasta 45%." },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  const groups = MOCK_PRODUCTS.slice(0, 14);
  return (
    <MobileShell>
      <header className="sticky top-0 z-30 px-5 pb-3 pt-4 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.85)" }}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">NEIBA · en vivo</p>
        <h1 className="font-display text-3xl">Grupos activos</h1>
        <p className="mt-1 text-xs text-muted-foreground">Sumate y ahorrá hasta 45% comprando con otros.</p>
      </header>

      <main className="px-5 pt-4 pb-8 space-y-3">
        {groups.map((p) => {
          const pct = Math.round((p.groupJoined / p.groupTarget) * 100);
          const missing = p.groupTarget - p.groupJoined;
          const almost = pct >= 70;
          return (
            <Link key={p.id} to="/group/$slug" params={{ slug: p.slug }} className="block">
              <div className="relative flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3">
                {almost && (
                  <span className="absolute right-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black uppercase text-white animate-pulse">
                    Casi completo
                  </span>
                )}
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-3xl" style={{ background: p.gradient }}>
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-base font-black text-primary">{formatARS(p.price.group)}</span>
                    <span className="text-[10px] text-muted-foreground line-through">{formatARS(p.price.individual)}</span>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      <Flame className="h-2.5 w-2.5" /> Precio en grupo
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-lg font-black leading-none">
                        <span className="text-primary">{p.groupJoined}</span>
                        <span className="text-muted-foreground">/{p.groupTarget}</span>
                      </p>
                      <span className="text-[10px] font-bold text-rose-500">faltan {missing}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-2.5 w-2.5" />
                        {180 + p.groupJoined * 27} mirando
                      </span>
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <Clock className="h-2.5 w-2.5" /> cierra {p.groupTimeLeft}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        <div className="mt-2 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
          <Users className="mx-auto mb-1 h-4 w-4 text-primary" />
          ¿Querés armar tu propio grupo? Entrá a un producto y tocá "Comprar en grupo".
        </div>
      </main>
    </MobileShell>
  );
}
