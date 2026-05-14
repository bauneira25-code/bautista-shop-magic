import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles, Package, Truck, CheckCircle2, Flame, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCustomerOrderIds } from "@/stores/customerOrderIds";
import { toast } from "sonner";

type LiveOrder = {
  id: string; status: string; product_title: string; product_emoji: string | null;
  product_gradient: string | null; quantity: number; unit_price: number;
  is_customized: boolean; tracking_code: string | null; created_at: string;
};

const STEPS = [
  { id: "processing", label: "Procesando", icon: Clock },
  { id: "customization", label: "Personalización", icon: Sparkles },
  { id: "packaging", label: "Empaquetado", icon: Package },
  { id: "shipping", label: "En camino", icon: Truck },
  { id: "delivered", label: "Entregado", icon: CheckCircle2 },
];

function statusToStep(s: string, isCustom: boolean): { step: number; blinkNext?: boolean; banner?: string } {
  switch (s) {
    case "pedido_creado": case "pago_pendiente": case "pago_confirmado":
    case "diseno_aprobado": case "pendiente_personalizacion": case "cola_produccion":
      return { step: 0 };
    case "enviando_maquina": case "imprimiendo": case "en_produccion":
      return { step: 1, banner: "🔥 Tu producto ya está siendo personalizado" };
    case "personalizado_terminado": case "impreso": case "control_calidad": case "listo_empaquetar":
      return { step: isCustom ? 2 : 1, banner: "✨ Tu producto está casi listo, pasando a empaquetado" };
    case "empaquetado":
      return { step: isCustom ? 2 : 1, blinkNext: true, banner: "✅ Empaquetado · ya va para tu dirección" };
    case "enviado":
      return { step: isCustom ? 3 : 2, banner: "🚚 En camino a tu dirección" };
    case "entregado":
      return { step: 4, banner: "🎉 Entregado · ¡gracias!" };
    case "cancelado": case "reembolsado":
      return { step: 0, banner: "⚠️ Pedido cancelado" };
    case "rehacer":
      return { step: 0, banner: "🔁 Rehaciendo tu pedido" };
    default: return { step: 0 };
  }
}

export function CustomerLiveOrders() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const ids = useRef<string[]>([]);
  const lastStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    ids.current = getCustomerOrderIds();
    if (ids.current.length === 0) return;

    const load = async () => {
      const { data } = await supabase.from("orders").select("*").in("id", ids.current);
      const list = (data ?? []) as any as LiveOrder[];
      // Disparar toast si cambió el estado
      list.forEach(o => {
        const prev = lastStatuses.current[o.id];
        if (prev && prev !== o.status) {
          const info = statusToStep(o.status, o.is_customized);
          if (info.banner) toast(info.banner, { description: o.product_title });
        }
        lastStatuses.current[o.id] = o.status;
      });
      list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      setOrders(list);
    };

    load();
    const ch = supabase.channel("customer-orders")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload: any) => {
        if (ids.current.includes(payload.new?.id)) load();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (orders.length === 0) return null;

  return (
    <section className="px-5 mb-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative grid h-2 w-2 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
          <span className="relative h-2 w-2 rounded-full bg-success" />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-success">En vivo</p>
      </div>

      <div className="space-y-3">
        {orders.map(o => <LiveCard key={o.id} order={o} />)}
      </div>
    </section>
  );
}

function LiveCard({ order }: { order: LiveOrder }) {
  const info = statusToStep(order.status, order.is_customized);
  // Si el producto NO es personalizado, el step de Personalización se oculta visualmente
  const visibleSteps = order.is_customized ? STEPS : STEPS.filter(s => s.id !== "customization");

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
          style={{ background: order.product_gradient ?? "var(--gradient-primary)" }}>
          {order.product_emoji ?? "📦"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {order.is_customized && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-black uppercase text-primary inline-flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> PERSONALIZADO
              </span>
            )}
            <span className="text-[10px] font-bold uppercase text-muted-foreground">#{order.id.slice(0, 8)}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-semibold">{order.product_title}</p>
          <p className="text-[11px] text-muted-foreground">{order.quantity} unidad · ${Number(order.unit_price).toLocaleString("es-AR")}</p>
        </div>
      </div>

      {info.banner && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-[12px] font-semibold text-primary">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{info.banner}</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {visibleSteps.map((s, i) => {
          const fullIndex = STEPS.findIndex(x => x.id === s.id);
          // mapear info.step (en escala completa) al index visible
          const adjusted = order.is_customized
            ? info.step
            : (info.step >= 1 ? info.step + (info.step >= 1 ? 1 : 0) : 0); // ajustar escala
          const realIndex = order.is_customized ? fullIndex : (fullIndex > 1 ? fullIndex - 1 : fullIndex);
          const done = realIndex <= adjusted;
          const blink = info.blinkNext && realIndex === adjusted + 1;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  done ? "text-primary-foreground" : blink ? "bg-primary/20 text-primary animate-pulse ring-2 ring-primary" : "bg-secondary text-muted-foreground"
                }`}
                style={done ? { background: "var(--gradient-primary)" } : undefined}
              >
                {s.id === "customization" && info.step === 1 ? <Flame className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <span className={`text-[9px] text-center ${done || blink ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {order.tracking_code && (
        <p className="mt-3 rounded-xl bg-secondary/40 px-3 py-2 text-[11px] text-foreground">
          📦 Tracking: <span className="font-mono font-bold">{order.tracking_code}</span>
        </p>
      )}
    </div>
  );
}
