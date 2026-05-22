// Per-category visual themes — each category feels like its own world.
import type { ComponentType, CSSProperties } from "react";
import { Cpu, Zap, Home, Dumbbell, Sparkles, Gem, Cat, Shirt } from "lucide-react";

export type CategoryTheme = {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  bg: string;
  surface: string;
  accent: string;
  accent2: string;
  textOn: string;
  font: string;
  pattern: "grid" | "waves" | "dots" | "sparkle" | "scan" | "shine" | "pixels" | "circuit";
  vibe: string;
  badges: string[];
  cta: string;
  isLight?: boolean;
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  tech: {
    id: "tech",
    name: "Tecnología",
    tagline: "Bienvenido al mundo IA",
    emoji: "📱",
    icon: Cpu,
    bg: "linear-gradient(180deg, #05060a 0%, #0a1530 50%, #05060a 100%)",
    surface: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(59,130,246,0.08))",
    accent: "#38bdf8",
    accent2: "#c0c8d4",
    textOn: "#ffffff",
    font: "font-mono",
    pattern: "circuit",
    vibe: "// AI · SYSTEM ONLINE",
    badges: ["IA READY", "5G", "PRO", "NUEVO"],
    cta: "Comprar ahora →",
  },
  electronica: {
    id: "electronica",
    name: "Electrónica",
    tagline: "Electrodomésticos inteligentes",
    emoji: "🍳",
    icon: Zap,
    bg: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%)",
    surface: "linear-gradient(135deg, rgba(100,116,139,0.14), rgba(14,165,233,0.08))",
    accent: "#0ea5e9",
    accent2: "#475569",
    textOn: "#ffffff",
    font: "font-display",
    pattern: "grid",
    vibe: "● SMART HOME",
    badges: ["INTELIGENTE", "AHORRO", "PRO", "ENVÍO GRATIS"],
    cta: "Llevarlo a casa →",
    isLight: true,
  },
  hogar: {
    id: "hogar",
    name: "Hogar",
    tagline: "Tu casa, tu calma",
    emoji: "🏠",
    icon: Home,
    bg: "linear-gradient(180deg, #f5ead8 0%, #e8d4b4 50%, #d9b889 100%)",
    surface: "linear-gradient(135deg, rgba(160,108,73,0.18), rgba(120,80,50,0.08))",
    accent: "#a06c49",
    accent2: "#c9a079",
    textOn: "#1c140d",
    font: "font-serif",
    pattern: "shine",
    vibe: "✦ Cozy mode · velas",
    badges: ["BEST SELLER", "ZEN", "CÁLIDO", "ENVÍO GRATIS"],
    cta: "Llevarlo a casa",
    isLight: true,
  },
  gym: {
    id: "gym",
    name: "Gym",
    tagline: "No excuses. Just reps.",
    emoji: "🏋️",
    icon: Dumbbell,
    bg: "linear-gradient(180deg, #0a0f08 0%, #14210d 50%, #0a0f08 100%)",
    surface: "linear-gradient(135deg, rgba(163,230,53,0.14), rgba(132,204,22,0.08))",
    accent: "#a3e635",
    accent2: "#fb923c",
    textOn: "#050a05",
    font: "font-bebas",
    pattern: "scan",
    vibe: "BEAST MODE",
    badges: ["PRO", "ATHLETE", "FITNESS", "ENERGY"],
    cta: "ENTRENAR YA",
  },
  belleza: {
    id: "belleza",
    name: "Belleza",
    tagline: "Glow infinito",
    emoji: "💄",
    icon: Sparkles,
    bg: "linear-gradient(180deg, #fff0f6 0%, #ffe0ee 50%, #ffd0e6 100%)",
    surface: "linear-gradient(135deg, rgba(236,72,153,0.16), rgba(244,114,182,0.08))",
    accent: "#ec4899",
    accent2: "#f472b6",
    textOn: "#1f0a18",
    font: "font-display",
    pattern: "sparkle",
    vibe: "✨ glow up",
    badges: ["VIRAL", "K-BEAUTY", "SKIN+", "PREMIUM"],
    cta: "Brillar ✨",
    isLight: true,
  },
  joyeria: {
    id: "joyeria",
    name: "Joyería",
    tagline: "Joyas que cuentan tu historia",
    emoji: "💍",
    icon: Gem,
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%)",
    surface: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(192,192,192,0.08))",
    accent: "#d4af37",
    accent2: "#c0c0c0",
    textOn: "#0a0a0a",
    font: "font-serif",
    pattern: "shine",
    vibe: "✦ ATELIER NEIBA",
    badges: ["GRABABLE", "ORO", "PLATA", "PREMIUM"],
    cta: "Reservar pieza →",
  },
  moda: {
    id: "moda",
    name: "Moda",
    tagline: "Tu estilo, tu regla",
    emoji: "👗",
    icon: Shirt,
    bg: "linear-gradient(180deg, #faf5f7 0%, #f3e8ed 50%, #ebdde5 100%)",
    surface: "linear-gradient(135deg, rgba(139,58,91,0.14), rgba(196,149,154,0.08))",
    accent: "#8b3a5b",
    accent2: "#c4959a",
    textOn: "#5c1a2e",
    font: "font-display",
    pattern: "sparkle",
    vibe: "✨ FASHION",
    badges: ["TREND", "OUTFIT", "PREMIUM", "NUEVO"],
    cta: "Vestirme →",
    isLight: true,
  },
  animales: {
    id: "animales",
    name: "Animales",
    tagline: "Todo para tu mejor amigo",
    emoji: "🐾",
    icon: Cat,
    bg: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    surface: "linear-gradient(135deg, rgba(74,124,89,0.16), rgba(34,197,94,0.08))",
    accent: "#4a7c59",
    accent2: "#22c55e",
    textOn: "#ffffff",
    font: "font-display",
    pattern: "dots",
    vibe: "♥ PET FRIENDLY",
    badges: ["PET", "NATURAL", "JUGUETE", "CÓMODO"],
    cta: "Mimarlos →",
    isLight: true,
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_THEMES);
