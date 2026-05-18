import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { MOCK_PRODUCTS, formatARS } from "@/lib/mockData";
import { useUserPrefs } from "@/stores/userPrefs";

export const Route = createFileRoute("/personalizables")({
  head: () => ({
    meta: [
      { title: "Personalizá tu producto — NEIBA" },
      { name: "description", content: "Diseñá con IA productos personalizables. Joyería, tecnología, belleza, hogar y más." },
    ],
  }),
  component: PersonalizablesPage,
});

const ORDER_MUJER = ["belleza", "hogar", "joyeria", "electronica", "tech"];
const ORDER_HOMBRE = ["tech", "electronica", "gym", "joyeria", "hogar", "belleza"];

function PersonalizablesPage() {
  const gender = useUserPrefs((s) => s.gender);
  const order = gender === "hombre" ? ORDER_HOMBRE : ORDER_MUJER;

  const customs = MOCK_PRODUCTS.filter((p) => p.customizable);
  const sorted = [...customs].sort((a, b) => {
    const ai = order.indexOf(a.category);
    const bi = order.indexOf(b.category);
    const A = ai === -1 ? 999 : ai;
    const B = bi === -1 ? 999 : bi;
    return A - B;
  });

  return (
    <MobileShell>
      <main className="space-y-4 px-5 pb-10 pt-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-card">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-xl leading-none">Personalizá tu producto</h1>
            <p className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> Diseñá con IA y recibilo a medida
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sorted.map((p) => (
            <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl text-5xl grid place-items-center" style={{ background: p.gradient }}>
                <span>{p.emoji}</span>
                <span className="absolute left-2 top-2 rounded-md bg-[#e8451c] px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                  Personalizable
                </span>
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-medium">{p.title}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{p.category}</p>
              <p className="text-[11px] font-bold text-primary">{formatARS(p.price.individual)}</p>
            </Link>
          ))}
        </div>
      </main>
    </MobileShell>
  );
}
