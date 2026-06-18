import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, Sparkles, Radio, Store, Factory, Building2, Clock, Flame, ChevronRight, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { SmartSearch } from "@/components/SmartSearch";
import { OnboardingGender } from "@/components/OnboardingGender";
import { useUserPrefs, GENDER_BIAS } from "@/stores/userPrefs";
import { useUserAuth } from "@/stores/userAuth";
import { CATEGORIES, MOCK_PRODUCTS, FLASH_DEALS, VIRAL, formatARS, type MockProduct, type SellerKind } from "@/lib/mockData";
import { useLiveTotalViewers, formatViewers } from "@/lib/liveViewers";

import imgTech from "@/assets/cat-tech.jpg";
import imgElectronica from "@/assets/cat-electronica.jpg";
import imgHogar from "@/assets/cat-hogar.jpg";
import imgBelleza from "@/assets/cat-belleza.jpg";
import imgJoyeria from "@/assets/cat-joyeria.jpg";
import imgModa from "@/assets/cat-moda.jpg";

const ORANGE = "#F97316";

const CAT_IMAGES: Record<string, { img: string; label: string; tint: string }> = {
  tech:        { img: imgTech,        label: "Tecnología",  tint: "#dbeafe" },
  electronica: { img: imgElectronica, label: "Electrónica", tint: "#cffafe" },
  hogar:       { img: imgHogar,       label: "Hogar",       tint: "#fef3c7" },
  belleza:     { img: imgBelleza,     label: "Belleza",     tint: "#fce7f3" },
  joyeria:     { img: imgJoyeria,     label: "Joyería",     tint: "#1f2937" },
  moda:        { img: imgModa,        label: "Moda",        tint: "#fce7f3" },
};
const CAT_ORDER = ["tech", "electronica", "hogar", "belleza", "joyeria", "moda"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEIBA — Compras grupales y ofertas" },
      { name: "description", content: "Marketplace con tiendas, importadores y fabricantes verificados." },
      { property: "og:title", content: "NEIBA" },
      { property: "og:description", content: "Compras grupales y mayoristas con descuentos." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    similar: typeof s.similar === "string" ? s.similar : undefined,
  }),
  component: Home,
});

type KindFilter = "all" | SellerKind;

