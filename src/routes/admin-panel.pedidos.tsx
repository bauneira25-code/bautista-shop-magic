import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { STATUS_LABEL, type FullOrderStatus } from "@/lib/admin/statuses";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/pedidos")({ component: PedidosPage });

const FILTERS: { value: "all" | FullOrderStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pago_confirmado", label: "Pagados" },
  { value: "en_produccion", label: "Producción" },
  { value: "control_calidad", label: "Calidad" },
  { value: "listo_empaquetar", label: "Listos" },
  { value: "empaquetado", label: "Empaquetados" },
  { value: "enviado", label: "Enviados" },
  { value: "entregado", label: "Entregados" },
  { value: "cancelado", label: "Cancelados" },
];

function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | FullOrderStatus>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
    setOrders(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    return orders.filter(o => (filter === "all" || o.status === filter)
      && (!q || o.customer_name.toLowerCase().includes(q.toLowerCase()) || o.product_title.toLowerCase().includes(q.toLowerCase())));
  }, [orders, filter, q]);

  const fmt = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Pedidos</h1>
          <p className="text-sm text-white/50 mt-1">{visible.length} de {orders.length}</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente o producto..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${filter === f.value ? "bg-white text-neutral-950" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wider text-white/50">
            <tr>
              <th className="text-left px-4 py-3">Pedido</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-white/40">Cargando...</td></tr>}
            {!loading && visible.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-white/40">Sin pedidos</td></tr>}
            {visible.map(o => (
              <tr key={o.id} onClick={() => setSelectedId(o.id)} className="border-t border-white/5 hover:bg-white/[0.04] cursor-pointer">
                <td className="px-4 py-3 font-mono text-[11px] text-white/60">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3 text-white/70">{o.product_emoji} {o.product_title}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right font-medium">{fmt(Number(o.unit_price) * o.quantity)}</td>
                <td className="px-4 py-3 text-white/50 text-xs">{new Date(o.created_at).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedId && <OrderDetail id={selectedId} onClose={() => setSelectedId(null)} onUpdate={load} />}
    </div>
  );
}

function OrderDetail({ id, onClose, onUpdate }: { id: string; onClose: () => void; onUpdate: () => void }) {
  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [cust, setCust] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<FullOrderStatus>("pago_confirmado");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: o }, { data: h }, { data: c }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).single(),
        supabase.from("order_status_history").select("*").eq("order_id", id).order("changed_at", { ascending: false }),
        supabase.from("customizations").select("*").eq("order_id", id).maybeSingle(),
      ]);
      setOrder(o); setHistory(h ?? []); setCust(c);
      setNotes(o?.internal_notes ?? "");
      setStatus(o?.status);
    })();
  }, [id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("orders").update({ status, internal_notes: notes }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Actualizado"); onUpdate(); onClose(); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] text-white/40 font-mono">#{id.slice(0, 8)}</p>
            <h2 className="font-display text-2xl mt-1">Pedido</h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>

        {!order ? <p className="text-white/40">Cargando...</p> : (
          <div className="space-y-5">
            <Section label="Cliente">
              <p>{order.customer_name}</p>
              {order.customer_phone && <p className="text-white/50 text-sm">{order.customer_phone}</p>}
            </Section>

            <Section label="Producto">
              <p>{order.product_emoji} {order.product_title} × {order.quantity}</p>
              <p className="text-white/50 text-sm">{Number(order.unit_price).toLocaleString("es-AR")} c/u</p>
            </Section>

            {cust && (
              <Section label="Personalización">
                <p className="text-sm">Texto: <span className="text-white">"{cust.text}"</span></p>
                <p className="text-sm text-white/60">Fuente: {cust.font} · Color: <span className="inline-block w-3 h-3 rounded align-middle" style={{ background: cust.color }} /> {cust.color}</p>
                {cust.svg_url && <a href={cust.svg_url} target="_blank" rel="noreferrer" className="text-xs text-orange-300 hover:underline">Ver archivo SVG →</a>}
              </Section>
            )}

            <Section label="Cambiar estado">
              <select value={status} onChange={(e) => setStatus(e.target.value as FullOrderStatus)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm">
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Section>

            <Section label="Notas internas">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-orange-400 outline-none" />
            </Section>

            <Section label="Historial de estados">
              {history.length === 0 ? <p className="text-white/40 text-xs">Sin cambios registrados</p> : (
                <ul className="space-y-1.5 text-xs">
                  {history.map(h => (
                    <li key={h.id} className="flex items-center justify-between text-white/60">
                      <span>{h.from_status ?? "—"} → <span className="text-white">{STATUS_LABEL[h.to_status as FullOrderStatus] ?? h.to_status}</span></span>
                      <span className="text-white/40">{new Date(h.changed_at).toLocaleString("es-AR")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <button onClick={save} disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-display text-sm font-bold disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">{label}</p>
      <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 text-sm">{children}</div>
    </div>
  );
}
