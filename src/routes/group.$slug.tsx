import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Clock, Share2, Sparkles, Flame, Eye, Gift, Copy, Zap, TrendingUp, MapPin,
  Flame as Fire, Upload, Type, Palette, Check, CreditCard, X, Lock,
} from "lucide-react";
import { findProduct, formatARS } from "@/lib/mockData";
import { toast } from "sonner";
import { useLocalCart } from "@/stores/localCart";
import { PaymentMethodsSheet } from "@/components/PaymentMethodsSheet";
import { MultiDesignSheet, type DesignData } from "@/components/MultiDesignSheet";
import { PurchaseSteps } from "@/components/PurchaseSteps";
import { QtyInput } from "@/components/QtyInput";

export const Route = createFileRoute("/group/$slug")({
  component: GroupPage,
});

const FAKE_NAMES = ["Lucas", "Mica", "Tomás", "Sofi", "Naza", "Vale", "Bruno", "Flor", "Joaco", "Cami", "Iván", "Pili", "Rocío", "Nico", "Lara"];
const NEIGHBORHOODS = ["Palermo", "Caballito", "Recoleta", "Belgrano", "Núñez", "Villa Crespo", "San Telmo", "Almagro", "Flores"];
const STYLES = ["Minimal", "Neón", "Retro", "Y2K", "Anime", "Grafitti"];
const COLORS = ["#000000", "#ffffff", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

type Step = "browse" | "intro" | "customize" | "summary" | "paid";

function GroupPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const addToCart = useLocalCart((s) => s.add);

  const [seconds, setSeconds] = useState(842);
  const [joined, setJoined] = useState(product?.groupJoined ?? 0);
  const [viewers, setViewers] = useState(2381);
  const [feed, setFeed] = useState<{ name: string; hood: string; ago: string; key: number }[]>([]);

  // Flow state
  const [step, setStep] = useState<Step>("browse");
  const [skipCustom, setSkipCustom] = useState(false);
  const [custText, setCustText] = useState("");
  const [custStyle, setCustStyle] = useState<string>("Minimal");
  const [custColor, setCustColor] = useState<string>(product?.colors?.[0] ?? "#000000");
  const [custImage, setCustImage] = useState<string | null>(null);
  const [custImageData, setCustImageData] = useState<string | null>(null);
  const [customAdded, setCustomAdded] = useState(false);
  const [delivery, setDelivery] = useState<"envio" | "retiro">("envio");
  const [payQty, setPayQty] = useState(1);
  const [showPay, setShowPay] = useState(false);
  const [showMulti, setShowMulti] = useState(false);

  const addDesignToCart = (d: DesignData, idx: number) => {
    if (!product) return;
    addToCart({
      id: `${product.slug}-group-d${idx}-${Date.now()}`,
      slug: product.slug,
      title: product.title,
      emoji: product.emoji,
      gradient: product.gradient,
      mode: "group",
      unitPrice: product.price.group,
      quantity: d.units,
      color: custColor,
      customization: { text: d.text, style: custStyle, imageName: d.imageName },
    });
  };

  const onPickImage = (file: File | undefined) => {
    if (!file) return;
    setCustImage(file.name);
    const r = new FileReader();
    r.onload = () => setCustImageData(typeof r.result === "string" ? r.result : null);
    r.readAsDataURL(file);
  };

  const addIndividualToCart = () => {
    addToCart({
      id: `${product!.slug}-ind-${Date.now()}`,
      slug: product!.slug,
      title: product!.title,
      emoji: product!.emoji,
      gradient: product!.gradient,
      mode: "individual",
      unitPrice: product!.price.individual,
      quantity: 1,
    });
    toast.success("Añadido al carrito 🛒", { description: product!.title });
  };

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 7) - 2), 2400);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
      const hood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
      setFeed((f) => [{ name, hood, ago: "ahora", key: Date.now() }, ...f].slice(0, 6));
    }, 5500);
    return () => clearInterval(t);
  }, []);

  if (!product) return null;
  const target = product.groupTarget;
  const pct = (joined / target) * 100;
  const missing = Math.max(0, target - joined);
  const maxQty = Math.max(1, missing);
  const almostFull = pct >= 70;
  useEffect(() => { if (payQty > maxQty) setPayQty(maxQty); }, [maxQty, payQty]);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const startJoin = () => {
    if (product.customizable) setStep("customize");
    else { setSkipCustom(true); setStep("summary"); }
  };

  const confirmCustom = () => setStep("summary");
  const skip = () => { setSkipCustom(true); setStep("summary"); };

  const confirmPay = (info: { method: string; cardLast4?: string }) => {
    setShowPay(false);
    setJoined((j) => Math.min(target, j + 1));
    addToCart({
      id: `${product.slug}-group-${Date.now()}`,
      slug: product.slug,
      title: product.title,
      emoji: product.emoji,
      gradient: product.gradient,
      mode: "group",
      unitPrice: product.price.group,
      quantity: payQty,
      color: skipCustom ? undefined : custColor,
      customization: skipCustom ? undefined : {
        text: custText || undefined,
        style: custStyle,
        imageName: custImage ?? undefined,
      },
    });
    setStep("paid");
    const desc = info.cardLast4 ? `${info.method} ···· ${info.cardLast4}` : info.method;
    toast.success("¡Estás dentro del grupo!", { description: desc });
  };

  const share = () => {
    navigator.clipboard?.writeText(`https://neiba.app/group/${slug}`).catch(() => {});
    toast.success("Link copiado ✨", { description: "Si se suman 2 amigos, ganás 20% extra OFF." });
  };

  const milestones = useMemo(() => Array.from({ length: target }, (_, i) => i + 1), [target]);
  const CUSTOM_FEE = 2300;
  const SHIPPING_FEE = 1800;
  const hasCustom = customAdded && (!!custText || !!custImage);
  const customFee = hasCustom ? CUSTOM_FEE * payQty : 0;
  const shippingFee = delivery === "envio" ? SHIPPING_FEE : 0;
  const total = product.price.group * payQty + customFee + shippingFee;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-white pb-32 text-neutral-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => navigate({ to: "/products/$slug", params: { slug } })} className="grid h-10 w-10 place-items-center rounded-full bg-orange-50">
          <ArrowLeft className="h-4 w-4 text-[#e8451c]" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8451c] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8451c]" />
          </span>
          <span className="text-[11px] font-bold text-[#e8451c]">EN VIVO</span>
        </div>
        <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-orange-50">
          <Share2 className="h-4 w-4 text-[#e8451c]" />
        </button>
      </header>

      {/* Hero simple: imagen producto + número */}
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="relative grid aspect-[16/10] place-items-center text-7xl" style={{ background: product.gradient }}>
            <span>{product.emoji}</span>
            {almostFull && (
              <span className="absolute right-3 top-3 rounded-full bg-[#e8451c] px-2.5 py-1 text-[10px] font-black uppercase text-white">⚠ Casi completo</span>
            )}
          </div>
          <div className="p-4">
            <h1 className="font-display text-lg leading-tight">{product.title}</h1>

            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-5xl font-black leading-none text-[#e8451c]">{joined}</span>
              <span className="font-display text-2xl font-bold text-neutral-400">/{target}</span>
              <span className="ml-auto text-xs text-neutral-500">{missing > 0 ? `Faltan ${missing}` : "Completo 🎉"}</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-orange-50">
              <div className="h-full rounded-full bg-[#e8451c] transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Precio grupo</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black text-neutral-900">{formatARS(product.price.group)}</span>
                  <span className="text-xs text-neutral-400 line-through">{formatARS(product.price.individual)}</span>
                </div>
              </div>
              <span className="rounded-md bg-[#e8451c] px-2 py-0.5 text-[11px] font-black text-white">
                -{Math.round((1 - product.price.group / product.price.individual) * 100)}%
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-[11px] font-semibold text-[#e8451c]">
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Cierra en</span>
              <span className="font-display text-base tabular-nums">{fmt(h)}:{fmt(m)}:{fmt(s)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personalizar inline */}
      {product.customizable && (
        <section className="mt-4 px-4">
          <button onClick={() => setStep("intro")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8451c] py-3.5 font-display text-sm font-black text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.5)]">
            <Flame className="h-4 w-4" /> PERSONALIZAR
          </button>
        </section>
      )}

      {/* Cantidad */}
      <section className="mt-3 px-4">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-3">
          <div>
            <p className="text-xs font-bold text-neutral-900">Unidades</p>
            <p className="text-[10px] text-neutral-500">Elegí cuántas querés sumar al grupo</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPayQty(Math.max(1, payQty - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-orange-50 text-[#e8451c]"><span className="text-xl leading-none">−</span></button>
            <QtyInput value={payQty} onChange={setPayQty} className="w-16 rounded-md border border-orange-200 bg-white py-1 text-center font-display text-base text-neutral-900 focus:border-[#e8451c] focus:outline-none" />
            <button onClick={() => setPayQty(payQty + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-[#e8451c] text-white"><span className="text-xl leading-none">+</span></button>
          </div>
        </div>
      </section>

      {/* Pasos compra grupal */}
      <section className="mt-4 px-4">
        <PurchaseSteps mode="group" />
      </section>

      {/* Compartir */}
      <section className="mt-4 px-4">
        <button onClick={share} className="flex w-full items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8451c]"><Gift className="h-4 w-4 text-white" /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-900">Compartí y ganá 20% extra OFF</p>
            <p className="text-[11px] text-neutral-500">Si 2 amigos se suman con tu link</p>
          </div>
          <Copy className="h-4 w-4 text-[#e8451c]" />
        </button>
      </section>

      {/* Live mini-feed */}
      <section className="mt-4 px-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">⚡ Entrando ahora · {viewers.toLocaleString("es-AR")} mirando</p>
        <div className="space-y-1.5">
          {(feed.length ? feed : [
            { name: "Lucas", hood: "Palermo", ago: "hace 30 seg", key: 1 },
            { name: "Mica", hood: "Caballito", ago: "hace 1 min", key: 2 },
          ]).slice(0, 3).map((a) => (
            <div key={a.key} className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8451c] text-[11px] font-bold text-white">{a.name[0]}</span>
              <p className="flex-1 text-xs text-neutral-700"><b>{a.name}</b> de {a.hood} se unió</p>
              <span className="text-[10px] text-neutral-400">{a.ago}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="rounded-2xl border border-orange-200 bg-white p-2.5 shadow-[0_10px_40px_-10px_rgba(232,69,28,0.4)]">
          {hasCustom && (
            <p className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#e8451c]">
              <Check className="h-3 w-3" /> Personalización agregada
            </p>
          )}
          <div className="flex items-center gap-2">
            <button onClick={addIndividualToCart} className="shrink-0 rounded-xl border border-[#e8451c] bg-white px-3 py-3 text-[11px] font-bold text-[#e8451c]">
              + Carrito
            </button>
            <button onClick={() => setStep("summary")} className="flex-1 rounded-xl bg-[#e8451c] py-3 font-display text-sm font-black tracking-wider text-white">
              <span className="inline-flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" /> UNIRME AL GRUPO
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* INTRO SHEET — confirmación previa */}
      {step === "intro" && (
        <Sheet onClose={() => setStep("browse")} title="Personalizá tu producto" subtitle={`${joined} de ${target} ya se unieron`}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#e8451c]">Producto</p>
              <p className="mt-1 font-display text-lg font-black text-neutral-900">{product.title}</p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900">¿Cuántas unidades?</p>
                  <p className="text-[10px] text-neutral-500">Si son 2 o más, podés hacer diseños distintos</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPayQty(Math.max(1, payQty - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-[#e8451c]"><span className="text-lg leading-none">−</span></button>
                  <QtyInput value={payQty} onChange={setPayQty} className="w-14 rounded-md border border-orange-200 bg-white py-0.5 text-center font-display text-base text-neutral-900 focus:border-[#e8451c] focus:outline-none" />
                  <button onClick={() => setPayQty(payQty + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#e8451c] text-white"><span className="text-lg leading-none">+</span></button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (payQty >= 2) {
                  setStep("browse");
                  setShowMulti(true);
                } else {
                  setStep("customize");
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8451c] py-3.5 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              <Flame className="h-4 w-4" /> PERSONALIZAR {payQty >= 2 ? `${payQty} UNIDADES` : ""}
            </button>
          </div>
        </Sheet>
      )}

      {/* CUSTOMIZE SHEET */}
      {step === "customize" && (
        <Sheet onClose={() => setStep("browse")} title="Personalizá tu unidad" subtitle={`${joined} de ${target} ya se unieron`}>
          <div className="space-y-5">
            {/* Progreso del grupo */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#e8451c]">Grupo en marcha</p>
                <p className="font-display text-sm font-black text-[#e8451c]">{joined} de {target}</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#e8451c] transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-neutral-500">{missing > 0 ? `Faltan ${missing} para completar` : "¡Grupo completo!"}</p>
            </div>

            {/* Preview producto */}
            <div className="relative grid h-44 place-items-center overflow-hidden rounded-3xl" style={{ background: product.gradient }}>
              {custImageData ? (
                <img src={custImageData} alt="custom" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              ) : (
                <span className="text-7xl drop-shadow-2xl">{product.emoji}</span>
              )}
              {custText && (
                <span className="absolute bottom-4 z-10 rounded-xl bg-black/70 px-3 py-1 font-display text-lg font-black text-white">{custText}</span>
              )}
            </div>

            <Field icon={<Type className="h-4 w-4" />} label="Texto / nombre">
              <input value={custText} onChange={(e) => setCustText(e.target.value.slice(0, 16))} placeholder="Tu nombre, frase…" maxLength={16}
                className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#e8451c]" />
            </Field>

            <Field icon={<Upload className="h-4 w-4" />} label="Subir imagen / logo">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-sm text-neutral-700">
                <span className="truncate">{custImage ?? "Tocá para elegir archivo"}</span>
                <span className="ml-2 rounded-lg bg-[#e8451c] px-2 py-1 text-[10px] font-bold text-white">{custImage ? "Cambiar" : "+"}</span>
                <input type="file" hidden accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0])} />
              </label>
              {custImageData && (
                <button onClick={() => { setCustImage(null); setCustImageData(null); }} className="mt-2 text-[11px] font-bold text-[#e8451c]">Quitar imagen</button>
              )}
            </Field>

            <button
              onClick={() => {
                setCustomAdded(true);
                setSkipCustom(false);
                setStep("summary");
              }}
              className="w-full rounded-xl bg-[#e8451c] py-3.5 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              <Zap className="mr-1 inline h-4 w-4" /> UNIRME AL GRUPO
            </button>
          </div>
        </Sheet>
      )}

      {/* SUMMARY / PAY SHEET */}
      {step === "summary" && (
        <Sheet onClose={() => setStep("browse")} title="Resumen y pago" subtitle="Confirmá para sumarte al grupo">
          <div className="space-y-4">
            <div className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
              <div className="grid h-16 w-16 place-items-center rounded-xl text-3xl" style={{ background: product.gradient }}>{product.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-900">{product.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded-md bg-[#e8451c] px-1.5 py-0.5 text-[10px] font-bold text-white">Grupal</span>
                  {!skipCustom && product.customizable && (
                    <>
                      <span className="rounded-md bg-orange-200 px-1.5 py-0.5 text-[10px] font-bold text-[#e8451c]">Personalizado</span>
                      {custText && <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-neutral-700">"{custText}"</span>}
                      <span className="grid h-4 w-4 rounded-full border border-neutral-300" style={{ background: custColor }} />
                    </>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">Reservás 1 lugar de {target}</p>
              </div>
            </div>

            {/* Cantidad */}
            <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-white px-3 py-2.5">
              <div>
                <p className="text-xs font-bold text-neutral-900">Unidades</p>
                <p className="text-[10px] text-neutral-500">¿Cuántas reservás?</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setPayQty(Math.max(1, payQty - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-[#e8451c]"><span className="text-lg leading-none">−</span></button>
                <QtyInput value={payQty} onChange={setPayQty} className="w-14 rounded-md border border-orange-200 bg-white py-0.5 text-center font-display text-base text-neutral-900 focus:border-[#e8451c] focus:outline-none" />
                <button onClick={() => setPayQty(payQty + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#e8451c] text-white"><span className="text-lg leading-none">+</span></button>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
              <Row label={`Precio grupo (${payQty})`} value={formatARS(product.price.group * payQty)} />
              {hasCustom && <Row label={`Personalización (${payQty})`} value={formatARS(customFee)} />}
              <Row
                label="Envío"
                value={delivery === "envio" ? formatARS(SHIPPING_FEE) : <span className="text-[#e8451c] font-bold">Gratis</span>}
              />
              <div className="my-3 h-px bg-neutral-100" />
              <Row label={<span className="font-bold text-neutral-900">Total</span>} value={<span className="font-display text-xl font-black text-[#e8451c]">{formatARS(total)}</span>} />
              <p className="mt-2 text-[10px] text-neutral-500">⚡ Si el grupo no se completa, te devolvemos el 100%.</p>
            </div>

            {/* Entrega */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">¿Cómo lo recibís?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDelivery("envio")}
                  className={`rounded-xl border p-3 text-left transition ${delivery === "envio" ? "border-[#e8451c] bg-orange-50" : "border-neutral-200 bg-white"}`}
                >
                  <p className="text-[11px] font-bold text-neutral-900">Envío a domicilio</p>
                  <p className="text-[10px] text-neutral-500">3 a 5 días · {formatARS(SHIPPING_FEE)}</p>
                </button>
                <button
                  onClick={() => setDelivery("retiro")}
                  className={`rounded-xl border p-3 text-left transition ${delivery === "retiro" ? "border-[#e8451c] bg-orange-50" : "border-neutral-200 bg-white"}`}
                >
                  <p className="text-[11px] font-bold text-neutral-900">Retiro en depósito</p>
                  <p className="text-[10px] text-neutral-500">Sin costo · CABA</p>
                </button>
              </div>
            </div>

            <button onClick={() => setShowPay(true)} className="w-full rounded-xl bg-[#e8451c] py-4 font-display text-base font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]">
              <Lock className="mr-2 inline h-4 w-4" /> PAGAR Y UNIRME · {formatARS(total)}
            </button>
            <p className="text-center text-[10px] text-neutral-400">Al pagar, aceptás los términos del grupo</p>
          </div>
        </Sheet>
      )}

      {/* SUCCESS */}
      {step === "paid" && (
        <Sheet onClose={() => setStep("browse")} title="¡Estás dentro!" subtitle={`Sos ${joined} de ${target} en el grupo`}>
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#e8451c] shadow-[0_0_40px_rgba(232,69,28,0.4)]">
              <Check className="h-12 w-12 text-white" />
            </div>
            <p className="font-display text-xl text-neutral-900">Reserva confirmada</p>
            <p className="text-sm text-neutral-600">Te avisamos cuando se complete el grupo. {missing > 0 ? `Faltan ${missing}` : "¡Grupo completo!"}</p>
            <button onClick={share} className="w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-bold text-[#e8451c]">
              <Fire className="mr-1 inline h-4 w-4" /> Compartir y ganar 20% OFF
            </button>
            <button onClick={() => navigate({ to: "/orders" })} className="w-full rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-700">Ver mis pedidos</button>
          </div>
        </Sheet>
      )}

      {showPay && (
        <PaymentMethodsSheet total={total} onClose={() => setShowPay(false)} onPaid={confirmPay} />
      )}

      {showMulti && product.customizable && (
        <MultiDesignSheet
          productTitle={product.title}
          productEmoji={product.emoji}
          productGradient={product.gradient}
          totalUnits={payQty}
          onClose={() => setShowMulti(false)}
          onDesignAdded={addDesignToCart}
          onAllDone={() => {
            setShowMulti(false);
            setJoined((j) => Math.min(target, j + payQty));
            toast.success("Diseños añadidos al resumen ✨");
            navigate({ to: "/cart" });
          }}
        />
      )}
    </div>
  );
}

function Chip({ children, icon, accent }: { children: React.ReactNode; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${accent ? "border-[#e8451c] bg-[#e8451c] text-white" : "border-orange-200 bg-orange-50 text-[#e8451c]"}`}>{icon} {children}</span>
  );
}

function Sheet({ children, onClose, title, subtitle }: { children: React.ReactNode; onClose: () => void; title: string; subtitle?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-[480px] rounded-t-[28px] border-t border-orange-100 bg-white p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl text-neutral-900">{title}</h3>
            {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100 text-neutral-700"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{icon} {label}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="flex items-center justify-between py-1"><span>{label}</span><span>{value}</span></div>;
}
