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
  { id: "todo", name: "Todo", emoji: "✨", count: 980 },
  { id: "tech", name: "Tecnología", emoji: "📱", count: 248 },
  { id: "hogar", name: "Hogar", emoji: "🏠", count: 312 },
  { id: "gamer", name: "Gamer", emoji: "🎮", count: 64 },
  { id: "belleza", name: "Belleza", emoji: "💄", count: 154 },
  { id: "deporte", name: "Deporte", emoji: "🏃", count: 92 },
  { id: "auto", name: "Auto", emoji: "🚗", count: 76 },
  { id: "personalizados", name: "Personalizados", emoji: "🎨", count: 120 },
  { id: "tendencias", name: "Tendencias", emoji: "🔥", count: 48 },
];

// Extra mock products to populate new categories (auto, deporte, personalizados, gamer)
const extraProducts: MockProduct[] = [
  {
    id: "p9", slug: "soporte-celular-auto", title: "Soporte celular magnético auto",
    emoji: "🚗", category: "auto",
    price: { individual: 8500, group: 6500, wholesale: 4500 },
    groupTarget: 15, groupJoined: 8, groupTimeLeft: "04:30:00",
    rating: 4.8, reviews: 540, sold: 2100, stock: 24, customizable: false,
    badge: "Top auto", colors: ["#000000"],
    gradient: grad("#1a1a1a", "#ef4444"),
    description: "Imán potente, rotación 360°, instalación en 10 segundos.",
    liveActivity: [{ name: "Mati", action: "compró 1 unidad", time: "hace 8 min" }],
  },
  {
    id: "p10", slug: "luces-led-interior-auto", title: "Luces LED RGB interior auto",
    emoji: "💡", category: "auto",
    price: { individual: 12000, group: 9000, wholesale: 6000 },
    groupTarget: 20, groupJoined: 13, groupTimeLeft: "06:00:00",
    rating: 4.7, reviews: 820, sold: 3400, stock: 18, customizable: false,
    badge: "Viral TikTok",
    gradient: grad("#0a0a0a", "#7c3aed"),
    description: "Tira LED RGB con app, sincroniza con música. 4 piezas.",
    liveActivity: [{ name: "Joaco", action: "se unió al grupo", time: "hace 3 min" }],
  },
  {
    id: "p11", slug: "botella-deportiva-1l", title: "Botella deportiva 1L motivacional",
    emoji: "💧", category: "deporte",
    price: { individual: 9500, group: 7000, wholesale: 4800 },
    groupTarget: 20, groupJoined: 15, groupTimeLeft: "02:00:00",
    rating: 4.9, reviews: 1240, sold: 5600, stock: 32, customizable: true,
    badge: "Personalizable", colors: ["#000000", "#a3e635", "#fb923c"],
    gradient: grad("#0a1f0a", "#a3e635"),
    description: "1L con marcas horarias, libre de BPA. Personalizá tu nombre.",
    liveActivity: [{ name: "Cami", action: "personalizó la suya", time: "hace 1 min" }],
  },
  {
    id: "p12", slug: "bandas-elasticas-set", title: "Set 5 bandas elásticas",
    emoji: "💪", category: "deporte",
    price: { individual: 11000, group: 8500, wholesale: 5500 },
    groupTarget: 12, groupJoined: 4, groupTimeLeft: "10:00:00",
    rating: 4.7, reviews: 680, sold: 1900, stock: 22, customizable: false,
    gradient: grad("#0a1f0a", "#fb923c"),
    description: "5 niveles de resistencia + bolso. Home gym total.",
    liveActivity: [{ name: "Lu", action: "compró 1 unidad", time: "hace 12 min" }],
  },
  {
    id: "p13", slug: "teclado-mecanico-rgb", title: "Teclado mecánico RGB switches azules",
    emoji: "⌨️", category: "gamer",
    price: { individual: 55000, group: 42000, wholesale: 30000 },
    groupTarget: 10, groupJoined: 6, groupTimeLeft: "03:45:00",
    rating: 4.9, reviews: 920, sold: 2400, stock: 9, customizable: false,
    badge: "RGB", gradient: grad("#03000f", "#00ffaa"),
    description: "Switches azules, RGB por tecla, anti-ghosting. PRO setup.",
    liveActivity: [{ name: "Fran", action: "se unió al grupo", time: "hace 2 min" }],
  },
  {
    id: "p14", slug: "mouse-gamer-rgb", title: "Mouse gamer 16000 DPI RGB",
    emoji: "🖱️", category: "gamer",
    price: { individual: 28000, group: 21000, wholesale: 15000 },
    groupTarget: 15, groupJoined: 11, groupTimeLeft: "01:20:00",
    rating: 4.8, reviews: 1340, sold: 4200, stock: 16, customizable: false,
    badge: "Casi completo", gradient: grad("#03000f", "#ff00aa"),
    description: "Sensor óptico 16K DPI, 7 botones programables.",
    liveActivity: [{ name: "Theo", action: "se unió al grupo", time: "hace 30 seg" }],
  },
  {
    id: "p15", slug: "taza-personalizada", title: "Taza personalizada con tu diseño",
    emoji: "☕", category: "personalizados",
    price: { individual: 6500, group: 4800, wholesale: 3200 },
    groupTarget: 30, groupJoined: 22, groupTimeLeft: "05:00:00",
    rating: 4.9, reviews: 2400, sold: 8800, stock: 50, customizable: true,
    badge: "TU DISEÑO",
    gradient: grad("#1a0a2e", "#ec4899"),
    description: "Sublimación full color. Subí foto, agregá texto, listo.",
    liveActivity: [{ name: "Vale", action: "diseñó la suya", time: "hace 1 min" }],
  },
  {
    id: "p16", slug: "remera-personalizada", title: "Remera con tu diseño DTF",
    emoji: "👕", category: "personalizados",
    price: { individual: 14000, group: 10500, wholesale: 7000 },
    groupTarget: 15, groupJoined: 9, groupTimeLeft: "08:00:00",
    rating: 4.8, reviews: 1100, sold: 3400, stock: 40, customizable: true,
    badge: "ÚNICO",
    gradient: grad("#1a0a2e", "#22d3ee"),
    description: "Algodón 180g, impresión DTF full color, lavable.",
    liveActivity: [{ name: "Sol", action: "diseñó la suya", time: "hace 4 min" }],
  },
];

MOCK_PRODUCTS.push(...extraProducts);

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
