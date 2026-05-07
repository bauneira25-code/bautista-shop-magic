// Mock data for the NEIBA prototype (UI-only).

export type PurchaseMode = "individual" | "group" | "wholesale";

export interface MockProduct {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  category: string;
  price: { individual: number; group: number; wholesale: number };
  groupTarget: number;
  groupJoined: number;
  groupTimeLeft: string;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  customizable: boolean;
  badge?: string;
  colors?: string[];
  variants?: string[];
  gradient: string;
  description: string;
  liveActivity: { name: string; action: string; time: string }[];
}

const grad = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "p1",
    slug: "funda-iphone-15-pro",
    title: "Funda iPhone 15 Pro Magsafe",
    emoji: "📱",
    category: "tech",
    price: { individual: 14000, group: 11000, wholesale: 8000 },
    groupTarget: 10,
    groupJoined: 7,
    groupTimeLeft: "01:29:45",
    rating: 4.9,
    reviews: 2412,
    sold: 8230,
    stock: 12,
    customizable: true,
    badge: "🔥 Viral",
    colors: ["#000000", "#7c3aed", "#ec4899", "#f59e0b"],
    variants: ["iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPhone 16"],
    gradient: grad("#7c3aed", "#ec4899"),
    description: "Funda magsafe ultra resistente con acabado mate premium. Personalizable.",
    liveActivity: [
      { name: "Lucas", action: "se unió al grupo", time: "hace 2 min" },
      { name: "Mica", action: "compró 1 unidad", time: "hace 4 min" },
      { name: "Tomás", action: "se unió al grupo", time: "hace 7 min" },
    ],
  },
  {
    id: "p2",
    slug: "auriculares-pro-anc",
    title: "Auriculares Pro ANC",
    emoji: "🎧",
    category: "audio",
    price: { individual: 45000, group: 36000, wholesale: 28000 },
    groupTarget: 15,
    groupJoined: 11,
    groupTimeLeft: "03:12:08",
    rating: 4.8,
    reviews: 1820,
    sold: 4500,
    stock: 28,
    customizable: false,
    badge: "Trending",
    colors: ["#000000", "#ffffff", "#7c3aed"],
    gradient: grad("#1e1b4b", "#7c3aed"),
    description: "Cancelación activa de ruido, 40h de batería, sonido Hi-Fi.",
    liveActivity: [
      { name: "Sofi", action: "se unió al grupo", time: "hace 1 min" },
      { name: "Juan", action: "compró 1 unidad", time: "hace 6 min" },
    ],
  },
  {
    id: "p3",
    slug: "smartwatch-x9",
    title: "Smartwatch X9 AMOLED",
    emoji: "⌚",
    category: "tech",
    price: { individual: 38000, group: 30000, wholesale: 22000 },
    groupTarget: 20,
    groupJoined: 14,
    groupTimeLeft: "00:45:22",
    rating: 4.7,
    reviews: 980,
    sold: 3200,
    stock: 5,
    customizable: false,
    badge: "Stock bajo",
    colors: ["#000000", "#c0c0c0", "#ec4899"],
    gradient: grad("#312e81", "#a78bfa"),
    description: "Pantalla AMOLED 2.1\", llamadas, GPS, oxígeno en sangre.",
    liveActivity: [
      { name: "Naza", action: "se unió al grupo", time: "ahora" },
    ],
  },
  {
    id: "p4",
    slug: "freidora-aire-6l",
    title: "Freidora de aire 6L",
    emoji: "🍳",
    category: "hogar",
    price: { individual: 65000, group: 52000, wholesale: 38000 },
    groupTarget: 12,
    groupJoined: 4,
    groupTimeLeft: "12:00:00",
    rating: 4.9,
    reviews: 3210,
    sold: 5400,
    stock: 22,
    customizable: false,
    badge: "Best seller",
    colors: ["#000000"],
    gradient: grad("#3b0764", "#7c3aed"),
    description: "6 litros, panel digital, 8 programas, sin aceite.",
    liveActivity: [
      { name: "Ailen", action: "compró 1 unidad", time: "hace 12 min" },
    ],
  },
  {
    id: "p5",
    slug: "mascara-led-7-colores",
    title: "Máscara LED 7 colores",
    emoji: "💆",
    category: "belleza",
    price: { individual: 75000, group: 58000, wholesale: 42000 },
    groupTarget: 10,
    groupJoined: 9,
    groupTimeLeft: "00:18:40",
    rating: 4.6,
    reviews: 740,
    sold: 1800,
    stock: 8,
    customizable: false,
    badge: "Casi completo",
    gradient: grad("#9d174d", "#7c3aed"),
    description: "Terapia lumínica facial profesional, 7 colores, anti-edad.",
    liveActivity: [
      { name: "Rocio", action: "se unió al grupo", time: "hace 30 seg" },
      { name: "Carla", action: "se unió al grupo", time: "hace 2 min" },
    ],
  },
  {
    id: "p6",
    slug: "mancuernas-ajustables-24kg",
    title: "Mancuernas ajustables 24kg",
    emoji: "🏋️",
    category: "gym",
    price: { individual: 95000, group: 78000, wholesale: 60000 },
    groupTarget: 8,
    groupJoined: 3,
    groupTimeLeft: "08:30:00",
    rating: 4.8,
    reviews: 420,
    sold: 980,
    stock: 14,
    customizable: false,
    gradient: grad("#1e293b", "#7c3aed"),
    description: "Par de mancuernas ajustables 5-24kg cada una.",
    liveActivity: [
      { name: "Bruno", action: "compró 1 unidad", time: "hace 20 min" },
    ],
  },
  {
    id: "p7",
    slug: "collar-acero-minimalista",
    title: "Collar acero minimalista",
    emoji: "💍",
    category: "joyeria",
    price: { individual: 12000, group: 9500, wholesale: 6500 },
    groupTarget: 25,
    groupJoined: 18,
    groupTimeLeft: "05:45:10",
    rating: 4.9,
    reviews: 1240,
    sold: 4100,
    stock: 60,
    customizable: true,
    badge: "Personalizable",
    colors: ["#c0c0c0", "#ffd700", "#000000"],
    gradient: grad("#0c0a09", "#a78bfa"),
    description: "Acero quirúrgico, hipoalergénico, grabado láser disponible.",
    liveActivity: [
      { name: "Vale", action: "se unió al grupo", time: "hace 1 min" },
    ],
  },
  {
    id: "p8",
    slug: "lampara-puesta-sol",
    title: "Lámpara puesta de sol",
    emoji: "🌅",
    category: "hogar",
    price: { individual: 18000, group: 14000, wholesale: 9500 },
    groupTarget: 15,
    groupJoined: 12,
    groupTimeLeft: "02:10:00",
    rating: 4.8,
    reviews: 2100,
    sold: 6700,
    stock: 30,
    customizable: false,
    badge: "TikTok viral",
    gradient: grad("#ea580c", "#7c3aed"),
    description: "Proyector LED ambiente, 16 colores, control remoto.",
    liveActivity: [
      { name: "Flor", action: "se unió al grupo", time: "hace 5 min" },
    ],
  },
];

