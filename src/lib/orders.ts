import { supabase } from "@/integrations/supabase/client";
import { generateSVG, type DesignSpec } from "@/lib/generateSVG";

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

export interface CustomizationRow {
  id: string;
  order_id: string;
  text: string;
  color: string;
  font: string;
  size: number;
  rotation_deg: number;
  pos_x: number;
  pos_y: number;
  svg_url: string | null;
  created_at: string;
}

const FALLBACK_META = { label: "EN PROCESO", color: "bg-neutral-300/40 text-neutral-600", dot: "bg-neutral-500" };

const _STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  pago_confirmado:           { label: "PAGADO",          color: "bg-emerald-500/15 text-emerald-700",  dot: "bg-emerald-500" },
  enviando_maquina:          { label: "ENVIANDO",        color: "bg-blue-500/15 text-blue-700",        dot: "bg-blue-500" },
  imprimiendo:               { label: "IMPRIMIENDO",     color: "bg-yellow-500/20 text-yellow-700",    dot: "bg-yellow-500" },
  en_produccion:             { label: "PRODUCCIÓN",      color: "bg-yellow-500/20 text-yellow-700",    dot: "bg-yellow-500" },
  impreso:                   { label: "IMPRESO",         color: "bg-neutral-300/40 text-neutral-600",  dot: "bg-neutral-500" },
  personalizado_terminado:   { label: "TERMINADO",       color: "bg-orange-500/20 text-orange-700",    dot: "bg-orange-500" },
  control_calidad:           { label: "CONTROL CALIDAD", color: "bg-cyan-500/20 text-cyan-700",        dot: "bg-cyan-500" },
  listo_empaquetar:          { label: "LISTO PACK",      color: "bg-violet-400/20 text-violet-700",    dot: "bg-violet-400" },
  diseno_aprobado:           { label: "APROBADO",        color: "bg-cyan-500/20 text-cyan-700",        dot: "bg-cyan-500" },
  cola_produccion:           { label: "EN COLA",         color: "bg-amber-500/20 text-amber-700",      dot: "bg-amber-500" },
  empaquetado:               { label: "EMPAQUETADO",     color: "bg-violet-500/15 text-violet-700",    dot: "bg-violet-500" },
  enviado:                   { label: "ENVIADO",         color: "bg-sky-500/15 text-sky-700",          dot: "bg-sky-500" },
  entregado:                 { label: "ENTREGADO",       color: "bg-emerald-300/30 text-emerald-700",  dot: "bg-emerald-400" },
};

export const STATUS_META = new Proxy(_STATUS_META, {
  get(target, prop: string) { return target[prop] ?? FALLBACK_META; },
}) as Record<string, { label: string; color: string; dot: string }>;


export async function createOrderWithDesign(args: {
  customer_name: string;
  customer_phone?: string;
  product_slug: string;
  product_title: string;
  product_emoji?: string;
  product_gradient?: string;
  unit_price: number;
  cost?: number;
  quantity?: number;
  design: DesignSpec;
}) {
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      customer_name: args.customer_name,
      customer_phone: args.customer_phone ?? null,
      product_slug: args.product_slug,
      product_title: args.product_title,
      product_emoji: args.product_emoji ?? null,
      product_gradient: args.product_gradient ?? null,
      unit_price: args.unit_price,
      cost: args.cost ?? Math.round(args.unit_price * 0.4),
      quantity: args.quantity ?? 1,
      status: "pago_confirmado",
    })
    .select()
    .single();
  if (oErr) throw oErr;

  const { error: cErr } = await supabase.from("customizations").insert({
    order_id: order.id,
    text: args.design.text,
    color: args.design.color,
    font: args.design.font,
    size: args.design.size,
    rotation_deg: args.design.rotationDeg,
    pos_x: args.design.posX,
    pos_y: args.design.posY,
  });
  if (cErr) throw cErr;

  return order as OrderRow;
}

// Transición atómica con guardia: solo cambia el estado si el actual coincide.
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

export async function uploadDesignSVG(orderId: string, design: DesignSpec): Promise<string> {
  const svg = generateSVG(design);
  const path = `${orderId}/${Date.now()}.svg`;
  const { error } = await supabase.storage
    .from("production-files")
    .upload(path, new Blob([svg], { type: "image/svg+xml" }), {
      contentType: "image/svg+xml",
      upsert: true,
    });
  if (error) throw error;
  const { data } = supabase.storage.from("production-files").getPublicUrl(path);
  // Guardar svg_url en la customization más reciente
  const { data: cust } = await supabase
    .from("customizations")
    .select("id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (cust?.id) {
    await supabase.from("customizations").update({ svg_url: data.publicUrl }).eq("id", cust.id);
  }
  return data.publicUrl;
}

export function ageMinutes(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}
