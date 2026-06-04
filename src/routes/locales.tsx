import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Star, Package } from "lucide-react";
import { LOCALS, MOCK_PRODUCTS, CATEGORIES, localsByCategory, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/locales")({
  head: () => ({
    meta: [
      { title: "Tiendas argentinas — NEIBA" },
      { name: "description", content: "Tiendas argentinas por categoría: hogar, tech, belleza, joyería, moda y más." },
      { property: "og:title", content: "Tiendas argentinas — NEIBA" },
      { property: "og:description", content: "Comprá a tiendas locales verificadas con stock en Argentina." },
    ],
  }),
  component: LocalesPage,
});

function LocalesPage() {
  const [cat, setCat] = useState<string>("hogar");
  const locsInCat = localsByCategory(cat);
  const cats = CATEGORIES.filter((c) => localsByCategory(c.id).length > 0);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-white pb-24">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-sky-100 bg-white/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-sky-50">
          <ArrowLeft className="h-4 w-4 text-sky-700" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base leading-none">Tiendas argentinas</p>
          <p className="text-[10px] text-neutral-500">{LOCALS.length} tiendas · stock en Argentina · envío 24/48 hs</p>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <p className="font-display text-sm text-sky-900">Comprá a tiendas argentinas</p>
          </div>
          <p className="mt-1 text-[11px] text-sky-800">
            Cada tienda elige su categoría y publica sus propios productos. Stock en Argentina con envío rápido.
          </p>
        </div>
      </section>

      {/* Tabs categoría */}
      <section className="px-4 pt-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2">Elegí una categoría</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
          {cats.map((c) => {
            const active = c.id === cat;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                  active ? "border-sky-600 bg-sky-600 text-white" : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                <span className="mr-1">{c.emoji}</span>{c.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tiendas de la categoría */}
      <section className="px-4 pt-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2">
          {locsInCat.length} tiendas en {CATEGORIES.find((c) => c.id === cat)?.name}
        </p>
        <div className="space-y-3">
          {locsInCat.map((loc) => {
            const products = MOCK_PRODUCTS.filter(
              (p) => p.sellerKind === "local" && p.sellerName === loc.name,
            ).slice(0, 6);
            return (
              <div key={loc.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-2xl">{loc.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-display text-sm leading-none">{loc.name}</p>
                      {loc.verified && <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />}
                    </div>
                    <p className="mt-0.5 text-[10px] text-neutral-500">{loc.tagline} · {loc.city}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-600">
                      <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {loc.rating}</span>
                      <span className="inline-flex items-center gap-0.5"><Package className="h-2.5 w-2.5" /> {products.length} productos</span>
                    </div>
                  </div>
                  <button className="rounded-full border border-sky-600 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                    Ver tienda
                  </button>
                </div>
                {products.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto px-3 pb-3 scrollbar-hide">
                    {products.map((p) => (
                      <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="w-[88px] shrink-0">
                        <div className="aspect-square overflow-hidden rounded-xl text-3xl grid place-items-center" style={{ background: p.gradient }}>
                          {p.emoji}
                        </div>
                        <p className="mt-1 line-clamp-1 text-[9px] font-medium">{p.title}</p>
                        <p className="text-[9px] font-black text-sky-700">{formatARS(p.price.individual)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {locsInCat.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
              Todavía no hay locales en esta categoría.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
