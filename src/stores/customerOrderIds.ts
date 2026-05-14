// Guarda los ids de pedidos creados desde este dispositivo para que el cliente
// pueda ver su seguimiento en /orders en tiempo real desde Supabase.
const KEY = "neiba.customer.order_ids";

export function getCustomerOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function pushCustomerOrderId(id: string) {
  if (typeof window === "undefined") return;
  const cur = getCustomerOrderIds();
  if (cur.includes(id)) return;
  localStorage.setItem(KEY, JSON.stringify([id, ...cur].slice(0, 50)));
}
