import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, Zap, TrendingUp, Sparkles, ChevronRight, ShieldCheck, LogIn, UserPlus, Factory } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { SmartSearch } from "@/components/SmartSearch";
import { ProductBadges } from "@/components/ProductBadges";
import { OnboardingGender } from "@/components/OnboardingGender";
import { useUserPrefs, GENDER_BIAS } from "@/stores/userPrefs";
import { useUserAuth } from "@/stores/userAuth";
import { CATEGORIES, FLASH_DEALS, MOCK_PRODUCTS, VIRAL, LIVE_FEED, formatARS, stockLabel } from "@/lib/mockData";
import { useLiveViewers, formatViewers } from "@/lib/liveViewers";

const CAT_STYLES: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  tech:        { bg: "linear-gradient(135deg,#0a1530,#1e3a8a)", border: "#38bdf8", glow: "#38bdf8", text: "#e0f2fe" },
  electronica: { bg: "linear-gradient(135deg,#f1f5f9,#e0f2fe)", border: "#0ea5e9", glow: "#7dd3fc", text: "#0c4a6e" },
  hogar:       { bg: "linear-gradient(135deg,#e8d4b4,#c9a079)", border: "#a06c49", glow: "#a06c49", text: "#3d2616" },
  belleza:     { bg: "linear-gradient(135deg,#ffe0ee,#ffd0e6)", border: "#ec4899", glow: "#f472b6", text: "#831843" },
  joyeria:     { bg: "linear-gradient(135deg,#1a1410,#2a1f15)", border: "#d4af37", glow: "#d4af37", text: "#fef3c7" },
  animales:    { bg: "linear-gradient(135deg,#f0fdf4,#bbf7d0)", border: "#4a7c59", glow: "#22c55e", text: "#14532d" },
  moda:        { bg: "linear-gradient(135deg,#faf5f7,#f3e8ed)", border: "#8b3a5b", glow: "#c4959a", text: "#5c1a2e" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEIBA — Compras grupales y ofertas" },
      { name: "description", content: "Compras grupales y mayoristas con descuentos en tecnología, hogar, belleza y más." },
      { property: "og:title", content: "NEIBA — Compras grupales y ofertas" },
      { property: "og:description", content: "Compras grupales y mayoristas con descuentos exclusivos." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NEIBA",
          url: "/",
          description: "Marketplace de compras grupales y mayoristas.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "NEIBA",
          url: "/",
          potentialAction: {
            "@type": "SearchAction",
            target: "/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    similar: typeof s.similar === "string" ? s.similar : undefined,
  }),
  component: Home,
});

