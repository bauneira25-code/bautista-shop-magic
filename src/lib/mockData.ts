// Mock data for the NEIBA prototype (UI-only).

export type PurchaseMode = "individual" | "wholesale";

export type SellerKind = "neiba" | "importer";
export type StockLocation = "ar" | "factory" | "transit" | "customs" | "nationalized";

export interface Importer {
  id: string;
  name: string;
  verified: boolean;
  city: string;
  rating: number;
  productsCount: number;
  emoji: string;
  specialty: string;
}

export const IMPORTERS: Importer[] = [
  { id: "imp1", name: "Asia Trade SA",      verified: true,  city: "CABA",    rating: 4.8, productsCount: 142, emoji: "🏭", specialty: "Tecnología y electrónica" },
  { id: "imp2", name: "Shenzhen Direct AR", verified: true,  city: "Córdoba", rating: 4.7, productsCount: 89,  emoji: "📦", specialty: "Smartwatches y wearables" },
  { id: "imp3", name: "Pacific Imports",    verified: true,  city: "Rosario", rating: 4.6, productsCount: 67,  emoji: "🚢", specialty: "Hogar y deco" },
  { id: "imp4", name: "Global Link",        verified: false, city: "Mendoza", rating: 4.4, productsCount: 38,  emoji: "🌐", specialty: "Moda y accesorios" },
  { id: "imp5", name: "China Express AR",   verified: true,  city: "CABA",    rating: 4.9, productsCount: 211, emoji: "⚡", specialty: "Personalización y branding" },
];

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
  badge?: string;
  colors?: string[];
  variants?: string[];
  gradient: string;
  description: string;
  liveActivity: { name: string; action: string; time: string }[];
  sellerKind: SellerKind;
  sellerName: string;
  sellerVerified: boolean;
  stockLocation: StockLocation;
  deliveryLabel: string;
  minOrder?: number;
  customizable?: boolean;
  customizationFee?: number;
  quotable?: boolean;
  importStatus?: string;
}

const grad = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

let _id = 0;
const make = (
  category: string,
  title: string,
  emoji: string,
  individual: number,
  groupPct: number,
  gradColors: [string, string],
  opts: Partial<MockProduct> = {},
): MockProduct => {
  _id += 1;
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const group = Math.round(individual * (1 - groupPct));
  const wholesale = Math.round(individual * (1 - groupPct - 0.15));
  const demand = (_id * 37) % 100;
  const target = demand > 66 ? 4 : demand > 33 ? 6 : 8;
  const missing = 1 + ((_id * 13) % (target - 1));
  const joined = target - missing;

  // Asignación determinística del tipo de vendedor / entrega
  // 0 → NEIBA, 1 → importador stock AR, 2 → importador a pedido (lote), 3 → NEIBA personalizable
  const kindIdx = _id % 4;
  const importerPool = ["Asia Trade SA", "Shenzhen Direct AR", "Pacific Imports", "Global Link", "China Express AR"];
  let sellerKind: SellerKind = "neiba";
  let sellerName = "NEIBA";
  let sellerVerified = true;
  let stockLocation: StockLocation = "ar";
  let deliveryLabel = "24/48 hs";
  let minOrder: number | undefined;
  let customizable = false;
  let customizationFee: number | undefined;
  let quotable = false;
  let importStatus: string | undefined;

  if (kindIdx === 1) {
    sellerKind = "importer";
    sellerName = importerPool[_id % importerPool.length];
    sellerVerified = true;
    stockLocation = "ar";
    deliveryLabel = "24/48 hs";
    // Algunos importadores ofrecen personalización con costo extra
    if (_id % 3 === 0) {
      customizable = true;
      customizationFee = 2500 + ((_id * 137) % 4) * 500; // 2500 / 3000 / 3500 / 4000
    }
  } else if (kindIdx === 2) {
    sellerKind = "importer";
    sellerName = importerPool[(_id + 1) % importerPool.length];
    sellerVerified = _id % 7 !== 0;
    stockLocation = "factory";
    deliveryLabel = "30 días";
    minOrder = 100;
    quotable = true;
    const statuses = ["En fábrica", "En tránsito", "En aduana", "Nacionalizado"];
    importStatus = statuses[_id % statuses.length];
    // Lotes a pedido: a veces con personalización (branding) más cara
    if (_id % 2 === 0) {
      customizable = true;
      customizationFee = 3500 + ((_id * 91) % 5) * 500; // 3500 a 5500
    }
  } else if (kindIdx === 3) {
    sellerKind = "neiba";
    sellerName = "NEIBA";
    stockLocation = "ar";
    deliveryLabel = "24/48 hs";
    customizable = true;
    customizationFee = 1500 + ((_id * 53) % 4) * 500; // 1500 / 2000 / 2500 / 3000
  }

  return {
    id: `p${_id}`,
    slug,
    title,
    emoji,
    category,
    price: { individual, group, wholesale },
    groupTarget: target,
    groupJoined: joined,
    groupTimeLeft: `0${1 + (_id % 5)}:${10 + (_id % 50)}:00`.slice(0, 8),
    rating: 4.5 + ((_id * 7) % 5) / 10,
    reviews: 200 + _id * 73,
    sold: 800 + _id * 211,
    stock: 5 + (_id % 30),
    badge: opts.badge,
    colors: opts.colors,
    variants: opts.variants,
    gradient: grad(gradColors[0], gradColors[1]),
    description: opts.description ?? `${title} — calidad premium con envío rápido.`,
    liveActivity: [
      { name: "Lucas", action: `compró un ${title}`, time: "hace 2 min" },
      { name: "Mica", action: `agregó ${title} al carrito`, time: "hace 4 min" },
    ],
    sellerKind,
    sellerName,
    sellerVerified,
    stockLocation,
    deliveryLabel,
    minOrder,
    customizable,
    quotable,
    importStatus,
  };
};

