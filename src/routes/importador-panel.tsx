import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Package, MessageSquare, Upload, Plus, Edit3, Eye, Camera, Video } from "lucide-react";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";

export const Route = createFileRoute("/importador-panel")({
  head: () => ({
    meta: [
      { title: "Panel del importador — NEIBA" },
      { name: "description", content: "Subí productos, definí precios, mínimos, stock y recibí pedidos y cotizaciones." },
    ],
  }),
  component: ImporterPanel,
});

type Tab = "productos" | "pedidos" | "cotizaciones" | "nuevo";

function ImporterPanel() {
  const [tab, setTab] = useState<Tab>("productos");
  const myProducts = MOCK_PRODUCTS.filter(
    (p) => p.sellerKind === "importer" && p.sellerName === "Asia Trade SA"
  ).slice(0, 8);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-neutral-50 pb-24">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/importadores" className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base leading-none">Panel del importador</p>
            <p className="text-[10px] text-neutral-500">Asia Trade SA · verificado</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto scrollbar-hide">
          {([
            { id: "productos", label: "Productos" },
            { id: "pedidos", label: "Pedidos" },
            { id: "cotizaciones", label: "Cotizaciones" },
            { id: "nuevo", label: "+ Nuevo" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                tab === t.id ? "bg-[#e8451c] text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-4">
        {tab === "productos" && <ProductosTab products={myProducts} />}
        {tab === "pedidos" && <PedidosTab />}
        {tab === "cotizaciones" && <CotizacionesTab />}
        {tab === "nuevo" && <NuevoProductoForm />}
      </main>
    </div>
  );
}

function ProductosTab({ products }: { products: typeof MOCK_PRODUCTS }) {
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label="Activos" value={products.length} />
        <Stat label="Pedidos" value={12} />
        <Stat label="Pend. cotizar" value={5} />
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white border border-neutral-200 p-2.5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: p.gradient }}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-xs font-bold">{p.title}</p>
              <p className="text-[10px] text-neutral-500">
                {formatARS(p.price.wholesale)} c/u · mín {p.minOrder ?? 1} · {p.stockLocation === "ar" ? "Stock AR" : "A pedido"}
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-400">{p.importStatus ?? "Disponible"}</p>
            </div>
            <button className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100"><Edit3 className="h-3.5 w-3.5" /></button>
            <button className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100"><Eye className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PedidosTab() {
  const pedidos = [
    { id: "PED-1042", cliente: "Tienda Norte", qty: 200, total: 2400000, estado: "Pago confirmado" },
    { id: "PED-1041", cliente: "Mayorista Sur", qty: 150, total: 1800000, estado: "En preparación" },
    { id: "PED-1039", cliente: "Local CABA", qty: 100, total: 1100000, estado: "Enviado" },
  ];
  return (
    <div className="space-y-2">
      {pedidos.map((p) => (
        <div key={p.id} className="rounded-2xl bg-white border border-neutral-200 p-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm">{p.id}</p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{p.estado}</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-600">{p.cliente} · {p.qty} unidades</p>
          <p className="mt-1 text-sm font-black text-[#e8451c]">{formatARS(p.total)}</p>
        </div>
      ))}
    </div>
  );
}

function CotizacionesTab() {
  const cotizaciones = [
    { id: "COT-552", cliente: "Importtex SRL", producto: "Smartwatch X9 Pro", qty: 500, msg: "¿Hacés descuento sobre 500u?" },
    { id: "COT-549", cliente: "Comercio AR",   producto: "Auriculares ANC",  qty: 300, msg: "Necesito entrega antes del 15." },
  ];
  return (
    <div className="space-y-2">
      {cotizaciones.map((c) => (
        <div key={c.id} className="rounded-2xl bg-white border border-neutral-200 p-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm">{c.id}</p>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pendiente</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-700">{c.producto} · {c.qty}u</p>
          <p className="text-[10px] text-neutral-500">{c.cliente}</p>
          <p className="mt-2 rounded-lg bg-neutral-50 p-2 text-[11px] text-neutral-700 italic">"{c.msg}"</p>
          <div className="mt-2 flex gap-2">
            <button className="flex-1 rounded-full bg-[#e8451c] py-2 text-[11px] font-black text-white">Responder</button>
            <button className="rounded-full border border-neutral-300 px-3 py-2 text-[11px] font-bold text-neutral-600">
              <MessageSquare className="inline h-3 w-3" /> Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function NuevoProductoForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
      <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-6 text-center">
        <div className="flex justify-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100"><Camera className="h-5 w-5 text-neutral-500" /></span>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100"><Video className="h-5 w-5 text-neutral-500" /></span>
        </div>
        <p className="mt-2 text-[11px] text-neutral-500">Subí fotos y videos del producto</p>
        <button type="button" className="mt-2 rounded-full bg-neutral-900 px-3 py-1.5 text-[10px] font-bold text-white">
          <Upload className="inline h-3 w-3" /> Subir
        </button>
      </div>

      <Field label="Nombre del producto" placeholder="Ej: Smartwatch X9 Pro" />
      <Field label="Categoría" placeholder="Tecnología, Hogar, Belleza…" />

      <div className="grid grid-cols-2 gap-2">
        <Field label="Precio por unidad" placeholder="$8.500" />
        <Select label="Tipo de precio" options={["Precio fijo", "A cotizar"]} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Cantidad mínima" placeholder="100" />
        <Field label="Días de llegada" placeholder="30" />
      </div>

      <Select label="Stock" options={["Stock en Argentina", "A pedido"]} />
      <Select label="Estado actual" options={["Stock en Argentina", "Entrega inmediata", "A pedido", "En fábrica", "En tránsito", "En aduana", "Nacionalizado"]} />

      <label className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-3">
        <input type="checkbox" className="h-4 w-4 accent-fuchsia-600" />
        <span className="text-xs font-semibold">Permite personalización</span>
      </label>

      <button type="submit" className="w-full rounded-2xl bg-[#e8451c] py-3 font-display text-sm font-black text-white">
        <Plus className="inline h-4 w-4" /> Publicar producto
      </button>
    </form>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e8451c]"
      />
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</span>
      <select className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e8451c]">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-2.5 text-center">
      <p className="font-display text-lg leading-none text-[#e8451c]">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-wider text-neutral-500">{label}</p>
    </div>
  );
}
