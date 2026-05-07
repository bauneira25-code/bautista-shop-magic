import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLocalCart } from "@/stores/localCart";
import { formatARS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const items = useLocalCart((s) => s.items);
  const setQty = useLocalCart((s) => s.setQty);
  const remove = useLocalCart((s) => s.remove);
  const clear = useLocalCart((s) => s.clear);
  const navigate = useNavigate();
  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const modeLabel = (m: string) =>
    m === "group" ? "Grupal" : m === "wholesale" ? "Mayorista" : "Individual";

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-32">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-4 py-4 backdrop-blur">
        <button onClick={() => navigate({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-lg">Mi carrito</h1>
        <button
          onClick={() => { clear(); toast.success("Carrito vaciado"); }}
          className="text-xs text-muted-foreground"
        >
          Vaciar
        </button>
      </header>

      {items.length === 0 ? (
        <div className="grid place-items-center px-6 pt-32 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary text-4xl">🛒</div>
          <p className="mt-4 font-display text-xl">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-muted-foreground">Descubrí productos virales y comprá en grupo para ahorrar.</p>
          <Link to="/" className="mt-6 rounded-2xl px-6 py-3 font-display text-sm text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}>
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {items.map((it) => (
            <div key={it.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <Link to="/products/$slug" params={{ slug: it.slug }} className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-3xl" style={{ background: it.gradient }}>
                {it.emoji}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-semibold">{it.title}</p>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{modeLabel(it.mode)}</span>
                  {it.variant && <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px]">{it.variant}</span>}
                  {it.color && <span className="grid h-4 w-4 rounded-full border border-border" style={{ background: it.color }} />}
                  {it.customization && (
                    <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">🔥 Personalizado</span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(it.id, it.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-secondary"><Minus className="h-3 w-3" /></button>
                    <span className="w-5 text-center text-sm font-bold">{it.quantity}</span>
                    <button onClick={() => setQty(it.id, it.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-secondary"><Plus className="h-3 w-3" /></button>
                  </div>
                  <p className="font-display text-base text-primary">{formatARS(it.unitPrice * it.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
          <div className="glass rounded-3xl p-3">
            <div className="flex items-center justify-between px-2 pb-2 text-xs">
              <span className="text-muted-foreground">{count} producto(s)</span>
              <span className="text-success">Envío gratis 🎉</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2">
                <p className="text-[10px] uppercase text-muted-foreground">Total</p>
                <p className="font-display text-xl text-primary">{formatARS(total)}</p>
              </div>
              <button
                onClick={() => toast.success("Yendo a pagar…", { description: "MercadoPago · Pago express" })}
                className="flex-1 rounded-2xl py-3.5 font-display text-sm tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-primary)" }}
              >
                <ShoppingBag className="mr-2 inline h-4 w-4" /> PAGAR AHORA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
