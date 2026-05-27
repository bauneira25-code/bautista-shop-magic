import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, Star, Truck, ShieldCheck, Sparkles,
  Plus, Minus,
} from "lucide-react";
import { findProduct, formatARS, stockLabel, relatedProducts, type PurchaseMode } from "@/lib/mockData";
import { useLocalCart } from "@/stores/localCart";
import { PurchaseSteps } from "@/components/PurchaseSteps";
import { toast } from "sonner";
import { QtyInput } from "@/components/QtyInput";
import { ProductBadges } from "@/components/ProductBadges";
import { CustomizeSheet } from "@/components/CustomizeSheet";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) {
      return {
        meta: [
          { title: "Producto no encontrado — NEIBA" },
          { name: "description", content: "El producto que buscás no está disponible en NEIBA." },
        ],
      };
    }
    const title = `${product.title} — NEIBA`;
    const desc = product.description.slice(0, 155);
    const url = `/products/${product.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: product.id,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
            offers: {
              "@type": "Offer",
              price: product.price.individual,
              priceCurrency: "ARS",
              availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url,
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">Producto no encontrado</div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const addToCart = useLocalCart((s) => s.add);
  const [mode, setMode] = useState<PurchaseMode>("individual");
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [variant, setVariant] = useState(0);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!product) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Producto no encontrado</div>;
  }

  const price = product.price[mode];
  const savings = product.price.individual - price;
  const cta = mode === "wholesale" ? "PEDIR MAYORISTA" : "AGREGAR AL CARRITO";

  const doAdd = () => {
    const id = `${product.slug}-${mode}-${variant}-${color}`;
    addToCart({
      id,
      slug: product.slug,
      title: product.title,
      emoji: product.emoji,
      gradient: product.gradient,
      mode,
      unitPrice: price,
      quantity: qty,
      variant: product.variants?.[variant],
      color: product.colors?.[color],
    });
  };

  const handleCta = () => {
    doAdd();
    toast.success("Agregado al carrito 🛒", {
      description: `${qty} × ${product.title} · ${formatARS(price * qty)}`,
      action: { label: "Ver carrito", onClick: () => navigate({ to: "/cart" }) },
    });
  };

  const handleBuyNow = () => {
    doAdd();
    navigate({ to: "/cart" });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-32">
      {/* Hero: carrusel horizontal de 5 fotos (swipe / scroll-snap) */}
      <div className="relative">
        <div
          className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== activePhoto) setActivePhoto(i);
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const tints = [
              product.gradient,
              `linear-gradient(135deg, #fff, ${product.colors?.[0] ?? "#fde68a"})`,
              `linear-gradient(160deg, #0f172a, #1e293b)`,
              `linear-gradient(135deg, #fef3c7, #fde68a)`,
              `linear-gradient(135deg, #fce7f3, #fbcfe8)`,
            ];
            return (
              <div
                key={i}
                className="relative grid aspect-square w-full shrink-0 snap-center place-items-center text-[10rem]"
                style={{ background: tints[i] }}
              >
                <span style={{ transform: `rotate(${(i - 2) * 4}deg)` }}>{product.emoji}</span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                  {i + 1}/5
                </span>
              </div>
            );
          })}
        </div>

        {/* Top overlay (back / share / heart) */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate({ to: "/" })} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="pointer-events-auto flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Share2 className="h-4 w-4 text-white" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Heart className="h-4 w-4 text-white" /></button>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === activePhoto ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>

        <div className="absolute left-4 top-16 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {stockLabel(product.stock).label}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-bold text-primary">{product.badge ?? "TENDENCIA"}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {product.rating} ({product.reviews})</span>
          </div>
          <h1 className="mt-2 font-display text-2xl leading-tight">{product.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

          {/* Vendedor */}
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black text-white ${product.sellerKind === "neiba" ? "bg-[#e8451c]" : "bg-emerald-600"}`}>
                {product.sellerKind === "neiba" ? "N" : "🏭"}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Vendido por</p>
                <p className="text-xs font-bold leading-tight flex items-center gap-1">
                  {product.sellerName}
                  {product.sellerVerified && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                </p>
              </div>
            </div>
            {product.sellerKind === "importer" && (
              <button className="rounded-full border border-emerald-600 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                Hablar con importador
              </button>
            )}
          </div>

          {/* Badges marketplace */}
          <div className="mt-3">
            <ProductBadges product={product} variant="detail" />
          </div>

          {/* Total según cantidad */}
          {product.minOrder && (
            <div className="mt-3 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">Compra por lote</p>
              <p className="mt-1 text-xs text-amber-900">Mínimo {product.minOrder} unidades · {formatARS(product.price.wholesale)} c/u</p>
              <p className="mt-2 font-display text-lg text-amber-900">
                Total: {formatARS(product.price.wholesale * (qty < product.minOrder ? product.minOrder : qty))}
              </p>
            </div>
          )}

          {/* Botones acción extra */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {product.customizable && (
              <button onClick={() => setCustomizeOpen(true)} className="col-span-2 rounded-xl bg-fuchsia-600 py-2.5 text-xs font-black text-white">
                ✨ Personalizar este producto
              </button>
            )}
            {product.sellerKind === "importer" && product.stockLocation === "factory" && (
              <>
                <button className="rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white">📦 Comprar lote</button>
                <button className="rounded-xl border-2 border-emerald-600 bg-white py-2.5 text-xs font-black text-emerald-700">💬 Pedir cotización</button>
              </>
            )}
          </div>
        </div>

        {/* 2 PURCHASE MODES */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Elegí cómo comprar</p>
          <div className="grid gap-2 grid-cols-2">
            <ModeCard
              active={mode === "individual"} onClick={() => setMode("individual")}
              title="Individual" icon="🛍" price={product.price.individual}
              sub="1 unidad"
            />
            <ModeCard
              active={mode === "wholesale"} onClick={() => setMode("wholesale")}
              title="Mayorista" icon="📦" price={product.price.wholesale}
              sub="Desde 100"
              compareAt={product.price.individual}
            />
          </div>
        </div>

        {/* Wholesale tiers */}
        {mode === "wholesale" && (
          <div className="rounded-2xl border border-border bg-card p-3 float-up space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Precios mayoristas</p>
            {[
              { range: "1 - 5 unidades", price: product.price.individual },
              { range: "5 - 20 unidades", price: product.price.group },
              { range: "20 - 100 unidades", price: Math.round((product.price.group + product.price.wholesale) / 2) },
              { range: "100+ unidades", price: product.price.wholesale, best: true },
            ].map((t) => (
              <div key={t.range} className={`flex items-center justify-between rounded-lg px-2.5 py-1 ${t.best ? "bg-primary/15 border border-primary/30" : "bg-secondary"}`}>
                <span className="text-[10px]">{t.range}</span>
                <span className="text-[11px] font-bold">{formatARS(t.price)}</span>
              </div>
            ))}
            <p className="pt-1 text-[10px] text-muted-foreground">📦 Packaging · 🏷 Branding · 🚚 Envío a tu local</p>
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

        {/* Pasos por modo */}
        <PurchaseSteps mode={mode} />

        {/* Quantity */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Cantidad</p>
            <p className="text-[11px] text-muted-foreground">Elegí cuántas querés</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><Minus className="h-4 w-4" /></button>
            <QtyInput
              value={qty}
              onChange={setQty}
              className="w-20 rounded-lg border border-border bg-background py-1 text-center font-display text-base text-foreground focus:border-primary focus:outline-none"
            />
            <button onClick={() => setQty(qty + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-2 text-center"><Truck className="mx-auto mb-1 h-4 w-4 text-primary" />Envío 48h</div>
          <div className="rounded-xl border border-border bg-card p-2 text-center"><ShieldCheck className="mx-auto mb-1 h-4 w-4 text-primary" />Garantía</div>
          <div className="rounded-xl border border-border bg-card p-2 text-center"><Sparkles className="mx-auto mb-1 h-4 w-4 text-primary" />MercadoPago</div>
        </div>

        {/* Reseñas */}
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

        {/* También te puede gustar */}
        <div>
          <div className="mb-3 flex items-end justify-between">
            <p className="font-display text-base">También te puede gustar</p>
            <span className="text-[10px] text-muted-foreground">curado para vos</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts(product.slug, 4).map((r) => (
              <Link key={r.id} to="/products/$slug" params={{ slug: r.slug }} className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center transition-transform group-active:scale-95" style={{ background: r.gradient }}>
                  <span>{r.emoji}</span>
                  {r.badge && <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">{r.badge}</span>}
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium">{r.title}</p>
                <p className="text-xs font-bold text-primary">{formatARS(r.price.group)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-orange-100 bg-white px-3 py-2.5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="shrink-0 px-1">
            <p className="text-[9px] uppercase leading-none text-neutral-500">{mode === "wholesale" ? "Mayorista" : "Individual"}</p>
            <p className="font-display text-base leading-tight text-[#e8451c]">{formatARS(price * qty)}</p>
            {savings > 0 && <p className="text-[9px] leading-none text-emerald-600">Ahorrás {formatARS(savings * qty)}</p>}
          </div>
          <div className="flex flex-1 gap-2">
            <button
              onClick={() => {
                doAdd();
                toast.success("Agregado al carrito 🛒", { description: `${qty} × ${product.title}` });
                navigate({ to: "/", search: { similar: product.slug } });
              }}
              className="flex-1 rounded-xl border-2 border-[#e8451c] bg-white py-3 text-xs font-black tracking-wider text-[#e8451c]"
            >
              AL CARRITO
            </button>
            <button
              onClick={mode === "wholesale" ? handleCta : handleBuyNow}
              className="flex-1 rounded-xl bg-[#e8451c] py-3 font-display text-xs font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              {mode === "individual" ? "COMPRAR" : cta}
            </button>
          </div>
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
    <button onClick={onClick} className={`relative flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${active ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]" : "border-border bg-card"}`}>
      {highlight && <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-warning px-1.5 py-0.5 text-[8px] font-black uppercase text-background whitespace-nowrap">⚡ Top</span>}
      <span className="text-lg leading-none mt-0.5">{icon}</span>
      <p className="text-[11px] font-bold leading-tight">{title}</p>
      <p className="font-display text-sm leading-none text-primary">{formatARS(price)}</p>
      {compareAt && compareAt > price ? (
        <p className="text-[9px] text-muted-foreground line-through leading-none">{formatARS(compareAt)}</p>
      ) : (
        <p className="text-[9px] text-muted-foreground leading-none">{sub}</p>
      )}
      {badge && <span className="rounded bg-success/20 px-1 py-0.5 text-[8px] font-bold text-success leading-none">{badge}</span>}
    </button>
  );
}
