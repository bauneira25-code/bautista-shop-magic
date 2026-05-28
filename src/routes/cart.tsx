import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, Lock, CreditCard, Truck, Store, Check, X, User, Mail, Phone, MapPin } from "lucide-react";
import { useLocalCart } from "@/stores/localCart";
import { formatARS, findProduct } from "@/lib/mockData";
import { useUserAuth } from "@/stores/userAuth";
import { PaymentMethodsSheet } from "@/components/PaymentMethodsSheet";
import { useUserOrders } from "@/stores/userOrders";
import { toast } from "sonner";
import { QtyInput } from "@/components/QtyInput";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});


const SHIPPING_FEE = 1800;
const ORANGE = "#e8451c";

function CartPage() {
  const items = useLocalCart((s) => s.items);
  const setQty = useLocalCart((s) => s.setQty);
  const remove = useLocalCart((s) => s.remove);
  const clear = useLocalCart((s) => s.clear);
  const navigate = useNavigate();
  const user = useUserAuth((s) => s.user);
  const setUser = useUserAuth((s) => s.setUser);

  const [delivery, setDelivery] = useState<"envio" | "retiro">("envio");
  const [showRegister, setShowRegister] = useState(false);
  const [showPayMethods, setShowPayMethods] = useState(false);
  const [paid, setPaid] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const designTotal = items.reduce((s, i) => s + (i.customFee ?? 0) * (i.customQty ?? 0), 0);
  const importTotal = items.reduce((s, i) => s + (i.importShippingFee ?? 0) * i.quantity, 0);
  const shippingFee = delivery === "envio" ? SHIPPING_FEE : 0;
  const total = subtotal + designTotal + importTotal + shippingFee;
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const modeLabel = (m: string) =>
    m === "wholesale" ? "Mayorista" : "Individual";

  const addOrder = useUserOrders((s) => s.add);

  const finishPay = (info: { method: string; cardLast4?: string }) => {
    setShowPayMethods(false);
    setPaid(true);
    const desc = info.cardLast4
      ? `${info.method} ···· ${info.cardLast4}`
      : info.method;
    toast.success("¡Pago confirmado!", { description: desc });

    const customerName = user ? `${user.nombre} ${user.apellido}`.trim() : "Invitado";
    const customerPhone = user?.telefono ?? null;

    // 1) Persistir en Supabase: una fila por item (lo que ve el admin panel)
    const rows = items.map((i) => ({
      customer_name: customerName,
      customer_phone: customerPhone,
      product_slug: i.slug,
      product_title: i.title,
      product_emoji: i.emoji,
      product_gradient: i.gradient,
      unit_price: i.unitPrice,
      cost: Math.round(i.unitPrice * 0.4),
      quantity: i.quantity,
      status: "pago_confirmado" as const,
      is_customized: false,
      notes: [
        i.variant ? `Variante: ${i.variant}` : null,
        i.color ? `Color: ${i.color}` : null,
        `Modo: ${i.mode}`,
        `Entrega: ${delivery}${user?.direccion ? ` · ${user.direccion}` : ""}`,
        `Pago: ${info.method}${info.cardLast4 ? ` ····${info.cardLast4}` : ""}`,
      ].filter(Boolean).join(" | "),
    }));
    if (rows.length > 0) {
      supabase.from("orders").insert(rows).then(({ error }) => {
        if (error) console.error("orders insert error", error);
      });
    }

    // 2) Mantener el orders local del cliente (lo que ve en /orders)
    const byMode = items.reduce<Record<string, typeof items>>((acc, it) => {
      (acc[it.mode] ||= []).push(it);
      return acc;
    }, {});
    Object.entries(byMode).forEach(([mode, list]) => {
      const orderTotal =
        list.reduce((s, i) => s + i.unitPrice * i.quantity, 0) +
        list.reduce((s, i) => s + (i.importShippingFee ?? 0) * i.quantity, 0) +
        list.reduce((s, i) => s + (i.customFee ?? 0) * (i.customQty ?? 0), 0) +
        (delivery === "envio" ? SHIPPING_FEE : 0);

      // Detectar si algún item es de importador a pedido (requiere importación)
      const importerItem = list
        .map((i) => findProduct(i.slug))
        .find((p) => p && p.sellerKind === "importer" && p.stockLocation === "factory");
      const isImport = !!importerItem;
      const importerName = importerItem?.sellerName;

      // ETA basada en método de importación elegido + personalización (+4 días)
      const importItem = list.find((i) => i.importShipping);
      const hasCustom = list.some((i) => (i.customQty ?? 0) > 0);
      const extra = hasCustom ? " (+4 días por personalización)" : "";
      const importEta = importItem?.importShipping === "aire"
        ? `Entre 15 y 30 días por avión${extra}`
        : importItem?.importShipping === "barco"
        ? `Entre 30 y 45 días por barco${extra}`
        : `Entre 15 y 30 días llega tu producto${extra}`;

      addOrder({
        id: `NB-${Date.now().toString().slice(-6)}-${mode.slice(0, 1).toUpperCase()}`,
        createdAt: Date.now(),
        mode: mode as "individual" | "wholesale",
        items: list.map((i) => ({
          slug: i.slug,
          title: i.title,
          emoji: i.emoji,
          gradient: i.gradient,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          variant: i.variant,
          color: i.color,
          customQty: i.customQty,
        })),
        total: orderTotal,
        paymentMethod: info.method,
        cardLast4: info.cardLast4,
        delivery,
        shippingAddress: user?.direccion,
        receiver: user
          ? { nombre: user.nombre, apellido: user.apellido, telefono: user.telefono }
          : undefined,
        status: "processing",
        progress: isImport ? 8 : 10,
        eta: isImport
          ? importEta
          : delivery === "envio" ? "Llega en 3 a 5 días" : "Listo para retirar en 48h",
        isImport,
        importerName,
      });
    });

    setTimeout(() => {
      clear();
      navigate({ to: "/orders" });
    }, 1500);
  };

  const handlePay = () => {
    if (!user) {
      setShowRegister(true);
      return;
    }
    setShowPayMethods(true);
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-white pb-44 text-neutral-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate({ to: "/" })}
          className="grid h-10 w-10 place-items-center rounded-full bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 text-[#e8451c]" />
        </button>
        <h1 className="font-display text-base">Mi carrito</h1>
        {items.length > 0 ? (
          <button
            onClick={() => { clear(); toast.success("Carrito vaciado"); }}
            className="text-[11px] font-bold text-[#e8451c]"
          >
            Vaciar
          </button>
        ) : <span className="w-10" />}
      </header>

      {items.length === 0 ? (
        <div className="grid place-items-center px-6 pt-32 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-orange-50 text-4xl">🛒</div>
          <p className="mt-4 font-display text-xl">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-neutral-500">Descubrí productos virales y comprá en grupo para ahorrar.</p>
          <Link
            to="/"
            className="mt-6 rounded-2xl bg-[#e8451c] px-6 py-3 font-display text-sm text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4 px-4 pt-4">
          {/* Productos */}
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3 rounded-2xl border border-orange-100 bg-white p-3">
                <Link
                  to="/products/$slug"
                  params={{ slug: it.slug }}
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-3xl"
                  style={{ background: it.gradient }}
                >
                  {it.emoji}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-semibold">{it.title}</p>
                    <button onClick={() => remove(it.id)} className="text-neutral-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-md bg-[#e8451c] px-1.5 py-0.5 text-[10px] font-bold text-white">{modeLabel(it.mode)}</span>
                    {it.variant && <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] text-neutral-700">{it.variant}</span>}
                    {it.color && <span className="grid h-4 w-4 rounded-full border border-neutral-300" style={{ background: it.color }} />}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(it.id, it.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-orange-50 text-[#e8451c]"><Minus className="h-3 w-3" /></button>
                      <QtyInput
                        value={it.quantity}
                        onChange={(n) => setQty(it.id, n)}
                        className="w-14 rounded-md border border-orange-200 bg-white py-0.5 text-center text-sm font-bold text-neutral-900 focus:border-[#e8451c] focus:outline-none"
                      />
                      <button onClick={() => setQty(it.id, it.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#e8451c] text-white"><Plus className="h-3 w-3" /></button>
                    </div>
                    <p className="font-display text-base text-[#e8451c]">{formatARS(it.unitPrice * it.quantity)}</p>
                  </div>
                  {it.customQty && it.customFee ? (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-fuchsia-50 px-2 py-1.5 text-[10px] text-fuchsia-700">
                      <span>Personaliza tu producto por {formatARS(it.customFee)} · {it.customQty} u.</span>
                      <span className="font-bold">+{formatARS(it.customFee * it.customQty)}</span>
                    </div>
                  ) : null}
                  {it.importShipping && it.importShippingFee ? (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-amber-50 px-2 py-1.5 text-[10px] text-amber-800">
                      <span>
                        {it.importShipping === "aire" ? "✈️ Por avión · 15-30 días" : "🚢 Por barco · 30-45 días"}
                        {" "}({formatARS(it.importShippingFee)}/u)
                      </span>
                      <span className="font-bold">+{formatARS(it.importShippingFee * it.quantity)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Entrega */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">¿Cómo lo recibís?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDelivery("envio")}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${delivery === "envio" ? "border-[#e8451c] bg-orange-50" : "border-neutral-200 bg-white"}`}
              >
                <Truck className="h-4 w-4 text-[#e8451c]" />
                <div>
                  <p className="text-[11px] font-bold text-neutral-900">Envío</p>
                  <p className="text-[10px] text-neutral-500">{formatARS(SHIPPING_FEE)}</p>
                </div>
              </button>
              <button
                onClick={() => setDelivery("retiro")}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${delivery === "retiro" ? "border-[#e8451c] bg-orange-50" : "border-neutral-200 bg-white"}`}
              >
                <Store className="h-4 w-4 text-[#e8451c]" />
                <div>
                  <p className="text-[11px] font-bold text-neutral-900">Retiro depósito</p>
                  <p className="text-[10px] text-neutral-500">Sin costo</p>
                </div>
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 text-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Resumen</p>
            <Row label={`Productos (${count})`} value={formatARS(subtotal)} />
            {designTotal > 0 && (
              <Row
                label={<span className="text-fuchsia-700">Personalización</span>}
                value={<span className="font-bold text-fuchsia-700">+{formatARS(designTotal)}</span>}
              />
            )}
            {importTotal > 0 && (
              <Row
                label={<span className="text-amber-800">Importación (a pedido)</span>}
                value={<span className="font-bold text-amber-800">+{formatARS(importTotal)}</span>}
              />
            )}
            <Row
              label="Envío"
              value={delivery === "envio" ? formatARS(SHIPPING_FEE) : <span className="font-bold text-[#e8451c]">Gratis</span>}
            />
            <div className="my-2 h-px bg-orange-100" />
            <Row
              label={<span className="font-bold text-neutral-900">Total</span>}
              value={<span className="font-display text-xl font-black text-[#e8451c]">{formatARS(total)}</span>}
            />
          </div>
        </div>
      )}

      {/* Sticky pay CTA */}
      {items.length > 0 && (
        <div className="fixed bottom-3 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 space-y-2 px-3">
          <button
            onClick={handlePay}
            className="w-full rounded-2xl bg-[#e8451c] py-4 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
          >
            <Lock className="mr-2 inline h-4 w-4" /> PAGAR · {formatARS(total)}
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full rounded-2xl border border-[#e8451c]/40 bg-white py-3 text-xs font-bold text-[#e8451c]"
          >
            🛒 Seguir navegando
          </button>
        </div>
      )}

      {/* Registration sheet */}
      {showRegister && (
        <RegisterSheet
          onClose={() => setShowRegister(false)}
          onDone={(u) => {
            setUser(u);
            setShowRegister(false);
            toast.success("Cuenta creada ✨");
            setTimeout(() => setShowPayMethods(true), 300);
          }}
        />
      )}

      {showPayMethods && (
        <PaymentMethodsSheet total={total} onClose={() => setShowPayMethods(false)} onPaid={finishPay} />
      )}

      {paid && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#e8451c]">
            <Check className="h-12 w-12 text-white" />
          </div>
          <p className="mt-4 font-display text-lg">¡Pago confirmado!</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-neutral-700">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function RegisterSheet({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: (u: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    direccion: string;
  }) => void;
}) {
  const [f, setF] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });
  const valid =
    f.nombre.trim().length > 1 &&
    f.apellido.trim().length > 1 &&
    f.dni.trim().length > 5 &&
    /\S+@\S+\.\S+/.test(f.email) &&
    f.telefono.trim().length > 5 &&
    f.direccion.trim().length > 3;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] border-t border-orange-100 bg-white p-5 pb-8 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl">Antes de pagar, registrate</h3>
            <p className="text-xs text-neutral-500">Solo te lo pedimos una vez.</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input icon={<User className="h-4 w-4" />} value={f.nombre} onChange={upd("nombre")} placeholder="Nombre" />
            <Input icon={<User className="h-4 w-4" />} value={f.apellido} onChange={upd("apellido")} placeholder="Apellido" />
          </div>
          <Input icon={<CreditCard className="h-4 w-4" />} value={f.dni} onChange={upd("dni")} placeholder="DNI" inputMode="numeric" />
          <Input icon={<Mail className="h-4 w-4" />} value={f.email} onChange={upd("email")} placeholder="Email" type="email" />
          <Input icon={<Phone className="h-4 w-4" />} value={f.telefono} onChange={upd("telefono")} placeholder="Teléfono" inputMode="tel" />
          <Input icon={<MapPin className="h-4 w-4" />} value={f.direccion} onChange={upd("direccion")} placeholder="Dirección de envío" />

          <button
            disabled={!valid}
            onClick={() => onDone(f)}
            className="mt-2 w-full rounded-2xl bg-[#e8451c] py-4 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)] disabled:opacity-40"
          >
            <CreditCard className="mr-2 inline h-4 w-4" /> CONTINUAR A PAGAR
          </button>
          <p className="text-center text-[10px] text-neutral-400">
            Al continuar aceptás los términos de NEIBA.
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode },
) {
  const { icon, className, ...rest } = props;
  return (
    <label className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#e8451c]">
      <span className="text-[#e8451c]">{icon}</span>
      <input
        {...rest}
        className={`w-full border-0 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${className ?? ""}`}
      />
    </label>
  );
}
