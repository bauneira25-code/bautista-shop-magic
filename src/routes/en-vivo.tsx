import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, IMPORTERS, LOCALS, FABRICANTES, formatARS, type MockProduct } from "@/lib/mockData";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ShoppingBag,
  BadgeCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Store,
  Factory,
  Package,
} from "lucide-react";

export const Route = createFileRoute("/en-vivo")({
  head: () => ({
    meta: [
      { title: "En Vivo — NEIBA" },
      { name: "description", content: "Vivos de tiendas, importadores y fabricantes. Mirá y comprá en tiempo real." },
    ],
  }),
  component: EnVivoPage,
});

type SellerKind = "local" | "importer" | "fabricante";

interface LiveStream {
  id: string;
  sellerName: string;
  sellerKind: SellerKind;
  verified: boolean;
  avatar: string;
  city: string;
  tagline: string;
  caption: string;
  viewers: number;
  likes: number;
  gradient: string;
  products: MockProduct[];
}

function buildStreams(): LiveStream[] {
  const streams: LiveStream[] = [];

  IMPORTERS.slice(0, 4).forEach((s, i) => {
    const products = MOCK_PRODUCTS.filter((p) => p.sellerKind === "importer" && p.sellerName === s.name).slice(0, 6);
    if (products.length === 0) return;
    streams.push({
      id: `imp-${s.id}`,
      sellerName: s.name,
      sellerKind: "importer",
      verified: s.verified,
      avatar: s.emoji,
      city: s.city,
      tagline: s.specialty,
      caption: ["🔥 Stock recién llegado — precios mayoristas", "🚢 Liquidación de containers — ofertas únicas", "📦 Drop nuevo, hasta agotar stock", "⚡ Live exclusivo: ofertas solo por hoy"][i % 4],
      viewers: 340 + i * 217 + ((i * 91) % 500),
      likes: 1200 + i * 480,
      gradient: `linear-gradient(135deg, #1a0a2e, #3b0f5c, #e8451c)`,
      products,
    });
  });

  LOCALS.slice(0, 5).forEach((s, i) => {
    const products = MOCK_PRODUCTS.filter((p) => p.sellerKind === "local" && p.sellerName === s.name).slice(0, 6);
    if (products.length === 0) return;
    streams.push({
      id: `loc-${s.id}`,
      sellerName: s.name,
      sellerKind: "local",
      verified: s.verified,
      avatar: s.emoji,
      city: s.city,
      tagline: s.tagline,
      caption: ["✨ Mostrando lo nuevo de la semana", "💬 Respondo dudas en vivo, escribime", "🎁 Sorteo entre quienes compren ahora", "🛍️ Probando los productos antes que nadie"][i % 4],
      viewers: 180 + i * 134,
      likes: 540 + i * 290,
      gradient: `linear-gradient(135deg, #0a1a2e, #1a4a6e, #2dd4a8)`,
      products,
    });
  });

  FABRICANTES.slice(0, 4).forEach((s, i) => {
    const products = MOCK_PRODUCTS.filter((p) => p.sellerKind === "fabricante" && p.sellerName === s.name).slice(0, 6);
    if (products.length === 0) return;
    streams.push({
      id: `fab-${s.id}`,
      sellerName: s.name,
      sellerKind: "fabricante",
      verified: s.verified,
      avatar: s.emoji,
      city: s.city,
      tagline: s.specialty,
      caption: ["🏭 Tour por la fábrica — producción en vivo", "⚙️ Mostrando líneas de producción a medida", "🧵 Personalizá tu pedido, mín. 100 u.", "📐 Demo de prototipos para mayoristas"][i % 4],
      viewers: 90 + i * 78,
      likes: 320 + i * 175,
      gradient: `linear-gradient(135deg, #1a1a1a, #2d2d2d, #e85d3a)`,
      products,
    });
  });

  // interleave for variety
  const out: LiveStream[] = [];
  const imp = streams.filter((s) => s.sellerKind === "importer");
  const loc = streams.filter((s) => s.sellerKind === "local");
  const fab = streams.filter((s) => s.sellerKind === "fabricante");
  const max = Math.max(imp.length, loc.length, fab.length);
  for (let i = 0; i < max; i++) {
    if (loc[i]) out.push(loc[i]);
    if (imp[i]) out.push(imp[i]);
    if (fab[i]) out.push(fab[i]);
  }
  return out;
}

const KIND_LABEL: Record<SellerKind, { label: string; icon: typeof Store }> = {
  local: { label: "Tienda", icon: Store },
  importer: { label: "Importador", icon: Package },
  fabricante: { label: "Fabricante", icon: Factory },
};

