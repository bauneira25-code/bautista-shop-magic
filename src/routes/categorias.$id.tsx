import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Search, Flame, Users, Sparkles, Eye } from "lucide-react";
import { CATEGORY_THEMES } from "@/lib/categoryThemes";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { SUBCATEGORIES } from "@/lib/subcategories";
import { useUserPrefs } from "@/stores/userPrefs";
import { useLiveViewers, formatViewers } from "@/lib/liveViewers";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryAmbient } from "@/components/CategoryAmbient";

export const Route = createFileRoute("/categorias/$id")({
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-2xl font-display">Categoría no encontrada</p>
        <Link to="/" className="mt-3 inline-block text-primary">← Volver al inicio</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-background text-foreground p-6">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function CategoryPage() {
  const { id } = Route.useParams();
  const theme = CATEGORY_THEMES[id];
  const trackView = useUserPrefs((s) => s.trackView);
  useEffect(() => { if (theme) trackView(id); }, [id, theme, trackView]);
  if (!theme) throw notFound();
  const TXT = theme.isLight ? "#1a0f08" : "#ffffff";
  const TXT_MUTED = theme.isLight ? "rgba(26,15,8,0.65)" : "rgba(255,255,255,0.65)";

  // Solo productos de esta categoría
  const allCat = useMemo(() => MOCK_PRODUCTS.filter((p) => p.category === id), [id]);
  const subs = SUBCATEGORIES[id] ?? [];
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const all = useMemo(() => {
    if (!activeSub) return allCat;
    const sub = subs.find((s) => s.id === activeSub);
    if (!sub) return allCat;
    const filtered = allCat.filter((p) => sub.match(p.title));
    return filtered.length ? filtered : allCat;
  }, [allCat, activeSub, subs]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden pb-28" style={{ background: theme.bg }}>
      {/* Immersive ambient decorations specific to the category world */}
      <CategoryAmbient theme={theme} />
      <div className="relative z-10">
      <CategoryHero theme={theme} />

      {/* Live viewers chip */}
      <LiveViewersChip theme={theme} TXT={TXT} />


      {/* Search bar matching theme */}
      <div className="px-5 pt-5">
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: theme.isLight ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.45)", border: `1px solid ${theme.accent}33` }}
        >
          <Search className="h-4 w-4" style={{ color: theme.accent }} />
          <input
            placeholder={`Buscar en ${theme.name}...`}
            className={`flex-1 bg-transparent text-sm outline-none ${theme.font}`}
            style={{ color: TXT }}
          />
        </div>
      </div>

      {/* Themed badges row */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-5 scrollbar-hide">
        {theme.badges.map((b) => (
          <span
            key={b}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${theme.font}`}
            style={{ background: `${theme.accent}22`, color: theme.accent, border: `1px solid ${theme.accent}55` }}
          >
            {b}
          </span>
        ))}
      </div>

      {/* Subcategorías filtrables */}
      {subs.length > 0 && (
        <div className="mt-4 px-5">
          <p className={`mb-2 text-[10px] uppercase tracking-[0.3em] ${theme.font}`} style={{ color: theme.accent }}>
            ▸ Subcategorías
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveSub(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${theme.font}`}
              style={{
                background: activeSub === null ? theme.accent : `${theme.accent}15`,
                color: activeSub === null ? "#fff" : theme.accent,
                border: `1px solid ${theme.accent}55`,
              }}
            >
              Todo
            </button>
            {subs.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSub(s.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${theme.font}`}
                style={{
                  background: activeSub === s.id ? theme.accent : `${theme.accent}15`,
                  color: activeSub === s.id ? "#fff" : theme.accent,
                  border: `1px solid ${theme.accent}55`,
                }}
              >
                <span className="mr-1">{s.emoji}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live ticker — feels alive */}
      <div className="mt-5 overflow-hidden border-y py-2" style={{ borderColor: `${theme.accent}33`, background: theme.isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.3)" }}>
        <div className="ticker flex whitespace-nowrap gap-8 text-xs" style={{ color: TXT_MUTED }}>
          {[...Array(2)].flatMap((_, k) =>
            all.map((p, i) => (
              <span key={`${k}-${i}`} className={`flex items-center gap-2 ${theme.font}`}>
                <Flame className="h-3 w-3" style={{ color: theme.accent }} />
                {p.title} · {p.sold.toLocaleString("es-AR")} vendidos
              </span>
            ))
          )}
        </div>
      </div>

      {/* Featured drop card */}
      <section className="px-5 pt-6">
        <p className={`text-[10px] uppercase tracking-[0.3em] ${theme.font}`} style={{ color: theme.accent }}>
          ★ Drop destacado
        </p>
        <FeaturedCard theme={theme} product={all[0]} />
      </section>

      {/* Group buying section */}
      <section className="px-5 pt-7">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg ${theme.font === "font-mono" ? "font-orbitron" : theme.font}`} style={{ color: TXT }}>
            <Users className="mr-2 inline h-4 w-4" style={{ color: theme.accent }} />
            Grupos activos
          </h2>
          <span className="text-[10px]" style={{ color: TXT_MUTED }}>{all.length} en vivo</span>
        </div>
        <div className="mt-3 space-y-3">
          {all.slice(0, 3).map((p) => (
            <GroupRow key={p.id} theme={theme} product={p} />
          ))}
        </div>
      </section>

      {/* Product grid in theme */}
      <section className="px-5 pt-7">
        <h2 className={`text-lg ${theme.font === "font-mono" ? "font-orbitron" : theme.font}`} style={{ color: TXT }}>
          Todo en {theme.name}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {all.map((p) => (
            <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group">
              <div
                className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center transition-transform group-active:scale-95"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.accent}44`,
                  boxShadow: theme.isLight ? `0 8px 24px -10px ${theme.accent}55` : "none",
                }}
              >
                <span>{p.emoji}</span>
                {!p.customizable && (
                  <span
                    className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${theme.font}`}
                    style={{ background: theme.accent, color: "#fff" }}
                  >
                    {"−" + Math.round((1 - p.price.group / p.price.individual) * 100) + "%"}
                  </span>
                )}
                {p.customizable && (
                  <span className="absolute left-2 top-2 rounded-md bg-[#e8451c] px-1.5 py-0.5 text-[9px] font-black text-white">
                    Personalizable 🔥
                  </span>
                )}
                {p.customizable && (
                  <Sparkles className="absolute right-2 top-2 h-4 w-4" style={{ color: theme.accent }} />
                )}
              </div>
              <p className={`mt-2 line-clamp-1 text-xs font-medium ${theme.font === "font-mono" ? "font-mono" : ""}`} style={{ color: TXT }}>
                {p.title}
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className={`text-sm font-bold ${theme.font}`} style={{ color: theme.accent }}>{formatARS(p.price.group)}</p>
                <p className="text-[9px] line-through" style={{ color: TXT_MUTED }}>{formatARS(p.price.individual)}</p>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="rounded-md px-1.5 py-0.5 text-[8px] font-bold" style={{ background: `${theme.accent}22`, color: theme.accent }}>Precio en grupo</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      </div>
      {/* Bottom CTA */}
      <div className="fixed bottom-3 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 px-5">
        <Link
          to="/"
          className={`flex items-center justify-center rounded-2xl py-4 text-sm font-bold shadow-2xl ${theme.font}`}
          style={{ background: theme.accent, color: "#ffffff", boxShadow: `0 20px 60px -10px ${theme.accent}88` }}
        >
          {theme.cta}
        </Link>
      </div>
    </div>
  );
}

function FeaturedCard({ theme, product }: { theme: typeof CATEGORY_THEMES[string]; product: typeof MOCK_PRODUCTS[number] }) {
  const TXT = theme.isLight ? "#1a0f08" : "#ffffff";
  const TXT_MUTED = theme.isLight ? "rgba(26,15,8,0.6)" : "rgba(255,255,255,0.6)";
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="mt-3 block overflow-hidden rounded-3xl border"
      style={{
        background: theme.isLight ? "#ffffff" : theme.surface,
        borderColor: `${theme.accent}55`,
        boxShadow: `0 25px 60px -25px ${theme.accent}99`,
      }}
    >
      <div className="relative grid aspect-[16/10] place-items-center text-7xl" style={{ background: `linear-gradient(135deg, ${theme.accent}33, ${theme.accent2}22)` }}>
        <div className="absolute inset-0 opacity-50 pat-shine" style={{ ["--pat-color" as never]: `${theme.accent}33` }} />
        <span className="relative">{product.emoji}</span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${theme.font}`}
          style={{ background: theme.accent, color: "#fff" }}
        >
          {product.badge ?? "TOP"}
        </span>
      </div>
      <div className="p-4">
        <p className={`text-base ${theme.font === "font-mono" ? "font-mono" : "font-display"}`} style={{ color: TXT }}>{product.title}</p>
        <p className="mt-1 text-xs line-clamp-2" style={{ color: TXT_MUTED }}>{product.description}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className={`text-2xl font-bold ${theme.font}`} style={{ color: theme.accent }}>
              {formatARS(product.price.group)}
            </p>
            <p className="text-[10px] line-through" style={{ color: TXT_MUTED }}>{formatARS(product.price.individual)}</p>
          </div>
          <span
            className="rounded-full px-3 py-1.5 text-[10px] font-bold"
            style={{ background: theme.accent2, color: "white" }}
          >
            {product.groupJoined}/{product.groupTarget} en grupo
          </span>
        </div>
      </div>
    </Link>
  );
}

function GroupRow({ theme, product }: { theme: typeof CATEGORY_THEMES[string]; product: typeof MOCK_PRODUCTS[number] }) {
  const pct = Math.round((product.groupJoined / product.groupTarget) * 100);
  const TXT = theme.isLight ? "#1a0f08" : "#ffffff";
  return (
    <Link
      to="/group/$slug"
      params={{ slug: product.slug }}
      className="flex items-center gap-3 rounded-2xl p-3"
      style={{ background: theme.isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.04)", border: `1px solid ${theme.accent}33` }}
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-3xl" style={{ background: theme.surface }}>
        {product.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm" style={{ color: TXT }}>{product.title}</p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: theme.isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})` }} />
        </div>
        <div className={`mt-1 flex justify-between text-[10px] ${theme.font}`} style={{ color: theme.accent }}>
          <span>{product.groupJoined}/{product.groupTarget} unidos</span>
          <span>⏱ {product.groupTimeLeft}</span>
        </div>
      </div>
    </Link>
  );
}

function LiveViewersChip({ theme, TXT }: { theme: typeof CATEGORY_THEMES[string]; TXT: string }) {
  const n = useLiveViewers(`cat:${theme.id}`);
  return (
    <div className="px-5 pt-3">
      <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur" style={{ borderColor: `${theme.accent}55`, background: theme.isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)" }}>
        <Eye className="h-3 w-3" style={{ color: theme.accent }} />
        <span className="text-[11px] font-bold tabular-nums" style={{ color: TXT }}>{formatViewers(n)} viendo {theme.name.toLowerCase()} ahora</span>
      </div>
    </div>
  );
}
