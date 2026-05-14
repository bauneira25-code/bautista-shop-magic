import { Sparkles, Package } from "lucide-react";

export function PersonalizedBadge({ on }: { on: boolean }) {
  if (on) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/40 px-2 py-0.5 text-[10px] font-bold text-orange-300">
        <Sparkles className="h-3 w-3" /> PERSONALIZADO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
      <Package className="h-3 w-3" /> ESTÁNDAR
    </span>
  );
}
