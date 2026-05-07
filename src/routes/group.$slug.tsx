import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Users, Clock, Share2, Sparkles, Flame, Eye, Gift, Copy, Zap, TrendingUp, MapPin,
} from "lucide-react";
import { findProduct, formatARS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/group/$slug")({
  component: GroupPage,
});

const FAKE_NAMES = ["Lucas", "Mica", "Tomás", "Sofi", "Naza", "Vale", "Bruno", "Flor", "Joaco", "Cami", "Iván", "Pili", "Rocío", "Nico", "Lara"];
const NEIGHBORHOODS = ["Palermo", "Caballito", "Recoleta", "Belgrano", "Núñez", "Villa Crespo", "San Telmo", "Almagro", "Flores"];

function GroupPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(842); // 14:02 — "se cierra en 14 minutos"
  const [joined, setJoined] = useState(product?.groupJoined ?? 0);
  const [viewers, setViewers] = useState(2381);
  const [feed, setFeed] = useState<{ name: string; hood: string; ago: string; key: number }[]>([]);

  // countdown
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // simulated viewer count flicker
  useEffect(() => {
    const t = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 7) - 2), 2400);
    return () => clearInterval(t);
  }, []);

  // simulated joiners feed
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

  const join = () => {
    setJoined((j) => Math.min(target, j + 1));
    const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
    const hood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
    setFeed((f) => [{ name: "Vos", hood: "Buenos Aires", ago: "ahora", key: Date.now() }, ...f].slice(0, 6));
    toast.success("¡Estás adentro! 💜", { description: `Faltan ${Math.max(0, target - joined - 1)} para desbloquear el precio grupal.` });
    void name; void hood;
  };

  const share = () => {
    navigator.clipboard?.writeText(`https://neiba.app/group/${slug}`).catch(() => {});
    toast.success("Link copiado ✨", { description: "Si se suman 2 amigos, ganás 20% extra OFF." });
  };

  const milestones = useMemo(() => Array.from({ length: target }, (_, i) => i + 1), [target]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden pb-32" style={{ background: "radial-gradient(ellipse at top, #1a0a3a 0%, #050010 70%)" }}>
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "#a855f7" }} />
      <div className="pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "#ec4899" }} />

      {/* Top bar */}
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

      {/* Live FOMO chips */}
      <div className="relative z-10 flex gap-2 overflow-x-auto px-4 pt-3 scrollbar-hide">
        <Chip icon={<Eye className="h-3 w-3" />}>{viewers.toLocaleString("es-AR")} mirando</Chip>
        <Chip icon={<TrendingUp className="h-3 w-3" />} accent>🔥 Tendencia BA</Chip>
        <Chip icon={<Flame className="h-3 w-3" />}>+1 cada 23s</Chip>
        <Chip icon={<MapPin className="h-3 w-3" />}>Envío 48h</Chip>
      </div>

      {/* HUGE counter card */}
      <div className="relative z-10 px-4 pt-4">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-black/40 p-6 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(168,85,247,0.6)]">
          {/* shimmer */}
          <div className="absolute -inset-1 opacity-50 blur-2xl" style={{ background: "radial-gradient(circle at 30% 0%, #a855f7, transparent 60%)" }} />

          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                Compra grupal
              </span>
              {almostFull && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white animate-pulse">
                  ⚠ Casi completo
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-xl leading-tight text-white/90">{product.title}</h1>

            {/* The GIANT 7/10 */}
            <div className="mt-4 flex items-end gap-3">
              <div className="flex items-baseline">
                <span className="font-display text-[88px] leading-none font-black text-white tracking-tighter" style={{ textShadow: "0 0 40px rgba(168,85,247,0.8)" }}>
                  {joined}
                </span>
                <span className="font-display text-5xl font-bold text-white/40">/{target}</span>
              </div>
              <div className="pb-2">
                <p className="text-[10px] uppercase tracking-widest text-white/60">personas</p>
                <p className="text-sm font-bold text-white">unidas</p>
              </div>
            </div>

            <p className="mt-1 text-sm font-semibold text-fuchsia-300">
              {missing > 0 ? `Faltan ${missing} para desbloquear el precio` : "¡Grupo completo! 🎉"}
            </p>

            {/* Animated progress bar with milestones */}
            <div className="mt-4">
              <div className="relative h-3 overflow-hidden rounded-full bg-black/50">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)" }}
                />
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
              </div>
              <div className="mt-2 flex justify-between">
                {milestones.map((m) => (
                  <span key={m} className={`h-1.5 w-1.5 rounded-full ${m <= joined ? "bg-fuchsia-400" : "bg-white/20"}`} />
                ))}
              </div>
            </div>

            {/* Countdown - SE CIERRA EN */}
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

            {/* Price reveal */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white">{formatARS(product.price.group)}</span>
              <span className="text-sm text-white/50 line-through">{formatARS(product.price.individual)}</span>
              <span className="ml-auto rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-black text-white">
                -{Math.round((1 - product.price.group / product.price.individual) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live joiners feed */}
      <section className="relative z-10 mt-6 px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">⚡ Entrando ahora</p>
          <span className="text-[10px] text-emerald-400">en vivo</span>
        </div>
        <div className="mt-3 space-y-2">
          {(feed.length ? feed : [
            { name: "Lucas", hood: "Palermo", ago: "hace 30 seg", key: 1 },
            { name: "Mica", hood: "Caballito", ago: "hace 1 min", key: 2 },
            { name: "Tomás", hood: "Belgrano", ago: "hace 2 min", key: 3 },
          ]).map((a) => (
            <div key={a.key} className="float-up flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, hsl(${(a.key * 37) % 360} 70% 55%), hsl(${(a.key * 67) % 360} 70% 45%))` }}>
                {a.name[0]}
              </span>
              <div className="flex-1">
                <p className="text-sm text-white"><span className="font-bold">{a.name}</span> <span className="text-white/60">de {a.hood} se unió</span></p>
                <p className="text-[10px] text-white/40">{a.ago}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400">+1</span>
            </div>
          ))}
        </div>
      </section>

      {/* Avatars grid */}
      <section className="relative z-10 mt-6 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">El squad</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: target }).map((_, i) => {
            const filled = i < joined;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-xs font-black ${filled ? "text-white shadow-lg" : "border-2 border-dashed border-white/15 text-white/30"}`}
                  style={filled ? { background: `linear-gradient(135deg, hsl(${i * 32} 70% 55%), hsl(${i * 32 + 60} 70% 45%))` } : undefined}
                >
                  {filled ? FAKE_NAMES[i % FAKE_NAMES.length][0] : "?"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Share to unlock */}
      <section className="relative z-10 mt-6 px-4">
        <button onClick={share} className="flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-rose-500/20 p-4 text-left backdrop-blur">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/30">
            <Gift className="h-5 w-5 text-amber-300" />
          </div>
          <div className="flex-1">
            <p className="font-display text-sm text-white">Compartí + desbloqueá 20% extra OFF</p>
            <p className="text-[11px] text-white/60">Si 2 amigos se suman con tu link</p>
          </div>
          <Copy className="h-4 w-4 text-white/70" />
        </button>
      </section>

      {/* How it works */}
      <section className="relative z-10 mt-6 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="font-display text-base text-white"><Sparkles className="mr-1 inline h-4 w-4 text-fuchsia-400" /> Cómo funciona</p>
          <ol className="mt-3 space-y-2 text-xs text-white/70">
            <li><span className="font-bold text-white">1.</span> Te sumás y reservás tu unidad sin pagar todavía</li>
            <li><span className="font-bold text-white">2.</span> Cuando se completa, todos pagan el precio grupal</li>
            <li><span className="font-bold text-white">3.</span> Si no se completa, te devolvemos el 100%</li>
            <li><span className="font-bold text-white">4.</span> Recibís en 48-72h 🚀</li>
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
            <button onClick={join} className="group relative flex-1 overflow-hidden rounded-2xl py-4 font-display text-base font-black tracking-wider text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              <span className="relative z-10 inline-flex items-center gap-2">
                <Zap className="h-4 w-4" /> SUMARME AL GRUPO
              </span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-white/50"><Clock className="mr-1 inline h-3 w-3" /> Se cierra en {fmt(m)}:{fmt(s)} · Sin compromiso</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, icon, accent }: { children: React.ReactNode; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur ${accent ? "border-rose-400/40 bg-rose-500/15 text-rose-200" : "border-white/15 bg-white/5 text-white/80"}`}>
      {icon} {children}
    </span>
  );
}
