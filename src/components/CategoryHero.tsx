import type { CategoryTheme } from "@/lib/categoryThemes";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

const PATTERN_CLASS: Record<CategoryTheme["pattern"], string> = {
  grid: "pat-grid",
  waves: "pat-waves",
  dots: "pat-dots",
  sparkle: "pat-sparkle",
  scan: "pat-scan",
  shine: "pat-shine",
  pixels: "pat-pixels",
  circuit: "pat-circuit",
};

export function CategoryHero({ theme }: { theme: CategoryTheme }) {
  const Icon = theme.icon;
  const TXT = theme.isLight ? "#1a0f08" : "#ffffff";
  const TXT_MUTED = theme.isLight ? "rgba(26,15,8,0.65)" : "rgba(255,255,255,0.7)";
  const CHIP_BG = theme.isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.35)";
  return (
    <header className="relative overflow-hidden" style={{ background: theme.bg }}>
      <div className={`absolute inset-0 opacity-60 ${PATTERN_CLASS[theme.pattern]}`} style={{ ["--pat-color" as never]: `${theme.accent}30` }} />
      <div
        className="absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl opacity-50"
        style={{ background: theme.accent }}
      />
      <div
        className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: theme.accent2 }}
      />

      <div className="relative px-5 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <Link to="/categorias" className="grid h-9 w-9 place-items-center rounded-full backdrop-blur" style={{ background: CHIP_BG }}>
            <ArrowLeft className="h-4 w-4" style={{ color: TXT }} />
          </Link>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${theme.font}`}
            style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: CHIP_BG }}
          >
            {theme.vibe}
          </span>
          <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: theme.accent }}>
            <Icon className="h-4 w-4" style={{ color: "#fff" }} />
          </div>
        </div>

        <div className="mt-6">
          <p className={`text-[11px] uppercase tracking-[0.3em] ${theme.font}`} style={{ color: `${theme.accent}` }}>
            NEIBA · {theme.id}
          </p>
          <h1
            className={`mt-2 text-5xl leading-[0.95] ${theme.font === "font-bebas" ? "font-bebas" : theme.font === "font-mono" ? "font-orbitron" : theme.font}`}
            style={{ color: TXT }}
          >
            {theme.name.toUpperCase()}
          </h1>
          <p className="mt-2 max-w-[280px] text-sm" style={{ color: TXT_MUTED }}>{theme.tagline}</p>
        </div>

        {/* Decorative widget per pattern */}
        {theme.pattern === "waves" && (
          <div className="mt-5 flex h-10 items-end gap-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                className="eq-bar w-1 rounded-full"
                style={{
                  height: `${20 + ((i * 7) % 80)}%`,
                  background: i % 2 ? theme.accent : theme.accent2,
                  animationDelay: `${(i % 8) * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        {theme.pattern === "circuit" && (
          <div className={`mt-5 rounded-lg border px-3 py-2 ${theme.font}`} style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>
            <p className="text-[10px]">$ neiba --category=tech --status=live</p>
            <p className="text-[10px] opacity-70">→ 248 dispositivos · 12 drops esta semana</p>
          </div>
        )}

        {theme.pattern === "pixels" && (
          <div className={`mt-5 flex items-center justify-between rounded-md border-2 px-3 py-2 ${theme.font}`} style={{ borderColor: theme.accent, color: theme.accent }}>
            <span className="text-xs">► PRESS START</span>
            <span className="text-xs">HI-SCORE 99,999</span>
          </div>
        )}

        {theme.pattern === "sparkle" && (
          <div className="mt-5 flex gap-2">
            {["NEW", "GLOW", "SKIN", "VIRAL"].map((t) => (
              <span key={t} className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: theme.accent, color: theme.textOn }}>
                ✨ {t}
              </span>
            ))}
          </div>
        )}

        {theme.pattern === "scan" && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border-l-4 px-3 py-2" style={{ borderColor: theme.accent, background: "rgba(255,255,255,0.04)" }}>
            <span className={`font-bebas text-3xl`} style={{ color: theme.accent }}>24/7</span>
            <div>
              <p className="font-bebas text-base text-white">NO DAYS OFF</p>
              <p className="text-[10px] text-white/60">Equipamiento pro · envío gratis</p>
            </div>
          </div>
        )}

        {theme.pattern === "shine" && theme.id === "joyeria" && (
          <p className={`mt-4 ${theme.font} text-sm italic`} style={{ color: theme.accent }}>
            "Joyas que cuentan tu historia"
          </p>
        )}

        {theme.pattern === "grid" && theme.id === "electronica" && (
          <div className={`mt-5 grid grid-cols-3 gap-2 ${theme.font}`}>
            {["WIFI", "IA", "AUTO"].map((t) => (
              <div key={t} className="rounded-md border px-2 py-1.5 text-center text-[10px]" style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: "rgba(255,255,255,0.7)" }}>
                ● {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
