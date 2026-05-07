import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Sparkles, Type, Image as ImageIcon, Wand2, ShoppingBag, Zap, Trash2, Move } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { AI_STYLES, MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { useLocalCart } from "@/stores/localCart";
import { toast } from "sonner";

export const Route = createFileRoute("/customize")({
  component: Customize,
});

const customizableProducts = MOCK_PRODUCTS.filter((p) => p.customizable);

type LogoState = {
  src: string | null;
  text: string;
  x: number; // % position
  y: number;
  scale: number;
};

function Customize() {
  const navigate = useNavigate();
  const add = useLocalCart((s) => s.add);

  const [product, setProduct] = useState(customizableProducts[0]);
  const [variant, setVariant] = useState(product.variants?.[0] ?? "");
  const [caseColor, setCaseColor] = useState(product.colors?.[0] ?? "#000000");
  const [logo, setLogo] = useState<LogoState>({ src: null, text: "TU LOGO", x: 50, y: 50, scale: 1 });
  const [tab, setTab] = useState<"logo" | "texto" | "ia">("logo");
  const [aiStyle, setAiStyle] = useState(AI_STYLES[0].id);
  const [aiPrompt, setAiPrompt] = useState("logo minimal blanco sobre negro");
  const [generating, setGenerating] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogo((l) => ({ ...l, src: url }));
    toast.success("Logo cargado ✨");
  };

  const onDrag = (e: React.PointerEvent) => {
    if (e.buttons !== 1 || !dragRef.current) return;
    const r = dragRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setLogo((l) => ({ ...l, x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) }));
  };

  const generateAI = () => {
    setGenerating(true);
    setTimeout(() => {
      setLogo((l) => ({ ...l, src: null, text: aiPrompt.slice(0, 14).toUpperCase() }));
      setGenerating(false);
      toast.success("Diseño IA aplicado ✨");
    }, 900);
  };

  const buildCartItem = () => ({
    id: `${product.slug}-custom-${Date.now()}`,
    slug: product.slug,
    title: `${product.title} · Custom`,
    emoji: product.emoji,
    gradient: product.gradient,
    mode: "individual" as const,
    unitPrice: product.price.individual,
    quantity: 1,
    variant,
    color: caseColor,
    customization: {
      text: logo.text,
      style: aiStyle,
      imageName: logo.src ? "logo-cliente" : undefined,
    },
  });

  const addToCart = () => {
    add(buildCartItem());
    toast.success("Agregado al carrito 🛒");
  };

  const payNow = () => {
    add(buildCartItem());
    navigate({ to: "/cart" });
  };

  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Studio</p>
        <h1 className="font-display text-3xl">Personalizar 🔥</h1>
        <p className="mt-1 text-xs text-muted-foreground">Subí tu logo y vé cómo queda en el producto</p>
      </header>

      <main className="space-y-5 px-5">
        {/* Producto */}
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 scrollbar-hide">
          {customizableProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProduct(p);
                setVariant(p.variants?.[0] ?? "");
                setCaseColor(p.colors?.[0] ?? "#000000");
              }}
              className={`flex shrink-0 flex-col items-center gap-1.5 ${product.id === p.id ? "" : "opacity-50"}`}
            >
              <span
                className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl border-2 transition ${product.id === p.id ? "border-primary" : "border-transparent"}`}
                style={{ background: p.gradient }}
              >
                {p.emoji}
              </span>
              <span className="text-[10px] font-medium">{p.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* MOCKUP de funda con logo */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-[40px] border border-white/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)]" style={{ background: "linear-gradient(180deg,#1a1a1a,#0a0a0a)" }}>
          {/* Fondo escenario */}
          <div className="absolute inset-0 opacity-40" style={{ background: product.gradient }} />

          {/* Funda */}
          <div
            ref={dragRef}
            onPointerMove={onDrag}
            onPointerDown={onDrag}
            className="absolute left-1/2 top-1/2 h-[78%] w-[58%] -translate-x-1/2 -translate-y-1/2 touch-none select-none rounded-[34px] border border-white/20 shadow-[inset_0_2px_20px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.5)]"
            style={{ background: caseColor }}
          >
            {/* Cámaras */}
            <div className="absolute left-4 top-4 grid h-16 w-16 grid-cols-2 grid-rows-2 gap-1 rounded-2xl bg-black/40 p-1.5">
              <div className="rounded-full bg-black/80 ring-2 ring-white/10" />
              <div className="rounded-full bg-black/80 ring-2 ring-white/10" />
              <div className="rounded-full bg-black/80 ring-2 ring-white/10" />
              <div className="grid place-items-center text-[8px] text-white/60">flash</div>
            </div>

            {/* Zona del logo */}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${logo.x}%`, top: `${logo.y}%`, transform: `translate(-50%,-50%) scale(${logo.scale})` }}
            >
              {logo.src ? (
                <img src={logo.src} alt="logo" className="max-h-28 max-w-28 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
              ) : (
                <div className="rounded-xl border border-dashed border-white/40 bg-black/30 px-3 py-2 text-center backdrop-blur">
                  <p className="font-display text-base font-black tracking-wider text-white">{logo.text || "TU LOGO"}</p>
                  <p className="text-[8px] text-white/50">arrastrá para mover</p>
                </div>
              )}
            </div>

            {/* MagSafe */}
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 opacity-30" />
          </div>

          {/* Etiqueta */}
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">
            Vista previa
          </span>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-white backdrop-blur">
            <Move className="h-3 w-3" /> arrastrá
          </span>

          {/* Modelo */}
          {variant && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
              {variant}
            </span>
          )}
        </div>

        {/* Variante / color */}
        {product.variants && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Modelo</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${variant === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}
        {product.colors && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Color de la funda</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setCaseColor(c)}
                  className={`h-9 w-9 rounded-full border-2 transition ${caseColor === c ? "border-primary scale-110" : "border-white/20"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tabs herramientas */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary p-1">
          {[
            { id: "logo" as const, label: "Logo", icon: ImageIcon },
            { id: "texto" as const, label: "Texto", icon: Type },
            { id: "ia" as const, label: "IA", icon: Wand2 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition ${tab === t.id ? "bg-card shadow" : "text-muted-foreground"}`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "logo" && (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-6 text-sm font-medium text-primary"
            >
              <ImageIcon className="h-4 w-4" />
              {logo.src ? "Cambiar logo" : "Subir tu logo (PNG/JPG)"}
            </button>
            {logo.src && (
              <button
                onClick={() => setLogo((l) => ({ ...l, src: null }))}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Trash2 className="h-3 w-3" /> Quitar logo
              </button>
            )}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tamaño</p>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={logo.scale}
                onChange={(e) => setLogo((l) => ({ ...l, scale: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {tab === "texto" && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Texto sobre la funda</p>
            <input
              value={logo.text}
              onChange={(e) => setLogo((l) => ({ ...l, text: e.target.value }))}
              placeholder="Tu nombre, marca, frase…"
              className="mt-2 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {tab === "ia" && (
          <div className="rounded-3xl border border-primary/30 p-4" style={{ background: "var(--gradient-violet, linear-gradient(135deg,#7c3aed,#ec4899))" }}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white" />
              <p className="font-display text-base text-white">AI Studio</p>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={2}
              className="mt-3 w-full resize-none rounded-xl bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50"
              placeholder="Describí el logo que querés..."
            />
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {AI_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAiStyle(s.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${aiStyle === s.id ? "border-white bg-white text-primary" : "border-white/30 text-white"}`}
                >
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
            <button
              onClick={generateAI}
              disabled={generating}
              className="mt-4 w-full rounded-2xl bg-white py-3 font-display text-sm text-primary disabled:opacity-50"
            >
              {generating ? "Generando…" : "✨ Generar diseño"}
            </button>
          </div>
        )}

        {/* CTAs finales */}
        <div className="sticky bottom-24 z-20 -mx-5 mt-4 space-y-2 bg-gradient-to-t from-background via-background to-transparent px-5 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-2.5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="font-display text-xl">{formatARS(product.price.individual)}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
              Personalización incluida
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={addToCart}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold"
            >
              <ShoppingBag className="h-4 w-4" /> Al carrito
            </button>
            <button
              onClick={payNow}
              className="flex items-center justify-center gap-1.5 rounded-2xl py-3.5 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)]"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
            >
              <Zap className="h-4 w-4" /> Pagar ahora
            </button>
          </div>
        </div>
      </main>
    </MobileShell>
  );
}
