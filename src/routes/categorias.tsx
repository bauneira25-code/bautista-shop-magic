import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { CATEGORIES, MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/categorias")({
  component: Categorias,
});

function Categorias() {
  return (
    <MobileShell>
      <header className="sticky top-0 z-30 px-5 pb-3 pt-4 backdrop-blur-xl" style={{ background: "oklch(0.13 0.02 295 / 0.85)" }}>
        <h1 className="font-display text-2xl">Categorías</h1>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Buscar en categorías..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </header>

      <main className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/categorias" className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card p-4">
              <div className="absolute -bottom-4 -right-4 text-7xl opacity-90">{c.emoji}</div>
              <p className="font-display text-base">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.count} productos</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-8 font-display text-lg">Todos los productos</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 pb-8">
          {MOCK_PRODUCTS.map((p) => (
            <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }}>
              <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
                <span>{p.emoji}</span>
                {p.customizable && <span className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">CUSTOM</span>}
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
              <p className="text-sm font-bold text-primary">{formatARS(p.price.group)}</p>
              <p className="text-[10px] text-muted-foreground line-through">{formatARS(p.price.individual)}</p>
            </Link>
          ))}
        </div>
      </main>
    </MobileShell>
  );
}
