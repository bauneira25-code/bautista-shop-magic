import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Share2, Star, Users, Clock, Truck, ShieldCheck, Sparkles, Plus, Minus, ChevronRight } from "lucide-react";
import { findProduct, formatARS, type PurchaseMode } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">Producto no encontrado</div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const [mode, setMode] = useState<PurchaseMode>("group");
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [variant, setVariant] = useState(0);

  if (!product) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Producto no encontrado</div>;
  }

  const price = product.price[mode];
  const savings = product.price.individual - price;
  const groupPct = (product.groupJoined / product.groupTarget) * 100;

  const cta =
    mode === "group" ? "JOIN GROUP" : mode === "wholesale" ? "PEDIR MAYORISTA" : "BUY NOW";

  const handleCta = () => {
    if (mode === "group") navigate({ to: "/group/$slug", params: { slug: product.slug } });
    else toast.success(`${cta} — ${product.title}`, { description: `${qty} unidad(es) · ${formatARS(price * qty)}` });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-32">
      {/* Hero image */}
      <div className="relative aspect-square w-full" style={{ background: product.gradient }}>
        <div className="absolute inset-0 grid place-items-center text-[10rem]">{product.emoji}</div>
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Share2 className="h-4 w-4 text-white" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Heart className="h-4 w-4 text-white" /></button>
          </div>
        </div>
        {/* Live activity float */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-[11px] text-white">{product.liveActivity[0]?.name} {product.liveActivity[0]?.action}</span>
        </div>
        <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          {product.sold.toLocaleString()} vendidos
        </div>
      </div>

      {/* Thumbnails */}
      <div className="-mt-3 flex gap-2 overflow-x-auto px-4 scrollbar-hide">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-card text-xl" style={{ background: i === 0 ? product.gradient : undefined }}>
            {i === 0 ? product.emoji : i === 3 ? "▶" : "🖼"}
          </div>
        ))}
      </div>

      <div className="space-y-5 px-5 pt-5">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-bold text-primary">{product.badge ?? "TRENDING"}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {product.rating} ({product.reviews})</span>
          </div>
          <h1 className="mt-2 font-display text-2xl leading-tight">{product.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
        </div>

        {/* 3 PURCHASE MODES */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Elegí cómo comprar</p>
          <div className="space-y-2">
            <ModeCard active={mode === "individual"} onClick={() => setMode("individual")} title="Individual" icon="🛍" price={product.price.individual} sub="1 unidad · entrega rápida" />
            <ModeCard active={mode === "group"} onClick={() => setMode("group")} title="Grupal" icon="👥" price={product.price.group} sub={`Sumate a ${product.groupTarget - product.groupJoined} personas más`} highlight badge={`-${Math.round((1 - product.price.group / product.price.individual) * 100)}%`} compareAt={product.price.individual} />
            <ModeCard active={mode === "wholesale"} onClick={() => setMode("wholesale")} title="Mayorista" icon="📦" price={product.price.wholesale} sub="Desde 100 unidades · packaging custom" compareAt={product.price.individual} />
          </div>
        </div>

        {/* Group progress (only when group) */}
        {mode === "group" && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 float-up">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary"><Users className="mr-1 inline h-3 w-3" />{product.groupJoined}/{product.groupTarget} unidos</span>
              <span className="inline-flex items-center gap-1 text-warning"><Clock className="h-3 w-3" /> {product.groupTimeLeft}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full" style={{ width: `${groupPct}%`, background: "var(--gradient-primary)" }} />
            </div>
            <div className="mt-3 flex -space-x-2">
              {product.liveActivity.concat(product.liveActivity).slice(0, 5).map((a, i) => (
                <span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-background text-[10px] font-bold text-primary-foreground" style={{ background: `hsl(${i * 60} 70% 50%)` }}>
                  {a.name[0]}
                </span>
              ))}
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-secondary text-[10px] font-bold">+{product.groupJoined - 5}</span>
            </div>
          </div>
        )}

        {/* Wholesale tiers */}
        {mode === "wholesale" && (
          <div className="rounded-2xl border border-border bg-card p-4 float-up space-y-2">
            <p className="text-xs font-bold uppercase text-muted-foreground">Precios mayoristas</p>
            {[
              { range: "1 - 5 unidades", price: product.price.individual },
              { range: "5 - 20 unidades", price: product.price.group },
              { range: "20 - 100 unidades", price: Math.round((product.price.group + product.price.wholesale) / 2) },
              { range: "100+ unidades", price: product.price.wholesale, best: true },
            ].map((t) => (
              <div key={t.range} className={`flex items-center justify-between rounded-xl px-3 py-2 ${t.best ? "bg-primary/15 border border-primary/30" : "bg-secondary"}`}>
                <span className="text-xs">{t.range}</span>
                <span className="text-sm font-bold">{formatARS(t.price)}</span>
              </div>
            ))}
            <p className="pt-2 text-[11px] text-muted-foreground">📦 Packaging personalizado disponible · 🏷 Branding propio · 🚚 Envío directo a tu local</p>
          </div>
        )}

        {/* Variants */}
        {product.variants && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Modelo</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button key={v} onClick={() => setVariant(i)} className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${variant === i ? "border-primary bg-primary/15 text-primary" : "border-border bg-card"}`}>{v}</button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Color</p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button key={c} onClick={() => setColor(i)} className={`h-9 w-9 rounded-full border-2 transition ${color === i ? "border-primary scale-110" : "border-border"}`} style={{ background: c }} />
              ))}
            </div>
          </div>
        )}

        {/* Customize banner */}
        {product.customizable && (
          <Link to="/customize" className="flex items-center justify-between rounded-2xl p-4 text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Personalizable con IA</p>
              <p className="font-display text-lg">CUSTOMIZE 🔥</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}

        {/* Quantity */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <span className="text-sm">Cantidad</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><Minus className="h-3 w-3" /></button>
            <span className="w-6 text-center font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><Plus className="h-3 w-3" /></button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-2 text-center"><Truck className="mx-auto mb-1 h-4 w-4 text-primary" />Envío 48h</div>
          <div className="rounded-xl border border-border bg-card p-2 text-center"><ShieldCheck className="mx-auto mb-1 h-4 w-4 text-primary" />Garantía</div>
          <div className="rounded-xl border border-border bg-card p-2 text-center"><Sparkles className="mx-auto mb-1 h-4 w-4 text-primary" />MercadoPago</div>
        </div>

        {/* Reviews preview */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-base">Reseñas</p>
            <span className="text-xs text-primary">Ver todas</span>
          </div>
          <div className="mt-3 space-y-3">
            {[
              { n: "Mica", r: 5, t: "La calidad es brutal, llegó re rápido 💜" },
              { n: "Lucas", r: 5, t: "Compré en grupo y ahorré un montón. Recomiendo." },
            ].map((r, i) => (
              <div key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">{r.n[0]}</span>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{r.n}</span>
                    <span className="text-warning">{"★".repeat(r.r)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="glass flex items-center gap-3 rounded-3xl p-3">
          <div className="px-2">
            <p className="text-[10px] uppercase text-muted-foreground">{mode === "group" ? "Precio grupal" : mode === "wholesale" ? "Mayorista" : "Individual"}</p>
            <p className="font-display text-xl text-primary">{formatARS(price * qty)}</p>
            {savings > 0 && <p className="text-[10px] text-success">Ahorrás {formatARS(savings * qty)}</p>}
          </div>
          <button onClick={handleCta} className="flex-1 rounded-2xl py-3.5 font-display text-sm tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  active, onClick, title, icon, price, sub, highlight, badge, compareAt,
}: {
  active: boolean; onClick: () => void; title: string; icon: string; price: number; sub: string; highlight?: boolean; badge?: string; compareAt?: number;
}) {
  return (
    <button onClick={onClick} className={`relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]" : "border-border bg-card"}`}>
      {highlight && <span className="absolute -top-2 right-3 rounded-full bg-warning px-2 py-0.5 text-[9px] font-black uppercase text-background">⚡ Más elegida</span>}
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-xl">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{title}</p>
          {badge && <span className="rounded-md bg-success/20 px-1.5 py-0.5 text-[9px] font-bold text-success">{badge}</span>}
        </div>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-base">{formatARS(price)}</p>
        {compareAt && compareAt > price && <p className="text-[10px] text-muted-foreground line-through">{formatARS(compareAt)}</p>}
      </div>
    </button>
  );
}
