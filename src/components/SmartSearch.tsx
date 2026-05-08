import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, TrendingUp, X, ArrowRight } from "lucide-react";
import { searchProducts, formatARS } from "@/lib/mockData";

const TRENDING_QUERIES = ["iPhone 15", "Auriculares ANC", "Smartwatch", "Freidora aire", "Máscara LED"];

export function SmartSearch({ placeholder = "Buscar productos, marcas..." }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const results = searchProducts(q, 6).filter((p) => p.stock > 0);
  const goSearch = (term: string) => {
    setOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <form
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) goSearch(q.trim()); }}
        className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 transition focus-within:ring-2 focus-within:ring-primary/40"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q ? (
          <button type="button" onClick={() => setQ("")} className="grid h-5 w-5 place-items-center rounded-full bg-muted">
            <X className="h-3 w-3" />
          </button>
        ) : (
          <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">IA</span>
        )}
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl float-up">
          {q.length === 0 ? (
            <div className="p-3">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Búsquedas trending
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_QUERIES.map((t) => (
                  <button key={t} onClick={() => goSearch(t)} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] hover:bg-primary/20">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              <Sparkles className="mx-auto mb-1 h-4 w-4 text-primary" />
              Sin resultados. Probá con otra palabra.
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map((p) => (
                <Link
                  key={p.id}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-border/60 p-3 last:border-0 hover:bg-secondary/50"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl" style={{ background: p.gradient }}>{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-semibold">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{p.category}</p>
                  </div>
                  <p className="text-xs font-bold text-primary">{formatARS(p.price.group)}</p>
                </Link>
              ))}
              <button
                onClick={() => goSearch(q.trim())}
                className="flex w-full items-center justify-center gap-1 bg-primary/10 py-2.5 text-[11px] font-bold text-primary"
              >
                Ver todos los resultados <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
