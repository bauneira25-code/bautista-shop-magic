import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, TrendingUp, Users, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/admin-panel/analisis")({ component: AnalisisPage });

const COLORS = ["#fb923c", "#f43f5e", "#a78bfa", "#22d3ee", "#34d399", "#facc15", "#f472b6"];

interface OrderRow {
  status: string; unit_price: number; quantity: number; created_at: string;
  customer_name: string; product_slug: string; product_title: string; product_emoji: string | null;
  is_customized: boolean;
}

function AnalisisPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("orders")
        .select("status,unit_price,quantity,created_at,customer_name,product_slug,product_title,product_emoji,is_customized")
        .gte("created_at", new Date(Date.now() - range * 86400000).toISOString())
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    };
    load();
    const ch = supabase.channel("admin-analisis")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [range]);

  const m = useMemo(() => {
    const ingresos = orders.reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0);
    const ticket = orders.length ? ingresos / orders.length : 0;
    const unidades = orders.reduce((s, o) => s + o.quantity, 0);
    const personalizados = orders.filter(o => o.is_customized).length;
    const clientes = new Set(orders.map(o => o.customer_name)).size;

    // Por día
    const dayMap = new Map<string, { ventas: number; unidades: number }>();
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const k = `${d.getDate()}/${d.getMonth() + 1}`;
      dayMap.set(k, { ventas: 0, unidades: 0 });
    }
    for (const o of orders) {
      const d = new Date(o.created_at);
      const k = `${d.getDate()}/${d.getMonth() + 1}`;
      const cur = dayMap.get(k);
      if (cur) {
        cur.ventas += Number(o.unit_price) * o.quantity;
        cur.unidades += o.quantity;
      }
    }
    const byDay = Array.from(dayMap.entries()).map(([day, v]) => ({ day, ...v, ventas: Math.round(v.ventas) }));

    // Top productos
    const prodMap = new Map<string, { title: string; emoji: string; unidades: number; ingresos: number }>();
    for (const o of orders) {
      const cur = prodMap.get(o.product_slug) ?? { title: o.product_title, emoji: o.product_emoji ?? "📦", unidades: 0, ingresos: 0 };
      cur.unidades += o.quantity;
      cur.ingresos += Number(o.unit_price) * o.quantity;
      prodMap.set(o.product_slug, cur);
    }
    const topProductos = Array.from(prodMap.values()).sort((a, b) => b.ingresos - a.ingresos).slice(0, 8);

    // Top clientes
    const custMap = new Map<string, { pedidos: number; gastado: number }>();
    for (const o of orders) {
      const cur = custMap.get(o.customer_name) ?? { pedidos: 0, gastado: 0 };
      cur.pedidos += 1;
      cur.gastado += Number(o.unit_price) * o.quantity;
      custMap.set(o.customer_name, cur);
    }
    const topClientes = Array.from(custMap.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.gastado - a.gastado).slice(0, 6);

    // Custom vs estándar
    const custData = [
      { name: "Personalizados", value: personalizados },
      { name: "Estándar", value: orders.length - personalizados },
    ];

    return { ingresos, ticket, unidades, personalizados, clientes, byDay, topProductos, topClientes, custData };
  }, [orders, range]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-2"><BarChart3 className="h-7 w-7 text-orange-400" /> Análisis</h1>
          <p className="text-sm text-white/50 mt-1">{loading ? "Cargando…" : `${orders.length} pedidos en los últimos ${range} días`}</p>
        </div>
        <div className="flex gap-1 rounded-full bg-white/5 p-1">
          {([7, 30, 90] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} className={`rounded-full px-3 py-1 text-xs font-bold ${range === r ? "bg-orange-500 text-white" : "text-white/60"}`}>{r}d</button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi icon={TrendingUp} label="Ingresos" value={formatARS(Math.round(m.ingresos))} />
        <Kpi icon={BarChart3} label="Pedidos" value={orders.length} />
        <Kpi label="Ticket prom." value={formatARS(Math.round(m.ticket))} />
        <Kpi icon={Users} label="Clientes únicos" value={m.clientes} />
        <Kpi icon={Sparkles} label="Personalizados" value={m.personalizados} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Panel title="Ventas por día" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={m.byDay}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="ventas" stroke="#fb923c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Personalizados vs estándar">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={m.custData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {m.custData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel title="Top productos por ingresos">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.topProductos} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#666" fontSize={10} />
                <YAxis dataKey="title" type="category" stroke="#666" fontSize={10} width={120} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  formatter={(v: any) => formatARS(v as number)} />
                <Bar dataKey="ingresos" fill="#fb923c" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top clientes">
          <div className="divide-y divide-white/5">
            {m.topClientes.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 py-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-300">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-[10px] text-white/40">{c.pedidos} pedidos</p>
                </div>
                <p className="font-display text-sm text-emerald-300">{formatARS(Math.round(c.gastado))}</p>
              </div>
            ))}
            {m.topClientes.length === 0 && <p className="py-10 text-center text-sm text-white/40">Sin datos aún</p>}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon?: any; label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
          <p className="mt-2 font-display text-xl">{value}</p>
        </div>
        {Icon && <Icon className="h-4 w-4 text-white/40" />}
      </div>
    </div>
  );
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/5 bg-white/[0.03] p-5 ${className ?? ""}`}>
      <h3 className="font-display text-sm mb-4 text-white/80">{title}</h3>
      {children}
    </div>
  );
}
