import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, AlertTriangle, Package, DollarSign, Users, Truck, Sparkles, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { useBrands } from "@/stores/brands";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const lowStock = MOCK_PRODUCTS.filter((p) => p.stock < 15);
  const topSellers = [...MOCK_PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const brands = useBrands((s) => s.brands);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] pb-10">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-xl">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-card"><ArrowLeft className="h-4 w-4" /></Link>
        <p className="font-display text-base">Admin · NEIBA</p>
        <span className="rounded-full bg-success/20 px-2 py-1 text-[10px] font-bold text-success">LIVE</span>
      </header>

      <main className="space-y-6 px-5 pt-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <KPI icon={DollarSign} label="Ingresos hoy" value="$1.284.000" delta="+12%" up />
          <KPI icon={Package} label="Pedidos" value="248" delta="+18%" up />
          <KPI icon={Users} label="Grupos activos" value="34" delta="+4" up />
          <KPI icon={TrendingUp} label="Margen" value="42%" delta="-2%" />
        </div>

        {/* Revenue chart placeholder */}
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-base">Ventas (7 días)</p>
            <span className="text-xs text-success">+24%</span>
          </div>
          <div className="mt-4 flex h-32 items-end gap-2">
            {[40, 65, 50, 80, 72, 95, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%`, background: "var(--gradient-primary)" }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {["L","M","X","J","V","S","D"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Low stock alerts */}
        <section>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="font-display text-base">Stock bajo</p>
            <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">{lowStock.length}</span>
          </div>
          <div className="mt-3 space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: p.gradient }}>{p.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">{p.stock} unidades restantes</p>
                </div>
                <button className="rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">Reordenar</button>
              </div>
            ))}
          </div>
        </section>

        {/* Top sellers */}
        <section>
          <p className="font-display text-base">Top vendidos</p>
          <div className="mt-3 space-y-2">
            {topSellers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <span className="font-display text-lg text-primary w-5">{i + 1}</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: p.gradient }}>{p.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sold.toLocaleString()} vendidos</p>
                </div>
                <p className="text-xs font-bold text-success">{formatARS(p.sold * p.price.individual / 1000)}k</p>
              </div>
            ))}
          </div>
        </section>

        {/* Logistics */}
        <section className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <p className="font-display text-base">Logística & importación</p>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            {[
              { label: "Container CN-2284 (Shenzhen)", status: "En tránsito", eta: "12 días", pct: 65 },
              { label: "Lote MX-104 (México)", status: "Aduana", eta: "3 días", pct: 88 },
              { label: "Reposición auriculares", status: "Pendiente orden", eta: "—", pct: 10 },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-secondary p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{c.label}</p>
                  <span className="text-[10px] text-muted-foreground">{c.eta}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div className="h-full" style={{ width: `${c.pct}%`, background: "var(--gradient-primary)" }} />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{c.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI suggestions */}
        <div className="rounded-3xl border border-primary/40 p-4" style={{ background: "var(--gradient-violet)" }}>
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4" />
            <p className="font-display text-base">Sugerencias IA</p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-white/90">
            <li>📈 La <span className="font-bold">Funda iPhone 15 Pro</span> se vende 3.2× más rápido. Reordenar 500 unidades.</li>
            <li>🔥 Lanzar grupo de <span className="font-bold">Mascara LED</span>, demanda detectada en TikTok AR.</li>
            <li>⚠️ <span className="font-bold">Smartwatch X9</span>: stock se agota en 4 días al ritmo actual.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, up }: { icon: typeof TrendingUp; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-4 w-4" /></span>
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-success" : "text-destructive"}`}>
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {delta}
        </span>
      </div>
      <p className="mt-3 font-display text-xl">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
