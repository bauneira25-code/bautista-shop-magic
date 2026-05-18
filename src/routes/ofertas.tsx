import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Zap, Clock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Oferta relámpago — NEIBA" },
      { name: "description", content: "Ofertas relámpago con descuentos exclusivos por tiempo limitado." },
    ],
  }),
  component: OfertasPage,
});

function OfertasPage() {
  // Elegidos por la app: top 10 con mejor descuento
  const picks = [...MOCK_PRODUCTS]
    .map((p) => ({ ...p, _disc: 1 - p.price.group / p.price.individual }))
    .sort((a, b) => b._disc - a._disc)
    .slice(0, 10);

  return (
    <MobileShell>
      <main className="space-y-4 px-5 pb-10 pt-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-card">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-xl leading-none inline-flex items-center gap-1.5">
              <Zap className="h-5 w-5 text-[#e8451c]" /> Oferta relámpago
            </h1>
            <p className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> Termina en 02:14:38
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {picks.map((p) => {
            const pct = Math.round(p._disc * 100);
            return (
              <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: p.gradient }}>
                  <span>{p.emoji}</span>
                  <span className="absolute left-2 top-2 rounded-md bg-[#e8451c] px-1.5 py-0.5 text-[10px] font-black text-white">-{pct}%</span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-primary">{formatARS(p.price.group)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">{formatARS(p.price.individual)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </MobileShell>
  );
}
