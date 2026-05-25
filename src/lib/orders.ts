import { supabase } from "@/integrations/supabase/client";

export type OrderStatus =
  | "pago_confirmado"
  | "enviando_maquina"
  | "imprimiendo"
  | "impreso"
  | "empaquetado"
  | "enviado"
  | "entregado";

export interface OrderRow {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  product_slug: string;
  product_title: string;
  product_emoji: string | null;
  product_gradient: string | null;
  unit_price: number;
  cost: number;
  quantity: number;
  status: OrderStatus;
  progress: number;
  printed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const FALLBACK_META = { label: "EN PROCESO", color: "bg-neutral-300/40 text-neutral-600", dot: "bg-neutral-500" };

const _STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  pago_confirmado:           { label: "PAGADO",          color: "bg-emerald-500/15 text-emerald-700",  dot: "bg-emerald-500" },
  enviando_maquina:          { label: "ENVIANDO",        color: "bg-blue-500/15 text-blue-700",        dot: "bg-blue-500" },
  imprimiendo:               { label: "EN PROCESO",      color: "bg-yellow-500/20 text-yellow-700",    dot: "bg-yellow-500" },
  en_produccion:             { label: "EN PROCESO",      color: "bg-yellow-500/20 text-yellow-700",    dot: "bg-yellow-500" },
  impreso:                   { label: "LISTO",           color: "bg-neutral-300/40 text-neutral-600",  dot: "bg-neutral-500" },
  control_calidad:           { label: "CONTROL CALIDAD", color: "bg-cyan-500/20 text-cyan-700",        dot: "bg-cyan-500" },
  listo_empaquetar:          { label: "LISTO PACK",      color: "bg-violet-400/20 text-violet-700",    dot: "bg-violet-400" },
  cola_produccion:           { label: "EN COLA",         color: "bg-amber-500/20 text-amber-700",      dot: "bg-amber-500" },
  empaquetado:               { label: "EMPAQUETADO",     color: "bg-violet-500/15 text-violet-700",    dot: "bg-violet-500" },
  enviado:                   { label: "ENVIADO",         color: "bg-sky-500/15 text-sky-700",          dot: "bg-sky-500" },
  entregado:                 { label: "ENTREGADO",       color: "bg-emerald-300/30 text-emerald-700",  dot: "bg-emerald-400" },
};

export const STATUS_META = new Proxy(_STATUS_META, {
  get(target, prop: string) { return target[prop] ?? FALLBACK_META; },
}) as Record<string, { label: string; color: string; dot: string }>;

export async function transitionStatus(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
  extra: Partial<Pick<OrderRow, "progress" | "tracking_code">> = {},
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: to, ...extra })
    .eq("id", orderId)
    .eq("status", from)
    .select()
    .single();
  if (error) throw error;
  return data as OrderRow | null;
}

export function ageMinutes(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}
