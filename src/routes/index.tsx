import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, Flame, Zap, Users, Clock, TrendingUp, Sparkles, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { SmartSearch } from "@/components/SmartSearch";
import { OnboardingGender } from "@/components/OnboardingGender";
import { useUserPrefs, GENDER_BIAS } from "@/stores/userPrefs";
import { CATEGORIES, FLASH_DEALS, MOCK_PRODUCTS, VIRAL, LIVE_FEED, formatARS, stockLabel } from "@/lib/mockData";
import { useLiveViewers, formatViewers } from "@/lib/liveViewers";

const CAT_STYLES: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  tech:        { bg: "linear-gradient(135deg,#0a1530,#1e3a8a)", border: "#38bdf8", glow: "#38bdf8", text: "#e0f2fe" },
  electronica: { bg: "linear-gradient(135deg,#f1f5f9,#e0f2fe)", border: "#0ea5e9", glow: "#7dd3fc", text: "#0c4a6e" },
  hogar:       { bg: "linear-gradient(135deg,#e8d4b4,#c9a079)", border: "#a06c49", glow: "#a06c49", text: "#3d2616" },
  gym:         { bg: "linear-gradient(135deg,#14210d,#1a2e10)", border: "#a3e635", glow: "#a3e635", text: "#ecfccb" },
  belleza:     { bg: "linear-gradient(135deg,#ffe0ee,#ffd0e6)", border: "#ec4899", glow: "#f472b6", text: "#831843" },
  joyeria:     { bg: "linear-gradient(135deg,#1a1410,#2a1f15)", border: "#d4af37", glow: "#d4af37", text: "#fef3c7" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEIBA — Marketplace futurista" },
      { name: "description", content: "Tecnología, hogar, belleza y más con compras grupales y personalización IA." },
    ],
  }),
  component: Home,
});

