import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Layers3, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/admin-panel/todo")({ component: TodoPage });

function TodoPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-todo")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const visible = useMemo(() => orders.filter(o =>
    !q || o.customer_name.toLowerCase().includes(q.toLowerCase()) || o.product_title.toLowerCase().includes(q.toLowerCase())
  ), [orders, q]);

  const fmt = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-2"><Layers3 className="h-7 w-7 text-orange-400" /> Todo</h1>
          <p className="text-sm text-white/50 mt-1">{orders.length} pedidos</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-sm focus:border-orange-400 outline-none" />
        </div>
      </header>

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
              <tr key={o.id} className="border-t border-white/5 hover:bg-white/[0.04]">
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
    </div>
  );
}
