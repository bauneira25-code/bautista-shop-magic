// Per-category visual themes — each category feels like its own world.
import type { ComponentType, CSSProperties } from "react";
import {
  LayoutGrid, Cpu, Home, Gamepad2, Sparkles, Dumbbell, Car, Palette, Flame,
} from "lucide-react";

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
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  todo: {
    id: "todo",
    name: "Todo",
    tagline: "El inicio de tu próxima compra",
    emoji: "✨",
    icon: LayoutGrid,
    bg: "linear-gradient(180deg, #fff7f0 0%, #ffe8d6 50%, #fff7f0 100%)",
    surface: "linear-gradient(135deg, rgba(255,87,34,0.10), rgba(255,152,0,0.06))",
    accent: "#ff5722",
    accent2: "#ff9800",
    textOn: "#ffffff",
    font: "font-display",
    pattern: "sparkle",
    vibe: "★ INICIO",
    badges: ["DESTACADOS", "VIRALES", "OFERTAS", "GRUPOS"],
    cta: "Explorar todo →",
  },
  tech: {
    id: "tech",
    name: "Tecnología",
    tagline: "Bienvenido al mundo IA",
    emoji: "📱",
    icon: Cpu,
    bg: "linear-gradient(180deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%)",
    surface: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(59,130,246,0.08))",
    accent: "#0284c7",
    accent2: "#3b82f6",
    textOn: "#ffffff",
    font: "font-mono",
    pattern: "circuit",
    vibe: "// AI · SYSTEM ONLINE",
    badges: ["IA READY", "NEW DROP", "5G", "PRO"],
    cta: "Comprar ahora →",
  },
  hogar: {
    id: "hogar",
    name: "Hogar",
    tagline: "Tu casa, tu calma",
    emoji: "🏠",
    icon: Home,
    bg: "linear-gradient(180deg, #1c140d 0%, #2a1f15 100%)",
    surface: "linear-gradient(135deg, rgba(245,222,179,0.10), rgba(134,179,114,0.05))",
    accent: "#e8c07a",
    accent2: "#87a878",
    textOn: "#1c140d",
    font: "font-display",
    pattern: "shine",
    vibe: "Cozy mode",
    badges: ["BEST SELLER", "ZEN", "CÁLIDO", "ENVÍO GRATIS"],
    cta: "Llevarlo a casa",
  },
  gamer: {
    id: "gamer",
    name: "Gamer",
    tagline: "Level up your setup",
    emoji: "🎮",
    icon: Gamepad2,
    bg: "linear-gradient(180deg, #03000f 0%, #0a0028 50%, #03000f 100%)",
    surface: "linear-gradient(135deg, rgba(0,255,170,0.10), rgba(255,0,170,0.06))",
    accent: "#00ffaa",
    accent2: "#ff00aa",
    textOn: "#03000f",
    font: "font-mono",
    pattern: "pixels",
    vibe: "<PLAYER 1>",
    badges: ["RGB", "144HZ", "PRO ESPORTS", "MECHANICAL"],
    cta: "INSERT COIN ▶",
  },
  belleza: {
    id: "belleza",
    name: "Belleza",
    tagline: "Glow infinito",
    emoji: "💄",
    icon: Sparkles,
    bg: "linear-gradient(180deg, #1f0a18 0%, #2d0a2e 50%, #1f0a18 100%)",
    surface: "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(252,211,77,0.05))",
    accent: "#f9a8d4",
    accent2: "#fcd34d",
    textOn: "#1f0a18",
    font: "font-display",
    pattern: "sparkle",
    vibe: "✨ glow up",
    badges: ["VIRAL", "K-BEAUTY", "SKIN+", "PREMIUM"],
    cta: "Brillar ✨",
  },
  deporte: {
    id: "deporte",
    name: "Deporte",
    tagline: "No excuses. Just reps.",
    emoji: "🏃",
    icon: Dumbbell,
    bg: "linear-gradient(180deg, #050a05 0%, #0a1f0a 100%)",
    surface: "linear-gradient(135deg, rgba(132,204,22,0.10), rgba(249,115,22,0.06))",
    accent: "#a3e635",
    accent2: "#fb923c",
    textOn: "#050a05",
    font: "font-display",
    pattern: "scan",
    vibe: "BEAST MODE",
    badges: ["PRO", "ATHLETE", "FITNESS", "ENERGY"],
    cta: "ENTRENAR YA",
  },
  auto: {
    id: "auto",
    name: "Auto",
    tagline: "Tecnología sobre ruedas",
    emoji: "🚗",
    icon: Car,
    bg: "linear-gradient(180deg, #050505 0%, #1a0505 50%, #050505 100%)",
    surface: "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(148,163,184,0.05))",
    accent: "#ef4444",
    accent2: "#94a3b8",
    textOn: "#050505",
    font: "font-mono",
    pattern: "scan",
    vibe: "▶ DRIVE MODE",
    badges: ["TURBO", "12V", "PREMIUM", "RACING"],
    cta: "Acelerar →",
  },
  personalizados: {
    id: "personalizados",
    name: "Personalizados",
    tagline: "Creá lo tuyo, único",
    emoji: "🎨",
    icon: Palette,
    bg: "linear-gradient(180deg, #0d0a1a 0%, #1a0a2e 50%, #0d0a1a 100%)",
    surface: "linear-gradient(135deg, rgba(236,72,153,0.10), rgba(34,211,238,0.06))",
    accent: "#ec4899",
    accent2: "#22d3ee",
    textOn: "#0d0a1a",
    font: "font-display",
    pattern: "dots",
    vibe: "CREATE · DESIGN · WEAR",
    badges: ["ÚNICO", "TU DISEÑO", "IA", "MOCKUP"],
    cta: "Diseñar ahora 🎨",
  },
  tendencias: {
    id: "tendencias",
    name: "Tendencias",
    tagline: "Lo que rompe ahora",
    emoji: "🔥",
    icon: Flame,
    bg: "linear-gradient(180deg, #1a0505 0%, #2e0a0a 50%, #1a0505 100%)",
    surface: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(236,72,153,0.06))",
    accent: "#fb923c",
    accent2: "#ef4444",
    textOn: "#1a0505",
    font: "font-display",
    pattern: "waves",
    vibe: "🔥 TRENDING",
    badges: ["VIRAL", "TIKTOK", "NEW DROP", "URGENT"],
    cta: "Sumate al hype 🔥",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_THEMES);
