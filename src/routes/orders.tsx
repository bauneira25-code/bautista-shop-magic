import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, CheckCircle2, Sparkles, Clock, MapPin, Phone, CreditCard } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_ORDERS, formatARS } from "@/lib/mockData";
import { useUserOrders, type UserOrder } from "@/stores/userOrders";
import { CustomerLiveOrders } from "@/components/CustomerLiveOrders";

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

const MODE_LABEL = {
  individual: "Compra individual",
  wholesale: "Pedido mayorista",
} as const;

const MODE_BADGE = {
  individual: "🛍",
  wholesale: "📦",
} as const;

function Orders() {
  const orders = useUserOrders((s) => s.orders);

  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <h1 className="font-display text-3xl">Mis pedidos</h1>
        <p className="text-xs text-muted-foreground">Seguimiento en tiempo real</p>
      </header>

      <CustomerLiveOrders />

      <div className="space-y-4 px-5">
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-xs text-muted-foreground">
            Todavía no tenés compras propias. Las que hagas aparecen acá.
          </div>
        )}

        {orders.map((o) => (
          <UserOrderCard key={o.id} order={o} />
        ))}

        {orders.length > 0 && (
          <p className="pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pedidos de ejemplo</p>
        )}

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

function UserOrderCard({ order }: { order: UserOrder }) {
  const stepIndex = STATUS_STEPS.findIndex((s) => s.id === order.status);
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black uppercase text-primary-foreground">
          {MODE_BADGE[order.mode]} {MODE_LABEL[order.mode]}
        </span>
        <span className="text-[10px] font-bold uppercase text-muted-foreground">#{order.id}</span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {new Date(order.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
      </p>

      {/* Items */}
      <div className="mt-3 space-y-2">
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-2">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: it.gradient }}>
              {it.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold">{it.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {it.quantity} × {formatARS(it.unitPrice)}
                {it.customization && <span className="ml-1 rounded bg-primary/15 px-1 text-[9px] font-bold text-primary">PERSONALIZADO</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Group countdown */}
      {order.mode === "group" && order.groupEndsAt && (
        <GroupCountdown order={order} />
      )}

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
          <div className="absolute inset-y-0 left-0" style={{ width: `${order.progress}%`, background: "var(--gradient-primary)" }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">⏱ {order.eta}</p>
      </div>

      {/* Shipping details */}
      <div className="mt-4 space-y-1.5 rounded-2xl border border-border bg-secondary/30 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {order.delivery === "envio" ? "📦 Detalles de envío" : "🏬 Retiro en depósito"}
        </p>
        {order.delivery === "envio" && order.shippingAddress && (
          <p className="flex items-start gap-1.5 text-[11px]"><MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {order.shippingAddress}</p>
        )}
        {order.receiver && (
          <p className="flex items-center gap-1.5 text-[11px]"><Phone className="h-3 w-3 shrink-0 text-primary" /> {order.receiver.nombre} {order.receiver.apellido} · {order.receiver.telefono}</p>
        )}
        <p className="flex items-center gap-1.5 text-[11px]"><CreditCard className="h-3 w-3 shrink-0 text-primary" /> {order.paymentMethod}{order.cardLast4 ? ` ···· ${order.cardLast4}` : ""}</p>
        <p className="pt-1 text-[11px] font-bold text-primary">Total · {formatARS(order.total)} · {totalQty} unidad{totalQty === 1 ? "" : "es"}</p>
      </div>

      {order.whatsappNotify && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-success/10 px-2.5 py-1.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <MessageCircle className="h-3 w-3" /> Te avisaremos con una notificación cuando se complete el grupo
          </p>
          <NotifyButton />
        </div>
      )}
    </div>
  );
}

function GroupCountdown({ order }: { order: UserOrder }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = Math.max(0, (order.groupEndsAt ?? 0) - now);
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const joined = order.groupJoined ?? 0;
  const target = order.groupTarget ?? 0;
  const pct = target ? (joined / target) * 100 : 0;

  return (
    <div className="mt-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
          <Users className="h-3.5 w-3.5" /> {joined} de {target} en el grupo
        </p>
        <p className="flex items-center gap-1 text-[11px] font-bold text-primary">
          <Clock className="h-3 w-3" /> {fmt(h)}:{fmt(m)}:{fmt(s)}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        {remaining > 0 ? <>Cierra en {h}h {m}m</> : "Cerrado · procesando"}
      </p>
    </div>
  );
}
