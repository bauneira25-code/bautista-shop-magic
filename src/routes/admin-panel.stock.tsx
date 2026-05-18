import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Boxes, AlertTriangle, TrendingDown, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/admin-panel/stock")({ component: StockPage });

interface OrderAgg { product_slug: string; quantity: number; status: string }

function StockPage() {
  const [orders, setOrders] = useState<OrderAgg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "bajo" | "agotado">("todos");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("product_slug,quantity,status");
    setOrders((data ?? []) as OrderAgg[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-stock")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const rows = useMemo(() => {
    const soldBy = new Map<string, number>();
    const reservedBy = new Map<string, number>();
    for (const o of orders) {
      const isReserved = ["pago_confirmado", "pendiente_personalizacion", "cola_produccion", "enviando_maquina", "imprimiendo", "en_produccion"].includes(o.status);
      const isSold = ["enviado", "entregado", "empaquetado", "listo_empaquetar", "personalizado_terminado"].includes(o.status);
      if (isSold) soldBy.set(o.product_slug, (soldBy.get(o.product_slug) ?? 0) + o.quantity);
      if (isReserved) reservedBy.set(o.product_slug, (reservedBy.get(o.product_slug) ?? 0) + o.quantity);
    }
    return MOCK_PRODUCTS.map(p => {
      const sold = soldBy.get(p.slug) ?? 0;
      const reserved = reservedBy.get(p.slug) ?? 0;
      const available = Math.max(0, p.stock - sold - reserved);
      const min = Math.max(5, Math.round(p.stock * 0.15));
      const status: "ok" | "bajo" | "agotado" = available <= 0 ? "agotado" : available <= min ? "bajo" : "ok";
      return { p, sold, reserved, available, min, status };
    });
  }, [orders]);

  const filtered = rows.filter(r => filter === "todos" ? true : r.status === filter);
  const totals = {
    bajo: rows.filter(r => r.status === "bajo").length,
    agotado: rows.filter(r => r.status === "agotado").length,
    valorInventario: rows.reduce((s, r) => s + r.available * r.p.price.individual, 0),
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl flex items-center gap-2"><Boxes className="h-7 w-7 text-orange-400" /> Stock</h1>
        <p className="text-sm text-white/50 mt-1">{loading ? "Cargando…" : `${rows.length} SKU · conectado a pedidos en vivo`}</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi icon={AlertTriangle} label="Stock bajo" value={totals.bajo} tone="text-amber-400" />
        <Kpi icon={TrendingDown} label="Agotados" value={totals.agotado} tone="text-red-400" />
        <Kpi icon={Package} label="Valor inventario" value={formatARS(totals.valorInventario)} tone="text-emerald-400" />
      </div>

      <div className="flex gap-2">
        {(["todos", "bajo", "agotado"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === f ? "bg-orange-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-right">Stock</th>
              <th className="px-3 py-2 text-right">Vendido</th>
              <th className="px-3 py-2 text-right">Reservado</th>
              <th className="px-3 py-2 text-right">Disponible</th>
              <th className="px-3 py-2 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ p, sold, reserved, available, status }) => (
              <tr key={p.slug} className="border-t border-white/5">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg text-base" style={{ background: p.gradient }}>{p.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.title}</p>
                      <p className="text-[10px] text-white/40 capitalize">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-white/70">{p.stock}</td>
                <td className="px-3 py-2 text-right text-white/70">{sold}</td>
                <td className="px-3 py-2 text-right text-amber-300">{reserved}</td>
                <td className="px-3 py-2 text-right font-bold">{available}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    status === "agotado" ? "bg-red-500/20 text-red-300"
                    : status === "bajo" ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/15 text-emerald-300"
                  }`}>{status === "ok" ? "OK" : status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-10 text-center text-white/40">Sin productos en este filtro</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: any; label: string; value: any; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
          <p className={`mt-2 font-display text-2xl ${tone ?? ""}`}>{value}</p>
        </div>
        <Icon className={`h-4 w-4 ${tone ?? "text-white/40"}`} />
      </div>
    </div>
  );
}
