import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/a-pedido")({
  head: () => ({
    meta: [
      { title: "A pedido — NEIBA" },
      { name: "description", content: "Productos a pedido de importadores. Mínimo 100 u, entrega 20 a 40 días." },
    ],
  }),
  component: APedidoPage,
});

function APedidoPage() {
  const items = MOCK_PRODUCTS.filter(
    (p) => p.sellerKind === "importer" && p.stockLocation === "factory",
  );

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 border-b border-amber-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 leading-tight">A pedido</h1>
            <p className="text-[11px] text-neutral-500 leading-tight">Importadores · Mín. 100 u · 20 a 40 días</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <p className="mb-3 text-[11px] text-neutral-500">{items.length} productos disponibles a pedido</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </main>
    </MobileShell>
  );
}

function Card({ p }: { p: typeof MOCK_PRODUCTS[number] }) {
  return (
    <Link to="/products/$slug" params={{ slug: p.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl text-6xl grid place-items-center" style={{ background: p.gradient }}>
        <span>{p.emoji}</span>
        {p.customizable && (
          <span className="absolute right-2 top-2 rounded-md bg-fuchsia-600 px-1.5 py-0.5 text-[8px] font-black leading-none text-white">
            Personalizable
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-900">{p.title}</p>
      <p className="text-[9px] text-neutral-500 line-clamp-1">por {p.sellerName}</p>
      <p className="text-sm font-black text-[#e8451c] leading-tight">{formatARS(p.price.wholesale)} c/u</p>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-100 px-1.5 py-0.5 text-[8px] font-black leading-none text-emerald-700">
          Importador
        </span>
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[8px] font-black leading-none text-amber-700">
          A pedido
        </span>
      </div>
    </Link>
  );
}
