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

      {/* Cámara principal */}
      <div className="px-5 pt-3">
        <MachineFeed machine={machine} big />
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

      {/* Productos que personaliza */}
      <section className="px-5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Esta máquina personaliza</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {machine.products.map((p) => (
            <span key={p} className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold">{p}</span>
          ))}
        </div>
      </section>

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