const _RAW: MockProduct[] = [
  // ============ TECNOLOGÍA ============
  make("tech", "Funda iPhone Magsafe", "📱", 14000, 0.22, ["#0a1530", "#38bdf8"], { badge: "Viral", variants: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPhone 16"], colors: ["#000", "#7c3aed", "#ec4899"] }),
  make("tech", "Auriculares Pro ANC", "🎧", 45000, 0.20, ["#0a1530", "#3b82f6"], { badge: "Nuevo" }),
  make("tech", "Smartwatch X9 AMOLED", "⌚", 38000, 0.21, ["#05060a", "#38bdf8"], { badge: "Stock bajo" }),
  make("tech", "Parlante Bluetooth 360°", "🔊", 22000, 0.23, ["#0a1530", "#c0c8d4"]),
  make("tech", "Cámara Mirrorless 4K", "📷", 280000, 0.18, ["#05060a", "#38bdf8"], { badge: "PRO" }),
  make("tech", "Mini robot IA de escritorio", "🤖", 65000, 0.25, ["#05060a", "#38bdf8"], { badge: "IA" }),
  make("tech", "Monitor 27\" 144Hz", "🖥️", 320000, 0.18, ["#0a1530", "#3b82f6"]),
  make("tech", "Setup gamer combo", "🎮", 120000, 0.22, ["#03000f", "#38bdf8"], { badge: "Gamer" }),
  make("tech", "Drone 4K plegable", "🛸", 145000, 0.20, ["#05060a", "#c0c8d4"]),
  make("tech", "Smart Glasses IA", "🕶️", 195000, 0.19, ["#05060a", "#38bdf8"], { badge: "IA" }),
  make("tech", "Micrófono USB-C streamer", "🎙️", 35000, 0.22, ["#0a1530", "#3b82f6"]),
  make("tech", "Proyector portátil HD", "📽️", 89000, 0.21, ["#05060a", "#38bdf8"]),
  make("tech", "Cargador 65W GaN", "🔌", 18000, 0.24, ["#0a1530", "#c0c8d4"]),
  make("tech", "Tira LED RGB Wi-Fi 5m", "💡", 12000, 0.25, ["#0a1530", "#38bdf8"], { badge: "Viral" }),
  make("tech", "Soporte celular magnético", "📲", 8500, 0.24, ["#0a1530", "#c0c8d4"]),

  // ============ ELECTRÓNICA ============
  make("electronica", "Cafetera espresso automática", "☕", 145000, 0.20, ["#e2e8f0", "#0ea5e9"], { badge: "Best seller" }),
  make("electronica", "Freidora de aire 6L", "🍳", 65000, 0.20, ["#f1f5f9", "#475569"]),
  make("electronica", "Licuadora 1200W", "🥤", 42000, 0.22, ["#e2e8f0", "#0ea5e9"]),
  make("electronica", "Batidora de pie pro", "🍰", 95000, 0.20, ["#f1f5f9", "#475569"]),
  make("electronica", "Exprimidor cítricos", "🍊", 18000, 0.23, ["#e2e8f0", "#f59e0b"]),
  make("electronica", "Wafflera doble", "🧇", 28000, 0.22, ["#f1f5f9", "#0ea5e9"]),
  make("electronica", "Pochoclera retro", "🍿", 22000, 0.24, ["#e2e8f0", "#ef4444"], { badge: "Trending" }),
  make("electronica", "Espumador de leche", "🥛", 14000, 0.22, ["#f1f5f9", "#475569"]),
  make("electronica", "Aspiradora robot IA", "🤖", 230000, 0.18, ["#e2e8f0", "#0ea5e9"], { badge: "IA" }),
  make("electronica", "Aspiradora de mano", "🧹", 38000, 0.22, ["#f1f5f9", "#475569"]),
  make("electronica", "Robot limpia vidrios", "🪟", 95000, 0.20, ["#e2e8f0", "#0ea5e9"]),
  make("electronica", "Afeitadora premium", "🪒", 32000, 0.23, ["#f1f5f9", "#475569"]),
  make("electronica", "Máquina de hielo express", "🧊", 110000, 0.20, ["#e2e8f0", "#38bdf8"]),
  make("electronica", "Aire acondicionado IA", "❄️", 480000, 0.16, ["#f1f5f9", "#0ea5e9"], { badge: "IA" }),

  // ============ HOGAR ============
  make("hogar", "Vajilla cerámica 16 pzas", "🍽️", 48000, 0.20, ["#fde8b4", "#d97706"], { badge: "Cozy" }),
  make("hogar", "Set utensilios cocina", "🥄", 22000, 0.22, ["#fff8e1", "#f59e0b"]),
  make("hogar", "Cuadro decorativo abstracto", "🖼️", 18000, 0.25, ["#fde8b4", "#d97706"]),
  make("hogar", "Lámpara mesa cálida", "💡", 24000, 0.22, ["#fff8e1", "#f59e0b"]),
  make("hogar", "Espejo redondo arco", "🪞", 38000, 0.20, ["#fde8b4", "#d97706"]),
  make("hogar", "Set 3 velas aromáticas", "🕯️", 14000, 0.25, ["#fff8e1", "#f59e0b"], { badge: "Zen" }),
  make("hogar", "Difusor aroma ultrasónico", "🌬️", 18000, 0.24, ["#fde8b4", "#d97706"]),
  make("hogar", "Canasto fibra natural", "🧺", 12000, 0.25, ["#fff8e1", "#d97706"]),
  make("hogar", "Set 3 toallas premium", "🛁", 22000, 0.22, ["#fde8b4", "#f59e0b"]),
  make("hogar", "Caja organizadora bambú", "📦", 9500, 0.25, ["#fff8e1", "#d97706"]),
  make("hogar", "Lámpara puesta de sol", "🌅", 18000, 0.22, ["#fde8b4", "#f59e0b"], { badge: "TikTok viral" }),
  make("hogar", "Proyector estrellas IA", "✨", 28000, 0.24, ["#fde8b4", "#d97706"], { badge: "IA" }),

  // ============ GYM ============
  make("gym", "Mancuernas ajustables 24kg", "🏋️", 95000, 0.18, ["#0a0f08", "#a3e635"]),
  make("gym", "Set pesas hexagonales", "💪", 65000, 0.20, ["#0a0f08", "#fb923c"]),
  make("gym", "Barra olímpica 20kg", "🏋️", 110000, 0.20, ["#0a0f08", "#a3e635"]),
  make("gym", "Pelota fútbol pro", "⚽", 18000, 0.22, ["#0a0f08", "#a3e635"]),
  make("gym", "Guantes boxeo 14oz", "🥊", 28000, 0.22, ["#0a0f08", "#fb923c"]),
  make("gym", "Pelota básquet outdoor", "🏀", 22000, 0.22, ["#0a0f08", "#fb923c"]),
  make("gym", "Pelota rugby match", "🏉", 25000, 0.22, ["#0a0f08", "#a3e635"]),
  make("gym", "Stick hockey pro", "🏒", 42000, 0.20, ["#0a0f08", "#fb923c"]),
  make("gym", "Tabla snowboard 155cm", "🏂", 280000, 0.18, ["#0a0f08", "#a3e635"]),
  make("gym", "Set 5 bandas elásticas", "💪", 11000, 0.23, ["#0a0f08", "#fb923c"]),
  make("gym", "Set 6 conos entrenamiento", "🔶", 8500, 0.25, ["#0a0f08", "#a3e635"]),
  make("gym", "Soga saltar pro", "🪢", 9500, 0.24, ["#0a0f08", "#fb923c"]),
  make("gym", "Rueda abdominal doble", "⚙️", 12000, 0.24, ["#0a0f08", "#a3e635"]),
  make("gym", "Botella deportiva 1L", "💧", 9500, 0.26, ["#0a0f08", "#a3e635"]),
  make("gym", "Toalla microfibra gym", "🧖", 7500, 0.25, ["#0a0f08", "#fb923c"]),

  // ============ BELLEZA ============
  make("belleza", "Mascarilla coreana x10", "🌸", 18000, 0.24, ["#ffe0ee", "#ec4899"], { badge: "K-Beauty" }),
  make("belleza", "Máscara LED 7 colores", "💆", 75000, 0.20, ["#ffe0ee", "#f472b6"], { badge: "Casi completo" }),
  make("belleza", "Masajeador facial Y", "✨", 14000, 0.25, ["#ffe0ee", "#ec4899"]),
  make("belleza", "Set uñas press-on", "💅", 9500, 0.25, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Esmaltes gel pack 6", "💗", 12000, 0.24, ["#ffe0ee", "#ec4899"]),
  make("belleza", "Limpieza poros eléctrica", "🫧", 22000, 0.23, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Serum rejuvenecedor", "🧴", 28000, 0.22, ["#ffe0ee", "#ec4899"], { badge: "Premium" }),
  make("belleza", "Set brochas profesional", "🖌️", 18000, 0.24, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Skincare kit completo", "🌷", 45000, 0.22, ["#ffe0ee", "#ec4899"]),
  make("belleza", "Planchita iónica", "💇", 32000, 0.22, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Secador profesional 2200W", "💨", 38000, 0.22, ["#ffe0ee", "#ec4899"]),
  make("belleza", "Rizadora automática", "💁", 42000, 0.22, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Lámpara UV uñas 48W", "💡", 22000, 0.23, ["#ffe0ee", "#ec4899"]),
  make("belleza", "Set vinchas spa", "🎀", 6500, 0.26, ["#ffe0ee", "#f472b6"]),
  make("belleza", "Parches granitos x36", "🩹", 7500, 0.25, ["#ffe0ee", "#ec4899"], { badge: "Viral" }),
  make("belleza", "Depilador láser IPL", "✨", 95000, 0.20, ["#ffe0ee", "#f472b6"], { badge: "Premium" }),

  // ============ JOYERÍA ============
  make("joyeria", "Anillo oro 18k minimalista", "💍", 65000, 0.18, ["#1a1410", "#d4af37"], { badge: "Premium" }),
  make("joyeria", "Pulsera plata 925", "📿", 28000, 0.22, ["#1a1410", "#c0c0c0"]),
  make("joyeria", "Collar acero minimalista", "🔗", 18000, 0.22, ["#0a0a0a", "#d4af37"]),
  make("joyeria", "Aros argollas oro", "💫", 32000, 0.22, ["#1a1410", "#d4af37"]),
  make("joyeria", "Reloj clásico cuero", "⌚", 85000, 0.20, ["#0a0a0a", "#d4af37"], { badge: "Premium" }),
  make("joyeria", "Lentes sol polarizados", "🕶️", 28000, 0.22, ["#1a1410", "#c0c0c0"]),
  make("joyeria", "Dije inicial", "✨", 14000, 0.24, ["#0a0a0a", "#d4af37"]),
  make("joyeria", "Set anillos apilables", "💍", 22000, 0.24, ["#1a1410", "#d4af37"]),
  make("joyeria", "Pulsera cuero", "🪢", 12000, 0.25, ["#0a0a0a", "#c0c0c0"]),
  make("joyeria", "Cadena cubana plata", "🔗", 48000, 0.20, ["#1a1410", "#c0c0c0"]),

  // ============ ANIMALES ============
  make("animales", "Comedero automático Wi-Fi", "🐱", 45000, 0.20, ["#f0fdf4", "#4a7c59"], { badge: "Smart" }),
  make("animales", "Cama ortopédica perro", "🐶", 28000, 0.22, ["#dcfce7", "#22c55e"]),
  make("animales", "Rascador torre gato", "🐱", 18000, 0.24, ["#f0fdf4", "#4a7c59"], { badge: "Best seller" }),
  make("animales", "Transportadora premium", "🐾", 22000, 0.22, ["#dcfce7", "#22c55e"]),
  make("animales", "Juguete interactivo", "🎾", 8500, 0.25, ["#f0fdf4", "#4a7c59"], { badge: "Viral" }),
  make("animales", "Collar GPS mascota", "📍", 32000, 0.22, ["#dcfce7", "#22c55e"]),
  make("animales", "Shampoo natural 5L", "🧴", 12000, 0.24, ["#f0fdf4", "#4a7c59"]),
  make("animales", "Dispensador agua fuente", "💧", 15000, 0.23, ["#dcfce7", "#22c55e"]),

  // ============ MODA ============
  make("moda", "Remera oversize unisex", "👕", 12000, 0.22, ["#fdf2f8", "#ec4899"]),
  make("moda", "Zapatillas urbanas", "👟", 45000, 0.20, ["#fce7f3", "#f472b6"], { badge: "Trending" }),
  make("moda", "Bolso tote cuero vegano", "👜", 18000, 0.24, ["#fdf2f8", "#ec4899"]),
  make("moda", "Bufanda tejida premium", "🧣", 9500, 0.25, ["#fce7f3", "#f472b6"], { badge: "Cozy" }),
  make("moda", "Gorra bordada", "🧢", 8500, 0.25, ["#fdf2f8", "#ec4899"]),
  make("moda", "Lentes sol retro", "🕶️", 22000, 0.22, ["#fce7f3", "#f472b6"]),
  make("moda", "Cinturón reversible", "🪢", 11000, 0.24, ["#fdf2f8", "#ec4899"]),
  make("moda", "Set medias x6 diseños", "🧦", 7500, 0.25, ["#fce7f3", "#f472b6"], { badge: "Pack" }),
];

export const MOCK_PRODUCTS: MockProduct[] = _RAW;

export const CATEGORIES = [
  { id: "tech", name: "Tecnología", emoji: "📱" },
  { id: "electronica", name: "Electrónica", emoji: "🍳" },
  { id: "hogar", name: "Hogar", emoji: "🏠" },
  { id: "belleza", name: "Belleza", emoji: "💄" },
  { id: "joyeria", name: "Joyería", emoji: "💍" },
  { id: "moda", name: "Moda", emoji: "👗" },
  { id: "animales", name: "Animales", emoji: "🐾" },
];

export const FLASH_DEALS = MOCK_PRODUCTS.slice(0, 6);
export const TRENDING = MOCK_PRODUCTS.filter((p) => !!p.badge).slice(0, 8);
export const VIRAL = MOCK_PRODUCTS.filter((p) => p.badge?.includes("Viral") || p.badge?.includes("TikTok")).slice(0, 6);

export const LIVE_FEED = [
  "🔥 Lucas compró una Funda iPhone Magsafe",
  "💜 Mica agregó Pulsera plata 925 al carrito",
  "⚡ Tomás se unió al grupo de Auriculares Pro",
  "✨ Sofi compró un Collar acero minimalista",
];

export const MOCK_ORDERS = [
  {
    id: "NB-10248",
    product: MOCK_PRODUCTS[0],
    status: "shipping" as const,
    progress: 75,
    eta: "Llega mañana",
    mode: "individual" as PurchaseMode,
    qty: 1,
  },
  {
    id: "NB-10247",
    product: MOCK_PRODUCTS[15],
    status: "packaging" as const,
    progress: 55,
    eta: "Llega en 5 días",
    mode: "individual" as PurchaseMode,
    qty: 1,
  },
  {
    id: "NB-10240",
    product: MOCK_PRODUCTS[60],
    status: "delivered" as const,
    progress: 100,
    eta: "Entregado",
    mode: "wholesale" as PurchaseMode,
    qty: 2,
  },
];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const findProduct = (slug: string) => MOCK_PRODUCTS.find((p) => p.slug === slug);

export const stockLabel = (stock: number): { label: string; tone: "low" | "mid" | "ok" } => {
  if (stock <= 6) return { label: "Últimas unidades", tone: "low" };
  if (stock <= 15) return { label: "Alta demanda", tone: "mid" };
  return { label: "Disponible", tone: "ok" };
};

export const relatedProducts = (slug: string, limit = 4) => {
  const current = findProduct(slug);
  if (!current) return [];
  const same = MOCK_PRODUCTS.filter((p) => p.slug !== slug && p.category === current.category);
  const fill = MOCK_PRODUCTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...same, ...fill].slice(0, limit);
};

export const searchProducts = (q: string, limit = 6) => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return MOCK_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query),
  ).slice(0, limit);
};
