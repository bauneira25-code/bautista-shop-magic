import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft, Heart, Share2, Star, Users, Clock, Truck, ShieldCheck, Sparkles,
  Plus, Minus,
} from "lucide-react";
import { findProduct, formatARS, AI_STYLES, stockLabel, relatedProducts, type PurchaseMode } from "@/lib/mockData";
import { useLocalCart } from "@/stores/localCart";
import { MultiDesignSheet, type DesignData } from "@/components/MultiDesignSheet";
import { FullCustomizeSheet } from "@/components/FullCustomizeSheet";
import { PurchaseSteps } from "@/components/PurchaseSteps";
import { toast } from "sonner";
import { QtyInput } from "@/components/QtyInput";

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
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customStyle, setCustomStyle] = useState(AI_STYLES[0].id);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageData, setCustomImageData] = useState<string | null>(null);
  const [customAdded, setCustomAdded] = useState(false);
  const [wsCustomQty, setWsCustomQty] = useState(50);
  const [wsTotalQty, setWsTotalQty] = useState(100);
  const [wsDesignsArr, setWsDesignsArr] = useState<number[]>([50]);
  const [showWsCustom, setShowWsCustom] = useState(false);
  const [showMulti, setShowMulti] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addDesignToCart = (d: DesignData, idx: number) => {
    if (!product) return;
    const id = `${product.slug}-${mode}-${variant}-${color}-design${idx}-${Date.now()}`;
    addToCart({
      id,
      slug: product.slug,
      title: product.title,
      emoji: product.emoji,
      gradient: product.gradient,
      mode,
      unitPrice: price,
      quantity: d.units,
      variant: product.variants?.[variant],
      color: product.colors?.[color],
      customization: { text: d.text, style: customStyle, imageName: d.imageName },
    });
  };

  if (!product) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Producto no encontrado</div>;
  }

  const price = product.price[mode];
  const savings = product.price.individual - price;

  const cta = mode === "wholesale" ? "PEDIR MAYORISTA" : "AGREGAR AL CARRITO";

  const doAdd = () => {
    const customization = customText || customImage
      ? { text: customText || undefined, style: customStyle, imageName: customImage || undefined }
      : undefined;
    const id = `${product.slug}-${mode}-${variant}-${color}-${customization ? "custom" : "std"}`;
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
      customization,
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

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handlePickImageFile(f);
  };

  const handlePickImageFile = (f: File | undefined) => {
    if (!f) return;
    setCustomImage(f.name);
    const r = new FileReader();
    r.onload = () => setCustomImageData(typeof r.result === "string" ? r.result : null);
    r.readAsDataURL(f);
    toast.success("Imagen subida ✨", { description: f.name });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-32">
      {/* Hero image */}
      <div className="relative aspect-square w-full" style={{ background: product.gradient }}>
        <div className="absolute inset-0 grid place-items-center text-[10rem]">{product.emoji}</div>
        {customText && (
          <div className="absolute inset-x-0 bottom-20 text-center font-display text-3xl text-white drop-shadow-lg">
            {customText}
          </div>
        )}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Share2 className="h-4 w-4 text-white" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur"><Heart className="h-4 w-4 text-white" /></button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-[11px] text-white">{product.liveActivity[0]?.name} {product.liveActivity[0]?.action}</span>
        </div>
        <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {stockLabel(product.stock).label}
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

      <div className="space-y-4 px-4 pt-4">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-bold text-primary">{product.badge ?? "TENDENCIA"}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {product.rating} ({product.reviews})</span>
          </div>
          <h1 className="mt-2 font-display text-2xl leading-tight">{product.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
        </div>

        {/* 3 PURCHASE MODES — uno al lado del otro */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Elegí cómo comprar</p>
          <div className={`grid gap-2 ${hasActiveGroup ? "grid-cols-3" : "grid-cols-2"}`}>
            <ModeCard
              active={mode === "individual"} onClick={() => setMode("individual")}
              title="Individual" icon="🛍" price={product.price.individual}
              sub="1 unidad"
            />
            {hasActiveGroup && (
              <ModeCard
                active={mode === "group"} onClick={() => setMode("group")}
                title="Grupal" icon="👥" price={product.price.group}
                sub={`Desde ${product.groupTarget}`}
                highlight badge={`-${Math.round((1 - product.price.group / product.price.individual) * 100)}%`}
                compareAt={product.price.individual}
              />
            )}
            <ModeCard
              active={mode === "wholesale"} onClick={() => setMode("wholesale")}
              title="Mayorista" icon="📦" price={product.price.wholesale}
              sub="Desde 100"
              compareAt={product.price.individual}
            />
          </div>
        </div>

        {/* Group simple explainer */}
        {mode === "group" && (
          <div className="rounded-3xl border-2 border-[#e8451c]/40 bg-white p-4 float-up space-y-4 shadow-sm">
            {/* Big number row */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-3xl font-black leading-none text-[#e8451c]">
                  {product.groupJoined}<span className="text-neutral-400">/{product.groupTarget}</span>
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">personas se unieron</p>
              </div>
              <div className="rounded-2xl bg-[#e8451c] px-3 py-2 text-center text-white">
                <p className="text-[9px] font-bold uppercase opacity-90">Cierra en</p>
                <p className="font-display text-sm font-black leading-tight">{product.groupTimeLeft}</p>
              </div>
            </div>

            {/* Avatars grid */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: product.groupTarget }).map((_, i) => {
                const filled = i < product.groupJoined;
                return (
                  <span
                    key={i}
                    className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-black ${
                      filled ? "bg-[#e8451c] text-white" : "border-2 border-dashed border-neutral-300 text-neutral-400"
                    }`}
                  >
                    {filled ? "✓" : "+"}
                  </span>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#e8451c] transition-all" style={{ width: `${groupPct}%` }} />
            </div>

            {/* Plain explanation */}
            <div className="rounded-2xl bg-orange-50 p-3">
              <p className="text-xs font-bold text-neutral-900">
                👥 Comprá junto a otras personas que quieren el mismo producto
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-700">
                Cuando se completen las <b>{product.groupTarget}</b> unidades, todos pagan solo{" "}
                <b className="text-[#e8451c]">{formatARS(product.price.group)}</b> por unidad.
                Faltan <b>{product.groupTarget - product.groupJoined}</b> para cerrar el grupo.
              </p>
            </div>

            {/* Quick choice */}
            {(() => {
              const remaining = product.groupTarget - product.groupJoined;
              const completing = qty >= remaining;
              return (
                <>
                  <div className="flex gap-2">
                    <button onClick={() => setQty(1)} className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${!completing ? "border-[#e8451c] bg-[#e8451c]/10 text-[#e8451c]" : "border-neutral-200 text-neutral-600"}`}>
                      Sumarme con 1
                    </button>
                    <button onClick={() => setQty(remaining)} className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${completing ? "border-[#e8451c] bg-[#e8451c]/10 text-[#e8451c]" : "border-neutral-200 text-neutral-600"}`}>
                      Llevarme las {remaining}
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-700">
                    💡 Comprando <b>{remaining} unidad{remaining === 1 ? "" : "es"}</b> completás el grupo y desbloqueás la oferta al instante para vos y todos los que ya se sumaron.
                  </p>
                </>
              );
            })()}
          </div>
        )}

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

        {/* Wholesale custom — botón "Personalizar con fuego" */}
        {mode === "wholesale" && product.customizable && (
          <button
            onClick={() => setShowWsCustom(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-sm font-black tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            PERSONALIZAR
          </button>
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

        {/* Personalizar — individual y grupal (fullscreen) */}
        {product.customizable && (mode === "individual" || mode === "group") && (
          <button
            onClick={() => {
              if (qty >= 2) setShowMulti(true);
              else setShowCustom(true);
            }}
            className="flex w-full items-center justify-between rounded-2xl p-4 text-white shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {qty >= 2 ? `Hasta ${qty} diseños distintos` : "Texto, imagen y color"}
              </p>
              <p className="font-display text-lg">PERSONALIZAR</p>
            </div>
            {customAdded && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                ✓ Listo
              </span>
            )}
          </button>
        )}

        {/* Pasos por modo */}
        <PurchaseSteps mode={mode} />

        {/* Quantity — siempre visible */}
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
            <p className="text-[9px] uppercase leading-none text-neutral-500">{mode === "group" ? "Grupal" : mode === "wholesale" ? "Mayorista" : "Individual"}</p>
            <p className="font-display text-base leading-tight text-[#e8451c]">{formatARS(price * qty)}</p>
            {savings > 0 && <p className="text-[9px] leading-none text-emerald-600">Ahorrás {formatARS(savings * qty)}</p>}
          </div>
          <div className="flex flex-1 gap-2">
            <button
              onClick={() => { doAdd(); toast.success("Agregado al carrito 🛒", { description: `${qty} × ${product.title}` }); }}
              className="flex-1 rounded-xl border-2 border-[#e8451c] bg-white py-3 text-xs font-black tracking-wider text-[#e8451c]"
            >
              AL CARRITO
            </button>
            <button
              onClick={mode === "wholesale" ? handleCta : handleBuyNow}
              className="flex-1 rounded-xl bg-[#e8451c] py-3 font-display text-xs font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              {mode === "individual" ? "COMPRAR" : mode === "group" ? "UNIRME AL GRUPO" : cta}
            </button>
          </div>
        </div>
      </div>

      {/* WHOLESALE CUSTOM SHEET */}
      {showWsCustom && product.customizable && (
        <WholesaleCustomSheet
          product={product}
          totalQty={wsTotalQty}
          setTotalQty={setWsTotalQty}
          customQty={wsCustomQty}
          setCustomQty={setWsCustomQty}
          designs={wsDesignsArr}
          setDesigns={setWsDesignsArr}
          customText={customText}
          setCustomText={setCustomText}
          customImage={customImage}
          onPickImage={onPickImage}
          fileRef={fileRef}
          onClose={() => setShowWsCustom(false)}
          onAddToCart={() => {
            setQty(wsTotalQty);
            doAdd();
            setShowWsCustom(false);
            toast.success("Agregado al carrito 🛒", { description: `${wsTotalQty} × ${product.title} · ${wsCustomQty} personalizadas` });
          }}
          onBuyNow={() => {
            setQty(wsTotalQty);
            doAdd();
            setShowWsCustom(false);
            navigate({ to: "/cart" });
          }}
          onOpenMulti={() => { setShowWsCustom(false); setShowMulti(true); }}
        />
      )}

      {/* MULTI DESIGN SHEET — individual / grupal con qty >= 2 o mayorista */}
      {showMulti && product.customizable && (
        <MultiDesignSheet
          productTitle={product.title}
          productEmoji={product.emoji}
          productGradient={product.gradient}
          totalUnits={mode === "wholesale" ? wsCustomQty : qty}
          onClose={() => setShowMulti(false)}
          onDesignAdded={addDesignToCart}
          onAllDone={() => {
            setShowMulti(false);
            toast.success("Diseños añadidos al resumen ✨");
            navigate({ to: "/cart" });
          }}
        />
      )}

      {/* FULLSCREEN CUSTOM SHEET — individual / grupal con 1 unidad */}
      {showCustom && product.customizable && (
        <FullCustomizeSheet
          productTitle={product.title}
          productEmoji={product.emoji}
          productGradient={product.gradient}
          text={customText}
          setText={setCustomText}
          imageName={customImage}
          imageData={customImageData}
          onPickImage={handlePickImageFile}
          colors={product.colors}
          selectedColor={product.colors?.[color]}
          onSelectColor={(c) => {
            const idx = product.colors?.indexOf(c) ?? -1;
            if (idx >= 0) setColor(idx);
          }}
          onClose={() => setShowCustom(false)}
          onConfirm={() => {
            setCustomAdded(true);
            setShowCustom(false);
            toast.success("Diseño guardado ✨", { description: "Listo para comprar" });
          }}
        />
      )}
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

function WholesaleCustomSheet({
  product, totalQty, setTotalQty, customQty, setCustomQty, designs, setDesigns,
  customText, setCustomText, customImage, onPickImage, fileRef, onClose, onAddToCart, onBuyNow, onOpenMulti,
}: {
  product: ReturnType<typeof findProduct> & {};
  totalQty: number; setTotalQty: (n: number) => void;
  customQty: number; setCustomQty: (n: number) => void;
  designs: number[]; setDesigns: (a: number[]) => void;
  customText: string; setCustomText: (s: string) => void;
  customImage: string | null;
  onPickImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void; onAddToCart: () => void; onBuyNow: () => void;
  onOpenMulti: () => void;
}) {
  if (!product) return null;
  const sumDesigns = designs.reduce((a, b) => a + b, 0);
  const stockQty = Math.max(0, totalQty - customQty);
  const valid = customQty > 0 && customQty <= totalQty && sumDesigns === customQty;
  const updateDesign = (i: number, v: number) => {
    const next = [...designs];
    next[i] = Math.max(0, Math.floor(v));
    setDesigns(next);
  };
  const addDesign = () => setDesigns([...designs, 0]);
  const removeDesign = (i: number) => setDesigns(designs.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] border-t border-primary/20 bg-background p-5 pb-8 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl">🔥 Personalizar mayorista</h3>
            <p className="text-[11px] text-muted-foreground">Diseñá libremente cuántas y cuántos diseños distintos.</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted">×</button>
        </div>

        {/* Preview producto */}
        <div className="relative mb-3 grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl text-7xl" style={{ background: product.gradient }}>
          <span>{product.emoji}</span>
          {customText && (
            <div className="absolute inset-x-0 bottom-3 text-center font-display text-2xl text-white drop-shadow-lg">{customText}</div>
          )}
          {customImage && (
            <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">📎 {customImage}</span>
          )}
        </div>

        {/* Texto */}
        <div className="mb-3">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Texto / marca</label>
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value.slice(0, 24))}
            placeholder="Ej: TU MARCA"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Imagen */}
        <div className="mb-3">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Imagen / logo</label>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
          <button onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card py-3 text-xs">
            🖼 {customImage ? customImage : "Subir imagen / logo"}
          </button>
        </div>

        {/* Total */}
        <div className="mb-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Total a comprar</label>
            <QtyInput
              value={totalQty}
              onChange={setTotalQty}
              className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-right text-sm"
            />
          </div>
          <input
            type="range" min={10} max={1000} step={10} value={totalQty}
            onChange={(e) => setTotalQty(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        {/* Personalizar cantidad */}
        <div className="mb-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">¿Cuántas personalizar?</label>
            <QtyInput
              value={customQty}
              min={0}
              max={totalQty}
              onChange={setCustomQty}
              className="w-20 rounded-lg border border-primary/40 bg-background px-2 py-1 text-right text-sm"
            />
          </div>
          <input
            type="range" min={0} max={totalQty} step={1} value={customQty}
            onChange={(e) => setCustomQty(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{customQty} personalizadas</span>
            <span>{stockQty} stock estándar</span>
          </div>
        </div>

        {/* Diseños — distribución libre */}
        <div className="mb-3 rounded-xl border border-dashed border-primary/30 bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold">Diseños distintos ({designs.length})</p>
            <button onClick={addDesign} className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">+ diseño</button>
          </div>
          <div className="space-y-1.5">
            {designs.map((d, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary px-2 py-1.5">
                <span className="text-[11px] font-semibold">Diseño {i + 1}</span>
                <QtyInput
                  value={d}
                  min={0}
                  onChange={(n) => updateDesign(i, n)}
                  className="ml-auto w-20 rounded-md border border-border bg-background px-2 py-1 text-right text-xs"
                />
                <span className="text-[10px] text-muted-foreground">u.</span>
                {designs.length > 1 && (
                  <button onClick={() => removeDesign(i)} className="text-[10px] text-muted-foreground hover:text-destructive">✕</button>
                )}
              </div>
            ))}
          </div>
          <p className={`mt-2 text-[10px] ${sumDesigns === customQty ? "text-success" : "text-warning"}`}>
            Asignadas {sumDesigns} de {customQty} unidades personalizadas
          </p>
        </div>

        {customQty >= 2 && (
          <button
            onClick={onOpenMulti}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 py-2.5 text-xs font-bold text-primary"
          >
            🎨 Diseñar uno por uno ({customQty} pantallas)
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onAddToCart} disabled={!valid} className="rounded-xl border border-primary/40 bg-primary/10 py-3 text-xs font-bold text-primary disabled:opacity-40">AL CARRITO</button>
          <button onClick={onBuyNow} disabled={!valid} className="rounded-xl py-3 font-display text-xs tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-40" style={{ background: "var(--gradient-primary)" }}>COMPRAR AHORA</button>
        </div>
      </div>
    </div>
  );
}

