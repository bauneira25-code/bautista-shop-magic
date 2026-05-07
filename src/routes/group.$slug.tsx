import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Clock, Share2, Sparkles } from "lucide-react";
import { findProduct, formatARS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/group/$slug")({
  component: GroupPage,
});

function GroupPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5385);
  const [joined, setJoined] = useState(product?.groupJoined ?? 0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!product) return null;
  const target = product.groupTarget;
  const pct = (joined / target) * 100;
  const fmt = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const join = () => {
    setJoined((j) => Math.min(target, j + 1));
    toast.success("¡Te sumaste al grupo! 💜", { description: `Te avisamos cuando se complete.` });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-32">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => navigate({ to: "/products/$slug", params: { slug } })} className="grid h-10 w-10 place-items-center rounded-full bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm">Compra grupal</p>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-card"><Share2 className="h-4 w-4" /></button>
      </header>

      {/* Big card */}
      <div className="px-5 pt-2">
        <div className="relative overflow-hidden rounded-3xl p-6 text-white" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">Grupo activo</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">{product.title}</h1>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl">{formatARS(product.price.group)}</span>
            <span className="text-xs line-through opacity-70">{formatARS(product.price.individual)}</span>
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur">-{Math.round((1 - product.price.group / product.price.individual) * 100)}%</span>
          </div>

          {/* Countdown */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[{ v: h, l: "Horas" }, { v: m, l: "Min" }, { v: s, l: "Seg" }].map((t) => (
              <div key={t.l} className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur">
                <p className="font-display text-3xl">{fmt(t.v)}</p>
                <p className="text-[10px] uppercase opacity-70">{t.l}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between text-xs">
              <span><Users className="mr-1 inline h-3 w-3" /> {joined} de {target}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/30">
              <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-[11px] opacity-80">⚡ Cuando llegue a {target}, todos pagan {formatARS(product.price.group)}</p>
          </div>
        </div>
      </div>

      {/* Avatars */}
      <section className="mt-6 px-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quiénes están adentro</p>
        <div className="mt-3 grid grid-cols-5 gap-3">
          {Array.from({ length: target }).map((_, i) => {
            const filled = i < joined;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-bold ${filled ? "text-primary-foreground" : "border-2 border-dashed border-border bg-transparent text-muted-foreground"}`} style={filled ? { background: `hsl(${i * 32} 70% 55%)` } : undefined}>
                  {filled ? ["L","M","T","S","J","R","C","N","V","F","B","A","P","O","I"][i] ?? "?" : "?"}
                </div>
                <span className="text-[9px] text-muted-foreground">{filled ? "Unido" : "Libre"}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live feed */}
      <section className="mt-6 px-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">En vivo</p>
        <div className="mt-3 space-y-2">
          {product.liveActivity.concat(product.liveActivity).slice(0, 5).map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 float-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-primary-foreground" style={{ background: `hsl(${i * 60} 70% 50%)` }}>{a.name[0]}</span>
              <div className="flex-1 text-xs">
                <p><span className="font-semibold">{a.name}</span> {a.action}</p>
                <p className="text-[10px] text-muted-foreground">{a.time}</p>
              </div>
              {a.action.includes("unió") && <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">+1</span>}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-6 px-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-display text-base"><Sparkles className="mr-1 inline h-4 w-4 text-primary" /> Cómo funciona</p>
          <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li><span className="font-bold text-foreground">1.</span> Te sumás al grupo y reservás tu unidad</li>
            <li><span className="font-bold text-foreground">2.</span> Cuando se completa o cierra el timer, todos pagan el precio grupal</li>
            <li><span className="font-bold text-foreground">3.</span> Si no se completa, te devolvemos el 100%</li>
            <li><span className="font-bold text-foreground">4.</span> Recibís tu producto en 48-72h 🚀</li>
          </ol>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="glass flex items-center gap-3 rounded-3xl p-3">
          <div className="px-2">
            <p className="text-[10px] uppercase text-muted-foreground">Precio grupo</p>
            <p className="font-display text-xl text-primary">{formatARS(product.price.group)}</p>
          </div>
          <button onClick={join} className="flex-1 rounded-2xl py-3.5 font-display text-sm tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
            JOIN GROUP <Clock className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
