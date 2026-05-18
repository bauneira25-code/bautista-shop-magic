export type MachineId = "laser" | "uv" | "sublimacion";

export interface LiveMachine {
  id: MachineId;
  emoji: string;
  name: string;
  short: string;
  products: string[];
  tagline: string;
  /** key tokens to match a product to this machine */
  matches: string[];
  activity: string[];
  // visual tokens
  hue: { from: string; via: string; to: string };
  accent: string;
}

export const LIVE_MACHINES: LiveMachine[] = [
  {
    id: "laser",
    emoji: "🔥",
    name: "Láser Premium",
    short: "Termos • Joyería • Llaveros",
    products: ["Termos", "Joyería", "Llaveros metálicos", "Placas", "Productos premium"],
    tagline: "Grabado láser de precisión sobre metal",
    matches: ["termo", "joyer", "llaver", "placa", "collar", "anillo", "pulser", "metal"],
    activity: [
      "Grabando termo personalizado",
      "Grabando collar premium",
      "Tallando llavero metálico",
      "Detallando placa de acero",
    ],
    hue: { from: "#1a0a08", via: "#3b0f08", to: "#e8451c" },
    accent: "#ff8a4d",
  },
  {
    id: "uv",
    emoji: "🎨",
    name: "Impresión UV",
    short: "Fundas • Acrílicos",
    products: ["Fundas", "Acrílicos", "Placas planas", "Objetos planos"],
    tagline: "Impresión UV full color de alta definición",
    matches: ["funda", "acril", "placa", "cuadro", "poster", "uv"],
    activity: [
      "Imprimiendo funda UV",
      "Aplicando barniz acrílico",
      "Curando tinta UV",
      "Imprimiendo cuadro full color",
    ],
    hue: { from: "#0a0a1a", via: "#1a1240", to: "#7a3bff" },
    accent: "#ff8a4d",
  },
  {
    id: "sublimacion",
    emoji: "🧴",
    name: "Sublimación",
    short: "Botellas • Tazas",
    products: ["Botellas", "Tazas", "Productos cilíndricos", "Accesorios"],
    tagline: "Transferencia térmica sobre superficies curvas",
    matches: ["botella", "taza", "mug", "cilindr", "vaso", "matero"],
    activity: [
      "Sublimando botella personalizada",
      "Girando taza en prensa térmica",
      "Retirando vaso terminado",
      "Calibrando prensa rotativa",
    ],
    hue: { from: "#0a1410", via: "#0d3324", to: "#10b981" },
    accent: "#ff8a4d",
  },
];

export function getMachine(id: string): LiveMachine | undefined {
  return LIVE_MACHINES.find((m) => m.id === id);
}

export function machineForProduct(title: string, slug = ""): MachineId {
  const t = (title + " " + slug).toLowerCase();
  for (const m of LIVE_MACHINES) {
    if (m.matches.some((k) => t.includes(k))) return m.id;
  }
  return "laser";
}
