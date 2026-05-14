import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Download, Check, Play, X, Flame, PackageCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PersonalizedBadge } from "@/components/admin/PersonalizedBadge";
import { generateSVG, downloadSVG } from "@/lib/generateSVG";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/personalizados")({ component: PersonalizadosPage });

function PersonalizadosPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: custs } = await supabase.from("customizations").select("*").order("created_at", { ascending: false }).limit(200);
    const ids = (custs ?? []).map(c => c.order_id).filter((x): x is string => !!x);
    if (ids.length === 0) { setRows([]); setLoading(false); return; }
    const { data: orders } = await supabase.from("orders").select("*").in("id", ids);
    const byId = new Map(orders?.map(o => [o.id, o]));
    setRows((custs ?? []).map(c => ({ cust: c, order: c.order_id ? byId.get(c.order_id) : null })).filter(r => r.order));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", orderId);
    if (error) toast.error(error.message); else { toast.success("Estado actualizado"); load(); setSelected(null); }
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl flex items-center gap-2"><Sparkles className="h-7 w-7 text-orange-400" /> Personalizados</h1>
        <p className="text-sm text-white/50 mt-1">{rows.length} diseños cargados</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-white/40">Cargando...</p>}
        {!loading && rows.length === 0 && <p className="text-white/40 col-span-full text-center py-10">Sin personalizados aún</p>}
        {rows.map(({ cust, order }) => (
          <button key={cust.id} onClick={() => setSelected({ cust, order })}
            className="text-left rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.06] transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display text-base">{order.product_emoji} {order.product_title}</p>
                <p className="text-xs text-white/50 mt-0.5">{order.customer_name}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="rounded-xl bg-black/40 px-3 py-2 text-center" style={{ fontFamily: cust.font, color: cust.color }}>
              "{cust.text}"
            </div>
            <p className="mt-2 text-[10px] text-white/40">{new Date(cust.created_at).toLocaleString("es-AR")}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl">{selected.order.product_title}</h2>
                <p className="text-xs text-white/50">{selected.order.customer_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-full bg-white/5"><X className="h-4 w-4" /></button>
            </div>

            <div className="rounded-2xl bg-black/40 p-6 text-center mb-4">
              <p style={{ fontFamily: selected.cust.font, color: selected.cust.color, fontSize: 32 }}>"{selected.cust.text}"</p>
              <p className="text-[10px] text-white/40 mt-3">{selected.cust.font} · {selected.cust.size}px · {selected.cust.rotation_deg}°</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => downloadSVG(`design-${selected.order.id.slice(0,8)}`, generateSVG({
                text: selected.cust.text, color: selected.cust.color, font: selected.cust.font,
                size: selected.cust.size, rotationDeg: selected.cust.rotation_deg,
                posX: selected.cust.pos_x, posY: selected.cust.pos_y,
              }))} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 py-2.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Descargar SVG
              </button>
              <button onClick={() => updateStatus(selected.order.id, "diseno_aprobado")}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 py-2.5 text-xs">
                <Check className="h-3.5 w-3.5" /> Aprobar diseño
              </button>
              <button onClick={() => updateStatus(selected.order.id, "cola_produccion")}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-xs font-bold">
                <Play className="h-3.5 w-3.5" /> Enviar a producción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
