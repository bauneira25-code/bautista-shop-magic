import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Clock, Activity, Sparkles, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { getMachine, LIVE_MACHINES } from "@/lib/liveMachines";
import { MachineFeed, LiveBadge } from "@/components/live/MachineFeed";
import { useMachineViewers, formatViewers } from "@/lib/liveViewers";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/en-vivo/$machineId")({
  component: MachineLivePage,
  notFoundComponent: () => (
    <MobileShell>
      <div className="px-5 pt-10 text-center">
        <p className="text-sm text-muted-foreground">Máquina no encontrada.</p>
        <Link to="/en-vivo" className="mt-3 inline-block text-sm font-semibold text-primary">← Volver</Link>
      </div>
    </MobileShell>
  ),
});

function MachineLivePage() {
  const { machineId } = Route.useParams();
  const machine = getMachine(machineId);
  if (!machine) throw notFound();

  const viewers = useMachineViewers(machine.id, 3500);
  const [activityIdx, setActivityIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setActivityIdx((i) => (i + 1) % machine.activity.length), 4500);
    const b = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, [machine.activity.length]);

  const others = LIVE_MACHINES.filter((m) => m.id !== machine.id);
  const remaining = Math.max(30 - (elapsed % 180), 5);

  // Productos personalizables que matchean esta máquina
  const matched = useMemo(
    () =>
      MOCK_PRODUCTS.filter((p) => {
        const t = (p.title + " " + p.slug).toLowerCase();
        return p.customizable !== false && machine.matches.some((k) => t.includes(k));
      }).slice(0, 24),
    [machine.matches],
  );
  const reel = matched.length > 0 ? [...matched, ...matched] : [];

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <Link to="/en-vivo" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <LiveBadge />
        <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
          <Eye className="h-3.5 w-3.5" /> {formatViewers(viewers)}
        </span>
      </header>

      <div className="px-5">
        <h1 className="mt-1 font-display text-2xl leading-tight">{machine.emoji} {machine.name}</h1>
        <p className="text-xs text-muted-foreground">{machine.tagline}</p>
      </div>

      {/* Cámara (izq) + reel de personalizables (der) */}
      <div className="px-5 pt-3">
        <div className="grid grid-cols-5 gap-2.5">
          <div className="col-span-3">
            <MachineFeed machine={machine} big />
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-wider text-primary">Personalizá ahora</p>
            </div>
            <div className="relative h-[260px] overflow-hidden rounded-2xl border border-border bg-card/40">
              <div className="absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-background to-transparent" />
              <div className="flex flex-col gap-2 p-2 animate-[scroll-y_24s_linear_infinite]">
                {reel.map((p, i) => (
                  <Link
                    key={`${p.id}-${i}`}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    search={{ customize: 1 } as never}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 hover:border-primary"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl" style={{ background: p.gradient }}>
                      {p.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[10px] font-semibold leading-tight">{p.title}</p>
                      <p className="text-[10px] font-black text-primary leading-none">{formatARS(p.price.individual)}</p>
                    </div>
                    <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad en vivo */}
      <section className="px-5 pt-4">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Activity className="h-3 w-3" /> Actividad
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <Clock className="h-3 w-3" /> {String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}
            </span>
          </div>
          <p key={activityIdx} className="mt-1 text-sm font-semibold animate-in fade-in slide-in-from-bottom-1">
            {machine.activity[activityIdx]}
          </p>
        </div>
      </section>

      {/* Grid completo de personalizables */}
      {matched.length > 0 && (
        <section className="px-5 pt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Todos los productos para esta máquina
          </p>
          <div className="grid grid-cols-3 gap-2">
            {matched.slice(0, 9).map((p) => (
              <Link
                key={p.id}
                to="/products/$slug"
                params={{ slug: p.slug }}
                search={{ customize: 1 } as never}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="aspect-square grid place-items-center text-3xl" style={{ background: p.gradient }}>
                  {p.emoji}
                </div>
                <div className="p-1.5">
                  <p className="line-clamp-1 text-[9.5px] font-semibold leading-tight">{p.title}</p>
                  <p className="text-[9.5px] font-black text-primary">{formatARS(p.price.individual)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* Cámaras secundarias */}
      <section className="px-5 pt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Otras cámaras en vivo</p>
        <div className="grid grid-cols-2 gap-3">
          {others.map((m) => (
            <Link
              key={m.id}
              to="/en-vivo/$machineId"
              params={{ machineId: m.id }}
              className="block overflow-hidden rounded-2xl border border-border bg-card"
            >
              <MachineFeed machine={m} />
              <p className="px-2.5 py-2 text-[11px] font-semibold">{m.emoji} {m.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </MobileShell>
  );
}