function Home() {
  const { gender, views } = useUserPrefs();
  const liveNow = useLiveViewers("home");
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
      <header className="sticky top-0 z-30 px-5 pb-2 pt-4 backdrop-blur-xl" style={{ background: "oklch(0.13 0.02 295 / 0.9)" }}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-base font-black text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>N</span>
            <div>
              <p className="font-display text-lg leading-none">NEIBA</p>
              <p className="text-[10px] text-muted-foreground">Buenos Aires, AR</p>
            </div>
          </Link>
          <button className="relative grid h-10 w-10 place-items-center rounded-full bg-card">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary pulse-ring" />
          </button>
        </div>

        <div className="mt-3">
          <SmartSearch />
        </div>

        {/* Categorías — fijas debajo del buscador, se ocultan al bajar y vuelven con rebote al subir */}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: showCats ? 96 : 0,
            opacity: showCats ? 1 : 0,
            transform: showCats ? "translateY(0)" : "translateY(-6px)",
            transition: "max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease-out, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="grid grid-cols-6 gap-1.5 pt-2">
            {CATEGORIES.map((c) => {
              const s = CAT_STYLES[c.id] ?? CAT_STYLES.tech;
              return (
                <Link
                  key={c.id}
                  to="/categorias/$id"
                  params={{ id: c.id }}
                  className="relative flex h-14 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg p-0.5 transition-transform active:scale-95"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <span className="text-sm leading-none">{c.emoji}</span>
                  <span className="text-[7px] font-bold leading-none text-center" style={{ color: s.text }}>{c.name}</span>
                  <span className="pointer-events-none absolute -right-2 -bottom-2 h-5 w-5 rounded-full opacity-50 blur-md" style={{ background: s.glow }} />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-3">
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

        {/* Combo: Hero grupal grande (izq) + productos destacados (der) */}
        <section className="grid grid-cols-5 gap-3">
          <Link to="/grupos" className="col-span-2 block">
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl p-3.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                <Flame className="h-2.5 w-2.5" /> Drop grupal
              </span>
              <h2 className="mt-2 font-display text-lg leading-tight text-white">Comprá en grupo y ahorrá hasta 45%</h2>
              <p className="mt-1 text-[10px] text-white/80">Sumate antes de que cierre</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-primary">
                Ver grupos <ChevronRight className="h-3 w-3" />
              </div>
              <div className="absolute right-2 bottom-2 text-5xl">👥</div>
            </div>
          </Link>

          {/* Divisor naranja */}
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
                  <p className="text-[10px] font-bold text-primary leading-none">{formatARS(p.price.group)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Flash deals */}
        <section>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <h3 className="font-display text-lg">Oferta relámpago</h3>
              </div>
              <p className="text-[11px] text-muted-foreground">Termina en 02:14:38</p>
            </div>
            <Link to="/grupos" className="text-xs text-primary">Ver todo</Link>
          </div>
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {FLASH_DEALS.map((p) => (
              <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="w-[160px] shrink-0">
                <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: p.gradient }}>
                  <span>{p.emoji}</span>
                  <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">-{Math.round((1 - p.price.group / p.price.individual) * 100)}%</span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-primary">{formatARS(p.price.group)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">{formatARS(p.price.individual)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Group deals (live) */}
        <section>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg">Compras grupales en vivo</h3>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> 3 activos
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {MOCK_PRODUCTS.slice(0, 3).map((p) => {
              const pct = (p.groupJoined / p.groupTarget) * 100;
              const missing = p.groupTarget - p.groupJoined;
              const almost = pct >= 70;
              return (
                <Link key={p.id} to="/group/$slug" params={{ slug: p.slug }} className="block">
                  <div className="relative flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3">
                    {almost && <span className="absolute right-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black uppercase text-white animate-pulse">Casi completo</span>}
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-3xl" style={{ background: p.gradient }}>{p.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
                      <div className="mt-0.5 flex items-baseline gap-1.5">
                        <span className="text-base font-black text-primary">{formatARS(p.price.group)}</span>
                        <span className="text-[10px] text-muted-foreground line-through">{formatARS(p.price.individual)}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-baseline justify-between">
                          <p className="font-display text-lg font-black leading-none">
                            <span className="text-primary">{p.groupJoined}</span><span className="text-muted-foreground">/{p.groupTarget}</span>
                          </p>
                          <span className="text-[10px] font-bold text-rose-400">faltan {missing}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#a855f7,#ec4899)" }} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{(180 + p.groupJoined * 27)} mirando</span>
                          <span className="inline-flex items-center gap-1 text-rose-400"><Clock className="h-2.5 w-2.5" />cierra {p.groupTimeLeft}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Se está agotando */}
        <section>
          <SectionHeader title="🚨 Se está vendiendo rápido" icon={<Flame className="h-4 w-4 text-rose-400" />} />
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {MOCK_PRODUCTS.slice(2, 7).map((p) => {
              const sl = stockLabel(p.stock);
              const tone = sl.tone === "low" ? "bg-rose-500" : sl.tone === "mid" ? "bg-amber-500" : "bg-emerald-500";
              return (
                <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="w-[150px] shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: p.gradient }}>
                    <span>{p.emoji}</span>
                    <span className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-black text-white ${tone}`}>{sl.label}</span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">Desde {formatARS(p.price.group)}</p>
                </Link>
              );
            })}
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

        {/* Personalizables */}
        <section>
          <SectionHeader title="🎨 Personalizalo a tu manera" />
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {MOCK_PRODUCTS.filter(p => p.customizable).map((p) => (
              <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="w-[150px] shrink-0">
                <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: p.gradient }}>
                  <span>{p.emoji}</span>
                  <span className="absolute left-2 top-2 rounded-md bg-pink-500 px-1.5 py-0.5 text-[9px] font-black text-white">Personalizable</span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">Desde {formatARS(p.price.group)}</p>
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

        <Link to="/admin" className="block rounded-2xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
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
  return (
    <Link to="/products/$slug" params={{ slug: p.slug }} className="group">
      <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
        <span>{p.emoji}</span>
        {p.badge && <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">{p.badge}</span>}
        {p.customizable && <span className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">Personalizable</span>}
      </div>
      <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{formatARS(p.price.individual)}</span>
        <span className="text-[10px] text-muted-foreground">⭐ {p.rating}</span>
      </div>
      <p className="text-[10px] text-success">Grupo desde {formatARS(p.price.group)}</p>
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
