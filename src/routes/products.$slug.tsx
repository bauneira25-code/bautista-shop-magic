import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft, Heart, Share2, Star, Users, Clock, Truck, ShieldCheck, Sparkles,
  Plus, Minus, Type, Image as ImageIcon, Smile, Wand2, ChevronDown,
} from "lucide-react";
import { findProduct, formatARS, AI_STYLES, stockLabel, relatedProducts, type PurchaseMode } from "@/lib/mockData";
import { useLocalCart } from "@/stores/localCart";
import { MultiDesignSheet, type DesignData } from "@/components/MultiDesignSheet";
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
  const addToCart = useLocalCart((s) => s.add);
  const [mode, setMode] = useState<PurchaseMode>("group");
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [variant, setVariant] = useState(0);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customStyle, setCustomStyle] = useState(AI_STYLES[0].id);
  const [customImage, setCustomImage] = useState<string | null>(null);
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
  const groupPct = (product.groupJoined / product.groupTarget) * 100;

  const groupSolo = mode === "group" && qty >= product.groupTarget;
  const cta =
    mode === "group"
      ? (groupSolo ? "COMPRAR LAS " + product.groupTarget : "SUMARME AL GRUPO")
      : mode === "wholesale" ? "PEDIR MAYORISTA" : "AGREGAR AL CARRITO";

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
    if (mode === "group" && !groupSolo) {
      navigate({ to: "/group/$slug", params: { slug: product.slug } });
      return;
    }
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
    if (f) {
      setCustomImage(f.name);
      toast.success("Imagen subida ✨", { description: f.name });
    }
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
          <div className="grid grid-cols-3 gap-2">
            <ModeCard
              active={mode === "individual"} onClick={() => setMode("individual")}
              title="Individual" icon="🛍" price={product.price.individual}
              sub="1 unidad"
            />
            <ModeCard
              active={mode === "group"} onClick={() => setMode("group")}
              title="Grupal" icon="👥" price={product.price.group}
              sub={`Desde ${product.groupTarget}`}
              highlight badge={`-${Math.round((1 - product.price.group / product.price.individual) * 100)}%`}
              compareAt={product.price.individual}
            />
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
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 float-up space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary"><Users className="mr-1 inline h-4 w-4" />Compra grupal desde {product.groupTarget} unidades</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-warning"><Clock className="h-3 w-3" />{product.groupTimeLeft}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sumate al grupo y pagás <b className="text-primary">{formatARS(product.price.group)}</b> por unidad,
              o llevate las <b>{product.groupTarget} unidades</b> vos solo y desbloqueás el precio al instante.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setQty(1)} className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${qty < product.groupTarget ? "border-primary bg-primary/15 text-primary" : "border-border"}`}>
                Sumarme con 1
              </button>
              <button onClick={() => setQty(product.groupTarget)} className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${qty >= product.groupTarget ? "border-primary bg-primary/15 text-primary" : "border-border"}`}>
                Llevar las {product.groupTarget}
              </button>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full" style={{ width: `${groupPct}%`, background: "var(--gradient-primary)" }} />
            </div>
            <p className="text-[10px] text-muted-foreground">{product.groupJoined}/{product.groupTarget} ya se sumaron</p>
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
            PERSONALIZAR 🔥
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

        {/* Personalizar — individual y grupal */}
        {product.customizable && (mode === "individual" || mode === "group") && (
          <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
            <button
              onClick={() => {
                if (qty >= 2) setShowMulti(true);
                else setShowCustom(!showCustom);
              }}
              className="flex w-full items-center justify-between p-4 text-white"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {qty >= 2 ? `Hasta ${qty} diseños distintos` : "Hacelo único"}
                </p>
                <p className="font-display text-lg">PERSONALIZAR 🔥</p>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showCustom ? "rotate-180" : ""}`} />
            </button>

            {showCustom && (
              <div className="space-y-4 bg-card p-4 float-up">
                {/* Preview producto */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl" style={{ background: product.gradient }}>
                  <div className="absolute inset-0 grid place-items-center text-7xl">{product.emoji}</div>
                  {customText && (
                    <div className="absolute inset-x-0 bottom-3 text-center font-display text-2xl text-white drop-shadow-lg">
                      {customText}
                    </div>
                  )}
                  {customImage && (
                    <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                      📎 {customImage}
                    </span>
                  )}
                </div>

                {/* Texto */}
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Type className="h-3 w-3" /> Tu texto / nombre
                  </label>
                  <input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.slice(0, 20))}
                    placeholder="Ej: NEIBA"
                    className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <ImageIcon className="h-3 w-3" /> Tu imagen / logo
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/50 py-4 text-xs"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {customImage ? customImage : "Pegar / subir imagen"}
                  </button>
                </div>

                {/* CTA por modo */}
                {mode === "individual" ? (
                  <button
                    onClick={handleBuyNow}
                    className="w-full rounded-xl py-3.5 font-display text-sm tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    COMPRAR AHORA
                  </button>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="w-full rounded-xl py-3.5 font-display text-sm tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    SUMARME AHORA
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quantity — siempre visible */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Cantidad</p>
            <p className="text-[11px] text-muted-foreground">Elegí cuántas querés</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><Minus className="h-4 w-4" /></button>
            <span className="w-7 text-center font-display text-lg">{qty}</span>
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
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2">
        <div className="glass rounded-t-2xl border-t border-border/50 px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="px-1 shrink-0">
              <p className="text-[9px] uppercase text-muted-foreground leading-none">{mode === "group" ? "Grupal" : mode === "wholesale" ? "Mayorista" : "Individual"}</p>
              <p className="font-display text-base text-primary leading-tight">{formatARS(price * qty)}</p>
              {savings > 0 && <p className="text-[9px] text-success leading-none">Ahorrás {formatARS(savings * qty)}</p>}
            </div>
          <div className="flex flex-1 gap-2">
              <button
                onClick={() => { doAdd(); toast.success("Agregado al carrito 🛒", { description: `${qty} × ${product.title}` }); }}
                className="flex-1 rounded-xl border border-primary/40 bg-primary/10 py-3 text-xs font-bold text-primary"
              >
                AL CARRITO
              </button>
              <button
                onClick={mode === "wholesale" ? handleCta : handleBuyNow}
                className="flex-1 rounded-xl py-3 font-display text-xs tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-primary)" }}
              >
                {mode === "individual" ? "COMPRAR" : mode === "group" ? "SUMARME AHORA" : cta}
              </button>
            </div>
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
        />
      )}

      {/* MULTI DESIGN SHEET — individual / grupal con qty >= 2 */}
      {showMulti && product.customizable && (mode === "individual" || mode === "group") && (
        <MultiDesignSheet
          productTitle={product.title}
          productEmoji={product.emoji}
          productGradient={product.gradient}
          totalUnits={qty}
          onClose={() => setShowMulti(false)}
          onDesignAdded={addDesignToCart}
          onAllDone={() => {
            setShowMulti(false);
            toast.success("Diseños añadidos al resumen ✨");
            navigate({ to: "/cart" });
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
            <input
              type="number" min={1} value={totalQty}
              onChange={(e) => setTotalQty(Math.max(1, Number(e.target.value)))}
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
            <input
              type="number" min={0} max={totalQty} value={customQty}
              onChange={(e) => setCustomQty(Math.min(totalQty, Math.max(0, Number(e.target.value))))}
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
                <input
                  type="number" min={0} value={d}
                  onChange={(e) => updateDesign(i, Number(e.target.value))}
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

