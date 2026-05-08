import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search as SearchIcon, X, Sparkles, Star } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState } from "react";
import { searchProducts, formatARS, stockLabel } from "@/lib/mockData";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q);

  // Solo en stock
  const all = searchProducts(query, 50).filter((p) => p.stock > 0);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate({ to: "/search", search: { q: query } });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-white pb-20 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 px-3 py-3 backdrop-blur-xl">
        <form onSubmit={submit} className="flex items-center gap-2">
          <button type="button" onClick={() => navigate({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-orange-50">
            <ArrowLeft className="h-4 w-4 text-[#e8451c]" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-orange-200 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#e8451c]/40">
            <SearchIcon className="h-4 w-4 text-[#e8451c]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: auriculares, funda iPhone..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="grid h-5 w-5 place-items-center rounded-full bg-neutral-100">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </form>
      </header>

      <div className="px-4 pt-4">
        {query.trim() === "" ? (
          <div className="grid place-items-center py-16 text-center text-neutral-400">
            <SearchIcon className="mb-2 h-8 w-8" />
            <p className="text-sm">Escribí qué estás buscando</p>
          </div>
        ) : all.length === 0 ? (
          <div className="grid place-items-center py-16 text-center">
            <Sparkles className="mb-2 h-8 w-8 text-[#e8451c]" />
            <p className="text-sm font-bold text-neutral-700">Sin stock para "{query}"</p>
            <p className="text-xs text-neutral-500">Probá con otra palabra.</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {all.length} resultado{all.length !== 1 ? "s" : ""} en stock para "<span className="text-[#e8451c]">{query}</span>"
            </p>
            <div className="grid grid-cols-2 gap-3">
              {all.map((p) => {
                const sl = stockLabel(p.stock);
                return (
                  <Link
                    key={p.id}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm active:scale-[0.98]"
                  >
                    <div className="relative grid aspect-square place-items-center text-5xl" style={{ background: p.gradient }}>
                      <span>{p.emoji}</span>
                      {p.badge && (
                        <span className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                          {p.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#e8451c]">
                        {sl.label}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        {p.rating} · stock {p.stock}
                      </div>
                      <p className="mt-1 font-display text-sm font-black text-[#e8451c]">{formatARS(p.price.group)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
