import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, CheckCircle2, Sparkles, Clock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_ORDERS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/orders")({
  component: Orders,
});

const STATUS_STEPS = [
  { id: "processing", label: "Procesando", icon: Clock },
  { id: "customization", label: "Personalización", icon: Sparkles },
  { id: "packaging", label: "Empaquetado", icon: Package },
  { id: "shipping", label: "En camino", icon: Truck },
  { id: "delivered", label: "Entregado", icon: CheckCircle2 },
];

function Orders() {
  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <h1 className="font-display text-3xl">Mis pedidos</h1>
        <p className="text-xs text-muted-foreground">Seguimiento en tiempo real</p>
      </header>

      <div className="space-y-4 px-5">
        {MOCK_ORDERS.map((o) => {
          const stepIndex = STATUS_STEPS.findIndex((s) => s.id === o.status);
          return (
            <div key={o.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl" style={{ background: o.product.gradient }}>{o.product.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">#{o.id}</p>
                    <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">{o.mode}</span>
                  </div>
                  <p className="line-clamp-1 text-sm font-semibold">{o.product.title}</p>
                  <p className="text-xs text-muted-foreground">{o.qty} unidad · {formatARS(o.product.price[o.mode] * o.qty)}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.map((s, i) => {
                    const done = i <= stepIndex;
                    const Icon = s.icon;
                    return (
                      <div key={s.id} className="flex flex-col items-center gap-1">
                        <span className={`grid h-8 w-8 place-items-center rounded-full ${done ? "text-primary-foreground" : "bg-secondary text-muted-foreground"}`} style={done ? { background: "var(--gradient-primary)" } : undefined}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className={`text-[8.5px] ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="relative mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="absolute inset-y-0 left-0" style={{ width: `${o.progress}%`, background: "var(--gradient-primary)" }} />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{o.eta}</span>
                <Link to="/products/$slug" params={{ slug: o.product.slug }} className="font-semibold text-primary">Ver detalle →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
