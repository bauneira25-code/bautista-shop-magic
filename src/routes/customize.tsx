import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Type, Image as ImageIcon, Smile, Wand2, Layers, Download, Heart, Eye, Bookmark, Box } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { AI_STYLES, MOCK_PRODUCTS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/customize")({
  component: Customize,
});

const customizableProducts = MOCK_PRODUCTS.filter((p) => p.customizable);

function Customize() {
  const [product, setProduct] = useState(customizableProducts[0]);
  const [text, setText] = useState("NEIBA");
  const [style, setStyle] = useState(AI_STYLES[0].id);
  const [prompt, setPrompt] = useState("minimal black mountain design");
  const [generated, setGenerated] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(["🌄", "⛰️", "🏔️", "🗻"]);
      setLoading(false);
      toast.success("4 diseños generados con IA ✨");
    }, 1100);
  };

  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Studio</p>
        <h1 className="font-display text-3xl">Customize 🔥</h1>
        <p className="mt-1 text-xs text-muted-foreground">Diseñá tu producto con IA en tiempo real</p>
      </header>

      <main className="space-y-6 px-5">
        {/* Product picker */}
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 scrollbar-hide">
          {customizableProducts.map((p) => (
            <button key={p.id} onClick={() => setProduct(p)} className={`flex shrink-0 flex-col items-center gap-1.5 ${product.id === p.id ? "" : "opacity-60"}`}>
              <span className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl border-2 transition ${product.id === p.id ? "border-primary" : "border-transparent"}`} style={{ background: p.gradient }}>{p.emoji}</span>
              <span className="text-[10px] font-medium">{p.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Live preview */}
        <div className="relative aspect-square overflow-hidden rounded-3xl" style={{ background: product.gradient }}>
          <div className="absolute inset-0 grid place-items-center text-[10rem]">{product.emoji}</div>
          <div className="absolute inset-x-6 bottom-12 grid place-items-center">
            <div className="rounded-2xl bg-black/40 px-4 py-2 backdrop-blur">
              <p className="font-display text-2xl text-white tracking-wider">{text}</p>
            </div>
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">Vista en vivo</span>
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur"><Layers className="h-4 w-4" /></span>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Type, label: "Texto" },
            { icon: ImageIcon, label: "Imagen" },
            { icon: Smile, label: "Sticker" },
            { icon: Wand2, label: "Efectos" },
          ].map((t) => (
            <button key={t.label} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3 text-xs">
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Text input */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu texto</p>
          <input value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {/* AI Generation */}
        <div className="rounded-3xl border border-primary/30 p-4" style={{ background: "var(--gradient-violet)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neon" />
            <p className="font-display text-base">AI Studio</p>
            <span className="rounded-md bg-neon/20 px-1.5 py-0.5 text-[9px] font-bold text-neon">BETA</span>
          </div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} className="mt-3 w-full resize-none rounded-xl bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50" placeholder="Describí el diseño que querés..." />

          <p className="mt-3 text-[10px] uppercase tracking-wider text-white/70">Estilo</p>
          <div className="-mx-1 mt-1 flex gap-2 overflow-x-auto px-1 scrollbar-hide">
            {AI_STYLES.map((s) => (
              <button key={s.id} onClick={() => setStyle(s.id)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${style === s.id ? "border-white bg-white text-primary" : "border-white/30 text-white"}`}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>

          <button onClick={generate} disabled={loading} className="mt-4 w-full rounded-2xl bg-white py-3 font-display text-sm text-primary disabled:opacity-50">
            {loading ? "Generando..." : "✨ Generar diseños"}
          </button>

          {generated.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {generated.map((g, i) => (
                <button key={i} className="aspect-square rounded-xl bg-black/40 text-3xl">{g}</button>
              ))}
            </div>
          )}
        </div>

        {/* 3D preview teaser */}
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-base"><Box className="mr-1 inline h-4 w-4 text-neon" /> Preview 3D</p>
            <span className="rounded-md bg-neon/20 px-1.5 py-0.5 text-[9px] font-bold text-neon">NEW</span>
          </div>
          <div className="mt-3 grid h-32 place-items-center rounded-2xl text-5xl" style={{ background: "var(--gradient-violet)" }}>
            <span className="animate-pulse">{product.emoji}</span>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">Girá el producto y vé tu diseño en 360°</p>
        </div>

        {/* Community designs */}
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-lg">🔥 Diseños virales</p>
              <p className="text-[10px] text-muted-foreground">Lo que está usando la comunidad</p>
            </div>
            <button className="text-xs text-primary">Ver todo</button>
          </div>
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {[
              { e: "🌄", a: "Mica", l: "12.4k", v: "89k" },
              { e: "🐉", a: "Joaco", l: "9.1k", v: "65k" },
              { e: "🌸", a: "Pili", l: "7.8k", v: "54k" },
              { e: "👽", a: "Iván", l: "6.2k", v: "41k" },
              { e: "🦋", a: "Vale", l: "5.4k", v: "38k" },
            ].map((d, i) => (
              <div key={i} className="w-[140px] shrink-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: `linear-gradient(135deg, hsl(${i * 60} 70% 35%), hsl(${i * 60 + 60} 70% 25%))` }}>
                  <span>{d.e}</span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-[10px] font-bold text-white">@{d.a}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[9px] text-white/80">
                      <span className="inline-flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" />{d.l}</span>
                      <span className="inline-flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" />{d.v}</span>
                    </div>
                  </div>
                  <button className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 backdrop-blur"><Bookmark className="h-3 w-3 text-white" /></button>
                </div>
                <button className="mt-2 w-full rounded-xl bg-card py-1.5 text-[10px] font-bold text-primary">Usar diseño</button>
              </div>
            ))}
          </div>
        </div>

        {/* TikTok templates */}
        <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-4">
          <p className="font-display text-base text-white">📱 Templates TikTok</p>
          <p className="text-[10px] text-white/60">Los formatos que más están explotando</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["#GRWM", "#FYP", "#aesthetic"].map((t) => (
              <button key={t} className="rounded-xl border border-pink-400/40 bg-black/40 py-2 text-[10px] font-bold text-pink-200">{t}</button>
            ))}
          </div>
        </div>

        {/* HUGE protagonist CTA */}
        <button className="group relative mb-8 flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[28px] py-7 text-white shadow-[0_30px_80px_-15px_rgba(168,85,247,0.8)]" style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)" }}>
          <span className="relative z-10 flex items-center gap-2 font-display text-2xl font-black tracking-wider">
            <Sparkles className="h-6 w-6" /> PERSONALIZAR 🔥
          </span>
          <span className="relative z-10 inline-flex items-center gap-1 text-[11px] font-medium text-white/80">
            <Download className="h-3 w-3" /> Guardar y sumar al carrito · envío gratis
          </span>
          <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </main>
    </MobileShell>
  );
}
