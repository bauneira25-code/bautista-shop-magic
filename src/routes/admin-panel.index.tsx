import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingBag, Sparkles, Factory, PackageCheck, AlertTriangle, Layers,
  Boxes, TrendingUp, DollarSign, Receipt,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { STATUS_LABEL } from "@/lib/admin/statuses";

export const Route = createFileRoute("/admin-panel/")({ component: Dashboard });

interface KPIs {
  ventasHoy: number;
  ingresosMes: number;
  ticketProm: number;
  pendientes: number;
  enProduccion: number;
  personalizadosPend: number;
  listosEmpaquetar: number;
  reclamos: number;
  gruposActivos: number;
  stockBajo: number;
}

function Dashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [byStatus, setByStatus] = useState<{ name: string; value: number }[]>([]);
  const [byDay, setByDay] = useState<{ day: string; ventas: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("status,unit_price,quantity,created_at")
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString());

      const list = orders ?? [];
      const todayStr = new Date().toDateString();
      const ventasHoy = list.filter(o => new Date(o.created_at).toDateString() === todayStr)
        .reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0);
      const ingresosMes = list.reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0);
      const ticketProm = list.length ? Math.round(ingresosMes / list.length) : 0;

      const counts = (s: string[]) => list.filter(o => s.includes(o.status)).length;

      setKpis({
        ventasHoy: Math.round(ventasHoy),
        ingresosMes: Math.round(ingresosMes),
        ticketProm,
        pendientes: counts(["pago_confirmado", "pendiente_personalizacion"]),
        enProduccion: counts(["en_produccion", "imprimiendo", "cola_produccion", "enviando_maquina"]),
        personalizadosPend: counts(["pendiente_personalizacion", "diseno_aprobado"]),
        listosEmpaquetar: counts(["listo_empaquetar", "personalizado_terminado"]),
        reclamos: 0,
        gruposActivos: 0,
        stockBajo: 0,
      });

      // By status
      const map = new Map<string, number>();
      for (const o of list) map.set(o.status, (map.get(o.status) ?? 0) + 1);
      setByStatus(Array.from(map.entries()).map(([k, v]) => ({ name: STATUS_LABEL[k as keyof typeof STATUS_LABEL] ?? k, value: v })));

      // By day (last 14)
      const days: { day: string; ventas: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toDateString();
        const total = list
          .filter(o => new Date(o.created_at).toDateString() === key)
          .reduce((s, o) => s + Number(o.unit_price) * o.quantity, 0);
        days.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, ventas: Math.round(total) });
      }
      setByDay(days);
    };
    load();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="font-display text-3xl">Panel de control</h1>
        <p className="text-sm text-white/50 mt-1">Vista general de la operación</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard icon={DollarSign} label="Ventas hoy" value={kpis ? fmt(kpis.ventasHoy) : "—"} accent="from-emerald-500/30 to-emerald-500/0" />
        <KpiCard icon={TrendingUp} label="Ingresos mes" value={kpis ? fmt(kpis.ingresosMes) : "—"} accent="from-orange-500/30 to-orange-500/0" />
        <KpiCard icon={Receipt} label="Ticket promedio" value={kpis ? fmt(kpis.ticketProm) : "—"} accent="from-violet-500/30 to-violet-500/0" />
        <KpiCard icon={ShoppingBag} label="Pedidos pendientes" value={kpis?.pendientes ?? "—"} />
        <KpiCard icon={Factory} label="En producción" value={kpis?.enProduccion ?? "—"} />
        <KpiCard icon={Sparkles} label="Personalizados pend." value={kpis?.personalizadosPend ?? "—"} />
        <KpiCard icon={PackageCheck} label="Listos p/ empaquetar" value={kpis?.listosEmpaquetar ?? "—"} />
        <KpiCard icon={AlertTriangle} label="Reclamos abiertos" value={kpis?.reclamos ?? 0} />
        <KpiCard icon={Layers} label="Grupos activos" value={kpis?.gruposActivos ?? 0} />
        <KpiCard icon={Boxes} label="Stock bajo" value={kpis?.stockBajo ?? 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Ventas últimos 14 días">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="ventas" stroke="#fb923c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Pedidos por estado">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="value" fill="#fb923c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: any; accent?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-4`}>
      {accent && <div className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`} />}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
          <p className="mt-2 font-display text-2xl">{value}</p>
        </div>
        <Icon className="h-4 w-4 text-white/40" />
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">
      <h3 className="font-display text-sm mb-4 text-white/80">{title}</h3>
      {children}
    </div>
  );
}