function Home() {
  const { gender, views } = useUserPrefs();
  const { similar: similarSlug } = Route.useSearch();
  const similarBase = similarSlug ? MOCK_PRODUCTS.find(p => p.slug === similarSlug) : undefined;
  const similarProducts = similarBase
    ? [
        ...MOCK_PRODUCTS.filter(p => p.slug !== similarBase.slug && p.category === similarBase.category),
        ...MOCK_PRODUCTS.filter(p => p.slug !== similarBase.slug && p.category !== similarBase.category),
      ].slice(0, 8)
    : [];
  const liveNow = useLiveViewers("home");
  const user = useUserAuth((s) => s.user);
  // Bias: orden de categorías priorizadas según género o vistas más altas
  const viewedTop = Object.entries(views).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  const biasOrder = viewedTop.length > 0
    ? [...new Set([...viewedTop, ...(gender ? GENDER_BIAS[gender] : [])])]
    : (gender ? GENDER_BIAS[gender] : []);
  const score = (cat: string) => {
    const idx = biasOrder.indexOf(cat);
    return idx === -1 ? 99 : idx;
  };
  const trendingFor = [...MOCK_PRODUCTS]
    .filter((p) => !!p.badge)
    .sort((a, b) => score(a.category) - score(b.category))
    .slice(0, 8);
  const forYou = [...MOCK_PRODUCTS]
    .sort((a, b) => score(a.category) - score(b.category))
    .slice(0, 10);

  // Scroll direction: ocultar categorías al bajar, mostrarlas al subir (con rebote)
  const [showCats, setShowCats] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) { setShowCats(true); lastY.current = y; return; }
      const dy = y - lastY.current;
      if (dy > 8) setShowCats(false);
      else if (dy < -8) setShowCats(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MobileShell>
      <OnboardingGender />
      {/* Top bar — buscador siempre fijo */}
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 px-4 pb-2 pt-2 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#ff7a3d,#e8451c)" }}>N</span>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-display text-sm leading-none text-neutral-900">NEIBA</p>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 text-[7px] font-semibold text-[#e8451c] leading-none">
                  Productos internacionales
                  <ShieldCheck className="h-2 w-2" />
                </span>
              </div>
              <p className="mt-0.5 text-[9px] text-neutral-400">Buenos Aires, AR · verificado</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button className="relative grid h-8 w-8 place-items-center rounded-full bg-orange-50">
              <Bell className="h-3.5 w-3.5 text-[#e8451c]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e8451c]" />
            </button>
          </div>
        </div>

        {!user && (
          <Link
            to="/auth"
            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#e8451c]"
          >
            Iniciar sesión <span className="text-neutral-300">/</span> Registrarse
          </Link>
        )}
        {user && (
          <Link to="/profile" className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-700">
            Hola, <span className="text-[#e8451c]">{user.nombre}</span>
          </Link>
        )}

        <div className="mt-2">
          <SmartSearch />
        </div>

        {/* Categorías — fijas debajo del buscador, se ocultan al bajar y vuelven con rebote al subir */}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: showCats ? 80 : 0,
            opacity: showCats ? 1 : 0,
            transform: showCats ? "translateY(0)" : "translateY(-6px)",
            transition: "max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease-out, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {CATEGORIES.filter((c) => c.id !== "gym").map((c) => {
              const s = CAT_STYLES[c.id] ?? CAT_STYLES.tech;
              return (
                <Link
                  key={c.id}
                  to="/search"
                  search={{ q: "", cat: c.id }}
                  className="relative flex h-12 flex-col items-center justify-center gap-0 overflow-hidden rounded-lg p-0.5 transition-transform active:scale-95"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <span className="text-[12px] leading-none">{c.emoji}</span>
                  <span className="text-[6px] font-bold leading-none text-center mt-px" style={{ color: s.text }}>{c.name}</span>
                  <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 rounded-full opacity-40 blur-sm" style={{ background: s.glow }} />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-3">
        {/* Productos similares al recién agregado */}
        {similarBase && similarProducts.length > 0 && (
          <section className="rounded-2xl border-2 border-[#e8451c]/30 bg-gradient-to-br from-orange-50 to-white p-3.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl text-lg" style={{ background: similarBase.gradient }}>
                {similarBase.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#e8451c]">✓ Agregado al carrito</p>
                <p className="line-clamp-1 font-display text-sm leading-tight">Te puede interesar también</p>
              </div>
              <Link to="/cart" className="rounded-full bg-[#e8451c] px-2.5 py-1 text-[10px] font-black text-white">Ir al carrito</Link>
            </div>
            <div className="-mx-3.5 mt-3 flex gap-2.5 overflow-x-auto px-3.5 pb-1 scrollbar-hide">
              {similarProducts.map((p) => (
                <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="w-[110px] shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-xl text-3xl grid place-items-center" style={{ background: p.gradient }}>
                    <span>{p.emoji}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] font-medium">{p.title}</p>
                  <p className="text-[10px] font-bold text-[#e8451c] leading-none">{formatARS(p.price.individual)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Live ticker */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/50">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-success">En vivo</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{formatViewers(liveNow)} personas mirando ahora</span>
          </div>
          <div className="relative h-7 overflow-hidden">
            <div className="absolute inset-0 flex animate-[shimmer_25s_linear_infinite] items-center gap-8 whitespace-nowrap px-4 text-[11px] text-foreground/80" style={{ animation: "none" }}>
              {LIVE_FEED.map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Combo: Oferta relámpago (izq) + Destacados (der) */}
        <section className="grid grid-cols-5 gap-3">
          <Link
            to="/ofertas"
            className="col-span-2 block"
          >
            <div
              className="relative h-full min-h-[210px] overflow-hidden rounded-2xl p-3.5"
              style={{
                background: "linear-gradient(150deg,#ff6a2c 0%,#e8451c 55%,#b81f1f 100%)",
                boxShadow: "0 14px 30px -12px rgba(232,69,28,0.55)",
              }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-yellow-300/20 blur-2xl" />
              <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur">
                <Zap className="h-2.5 w-2.5" /> Flash
              </span>
              <h2 className="mt-2 font-display text-lg leading-tight text-white">
                Oferta<br />relámpago
              </h2>
              <p className="mt-1 text-[10px] font-medium text-white/85">Termina en 02:14:38</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#e8451c]">
                Ver ahora <ChevronRight className="h-3 w-3" />
              </div>
              <div className="absolute right-2 bottom-2 text-5xl drop-shadow">⚡</div>
            </div>
          </Link>

          <div className="col-span-3 relative pl-3">
            <span className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <h3 className="font-display text-sm">Destacados</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {forYou.slice(0, 4).map((p) => (
                <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-xl text-3xl grid place-items-center" style={{ background: p.gradient }}>
                    <span>{p.emoji}</span>
                    {p.badge && <span className="absolute left-1 top-1 rounded bg-black/50 px-1 py-0.5 text-[8px] font-bold text-white backdrop-blur">{p.badge}</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] font-medium">{p.title}</p>
                  <p className="text-[10px] font-bold text-primary leading-none">{formatARS(p.price.individual)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>




        {/* Trending */}
        <section>
          <SectionHeader title="Tendencias ahora" icon={<TrendingUp className="h-4 w-4 text-neon" />} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {trendingFor.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Viral / TikTok style */}
        <section>
          <SectionHeader title="Viral en TikTok" icon={<Sparkles className="h-4 w-4 text-neon" />} />
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {VIRAL.map((p) => (
              <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="relative aspect-[9/14] w-[180px] shrink-0 overflow-hidden rounded-2xl" style={{ background: p.gradient }}>
                <div className="absolute inset-0 grid place-items-center text-7xl">{p.emoji}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur">{p.badge ?? "TRENDING"}</span>
                  <p className="mt-1.5 line-clamp-2 text-xs font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm font-black">{formatARS(p.price.group)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>




        {/* Recomendados */}
        <section>
          <SectionHeader title="Para vos" icon={<Sparkles className="h-4 w-4 text-primary" />} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {forYou.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Explorar todo — scroll infinito */}
        <InfiniteAll />

        {/* Importadores */}
        <Link to="/importadores" className="block rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Factory className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">Importadores verificados</p>
              <p className="text-[10px] text-muted-foreground">Catálogos mayoristas de fábricas chinas · stock AR y a pedido</p>
            </div>
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          </div>
        </Link>

        {/* Para emprendedores — discreto */}
        <Link to="/registrar-marca" className="block rounded-2xl border border-border bg-card p-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">Registrá tu marca con NEIBA</p>
              <p className="text-[10px] text-muted-foreground">Para emprendedores · protegé tu logo y nombre</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>

        <Link to="/admin-login" className="block rounded-2xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
          🛠 Acceder al panel admin
        </Link>
      </main>
    </MobileShell>
  );
}

function SectionHeader({ title, link, icon }: { title: string; link?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      {link && <Link to={link} className="text-xs text-primary">Ver todo</Link>}
    </div>
  );
}

function ProductCard({ product: p }: { product: typeof MOCK_PRODUCTS[number] }) {
  const priceLabel = p.minOrder ? `${formatARS(p.price.wholesale)} c/u` : formatARS(p.price.individual);
  return (
    <Link to="/products/$slug" params={{ slug: p.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
        <span>{p.emoji}</span>
        <span className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[8px] font-black leading-none ${p.sellerKind === "neiba" ? "bg-[#e8451c] text-white" : "bg-emerald-600 text-white"}`}>
          {p.sellerKind === "neiba" ? "NEIBA" : "Importador"}
        </span>
        {p.customizable && (
          <span className="absolute right-2 top-2 rounded-md bg-fuchsia-600 px-1.5 py-0.5 text-[8px] font-black leading-none text-white">
            Personalizable
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-900">{p.title}</p>
      {p.sellerKind === "importer" && (
        <p className="text-[9px] text-neutral-500 line-clamp-1">por {p.sellerName}</p>
      )}
      <p className="text-sm font-black text-[#e8451c] leading-tight">{priceLabel}</p>
      <div className="mt-1">
        <ProductBadges product={p} variant="card" max={2} />
      </div>
    </Link>
  );
}

function InfiniteAll() {
  const PAGE = 12;
  const [count, setCount] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  // Lista repetida para simular catálogo infinito
  const all = MOCK_PRODUCTS;
  const items = Array.from({ length: count }).map((_, i) => all[i % all.length]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setCount((c) => c + PAGE);
      }
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section>
      <SectionHeader title="Explorar todo" icon={<Sparkles className="h-4 w-4 text-primary" />} />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} />)}
      </div>
      <div ref={sentinel} className="mt-4 grid place-items-center py-4 text-[10px] text-muted-foreground">
        Cargando más…
      </div>
    </section>
  );
}
