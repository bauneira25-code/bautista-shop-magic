import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { LIVE_MACHINES } from "@/lib/liveMachines";
import { MachineCard, LiveBadge } from "@/components/live/MachineFeed";
import { useLiveTotalViewers, formatViewers } from "@/lib/liveViewers";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/en-vivo")({
  head: () => ({
    meta: [
      { title: "Producción en vivo — NEIBA" },
      { name: "description", content: "Mirá cómo se personalizan los productos en tiempo real desde nuestras máquinas." },
    ],
  }),
  component: EnVivoPage,
});

function EnVivoPage() {
  const totalViewers = useLiveViewers("envivo:global", 4000);
  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <div className="flex items-center justify-between">
          <LiveBadge />
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {formatViewers(totalViewers)} mirando
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl">🔥 Producción en vivo</h1>
        <p className="text-xs text-muted-foreground">Mirá cómo se personalizan los productos en tiempo real.</p>
      </header>

      <section className="space-y-4 px-5 pt-2">
        {LIVE_MACHINES.map((m) => (
          <MachineCard key={m.id} machine={m} />
        ))}
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Fábrica inteligente</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cámaras 24/7 dentro de la fábrica NEIBA. Todo lo que ves se está produciendo ahora mismo.
          </p>
        </div>
      </section>
    </MobileShell>
  );
}
