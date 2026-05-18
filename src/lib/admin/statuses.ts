// Catálogo único de estados del pedido (16 estados nuevos + 7 viejos como sinónimos)
export type FullOrderStatus =
  | "pedido_creado"
  | "pago_pendiente"
  | "pago_confirmado"
  | "picking"
  | "pendiente_personalizacion"
  | "en_personalizacion"
  | "diseno_aprobado"
  | "cola_produccion"
  | "enviando_maquina"
  | "imprimiendo"
  | "en_produccion"
  | "impreso"
  | "personalizado_terminado"
  | "control_calidad"
  | "listo_empaquetar"
  | "empaquetado"
  | "enviado"
  | "entregado"
  | "rehacer"
  | "cancelado"
  | "reembolsado";

export const STATUS_LABEL: Record<FullOrderStatus, string> = {
  pedido_creado: "Pedido recibido",
  pago_pendiente: "Pago pendiente",
  pago_confirmado: "Pedido recibido",
  picking: "Picking",
  pendiente_personalizacion: "Pend. personalización",
  en_personalizacion: "En personalización",
  diseno_aprobado: "Diseño aprobado",
  cola_produccion: "Cola producción",
  enviando_maquina: "Enviando a máquina",
  imprimiendo: "Imprimiendo",
  en_produccion: "En producción",
  impreso: "Impreso",
  personalizado_terminado: "Personaliz. terminado",
  control_calidad: "Control de calidad",
  listo_empaquetar: "Listo p/ empaquetar",
  empaquetado: "Empaquetado",
  enviado: "Enviado",
  entregado: "Entregado",
  rehacer: "Rehacer",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};

// hex-only colors used inside style props (theme-token compatible classes para los estados se mapean al vuelo)
export const STATUS_TONE: Record<FullOrderStatus, string> = {
  pedido_creado: "bg-neutral-200 text-neutral-700",
  pago_pendiente: "bg-amber-100 text-amber-800",
  pago_confirmado: "bg-emerald-100 text-emerald-800",
  picking: "bg-blue-100 text-blue-800",
  pendiente_personalizacion: "bg-orange-100 text-orange-800",
  en_personalizacion: "bg-orange-100 text-orange-800",
  diseno_aprobado: "bg-cyan-100 text-cyan-800",
  cola_produccion: "bg-blue-100 text-blue-800",
  enviando_maquina: "bg-blue-100 text-blue-800",
  imprimiendo: "bg-yellow-100 text-yellow-800",
  en_produccion: "bg-yellow-100 text-yellow-800",
  impreso: "bg-neutral-200 text-neutral-700",
  personalizado_terminado: "bg-violet-100 text-violet-800",
  control_calidad: "bg-fuchsia-100 text-fuchsia-800",
  listo_empaquetar: "bg-teal-100 text-teal-800",
  empaquetado: "bg-violet-100 text-violet-800",
  enviado: "bg-sky-100 text-sky-800",
  entregado: "bg-emerald-200 text-emerald-900",
  rehacer: "bg-red-100 text-red-800",
  cancelado: "bg-neutral-300 text-neutral-700",
  reembolsado: "bg-pink-100 text-pink-800",
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "Admin total",
  operations: "Operaciones",
  production: "Producción",
  support: "Atención cliente",
  finance: "Finanzas",
};
