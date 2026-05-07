// Per-category visual themes — each category feels like its own world.
import type { ComponentType } from "react";
import {
  Cpu, Headphones, Home, Sparkles, Dumbbell, Gem, Gamepad2, Bot,
} from "lucide-react";

export type CategoryTheme = {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  icon: ComponentType<{ className?: string }>;
  // Visual identity
  bg: string;            // page background gradient
  surface: string;       // card surface
  accent: string;        // primary accent hex
  accent2: string;       // secondary accent
  textOn: string;        // text color on accent
  font: string;          // tailwind font class
  pattern: "grid" | "waves" | "dots" | "sparkle" | "scan" | "shine" | "pixels" | "circuit";
  vibe: string;          // short vibe label
  badges: string[];      // badge words used in chips
  cta: string;           // CTA text
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  tech: {
    id: "tech",
    name: "Tecnología",
    tagline: "El futuro, hoy en tu bolsillo",
    emoji: "📱",
    icon: Cpu,
    bg: "linear-gradient(180deg, #050816 0%, #0a0f2c 50%, #050816 100%)",
    surface: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(124,58,237,0.05))",
    accent: "#22d3ee",
    accent2: "#7c3aed",
    textOn: "#020617",
    font: "font-mono",
    pattern: "circuit",
    vibe: "// SYSTEM ONLINE",
    badges: ["NEW DROP", "AI READY", "PRO TIER", "5G"],
    cta: "Comprar ahora →",
  },
  audio: {
    id: "audio",
    name: "Audio",
    tagline: "Sentí cada beat",
    emoji: "🎧",
    icon: Headphones,
    bg: "radial-gradient(ellipse at top, #1e1b4b 0%, #050816 70%)",
    surface: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.06))",
    accent: "#a855f7",
    accent2: "#ec4899",
    textOn: "#0a0a0a",
    font: "font-display",
    pattern: "waves",
    vibe: "♪ NOW PLAYING",
    badges: ["HI-FI", "ANC", "STUDIO", "BASS+"],
    cta: "Escuchar ahora ▶",
  },
  hogar: {
    id: "hogar",
    name: "Hogar",
    tagline: "Tu casa, reinventada",
    emoji: "🏠",
    icon: Home,
    bg: "linear-gradient(180deg, #1c1917 0%, #292524 100%)",
    surface: "linear-gradient(135deg, rgba(251,146,60,0.10), rgba(217,119,6,0.04))",
    accent: "#f59e0b",
    accent2: "#ea580c",
    textOn: "#1c1917",
    font: "font-display",
    pattern: "shine",
    vibe: "Cozy mode",
    badges: ["BEST SELLER", "TIKTOK VIRAL", "ENVÍO GRATIS"],
    cta: "Llevarlo a casa",
  },
  belleza: {
    id: "belleza",
    name: "Belleza",
    tagline: "Glow infinito",
    emoji: "💄",
    icon: Sparkles,
    bg: "linear-gradient(180deg, #1a0b1f 0%, #2d0a2e 50%, #1a0b1f 100%)",
    surface: "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(232,121,249,0.06))",
    accent: "#f472b6",
    accent2: "#e879f9",
    textOn: "#1a0b1f",
    font: "font-display",
    pattern: "sparkle",
    vibe: "✨ glow up",
    badges: ["VIRAL", "K-BEAUTY", "SKIN+", "TIKTOK"],
    cta: "Brillar ✨",
  },
  gym: {
    id: "gym",
    name: "Gym",
    tagline: "No excuses. Just reps.",
    emoji: "💪",
    icon: Dumbbell,
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
    surface: "linear-gradient(135deg, rgba(132,204,22,0.10), rgba(34,197,94,0.04))",
    accent: "#a3e635",
    accent2: "#22c55e",
    textOn: "#0a0a0a",
    font: "font-display",
    pattern: "scan",
    vibe: "BEAST MODE",
    badges: ["PRO", "+24KG", "HOME GYM", "ATHLETE"],
    cta: "ENTRENAR YA",
  },
  joyeria: {
    id: "joyeria",
    name: "Joyería",
    tagline: "Detalles que importan",
    emoji: "💍",
    icon: Gem,
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1c1917 100%)",
    surface: "linear-gradient(135deg, rgba(212,175,55,0.10), rgba(245,222,179,0.04))",
    accent: "#d4af37",
    accent2: "#f5deb3",
    textOn: "#0a0a0a",
    font: "font-serif",
    pattern: "shine",
    vibe: "Edición limitada",
    badges: ["18K", "GRABADO LÁSER", "HANDMADE"],
    cta: "Personalizar →",
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
    badges: ["RGB", "PRO ESPORTS", "144HZ", "MECHANICAL"],
    cta: "INSERT COIN ▶",
  },
  smart: {
    id: "smart",
    name: "Smart Home",
    tagline: "Tu casa te entiende",
    emoji: "🤖",
    icon: Bot,
    bg: "linear-gradient(180deg, #020617 0%, #0c1a3d 100%)",
    surface: "linear-gradient(135deg, rgba(96,165,250,0.10), rgba(34,211,238,0.05))",
    accent: "#60a5fa",
    accent2: "#22d3ee",
    textOn: "#020617",
    font: "font-mono",
    pattern: "grid",
    vibe: "AI · CONNECTED",
    badges: ["WIFI", "ALEXA", "AUTO", "AI"],
    cta: "Conectar ahora",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_THEMES);
