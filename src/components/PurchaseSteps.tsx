import { Check, Package, Users, Wand2, CreditCard, Truck } from "lucide-react";

type Mode = "individual" | "group" | "wholesale";

const STEPS: Record<Mode, { icon: React.ComponentType<{ className?: string }>; label: string }[]> = {
  group: [
    { icon: Package, label: "Elegís producto" },
    { icon: Plus, label: "Elegís cantidad" },
    { icon: Users, label: "Te sumás al grupo con otras personas" },
    { icon: Wand2, label: "Personalizás (opcional)" },
    { icon: CreditCard, label: "Pagás" },
    { icon: Truck, label: "Recibís tu envío" },
  ],
  individual: [
    { icon: Package, label: "Elegís producto" },
    { icon: Plus, label: "Elegís cantidad" },
    { icon: Wand2, label: "Personalizás (opcional)" },
    { icon: CreditCard, label: "Pagás" },
    { icon: Truck, label: "Recibís tu envío" },
  ],
  wholesale: [
    { icon: Package, label: "Elegís producto" },
    { icon: Plus, label: "Elegís cantidad" },
    { icon: Wand2, label: "Personalizás (opcional)" },
    { icon: CreditCard, label: "Pagás" },
    { icon: Truck, label: "Recibís tu envío" },
  ],
};

const TITLES: Record<Mode, string> = {
  group: "Cómo funciona la compra grupal",
  individual: "Cómo funciona tu compra",
  wholesale: "Cómo funciona el pedido mayorista",
};

export function PurchaseSteps({ mode }: { mode: Mode }) {
  const steps = STEPS[mode];
  return (
    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#e8451c]">
        <Check className="h-3 w-3" /> {TITLES[mode]}
      </p>
      <ol className="space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={i} className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8451c] font-display text-[11px] font-black text-white">
                {i + 1}
              </span>
              <Icon className="h-3.5 w-3.5 text-[#e8451c]" />
              <span className="text-xs font-semibold text-neutral-800">{s.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
