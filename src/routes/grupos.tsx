import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Users, Clock, Eye, Flame, Sparkles, Type, Image as ImageIcon, Palette, ShoppingBag, Zap } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { useLocalCart } from "@/stores/localCart";
import { toast } from "sonner";

export const Route = createFileRoute("/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos en vivo — NEIBA" },
      { name: "description", content: "Sumate a un grupo y ahorrá hasta 45%." },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  const groups = MOCK_PRODUCTS.slice(0, 14);
  const add = useLocalCart((s) => s.add);
  const navigate = useNavigate();

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 px-5 pb-3 pt-4 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.85)" }}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">NEIBA · en vivo</p>
        <h1 className="font-display text-3xl">Grupos activos</h1>
        <p className="mt-1 text-xs text-muted-foreground">Sumate y ahorrá hasta 45% comprando con otros.</p>
      </header>

      <main className="px-4 pt-4 pb-8 space-y-4">
        {groups.map((p) => {
          const pct = Math.round((p.groupJoined / p.groupTarget) * 100);
          const missing = p.groupTarget - p.groupJoined;
          const almost = pct >= 70;

          const addToCart = () => {
            add({
              id: `${p.slug}-grp-${Date.now()}`,
              slug: p.slug,
              title: p.title,
              emoji: p.emoji,
              gradient: p.gradient,
              mode: "group",
              unitPrice: p.price.group,
              quantity: 1,
            });
            toast.success("Agregado al carrito 🛒", { description: p.title });
          };

          return (
            <div key={p.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {/* Imagen del producto */}
              <Link to="/group/$slug" params={{ slug: p.slug }} className="relative block aspect-[16/10] w-full" style={{ background: p.gradient }}>
                <div className="absolute inset-0 grid place-items-center text-7xl">{p.emoji}</div>
                {almost && (
                  <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase text-white animate-pulse shadow-lg">
                    Casi completo
                  </span>
                )}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  EN VIVO
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/80">Precio grupo</p>
                    <p className="font-display text-2xl font-black text-white drop-shadow-lg">{formatARS(p.price.group)}</p>
                  </div>
                  <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-black text-white">
                    -{Math.round((1 - p.price.group / p.price.individual) * 100)}%
                  </span>
                </div>
              </Link>

              {/* Info + progress */}
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-bold">{p.title}</p>

                <div className="mt-2">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-base font-black leading-none">
                      <span className="text-primary">{p.groupJoined}</span>
                      <span className="text-muted-foreground">/{p.groupTarget}</span>
                    </p>
                    <span className="text-[10px] font-bold text-rose-500">faltan {missing}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{180 + p.groupJoined * 27} mirando</span>
                    <span className="inline-flex items-center gap-1 text-rose-500"><Clock className="h-2.5 w-2.5" /> cierra {p.groupTimeLeft}</span>
                  </div>
                </div>

                {/* Formas de personalizar */}
                {p.customizable && (
                  <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-2.5">
                    <p className="mb-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <Sparkles className="h-3 w-3" /> Personalizá tu unidad
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip icon={<Type className="h-3 w-3" />}>Texto</Chip>
                      <Chip icon={<ImageIcon className="h-3 w-3" />}>Imagen</Chip>
                      <Chip icon={<Palette className="h-3 w-3" />}>Color</Chip>
                      <Chip icon={<Sparkles className="h-3 w-3" />}>Estilo IA</Chip>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={addToCart}
                    className="shrink-0 rounded-2xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-[11px] font-bold text-primary inline-flex items-center gap-1"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Carrito
                  </button>
                  <button
                    onClick={() => navigate({ to: "/group/$slug", params: { slug: p.slug } })}
                    className="flex-1 rounded-2xl py-2.5 font-display text-xs font-black tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] inline-flex items-center justify-center gap-1.5"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Zap className="h-3.5 w-3.5" /> SUMARME AHORA
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-2 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
          <Users className="mx-auto mb-1 h-4 w-4 text-primary" />
          ¿Querés armar tu propio grupo? Entrá a un producto y tocá "Comprar en grupo".
        </div>
      </main>
    </MobileShell>
  );
}

function Chip({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-2 py-1 text-[10px] font-semibold text-foreground">
      {icon} {children}
    </span>
  );
}

// Flame ref kept for tree-shake silence
void Flame;
