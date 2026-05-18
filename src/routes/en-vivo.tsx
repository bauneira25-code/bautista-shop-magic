import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { LIVE_MACHINES, type LiveMachine } from "@/lib/liveMachines";
import { MachineCard, LiveBadge } from "@/components/live/MachineFeed";
import { useLiveTotalViewers, formatViewers } from "@/lib/liveViewers";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const totalViewers = useLiveTotalViewers(4000);
  const [cams, setCams] = useState<Array<{ id: string; name: string; machine: string; video_url: string | null; thumbnail_url: string | null }>>([]);

  useEffect(() => {
    supabase.from("live_cameras").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setCams((data ?? []) as any));
  }, []);

  // Merge DB cameras over defaults; fallback to LIVE_MACHINES if DB empty
  const machines: LiveMachine[] = cams.length > 0
    ? cams.map(c => {
        const def = LIVE_MACHINES.find(m => m.id === c.machine) ?? LIVE_MACHINES[0];
        return { ...def, id: (c.machine as any) ?? def.id, name: c.name };
      })
    : LIVE_MACHINES;

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
        {machines.map((m, i) => (
          <MachineCard key={`${m.id}-${i}`} machine={m} />
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