function EnVivoPage() {
  const streams = useMemo(buildStreams, []);
  const [filter, setFilter] = useState<"all" | SellerKind>("all");
  const filtered = filter === "all" ? streams : streams.filter((s) => s.sellerKind === filter);

  return (
    <MobileShell>
      <header className="px-5 pb-3 pt-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> En vivo
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {streams.reduce((a, s) => a + s.viewers, 0).toLocaleString("es-AR")} mirando
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl">📡 Vivos ahora</h1>
        <p className="text-xs text-muted-foreground">Tiendas, importadores y fabricantes mostrando sus productos en tiempo real.</p>

        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {([
            ["all", "Todos"],
            ["local", "Tiendas"],
            ["importer", "Importadores"],
            ["fabricante", "Fabricantes"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                filter === k ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 pt-2 pb-8 space-y-4">
        {filtered.map((s) => (
          <LiveCard key={s.id} stream={s} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No hay vivos en esta categoría ahora.</p>
        )}
      </section>
    </MobileShell>
  );
}

function LiveCard({ stream }: { stream: LiveStream }) {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [viewers, setViewers] = useState(stream.viewers);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const heartId = useRef(0);
  const [productIdx, setProductIdx] = useState(0);
  const Kind = KIND_LABEL[stream.sellerKind];

  // Viewer ticker (client-only to avoid SSR mismatch)
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(20, v + Math.floor(Math.random() * 11) - 4));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Auto-rotate featured product
  useEffect(() => {
    if (stream.products.length <= 1) return;
    const t = setInterval(() => setProductIdx((i) => (i + 1) % stream.products.length), 4000);
    return () => clearInterval(t);
  }, [stream.products.length]);

  // Floating hearts
  useEffect(() => {
    const t = setInterval(() => {
      const id = ++heartId.current;
      setHearts((h) => [...h.slice(-12), { id, left: 70 + Math.random() * 25 }]);
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2500);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const tapHeart = () => {
    setLiked((l) => !l);
    const id = ++heartId.current;
    setHearts((h) => [...h, { id, left: 70 + Math.random() * 25 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2500);
  };

  const featured = stream.products[productIdx];

  return (
    <article
      className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      style={{ background: stream.gradient, aspectRatio: "9/14" }}
    >
      {/* Ambient grid */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)" }} />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3">
        <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-2 py-1.5 pr-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-lg ring-2 ring-white/30">
            {stream.avatar}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[12px] font-bold text-white leading-tight">
              <span className="truncate max-w-[110px]">{stream.sellerName}</span>
              {stream.verified && <BadgeCheck className="h-3 w-3 text-sky-300 shrink-0" />}
            </p>
            <p className="text-[9px] text-white/70 leading-tight flex items-center gap-1">
              <Kind.icon className="h-2.5 w-2.5" /> {Kind.label} · {stream.city}
            </p>
          </div>
          <button className="ml-1 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase text-white">
            Seguir
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black uppercase text-white">
            <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> Live
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white">
            <Eye className="h-2.5 w-2.5" /> {viewers.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Featured product showcase (center) */}
      {featured && (
        <Link
          to="/products/$slug"
          params={{ slug: featured.slug }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 z-10"
        >
          <div key={featured.id} className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
            <div
              className="grid h-32 w-32 place-items-center rounded-3xl text-6xl shadow-xl ring-4 ring-white/20"
              style={{ background: featured.gradient }}
            >
              {featured.emoji}
            </div>
            <p className="mt-3 text-center text-sm font-bold text-white drop-shadow line-clamp-2 max-w-[80%]">
              {featured.title}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-black text-black">
              {formatARS(featured.price.individual)}
            </div>
          </div>
        </Link>
      )}

      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {hearts.map((h) => (
          <Heart
            key={h.id}
            className="absolute bottom-32 h-5 w-5 fill-red-400 text-red-400"
            style={{ left: `${h.left}%`, animation: "live-heart-rise 2.5s ease-out forwards" }}
          />
        ))}
      </div>

      {/* Right action rail */}
      <div className="absolute right-2.5 bottom-32 z-20 flex flex-col items-center gap-3.5">
        <button onClick={tapHeart} className="flex flex-col items-center">
          <div className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${liked ? "bg-red-500" : "bg-black/40"}`}>
            <Heart className={`h-5 w-5 ${liked ? "fill-white text-white" : "text-white"}`} />
          </div>
          <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow">{(stream.likes + (liked ? 1 : 0)).toLocaleString("es-AR")}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow">{Math.floor(stream.likes / 12)}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow">Compartir</span>
        </button>
        <button onClick={() => setMuted((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
          {muted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
        </button>
      </div>

      {/* Bottom info + product strip */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-12 pb-3 px-3 space-y-2.5">
        <p className="text-[12px] font-semibold text-white leading-snug pr-16 drop-shadow">{stream.caption}</p>
        <p className="text-[10px] text-white/70 line-clamp-1">{stream.tagline}</p>

        {/* Product strip */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {stream.products.map((p, i) => (
            <Link
              key={p.id}
              to="/products/$slug"
              params={{ slug: p.slug }}
              onClick={(e) => { e.stopPropagation(); setProductIdx(i); }}
              className={`shrink-0 w-[100px] rounded-xl bg-white/95 p-1.5 transition ${i === productIdx ? "ring-2 ring-primary scale-105" : ""}`}
            >
              <div className="aspect-square grid place-items-center rounded-lg text-2xl" style={{ background: p.gradient }}>
                {p.emoji}
              </div>
              <p className="mt-1 text-[9px] font-semibold text-black line-clamp-1 leading-tight">{p.title}</p>
              <p className="text-[10px] font-black text-primary leading-tight">{formatARS(p.price.individual)}</p>
            </Link>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-red-500 py-2.5 text-[12px] font-black uppercase text-white shadow-lg">
          <ShoppingBag className="h-3.5 w-3.5" /> Comprar del vivo
          <Sparkles className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}
