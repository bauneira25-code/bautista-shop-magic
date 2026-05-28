import { ShieldCheck, Truck, Clock, Package, Sparkles, Factory } from "lucide-react";
import type { MockProduct } from "@/lib/mockData";

type Variant = "card" | "detail";

export function ProductBadges({ product, variant = "card", max, deliveryOverride, hideCustomizable, hideImportStatus }: { product: MockProduct; variant?: Variant; max?: number; deliveryOverride?: string; hideCustomizable?: boolean; hideImportStatus?: boolean }) {
  const items: { key: string; label: string; cls: string; icon?: React.ReactNode }[] = [];

  // Vendedor
  if (product.sellerKind === "neiba") {
    items.push({
      key: "neiba",
      label: "NEIBA",
      cls: "bg-[#e8451c] text-white",
    });
  } else {
    items.push({
      key: "imp",
      label: product.sellerVerified ? "Importador verificado" : "Importador",
      cls: product.sellerVerified ? "bg-emerald-600 text-white" : "bg-neutral-600 text-white",
      icon: product.sellerVerified ? <ShieldCheck className="h-2.5 w-2.5" /> : undefined,
    });
  }

  // Stock / entrega
  if (product.stockLocation === "ar") {
    items.push({
      key: "stock-ar",
      label: "Stock en Argentina",
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: <Package className="h-2.5 w-2.5" />,
    });
  } else if (product.stockLocation === "factory") {
    items.push({
      key: "a-pedido",
      label: "A pedido",
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: <Factory className="h-2.5 w-2.5" />,
    });
  }

  if (deliveryOverride) {
    items.push({
      key: "entrega-dyn",
      label: `Entrega: ${deliveryOverride}`,
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: <Clock className="h-2.5 w-2.5" />,
    });
  } else if (product.deliveryLabel === "24/48 hs") {
    items.push({
      key: "entrega-rapida",
      label: "Entrega 24/48 hs",
      cls: "bg-sky-50 text-sky-700 border border-sky-200",
      icon: <Truck className="h-2.5 w-2.5" />,
    });
  } else {
    items.push({
      key: "entrega-30",
      label: `Entrega: ${product.deliveryLabel}`,
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: <Clock className="h-2.5 w-2.5" />,
    });
  }

  if (product.minOrder) {
    items.push({
      key: "min",
      label: `Mín. ${product.minOrder} u`,
      cls: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    });
  }

  if (product.customizable && !hideCustomizable) {
    const feeLabel = product.customizationFee
      ? `Personalizable +$${product.customizationFee.toLocaleString("es-AR")}`
      : "Personalizable";
    items.push({
      key: "perso",
      label: feeLabel,
      cls: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
      icon: <Sparkles className="h-2.5 w-2.5" />,
    });
  }

  if (variant === "detail" && product.importStatus && !hideImportStatus) {
    items.push({
      key: "import-status",
      label: product.importStatus,
      cls: "bg-blue-50 text-blue-700 border border-blue-200",
    });
  }

  const show = typeof max === "number" ? items.slice(0, max) : items;
  const size = variant === "card" ? "text-[8px] px-1.5 py-0.5" : "text-[10px] px-2 py-1";

  return (
    <div className="flex flex-wrap gap-1">
      {show.map((b) => (
        <span key={b.key} className={`inline-flex items-center gap-0.5 rounded-md font-bold leading-none ${size} ${b.cls}`}>
          {b.icon}
          {b.label}
        </span>
      ))}
    </div>
  );
}

export function ctaForProduct(p: MockProduct): { primary: string; secondary?: string } {
  if (p.customizable) return { primary: "Personalizar" };
  if (p.sellerKind === "importer" && p.stockLocation === "factory") {
    return { primary: "Comprar lote", secondary: "Cotización" };
  }
  return { primary: "Comprar" };
}
