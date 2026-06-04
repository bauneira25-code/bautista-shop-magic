import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Stock disponible — NEIBA" },
      { name: "description", content: "Productos con stock en Argentina, envío en 24/48 hs." },
    ],
  }),
  component: StockPage,
});

function StockPage() {
  const items = MOCK_PRODUCTS.filter(
    (p) => p.stockLocation === "ar" && !p.minOrder,
  );

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 leading-tight">Stock disponible</h1>
            <p className="text-[11px] text-neutral-500 leading-tight">Envío 24/48 hs desde Argentina</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <p className="mb-3 text-[11px] text-neutral-500">{items.length} productos con stock listo para enviar</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </main>
    </MobileShell>
  );
}

function Card({ p }: { p: typeof MOCK_PRODUCTS[number] }) {
  const kindLabel =
    p.sellerKind === "neiba" ? "NEIBA"
    : p.sellerKind === "local" ? "Tienda"
    : p.sellerKind === "fabricante" ? "Fabricante"
    : "Importador";
  const kindCls =
    p.sellerKind === "neiba" ? "bg-[#e8451c] text-white"
    : p.sellerKind === "local" ? "bg-sky-100 text-sky-700 border border-sky-200"
    : p.sellerKind === "fabricante" ? "bg-purple-100 text-purple-700 border border-purple-200"
    : "bg-emerald-100 text-emerald-700 border border-emerald-200";
  return (
    <Link to="/products/$slug" params={{ slug: p.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
        <span>{p.emoji}</span>
      </div>
      <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-900">{p.title}</p>
      {p.sellerKind !== "neiba" && (
        <p className="text-[9px] text-neutral-500 line-clamp-1">por {p.sellerName}</p>
      )}
      <p className="text-sm font-black text-[#e8451c] leading-tight">{formatARS(p.price.individual)}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[8px] font-black leading-none ${kindCls}`}>
          {kindLabel}
        </span>
        <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black leading-none text-emerald-700">
          Stock
        </span>
      </div>
    </Link>
  );
}
