import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Clock, Share2, Sparkles, Flame, Eye, Gift, Copy, Zap, TrendingUp, MapPin,
  Flame as Fire, Upload, Type, Palette, Check, CreditCard, X, Lock,
} from "lucide-react";
import { findProduct, formatARS } from "@/lib/mockData";
import { toast } from "sonner";
import { useLocalCart } from "@/stores/localCart";

export const Route = createFileRoute("/group/$slug")({
  component: GroupPage,
});

const FAKE_NAMES = ["Lucas", "Mica", "Tomás", "Sofi", "Naza", "Vale", "Bruno", "Flor", "Joaco", "Cami", "Iván", "Pili", "Rocío", "Nico", "Lara"];
const NEIGHBORHOODS = ["Palermo", "Caballito", "Recoleta", "Belgrano", "Núñez", "Villa Crespo", "San Telmo", "Almagro", "Flores"];
const STYLES = ["Minimal", "Neón", "Retro", "Y2K", "Anime", "Grafitti"];
const COLORS = ["#000000", "#ffffff", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

type Step = "browse" | "customize" | "summary" | "paid";

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
  const almostFull = pct >= 70;
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

  const pay = () => {
    setJoined((j) => Math.min(target, j + 1));
    addToCart({
      id: `${product.slug}-group-${Date.now()}`,
      slug: product.slug,
      title: product.title,
      emoji: product.emoji,
      gradient: product.gradient,
      mode: "group",
      unitPrice: product.price.group,
      quantity: 1,
      color: skipCustom ? undefined : custColor,
      customization: skipCustom ? undefined : {
        text: custText || undefined,
        style: custStyle,
        imageName: custImage ?? undefined,
      },
    });
    setStep("paid");
    toast.success("¡Estás dentro del grupo!", {
      description: `Faltan ${Math.max(0, target - joined - 1)} para desbloquear`,
    });
  };

  const share = () => {
    navigator.clipboard?.writeText(`https://neiba.app/group/${slug}`).catch(() => {});
    toast.success("Link copiado ✨", { description: "Si se suman 2 amigos, ganás 20% extra OFF." });
  };

  const milestones = useMemo(() => Array.from({ length: target }, (_, i) => i + 1), [target]);
  const fees = Math.round(product.price.group * 0.04);
  const total = product.price.group + fees;

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
          <div className="rounded-2xl border border-orange-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8451c]"><Sparkles className="h-4 w-4 text-white" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-900">Personalizá tu unidad</p>
                <p className="text-[11px] text-neutral-500">Texto, imagen, color y estilo IA</p>
              </div>
              <button onClick={() => setStep("customize")} className="rounded-xl bg-[#e8451c] px-3 py-2 text-[11px] font-bold text-white">
                Personalizar
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => setStep("customize")} className="rounded-xl border border-orange-200 bg-orange-50 px-2 py-2 text-[11px] font-semibold text-[#e8451c]">Texto</button>
              <button onClick={() => setStep("customize")} className="rounded-xl border border-orange-200 bg-orange-50 px-2 py-2 text-[11px] font-semibold text-[#e8451c]">Imagen</button>
              <button onClick={() => setStep("customize")} className="rounded-xl border border-orange-200 bg-orange-50 px-2 py-2 text-[11px] font-semibold text-[#e8451c]">Estilo IA</button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={addIndividualToCart} className="flex-1 rounded-xl border border-[#e8451c] bg-white py-2.5 text-[11px] font-bold text-[#e8451c]">+ Agregar al carrito</button>
              <button onClick={startJoin} className="flex-1 rounded-xl bg-[#e8451c] py-2.5 text-[11px] font-black text-white">
                <span className="inline-flex items-center justify-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Sumarme ahora</span>
              </button>
            </div>
          </div>
        </section>
      )}

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

      {/* Cómo funciona */}
      <section className="mt-4 px-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="font-display text-sm text-neutral-900"><Sparkles className="mr-1 inline h-4 w-4 text-[#e8451c]" /> Cómo funciona</p>
          <ol className="mt-2 space-y-1.5 text-xs text-neutral-600">
            <li><b className="text-[#e8451c]">1.</b> {product.customizable ? "Personalizás tu unidad" : "Te sumás al grupo"}</li>
            <li><b className="text-[#e8451c]">2.</b> Pagás para reservar tu lugar</li>
            <li><b className="text-[#e8451c]">3.</b> Cuando se completa, se produce y envía</li>
            <li><b className="text-[#e8451c]">4.</b> Si no se completa, te devolvemos el 100%</li>
          </ol>
        </div>
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
          <div className="flex items-center gap-2">
            <button onClick={addIndividualToCart} className="shrink-0 rounded-xl border border-[#e8451c] bg-white px-3 py-3 text-[11px] font-bold text-[#e8451c]">
              + Carrito
            </button>
            <button onClick={startJoin} className="flex-1 rounded-xl bg-[#e8451c] py-3 font-display text-sm font-black tracking-wider text-white">
              <span className="inline-flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" /> SUMARME AHORA
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMIZE SHEET */}
      {step === "customize" && (
        <Sheet onClose={() => setStep("browse")} title="Personalizá tu unidad" subtitle="Cada uno del grupo personaliza el suyo">
          <div className="space-y-5">
            {/* Preview */}
            <div className="relative grid h-44 place-items-center overflow-hidden rounded-3xl" style={{ background: product.gradient }}>
              {custImageData ? (
                <img src={custImageData} alt="custom" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              ) : (
                <span className="text-7xl drop-shadow-2xl">{product.emoji}</span>
              )}
              {custText && (
                <span className="absolute bottom-4 z-10 px-3 py-1 font-display text-lg font-black" style={{ color: custColor === "#ffffff" ? "#000" : "#fff", background: custColor + "cc", borderRadius: 12 }}>{custText}</span>
              )}
              <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">{custStyle}</span>
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

            <Field icon={<Palette className="h-4 w-4" />} label="Color">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setCustColor(c)} className={`h-10 w-10 rounded-xl border-2 ${custColor === c ? "border-[#e8451c] scale-110" : "border-neutral-200"}`} style={{ background: c }} />
                ))}
              </div>
            </Field>

            <Field icon={<Sparkles className="h-4 w-4" />} label="Estilo IA">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((st) => (
                  <button key={st} onClick={() => setCustStyle(st)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${custStyle === st ? "bg-[#e8451c] text-white" : "bg-orange-50 text-neutral-700"}`}>{st}</button>
                ))}
              </div>
            </Field>

            <div className="flex gap-2 pt-2">
              <button onClick={skip} className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-bold text-neutral-600">Saltar</button>
              <button onClick={confirmCustom} className="flex-[2] rounded-xl bg-[#e8451c] py-3 font-display text-sm font-black text-white">
                <Check className="mr-1 inline h-4 w-4" /> CONFIRMAR DISEÑO
              </button>
            </div>
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

            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
              <Row label="Precio grupal" value={formatARS(product.price.group)} />
              <Row label="Servicio" value={formatARS(fees)} />
              <Row label="Envío" value={<span className="text-[#e8451c] font-bold">Gratis 🎉</span>} />
              <div className="my-3 h-px bg-neutral-100" />
              <Row label={<span className="font-bold text-neutral-900">Total</span>} value={<span className="font-display text-xl font-black text-[#e8451c]">{formatARS(total)}</span>} />
              <p className="mt-2 text-[10px] text-neutral-500">⚡ Si el grupo no se completa en {fmt(m)}:{fmt(s)}, te devolvemos el 100%.</p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Método de pago</p>
              <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#e8451c] text-white"><CreditCard className="h-5 w-5" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">MercadoPago</p>
                  <p className="text-[10px] text-neutral-500">Tarjeta, débito o saldo</p>
                </div>
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <button onClick={pay} className="w-full rounded-xl bg-[#e8451c] py-4 font-display text-base font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]">
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
