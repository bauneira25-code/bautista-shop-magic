import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PackageCheck, Truck, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";

import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/empaquetado")({ component: EmpaquetadoPage });

// Pedidos esperando o pasando por empaquetado
const QUEUE = ["personalizado_terminado", "control_calidad", "listo_empaquetar", "impreso"];

function EmpaquetadoPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*")
      .in("status", QUEUE as any).order("created_at", { ascending: true });
    setJobs(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-empaquetado")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const finalizar = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "empaquetado" as any }).eq("id", orderId);
    if (error) toast.error(error.message);
    else toast.success("✅ Empaquetado finalizado · listo para envío");
  };

  const marcarEnviado = async (orderId: string) => {
    const code = window.prompt("Código de seguimiento (opcional):") ?? "";
    const { error } = await supabase.from("orders").update({
      status: "enviado" as any, tracking_code: code || null,
    }).eq("id", orderId);
    if (error) toast.error(error.message); else toast.success("📦 Marcado como enviado");
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl flex items-center gap-2"><PackageCheck className="h-7 w-7 text-orange-400" /> Empaquetado</h1>
        <p className="text-sm text-white/50 mt-1">{jobs.length} pedidos esperando empaquetado o envío</p>
      </header>

      {loading && <p className="text-white/40">Cargando...</p>}
      {!loading && jobs.length === 0 && (
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] py-20 text-center">
          <PackageCheck className="h-12 w-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Sin pedidos para empaquetar</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map(o => {
          const yaEmpaquetado = o.status === "empaquetado";
          return (
            <div key={o.id} className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg mt-2">{o.product_emoji} {o.product_title}</p>
                  <p className="text-xs text-white/60">{o.customer_name}{o.customer_phone ? ` · ${o.customer_phone}` : ""}</p>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">#{o.id.slice(0, 8)}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="rounded-2xl bg-black/30 px-3 py-2 text-[11px] text-white/60 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-orange-400 shrink-0" /> Cantidad: {o.quantity}</p>
                <p>Imprimí etiqueta con datos del cliente y pegala en el producto.</p>
              </div>

              <div className="flex gap-2 mt-auto">
                <button onClick={() => finalizar(o.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-3 text-xs font-bold">
                  <PackageCheck className="h-4 w-4" /> Empaquetado finalizado
                </button>
                {yaEmpaquetado && (
                  <button onClick={() => marcarEnviado(o.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-sky-950 px-3 py-3 text-xs font-bold">
                    <Truck className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