export const CATEGORIES = [
  { id: "tech", name: "Tecnología", emoji: "📱", count: 248 },
  { id: "audio", name: "Audio", emoji: "🎧", count: 86 },
  { id: "hogar", name: "Hogar", emoji: "🏠", count: 312 },
  { id: "belleza", name: "Belleza", emoji: "💄", count: 154 },
  { id: "gym", name: "Gym", emoji: "💪", count: 92 },
  { id: "joyeria", name: "Joyería", emoji: "💍", count: 78 },
  { id: "gamer", name: "Gamer", emoji: "🎮", count: 64 },
  { id: "smart", name: "Smart Home", emoji: "🤖", count: 48 },
];

export const FLASH_DEALS = MOCK_PRODUCTS.slice(0, 4);
export const TRENDING = MOCK_PRODUCTS.slice(2, 8);
export const VIRAL = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4], MOCK_PRODUCTS[7]];

export const LIVE_FEED = [
  "🔥 Lucas se unió al grupo de Funda iPhone 15 Pro",
  "⚡ Mica compró Auriculares Pro ANC",
  "✨ Sofi personalizó un collar minimalista",
  "🎯 Tomás se unió al grupo de Smartwatch X9",
  "💜 Naza compró Lámpara puesta de sol",
];

export const AI_STYLES = [
  { id: "minimal", name: "Minimal", emoji: "⚪" },
  { id: "gamer", name: "Gamer", emoji: "🎮" },
  { id: "luxury", name: "Luxury", emoji: "💎" },
  { id: "vintage", name: "Vintage", emoji: "📷" },
  { id: "anime", name: "Anime", emoji: "🌸" },
  { id: "aesthetic", name: "Aesthetic", emoji: "🌙" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "modern", name: "Modern", emoji: "✨" },
];

export const MOCK_ORDERS = [
  {
    id: "NB-10248",
    product: MOCK_PRODUCTS[0],
    status: "shipping" as const,
    progress: 75,
    eta: "Llega mañana",
    mode: "group" as PurchaseMode,
    qty: 1,
  },
  {
    id: "NB-10247",
    product: MOCK_PRODUCTS[4],
    status: "customization" as const,
    progress: 35,
    eta: "Llega en 5 días",
    mode: "individual" as PurchaseMode,
    qty: 1,
  },
  {
    id: "NB-10240",
    product: MOCK_PRODUCTS[6],
    status: "delivered" as const,
    progress: 100,
    eta: "Entregado",
    mode: "group" as PurchaseMode,
    qty: 2,
  },
];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const findProduct = (slug: string) => MOCK_PRODUCTS.find((p) => p.slug === slug);

// Convertir stock numérico a etiqueta cualitativa (más premium)
export const stockLabel = (stock: number): { label: string; tone: "low" | "mid" | "ok" } => {
  if (stock <= 6) return { label: "Últimas unidades", tone: "low" };
  if (stock <= 15) return { label: "Alta demanda", tone: "mid" };
  return { label: "Disponible", tone: "ok" };
};

// Productos relacionados (misma categoría, distinto slug)
export const relatedProducts = (slug: string, limit = 4) => {
  const current = findProduct(slug);
  if (!current) return [];
  const same = MOCK_PRODUCTS.filter((p) => p.slug !== slug && p.category === current.category);
  const fill = MOCK_PRODUCTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...same, ...fill].slice(0, limit);
};

// Búsqueda fuzzy sencilla para sugerencias en vivo
export const searchProducts = (q: string, limit = 6) => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return MOCK_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query),
  ).slice(0, limit);
};
