import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Factory, Play, Check, AlertTriangle, Camera, X, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateSVG, downloadSVG } from "@/lib/generateSVG";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/produccion")({ component: ProduccionPage });

const ACTIVE = ["pago_confirmado", "diseno_aprobado", "cola_produccion", "en_produccion", "enviando_maquina", "imprimiendo"];

function ProduccionPage() {
  const { profile } = useAdminAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [photoFor, setPhotoFor] = useState<any | null>(null);

  const load = async () => {
    const { data: orders } = await supabase.from("orders").select("*")
      .in("status", ACTIVE).order("created_at", { ascending: true });
    const ids = (orders ?? []).map(o => o.id);
    const { data: custs } = ids.length
      ? await supabase.from("customizations").select("*").in("order_id", ids)
      : { data: [] };
    const byOrder = new Map(custs?.map(c => [c.order_id, c]));
    setJobs((orders ?? []).map(o => ({ order: o, cust: byOrder.get(o.id) })));
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("production")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const start = async (orderId: string) => {
    if (!profile) return;
    const { error } = await supabase.from("orders").update({
      status: "en_produccion", assigned_to: profile.user.id,
    }).eq("id", orderId);
    if (error) toast.error(error.message); else toast.success("¡Comenzaste el trabajo!");
  };

  const finish = async (job: any, file: File) => {
    if (!profile) return;
    try {
      const path = `${job.order.id}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("qc-photos").upload(path, file);
      if (up.error) throw up.error;
      const { data: { publicUrl } } = supabase.storage.from("qc-photos").getPublicUrl(path);
      const { error } = await supabase.from("orders").update({
        status: "control_calidad", final_photo_url: publicUrl,
      }).eq("id", job.order.id);
      if (error) throw error;
      toast.success("Trabajo terminado y enviado a calidad");
      setPhotoFor(null);
    } catch (e: any) {
      toast.error(e.message ?? "Error subiendo foto");
    }
  };

  const reportProblem = async (orderId: string) => {
    const reason = window.prompt("Motivo del problema:");
    if (!reason) return;
    const { error } = await supabase.from("orders").update({
      status: "rehacer", internal_notes: reason,
    }).eq("id", orderId);
    if (error) toast.error(error.message); else toast.success("Problema reportado");
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-2"><Factory className="h-7 w-7 text-orange-400" /> Centro de producción</h1>
          <p className="text-sm text-white/50 mt-1">{jobs.length} trabajos en cola</p>
        </div>
      </header>

      {jobs.length === 0 && (
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] py-20 text-center">
          <Factory className="h-12 w-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">No hay trabajos pendientes</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map(job => {
          const inProgress = job.order.status === "en_produccion";
          const lockedByOther = inProgress && job.order.assigned_to && job.order.assigned_to !== profile?.user.id;
          return (
            <div key={job.order.id} className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-white/40 font-mono">#{job.order.id.slice(0, 8)}</p>
                  <p className="font-display text-lg mt-0.5">{job.order.product_emoji} {job.order.product_title}</p>
                  <p className="text-xs text-white/60">{job.order.customer_name}</p>
                </div>
                <StatusBadge status={job.order.status} />
              </div>

              {job.cust && (
                <div className="rounded-2xl bg-black/40 p-6 text-center">
                  <p style={{ fontFamily: job.cust.font, color: job.cust.color, fontSize: 28, transform: `rotate(${job.cust.rotation_deg}deg)` }}>"{job.cust.text}"</p>
                  <p className="text-[10px] text-white/40 mt-3">{job.cust.font} · {job.cust.size}px · pos ({job.cust.pos_x},{job.cust.pos_y})</p>
                </div>
              )}

              {lockedByOther && <p className="text-xs text-amber-400">⚠ En proceso por otro empleado</p>}

              <div className="flex gap-2 mt-auto">
                {job.cust && (
                  <button onClick={() => downloadSVG(`design-${job.order.id.slice(0,8)}`, generateSVG({
                    text: job.cust.text, color: job.cust.color, font: job.cust.font,
                    size: job.cust.size, rotationDeg: job.cust.rotation_deg,
                    posX: job.cust.pos_x, posY: job.cust.pos_y,
                  }))} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 py-3 text-xs">
                    <Download className="h-3.5 w-3.5" /> SVG
                  </button>
                )}
                {!inProgress && (
                  <button onClick={() => start(job.order.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-xs font-bold">
                    <Play className="h-3.5 w-3.5" /> Comenzar
                  </button>
                )}
                {inProgress && !lockedByOther && (
                  <button onClick={() => setPhotoFor(job)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-3 text-xs font-bold">
                    <Check className="h-3.5 w-3.5" /> Terminado
                  </button>
                )}
                <button onClick={() => reportProblem(job.order.id)}
                  className="grid place-items-center rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 px-3" title="Reportar problema">
                  <AlertTriangle className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {photoFor && (
        <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4" onClick={() => setPhotoFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display text-lg flex items-center gap-2"><Camera className="h-5 w-5" /> Foto del producto final</h2>
              <button onClick={() => setPhotoFor(null)}><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-white/50 mb-3">Tomá una foto del producto terminado antes de mandarlo a control de calidad.</p>
            <input
              type="file" accept="image/*" capture="environment"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) finish(photoFor, f); }}
              className="w-full text-xs file:mr-3 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2.5 file:text-white file:font-bold"
            />
          </div>
        </div>
      )}
    </div>
  );
}
