import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, TrendingUp, Package, DollarSign, Users, AlertTriangle,
  BarChart3, Factory, Boxes, Hammer, ArrowUp, ArrowDown, ShieldCheck, LogOut, Wrench,
} from "lucide-react";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { useBrands } from "@/stores/brands";
import { AdminPinGate } from "@/components/AdminPinGate";
import { adminLogout } from "@/lib/adminAuth";
import { supabase } from "@/integrations/supabase/client";
import { ageMinutes, STATUS_META, type OrderRow } from "@/lib/orders";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Tab = "resumen" | "analytics" | "produccion" | "stock";

function AdminPage() {
  return (
    <AdminPinGate>
      <Admin />
    </AdminPinGate>
  );
}

function Admin() {
  const [tab, setTab] = useState<Tab>("resumen");
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setOrders(data as OrderRow[]);
    };
    load();
    const ch = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur-xl">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <p className="font-display text-base">Admin · NEIBA</p>
        <div className="flex items-center gap-2">
          <Link to="/admin/machine" className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary" aria-label="Estación máquina">
            <Wrench className="h-4 w-4" />
          </Link>
          <button onClick={() => { adminLogout(); location.reload(); }} className="grid h-10 w-10 place-items-center rounded-full bg-card" aria-label="Salir">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[64px] z-20 flex gap-1 border-b border-border bg-background/95 px-3 py-2 backdrop-blur-xl">
        {([
          ["resumen", "Resumen", BarChart3],
          ["analytics", "Analytics", TrendingUp],
          ["produccion", "Producción", Factory],
          ["stock", "Stock", Boxes],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
              tab === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </nav>

      <main className="space-y-5 px-4 pt-4">
        {tab === "resumen" && <ResumenTab orders={orders} />}
        {tab === "analytics" && <AnalyticsTab orders={orders} />}
        {tab === "produccion" && <ProduccionTab orders={orders} />}
        {tab === "stock" && <StockTab />}
      </main>
    </div>
  );
}

function ResumenTab({ orders }: { orders: OrderRow[] }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
  const lastHour = orders.filter((o) => Date.now() - new Date(o.created_at).getTime() < 60 * 60_000);
  const revenue = todayOrders.reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0);
  const profit = todayOrders.reduce((s, o) => s + (Number(o.unit_price) - Number(o.cost)) * o.quantity, 0);

  const top = useMemo(() => {
    const map = new Map<string, { title: string; count: number }>();
    for (const o of orders) {
      const cur = map.get(o.product_slug) ?? { title: o.product_title, count: 0 };
      cur.count += o.quantity;
      map.set(o.product_slug, cur);
    }
    return [...map.values()].sort((a, b) => b.count - a.count)[0];
  }, [orders]);

  const lowStock = MOCK_PRODUCTS.filter((p) => p.stock < 15).slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KPI icon={DollarSign} label="Facturación hoy" value={formatARS(revenue)} delta="+12%" up />
        <KPI icon={TrendingUp} label="Ganancia hoy" value={formatARS(profit)} delta="+18%" up />
        <KPI icon={Package} label="Pedidos hoy" value={String(todayOrders.length)} delta={`${todayOrders.length}`} up />
        <KPI icon={Users} label="Última hora" value={String(lastHour.length)} delta={`+${lastHour.length}`} up />
      </div>

      {top && (
        <section className="rounded-3xl border border-primary/40 bg-primary/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Top producto</p>
          <p className="mt-1 font-display text-lg">{top.title}</p>
          <p className="text-xs text-muted-foreground">{top.count} unidades vendidas</p>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="font-display text-base">Stock crítico</p>
        </div>
        <div className="mt-3 space-y-2">
          {lowStock.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: p.gradient }}>{p.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">{p.stock} unidades</p>
              </div>
              <button className="rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">Reordenar</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalyticsTab({ orders }: { orders: OrderRow[] }) {
  // Agrupar por hora últimas 24h
  const buckets = useMemo(() => {
    const arr = new Array(24).fill(0);
    const now = Date.now();
    for (const o of orders) {
      const diff = now - new Date(o.created_at).getTime();
      const hoursAgo = Math.floor(diff / (60 * 60_000));
      if (hoursAgo < 24) arr[23 - hoursAgo] += 1;
    }
    return arr;
  }, [orders]);
  const max = Math.max(1, ...buckets);

  const ranking = useMemo(() => {
    const map = new Map<string, { title: string; count: number; revenue: number }>();
    for (const o of orders) {
      const cur = map.get(o.product_slug) ?? { title: o.product_title, count: 0, revenue: 0 };
      cur.count += o.quantity;
      cur.revenue += Number(o.unit_price) * o.quantity;
      map.set(o.product_slug, cur);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const ticketAvg = orders.length
    ? orders.reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0) / orders.length
    : 0;
  const margin = orders.length
    ? (orders.reduce((s, o) => s + (Number(o.unit_price) - Number(o.cost)), 0) /
        orders.reduce((s, o) => s + Number(o.unit_price), 1)) * 100
    : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-base">Pedidos / hora (24h)</p>
          <span className="text-xs text-muted-foreground">{orders.length} totales</span>
        </div>
        <div className="mt-4 flex h-32 items-end gap-1">
          {buckets.map((v, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / max) * 100}%`, background: "var(--gradient-primary, var(--primary))", backgroundColor: "hsl(from var(--primary) h s l)" }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KPI icon={DollarSign} label="Ticket promedio" value={formatARS(Math.round(ticketAvg))} delta="" />
        <KPI icon={TrendingUp} label="Margen" value={`${margin.toFixed(0)}%`} delta="" />
      </div>

      <section>
        <p className="font-display text-base">Ranking productos</p>
        <div className="mt-3 space-y-2">
          {ranking.length === 0 && (
            <p className="rounded-2xl bg-muted/50 p-4 text-center text-xs text-muted-foreground">Sin pedidos aún</p>
          )}
          {ranking.map((r, i) => (
            <div key={r.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <span className="font-display text-lg text-primary w-5">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-semibold">{r.title}</p>
                <p className="text-[10px] text-muted-foreground">{r.count} unidades</p>
              </div>
              <p className="text-xs font-bold text-success">{formatARS(r.revenue)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProduccionTab({ orders }: { orders: OrderRow[] }) {
  const cola = orders.filter((o) =>
    o.status === "pago_confirmado" || o.status === "enviando_maquina" || o.status === "imprimiendo"
  );

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Cola de producción</p>
        <p className="mt-1 font-display text-2xl">{cola.length} pedidos</p>
        <Link to="/admin/machine" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">
          <Hammer className="h-3 w-3" /> Ir a estación de máquina
        </Link>
      </div>

      {cola.length === 0 && (
        <p className="rounded-2xl bg-muted/50 p-6 text-center text-xs text-muted-foreground">No hay pedidos en cola</p>
      )}

      {cola.map((o) => {
        const meta = STATUS_META[o.status];
        const age = ageMinutes(o.created_at);
        const urgent = o.status === "pago_confirmado" && age > 60;
        return (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: o.product_gradient ?? "var(--muted)" }}>
                {o.product_emoji ?? "📦"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-semibold">{o.product_title}</p>
                <p className="text-[10px] text-muted-foreground">{o.customer_name} · hace {age}m</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${meta.color}`}>{meta.label}</span>
            </div>
            {urgent && (
              <p className="mt-2 rounded-xl bg-destructive/15 px-3 py-1 text-[10px] font-bold text-destructive">🚨 URGENTE · {age} min en cola</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StockTab() {
  return (
    <div className="space-y-2">
      {MOCK_PRODUCTS.slice(0, 12).map((p) => {
        const cost = Math.round(p.price.individual * 0.4);
        const margin = (((p.price.individual - cost) / p.price.individual) * 100).toFixed(0);
        const low = p.stock < 15;
        return (
          <div key={p.id} className={`rounded-2xl border p-3 ${low ? "border-warning/40 bg-warning/5" : "border-border bg-card"}`}>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: p.gradient }}>{p.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">Costo {formatARS(cost)} · Precio {formatARS(p.price.individual)} · Margen {margin}%</p>
              </div>
              <div className="text-right">
                <p className={`font-display text-base ${low ? "text-warning" : ""}`}>{p.stock}</p>
                <p className="text-[9px] text-muted-foreground">stock</p>
              </div>
            </div>
          </div>
        );
      })}
      <BrandSection />
    </div>
  );
}

function BrandSection() {
  const brands = useBrands((s) => s.brands);
  if (brands.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <p className="font-display text-base">Marcas registradas</p>
      </div>
      <div className="mt-3 space-y-2">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">{b.name}</p>
              <p className="text-[10px] text-muted-foreground">{b.owner}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, up }: { icon: typeof TrendingUp; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-4 w-4" /></span>
        {delta && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-success" : "text-destructive"}`}>
            {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {delta}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-xl">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