function Home() {
  const { gender, views } = useUserPrefs();
  const liveNow = useLiveTotalViewers();
  const user = useUserAuth((s) => s.user);
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");

  // Bias por género/views
  const viewedTop = Object.entries(views).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  const biasOrder = viewedTop.length > 0
    ? [...new Set([...viewedTop, ...(gender ? GENDER_BIAS[gender] : [])])]
    : (gender ? GENDER_BIAS[gender] : []);
  const score = (cat: string) => {
    const idx = biasOrder.indexOf(cat);
    return idx === -1 ? 99 : idx;
  };

  const matchKind = (p: MockProduct) => kindFilter === "all" || p.sellerKind === kindFilter;

  // Tendencias: 2 con badge viral
  const trending = MOCK_PRODUCTS
    .filter((p) => p.badge && (p.badge.toLowerCase().includes("viral") || p.badge.toLowerCase().includes("tiktok") || p.badge.toLowerCase().includes("trending")))
    .filter(matchKind)
    .slice(0, 2);

  const forYou = [...MOCK_PRODUCTS]
    .filter(matchKind)
    .sort((a, b) => score(a.category) - score(b.category))
    .slice(0, 10);


  return (
    <MobileShell>
      <OnboardingGender />

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/95 px-4 pb-2 pt-2 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-base font-black text-white shrink-0"
              style={{ background: `linear-gradient(135deg, #fb923c, ${ORANGE})`, boxShadow: "0 6px 14px -4px rgba(249,115,22,0.5)" }}
            >N</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-display text-[15px] font-black leading-none text-neutral-900">NEIBA</p>
                <ShieldCheck className="h-3 w-3 text-sky-500" />
              </div>
              <p className="mt-0.5 text-[10px] text-neutral-500 leading-none">Buenos Aires, AR · verificado</p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to="/en-vivo"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-black text-white"
              style={{ background: `linear-gradient(135deg, #fb923c, ${ORANGE})`, boxShadow: "0 4px 10px -3px rgba(249,115,22,0.55)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <Radio className="h-3 w-3" />
              <span className="tabular-nums">{formatViewers(liveNow)}</span>
              <span className="opacity-90">mirando</span>
            </Link>
            <button className="relative grid h-9 w-9 place-items-center rounded-full bg-neutral-100">
              <Bell className="h-4 w-4 text-neutral-700" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: ORANGE }} />
            </button>
          </div>
        </div>

        {!user && (
          <Link to="/auth" className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: ORANGE }}>
            Iniciar sesión <span className="text-neutral-300">/</span> Registrarse
          </Link>
        )}

        {/* SEARCH (incluye IA) */}
        <div className="mt-2">
          <SmartSearch />
        </div>
      </header>

      <main className="space-y-5 px-4 pt-4 pb-4">
        {/* CATEGORÍAS con fotos reales — chips chicos horizontales */}
        <section>
          <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
            {CAT_ORDER.map((id) => {
              const c = CAT_IMAGES[id];
              return (
                <Link
                  key={id}
                  to="/search"
                  search={{ q: "", cat: id }}
                  className="flex shrink-0 flex-col items-center gap-1 transition-transform active:scale-90"
                >
                  <div
                    className="h-14 w-14 overflow-hidden rounded-full border border-neutral-100"
                    style={{ background: c.tint, boxShadow: "0 4px 10px -4px rgba(0,0,0,0.12)" }}
                  >
                    <img src={c.img} alt={c.label} loading="lazy" width={120} height={120} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FILTROS por tipo de vendedor */}
        <section className="flex gap-2">
          <FilterChip active={kindFilter === "local"}    onClick={() => setKindFilter(kindFilter === "local" ? "all" : "local")}        icon={<Store className="h-3.5 w-3.5" />}     label="Tienda"      color="sky" />
          <FilterChip active={kindFilter === "importer"} onClick={() => setKindFilter(kindFilter === "importer" ? "all" : "importer")} icon={<Building2 className="h-3.5 w-3.5" />} label="Importador" color="emerald" />
          <FilterChip active={kindFilter === "fabricante"} onClick={() => setKindFilter(kindFilter === "fabricante" ? "all" : "fabricante")} icon={<Factory className="h-3.5 w-3.5" />} label="Fabricante" color="purple" />
        </section>

        {/* FLASH SALE — banner promo izquierda + productos con imagen grande, nombre y precio a la derecha */}
        <section
          className="overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #c026d3 55%, #f97316 100%)",
            boxShadow: "0 18px 36px -14px rgba(124,58,237,0.55)",
          }}
        >
          <div className="flex items-stretch gap-3 p-3">
            {/* LEFT — promo */}
            <div className="flex w-[34%] shrink-0 flex-col justify-between text-white">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur">
                  <Flame className="h-3 w-3" /> Flash sale
                </span>
                <h2 className="mt-2 font-display text-base font-black leading-tight">Oferta relámpago</h2>
                <p className="mt-1 text-[10px] leading-tight text-white/85">Hasta -40% por tiempo limitado</p>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 self-start rounded-md bg-black/40 px-2 py-1 text-[10px] font-black backdrop-blur">
                <Clock className="h-3 w-3" />
                <FlashTimer />
              </div>
            </div>

            {/* RIGHT — productos: imagen grande, nombre y precio */}
            <div className="-mr-3 flex gap-2.5 overflow-x-auto pr-3 scrollbar-hide">
              {FLASH_DEALS.map((p) => {
                const off = Math.round((1 - p.price.group / p.price.individual) * 100);
                return (
                  <Link
                    key={p.id}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="flex w-[130px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white"
                    style={{ boxShadow: "0 6px 14px -8px rgba(0,0,0,0.4)" }}
                  >
                    <div className="relative aspect-square grid place-items-center text-5xl" style={{ background: p.gradient }}>
                      <span>{p.emoji}</span>
                      {off > 0 && (
                        <span className="absolute left-1.5 top-1.5 rounded-md bg-black px-1.5 py-0.5 text-[9px] font-black text-white">
                          -{off}%
                        </span>
                      )}
                      {p.badge && (
                        <span className="absolute right-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-black text-neutral-900 backdrop-blur">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="line-clamp-1 text-[11px] font-bold text-neutral-900">{p.title}</p>
                      <div className="mt-0.5 flex items-baseline gap-1">
                        <p className="text-sm font-black tabular-nums" style={{ color: ORANGE }}>{formatARS(p.price.group)}</p>
                        <p className="text-[9px] text-neutral-400 line-through tabular-nums">{formatARS(p.price.individual)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>


        {/* TENDENCIAS — 2 productos con badge TikTok viral */}
        {trending.length > 0 && (
          <section>
            <div className="mb-2.5 flex items-center gap-1.5">
              <Flame className="h-4 w-4" style={{ color: ORANGE }} />
              <h3 className="font-display text-base font-black text-neutral-900">Tendencias</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trending.map((p) => (
                <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
                    <span>{p.emoji}</span>
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black px-1.5 py-0.5 text-[9px] font-black text-white">
                      🎵 TikTok viral
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs font-bold text-neutral-900">{p.title}</p>
                  <p className="text-sm font-black" style={{ color: ORANGE }}>{formatARS(p.price.individual)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* VIRAL EN TIKTOK — scroll horizontal cards fondo oscuro */}
        <section>
          <div className="mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-fuchsia-500" />
            <h3 className="font-display text-base font-black text-neutral-900">Viral en TikTok</h3>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {VIRAL.map((p) => (
              <Link
                key={p.id}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="relative aspect-[9/14] w-[170px] shrink-0 overflow-hidden rounded-2xl bg-neutral-900"
              >
                <div className="absolute inset-0 grid place-items-center text-7xl" style={{ background: p.gradient, opacity: 0.85 }}>
                  {p.emoji}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-black text-white backdrop-blur">
                  🎵 {p.badge ?? "Viral"}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="line-clamp-2 text-xs font-bold leading-tight">{p.title}</p>
                  <p className="mt-1 text-base font-black" style={{ color: "#fdba74" }}>{formatARS(p.price.group)}</p>
                  <p className="mt-0.5 text-[9px] text-white/70 line-clamp-1">por {p.sellerName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PARA VOS */}
        <section>
          <div className="mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" style={{ color: ORANGE }} />
            <h3 className="font-display text-base font-black text-neutral-900">Para vos</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {forYou.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <InfiniteAll kindFilter={kindFilter} />
      </main>
    </MobileShell>
  );
}

function FilterChip({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: "sky" | "emerald" | "purple" }) {
  const palettes = {
    sky:      { activeBg: "#0ea5e9", activeText: "#fff", idleBg: "#e0f2fe", idleText: "#075985", border: "#bae6fd" },
    emerald:  { activeBg: "#10b981", activeText: "#fff", idleBg: "#d1fae5", idleText: "#065f46", border: "#a7f3d0" },
    purple:   { activeBg: "#8b5cf6", activeText: "#fff", idleBg: "#ede9fe", idleText: "#5b21b6", border: "#ddd6fe" },
  }[color];
  return (
    <button
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-black transition-colors"
      style={{
        background: active ? palettes.activeBg : palettes.idleBg,
        color: active ? palettes.activeText : palettes.idleText,
        border: `1px solid ${active ? palettes.activeBg : palettes.border}`,
      }}
    >
      {icon}{label}
    </button>
  );
}


function ProductCard({ product: p }: { product: MockProduct }) {
  const priceLabel = p.minOrder ? `${formatARS(p.price.wholesale)} c/u` : formatARS(p.price.individual);
  const kindLabel =
    p.sellerKind === "local" ? "Tienda"
    : p.sellerKind === "fabricante" ? "Fabricante"
    : p.sellerKind === "importer" ? "Importador"
    : "NEIBA";
  const kindCls =
    p.sellerKind === "local" ? "bg-sky-100 text-sky-700 border border-sky-200"
    : p.sellerKind === "fabricante" ? "bg-purple-100 text-purple-700 border border-purple-200"
    : p.sellerKind === "importer" ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
    : "bg-orange-100 text-orange-700 border border-orange-200";
  const isAPedido = p.stockLocation === "factory";
  const stockText = isAPedido ? "A pedido" : "Stock";
  const stockCls = isAPedido
    ? "bg-amber-100 text-amber-700 border border-amber-200"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200";

  return (
    <Link to="/products/$slug" params={{ slug: p.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
        <span>{p.emoji}</span>
        {p.customizable && (
          <span className="absolute right-2 top-2 rounded-md bg-fuchsia-600 px-1.5 py-0.5 text-[9px] font-black leading-none text-white">
            Personalizable
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-1 text-xs font-bold text-neutral-900">{p.title}</p>
      <p className="text-[10px] text-neutral-500 line-clamp-1">por {p.sellerName}</p>
      <p className="text-sm font-black leading-tight" style={{ color: ORANGE }}>{priceLabel}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-black leading-none ${kindCls}`}>{kindLabel}</span>
        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-black leading-none ${stockCls}`}>{stockText}</span>
      </div>
    </Link>
  );
}

function InfiniteAll({ kindFilter }: { kindFilter: KindFilter }) {
  const PAGE = 12;
  const [count, setCount] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  const base = kindFilter === "all" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.sellerKind === kindFilter);
  const items = Array.from({ length: count }).map((_, i) => base[i % base.length]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setCount((c) => c + PAGE);
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section>
      <div className="mb-2.5 flex items-center gap-1.5">
        <Sparkles className="h-4 w-4" style={{ color: ORANGE }} />
        <h3 className="font-display text-base font-black text-neutral-900">Explorar todo</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} />)}
      </div>
      <div ref={sentinel} className="mt-4 grid place-items-center py-4 text-[10px] text-neutral-400">
        Cargando más…
      </div>
    </section>
  );
}
