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
    toast.success("¡Estás dentro del grupo! 💜", {
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
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden pb-32" style={{ background: "radial-gradient(ellipse at top, #1a0a3a 0%, #050010 70%)" }}>
      <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "#a855f7" }} />
      <div className="pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "#ec4899" }} />

      <header className="sticky top-0 z-30 flex items-center justify-between bg-black/40 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => navigate({ to: "/products/$slug", params: { slug } })} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur">
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-bold text-white">EN VIVO</span>
        </div>
        <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur">
          <Share2 className="h-4 w-4 text-white" />
        </button>
      </header>

      <div className="relative z-10 flex gap-2 overflow-x-auto px-4 pt-3 scrollbar-hide">
        <Chip icon={<Eye className="h-3 w-3" />}>{viewers.toLocaleString("es-AR")} mirando</Chip>
        <Chip icon={<TrendingUp className="h-3 w-3" />} accent>Tendencia BA</Chip>
        <Chip icon={<Flame className="h-3 w-3" />}>+1 cada 23s</Chip>
        <Chip icon={<MapPin className="h-3 w-3" />}>Envío 48h</Chip>
      </div>

      <div className="relative z-10 px-4 pt-4">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-black/40 p-6 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(168,85,247,0.6)]">
          <div className="absolute -inset-1 opacity-50 blur-2xl" style={{ background: "radial-gradient(circle at 30% 0%, #a855f7, transparent 60%)" }} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">Compra grupal</span>
              {almostFull && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white animate-pulse">⚠ Casi completo</span>
              )}
            </div>
            <h1 className="mt-3 font-display text-xl leading-tight text-white/90">{product.title}</h1>
            <div className="mt-4 flex items-end gap-3">
              <div className="flex items-baseline">
                <span className="font-display text-[88px] leading-none font-black text-white tracking-tighter" style={{ textShadow: "0 0 40px rgba(168,85,247,0.8)" }}>{joined}</span>
                <span className="font-display text-5xl font-bold text-white/40">/{target}</span>
              </div>
              <div className="pb-2">
                <p className="text-[10px] uppercase tracking-widest text-white/60">personas</p>
                <p className="text-sm font-bold text-white">unidas</p>
              </div>
            </div>
            <p className="mt-1 text-sm font-semibold text-fuchsia-300">{missing > 0 ? `Faltan ${missing} para desbloquear el precio` : "¡Grupo completo! 🎉"}</p>
            <div className="mt-4">
              <div className="relative h-3 overflow-hidden rounded-full bg-black/50">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)" }} />
              </div>
              <div className="mt-2 flex justify-between">
                {milestones.map((mi) => (<span key={mi} className={`h-1.5 w-1.5 rounded-full ${mi <= joined ? "bg-fuchsia-400" : "bg-white/20"}`} />))}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">⏰ Se cierra en</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[{ v: h, l: "Horas" }, { v: m, l: "Min" }, { v: s, l: "Seg" }].map((t) => (
                  <div key={t.l} className="rounded-xl bg-white/5 p-2 text-center">
                    <p className="font-display text-3xl font-black text-white tabular-nums">{fmt(t.v)}</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/50">{t.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white">{formatARS(product.price.group)}</span>
              <span className="text-sm text-white/50 line-through">{formatARS(product.price.individual)}</span>
              <span className="ml-auto rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-black text-white">-{Math.round((1 - product.price.group / product.price.individual) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-10 mt-6 px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">⚡ Entrando ahora</p>
          <span className="text-[10px] text-emerald-400">en vivo</span>
        </div>
        <div className="mt-3 space-y-2">
          {(feed.length ? feed : [
            { name: "Lucas", hood: "Palermo", ago: "hace 30 seg", key: 1 },
            { name: "Mica", hood: "Caballito", ago: "hace 1 min", key: 2 },
          ]).map((a) => (
            <div key={a.key} className="float-up flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, hsl(${(a.key * 37) % 360} 70% 55%), hsl(${(a.key * 67) % 360} 70% 45%))` }}>{a.name[0]}</span>
              <div className="flex-1">
                <p className="text-sm text-white"><span className="font-bold">{a.name}</span> <span className="text-white/60">de {a.hood} se unió</span></p>
                <p className="text-[10px] text-white/40">{a.ago}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400">+1</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-6 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">El squad</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: target }).map((_, i) => {
            const filled = i < joined;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl text-xs font-black ${filled ? "text-white shadow-lg" : "border-2 border-dashed border-white/15 text-white/30"}`} style={filled ? { background: `linear-gradient(135deg, hsl(${i * 32} 70% 55%), hsl(${i * 32 + 60} 70% 45%))` } : undefined}>
                  {filled ? FAKE_NAMES[i % FAKE_NAMES.length][0] : "?"}
                </div>
                {filled && product.customizable && (
                  <span className="text-[8px] text-fuchsia-300">personalizado</span>
                )}
              </div>
            );
          })}
        </div>
        {product.customizable && (
          <p className="mt-3 text-center text-[11px] text-white/50">✨ Cada uno personaliza el suyo</p>
        )}
      </section>

      <section className="relative z-10 mt-6 px-4">
        <button onClick={share} className="flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-rose-500/20 p-4 text-left backdrop-blur">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/30"><Gift className="h-5 w-5 text-amber-300" /></div>
          <div className="flex-1">
            <p className="font-display text-sm text-white">Compartí + desbloqueá 20% extra OFF</p>
            <p className="text-[11px] text-white/60">Si 2 amigos se suman con tu link</p>
          </div>
          <Copy className="h-4 w-4 text-white/70" />
        </button>
      </section>

      <section className="relative z-10 mt-6 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="font-display text-base text-white"><Sparkles className="mr-1 inline h-4 w-4 text-fuchsia-400" /> Cómo funciona</p>
          <ol className="mt-3 space-y-2 text-xs text-white/70">
            <li><span className="font-bold text-white">1.</span> {product.customizable ? "Personalizás tu unidad" : "Te sumás al grupo"}</li>
            <li><span className="font-bold text-white">2.</span> Pagás para reservar tu lugar</li>
            <li><span className="font-bold text-white">3.</span> Cuando se completa, se produce y envía</li>
            <li><span className="font-bold text-white">4.</span> Si no se completa, te devolvemos el 100%</li>
          </ol>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="rounded-[28px] border border-white/10 bg-black/70 p-3 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(168,85,247,0.6)]">
          <div className="flex items-center gap-3">
            <div className="px-2">
              <p className="text-[10px] uppercase tracking-wider text-white/50">Precio grupo</p>
              <p className="font-display text-2xl font-black text-white">{formatARS(product.price.group)}</p>
            </div>
            <button onClick={startJoin} className="group relative flex-1 overflow-hidden rounded-2xl py-4 font-display text-base font-black tracking-wider text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" /> {product.customizable ? "PERSONALIZAR Y SUMARME" : "SUMARME AL GRUPO"}
              </span>
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-white/50"><Clock className="mr-1 inline h-3 w-3" /> Se cierra en {fmt(m)}:{fmt(s)} · Pago seguro</p>
        </div>
      </div>

      {/* CUSTOMIZE SHEET */}
      {step === "customize" && (
        <Sheet onClose={() => setStep("browse")} title="Personalizá tu unidad" subtitle="Cada uno del grupo personaliza el suyo">
          <div className="space-y-5">
            {/* Preview */}
            <div className="relative grid h-44 place-items-center overflow-hidden rounded-3xl" style={{ background: product.gradient }}>
              <span className="text-7xl drop-shadow-2xl">{product.emoji}</span>
              {custText && (
                <span className="absolute bottom-4 px-3 py-1 font-display text-lg font-black" style={{ color: custColor === "#ffffff" ? "#000" : "#fff", background: custColor + "cc", borderRadius: 12 }}>{custText}</span>
              )}
              {custImage && <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white">📎 {custImage}</span>}
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">{custStyle}</span>
            </div>

            <Field icon={<Type className="h-4 w-4" />} label="Texto / nombre">
              <input value={custText} onChange={(e) => setCustText(e.target.value.slice(0, 16))} placeholder="Tu nombre, frase…" maxLength={16}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </Field>

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
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </Field>

            <Field icon={<Upload className="h-4 w-4" />} label="Subir imagen / logo">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/70">
                <span className="truncate">{custImage ?? "Tocá para elegir archivo"}</span>
                <span className="ml-2 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold">{custImage ? "Cambiar" : "+"}</span>
                <input type="file" hidden accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0])} />
              </label>
              {custImageData && (
                <button onClick={() => { setCustImage(null); setCustImageData(null); }} className="mt-2 text-[11px] font-bold text-rose-300">Quitar imagen</button>
              )}
            </Field>

            <Field icon={<Palette className="h-4 w-4" />} label="Color">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setCustColor(c)} className={`h-10 w-10 rounded-2xl border-2 ${custColor === c ? "border-white scale-110" : "border-white/20"}`} style={{ background: c }} />
                ))}
              </div>
            </Field>

            <Field icon={<Sparkles className="h-4 w-4" />} label="Estilo IA">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((st) => (
                  <button key={st} onClick={() => setCustStyle(st)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${custStyle === st ? "bg-fuchsia-500 text-white" : "bg-white/5 text-white/70"}`}>{st}</button>
                ))}
              </div>
            </Field>

            <div className="flex gap-2 pt-2">
              <button onClick={skip} className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-bold text-white/70">Saltar</button>
              <button onClick={confirmCustom} className="flex-[2] rounded-2xl py-3 font-display text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
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
            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="grid h-16 w-16 place-items-center rounded-xl text-3xl" style={{ background: product.gradient }}>{product.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{product.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded-md bg-fuchsia-500/20 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-300">Grupal</span>
                  {!skipCustom && product.customizable && (
                    <>
                      <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">Personalizado</span>
                      {custText && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white">"{custText}"</span>}
                      <span className="grid h-4 w-4 rounded-full border border-white/30" style={{ background: custColor }} />
                    </>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-white/50">Reservás 1 lugar de {target}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <Row label="Precio grupal" value={formatARS(product.price.group)} />
              <Row label="Servicio" value={formatARS(fees)} />
              <Row label="Envío" value={<span className="text-emerald-400">Gratis 🎉</span>} />
              <div className="my-3 h-px bg-white/10" />
              <Row label={<span className="font-bold text-white">Total</span>} value={<span className="font-display text-xl font-black text-white">{formatARS(total)}</span>} />
              <p className="mt-2 text-[10px] text-white/50">⚡ Si el grupo no se completa en {fmt(m)}:{fmt(s)}, te devolvemos el 100%.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">Método de pago</p>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/20 text-sky-300"><CreditCard className="h-5 w-5" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">MercadoPago</p>
                  <p className="text-[10px] text-white/50">Tarjeta, débito o saldo</p>
                </div>
                <Lock className="h-4 w-4 text-white/40" />
              </div>
            </div>

            <button onClick={pay} className="w-full rounded-2xl py-4 font-display text-base font-black tracking-wider text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.8)]" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              <Lock className="mr-2 inline h-4 w-4" /> PAGAR Y UNIRME · {formatARS(total)}
            </button>
            <p className="text-center text-[10px] text-white/40">Al pagar, aceptás los términos del grupo</p>
          </div>
        </Sheet>
      )}

      {/* SUCCESS */}
      {step === "paid" && (
        <Sheet onClose={() => setStep("browse")} title="¡Estás dentro! 💜" subtitle={`Sos ${joined} de ${target} en el grupo`}>
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_60px_rgba(16,185,129,0.6)]">
              <Check className="h-12 w-12 text-white" />
            </div>
            <p className="font-display text-xl text-white">Reserva confirmada</p>
            <p className="text-sm text-white/60">Te avisamos cuando se complete el grupo. {missing > 0 ? `Faltan ${missing}` : "¡Grupo completo!"}</p>
            <button onClick={share} className="w-full rounded-2xl border border-amber-400/30 bg-amber-500/20 py-3 text-sm font-bold text-amber-200">
              <Fire className="mr-1 inline h-4 w-4" /> Compartir y ganar 20% OFF
            </button>
            <button onClick={() => navigate({ to: "/orders" })} className="w-full rounded-2xl bg-white/10 py-3 text-sm font-bold text-white">Ver mis pedidos</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Chip({ children, icon, accent }: { children: React.ReactNode; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur ${accent ? "border-rose-400/40 bg-rose-500/15 text-rose-200" : "border-white/15 bg-white/5 text-white/80"}`}>{icon} {children}</span>
  );
}

function Sheet({ children, onClose, title, subtitle }: { children: React.ReactNode; onClose: () => void; title: string; subtitle?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-[480px] rounded-t-[32px] border-t border-white/10 bg-gradient-to-b from-[#1a0a3a] to-[#0a0418] p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl text-white">{title}</h3>
            {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/60">{icon} {label}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="flex items-center justify-between py-1"><span>{label}</span><span>{value}</span></div>;
}
