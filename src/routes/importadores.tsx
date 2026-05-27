import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Star, Package, Plus } from "lucide-react";
import { IMPORTERS, MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/importadores")({
  head: () => ({
    meta: [
      { title: "Importadores verificados — NEIBA" },
      { name: "description", content: "Catálogos de importadores argentinos verificados: tecnología, hogar, moda, belleza y más." },
    ],
  }),
  component: ImportadoresPage,
});

function ImportadoresPage() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-white pb-24">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-orange-50">
          <ArrowLeft className="h-4 w-4 text-[#e8451c]" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base leading-none">Importadores</p>
          <p className="text-[10px] text-neutral-500">{IMPORTERS.length} importadores · catálogos de fábricas chinas</p>
        </div>
        <Link to="/importador-panel" className="rounded-full bg-[#e8451c] px-3 py-1.5 text-[10px] font-black text-white">
          <Plus className="inline h-3 w-3" /> Soy importador
        </Link>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <p className="font-display text-sm text-emerald-900">¿Sos importador?</p>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800">
            Subí tu catálogo, definí mínimos, marcá si hay stock en Argentina o a pedido, y recibí pedidos y cotizaciones.
          </p>
          <Link to="/importador-panel" className="mt-3 inline-block rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-black text-white">
            Crear cuenta de importador
          </Link>
        </div>
      </section>

      <section className="px-4 pt-5">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2">Importadores activos</p>
        <div className="space-y-3">
          {IMPORTERS.map((imp) => {
            const products = MOCK_PRODUCTS.filter(
              (p) => p.sellerKind === "importer" && p.sellerName === imp.name
            ).slice(0, 4);
            return (
              <div key={imp.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-2xl">{imp.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-display text-sm leading-none">{imp.name}</p>
                      {imp.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                    </div>
                    <p className="mt-0.5 text-[10px] text-neutral-500">{imp.specialty} · {imp.city}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-600">
                      <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {imp.rating}</span>
                      <span className="inline-flex items-center gap-0.5"><Package className="h-2.5 w-2.5" /> {imp.productsCount} productos</span>
                    </div>
                  </div>
                  <button className="rounded-full border border-[#e8451c] px-2.5 py-1 text-[10px] font-bold text-[#e8451c]">
                    Ver catálogo
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
                        <p className="text-[9px] font-black text-[#e8451c]">{formatARS(p.price.wholesale)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
