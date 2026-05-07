// Ambient side decorations that immerse the user in each category's world.
// Renders fixed/absolute decorative elements alongside the product list:
//   - tech: floating chips, code lines, AI orbs
//   - hogar: zen candles, plants, soft light beams
//   - audio: wave bars
//   - belleza: floating sparkles & flowers
//   - gym: scan lines & dumbbell silhouettes
//   - joyeria: gold shine sparkles
//   - gamer: pixel arcade
//   - smart: connected nodes
import type { CategoryTheme } from "@/lib/categoryThemes";

export function CategoryAmbient({ theme }: { theme: CategoryTheme }) {
  switch (theme.id) {
    case "tech":
      return <TechAmbient theme={theme} />;
    case "hogar":
      return <HogarAmbient theme={theme} />;
    case "audio":
      return <AudioAmbient theme={theme} />;
    case "belleza":
      return <BellezaAmbient theme={theme} />;
    case "gym":
      return <GymAmbient theme={theme} />;
    case "joyeria":
      return <JoyeriaAmbient theme={theme} />;
    case "gamer":
      return <GamerAmbient theme={theme} />;
    case "smart":
      return <SmartAmbient theme={theme} />;
    default:
      return null;
  }
}

function TechAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Floating circuit chips */}
      <div className="absolute left-2 top-[20%] rotate-[8deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>
        ▷ ai.boot()
      </div>
      <div className="absolute right-2 top-[35%] -rotate-[6deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent2}55`, color: theme.accent2, background: "rgba(0,0,0,0.4)" }}>
        100% UP
      </div>
      <div className="absolute left-1 top-[55%] rounded-md border px-2 py-1 font-mono text-[8px]" style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>
        chip-x9
      </div>
      <div className="absolute right-1 top-[68%] rotate-[10deg] rounded-md border px-2 py-1 font-mono text-[8px]" style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>
        5G · LIVE
      </div>
      {/* AI orbs */}
      <div className="absolute right-[-30px] top-[15%] h-32 w-32 rounded-full opacity-30 blur-2xl pulse-ring" style={{ background: theme.accent }} />
      <div className="absolute left-[-30px] top-[45%] h-28 w-28 rounded-full opacity-25 blur-2xl" style={{ background: theme.accent2 }} />
      {/* Vertical scanline */}
      <div className="absolute left-1/2 top-0 h-full w-px opacity-20" style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}, transparent)` }} />
    </div>
  );
}

function HogarAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft warm light beams */}
      <div className="absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      {/* Candles */}
      <div className="absolute left-1 top-[22%] flex flex-col items-center">
        <span className="text-2xl">🕯️</span>
        <span className="mt-0.5 text-[8px] tracking-widest text-amber-200/70">ZEN</span>
      </div>
      <div className="absolute right-1 top-[34%] flex flex-col items-center">
        <span className="text-xl">🌿</span>
      </div>
      <div className="absolute left-2 top-[50%] flex flex-col items-center">
        <span className="text-2xl">🪴</span>
      </div>
      <div className="absolute right-1 top-[62%] flex flex-col items-center">
        <span className="text-xl">🕯️</span>
      </div>
      <div className="absolute left-1 top-[76%] flex flex-col items-center">
        <span className="text-lg">☕</span>
      </div>
      <div className="absolute right-2 top-[85%] text-lg">🌸</div>
      {/* Quote */}
      <div className="absolute right-2 top-[10%] max-w-[80px] -rotate-[4deg] font-serif text-[9px] italic leading-tight text-amber-100/70">
        "tu casa, tu calma"
      </div>
    </div>
  );
}

function AudioAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-0 top-[20%] flex h-20 items-end gap-0.5 opacity-50">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="eq-bar w-1 rounded-full" style={{ height: `${30 + i * 7}%`, background: i % 2 ? theme.accent : theme.accent2, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <div className="absolute right-0 top-[55%] flex h-20 items-end gap-0.5 opacity-50">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="eq-bar w-1 rounded-full" style={{ height: `${20 + ((i * 13) % 70)}%`, background: i % 2 ? theme.accent2 : theme.accent, animationDelay: `${i * 0.13}s` }} />
        ))}
      </div>
      <div className="absolute right-2 top-[15%] text-2xl opacity-60">♪</div>
      <div className="absolute left-2 top-[78%] text-2xl opacity-60">♫</div>
    </div>
  );
}

function BellezaAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 pat-sparkle opacity-30`} style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute left-1 top-[20%] text-2xl">✨</div>
      <div className="absolute right-2 top-[30%] text-xl">💗</div>
      <div className="absolute left-2 top-[45%] text-xl">🌷</div>
      <div className="absolute right-1 top-[58%] text-2xl">✨</div>
      <div className="absolute left-1 top-[72%] text-xl">🌸</div>
      <div className="absolute right-2 top-[85%] text-xl">💄</div>
    </div>
  );
}

function GymAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 pat-scan opacity-30`} style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute left-0 top-[18%] -rotate-90 origin-top-left translate-y-12 font-bebas text-3xl tracking-widest opacity-30" style={{ color: theme.accent }}>NO PAIN</div>
      <div className="absolute right-0 top-[55%] rotate-90 origin-top-right -translate-y-2 font-bebas text-3xl tracking-widest opacity-30" style={{ color: theme.accent }}>NO GAIN</div>
      <div className="absolute left-2 top-[35%] text-xl">🏋️</div>
      <div className="absolute right-2 top-[70%] text-xl">💪</div>
    </div>
  );
}

function JoyeriaAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 pat-shine opacity-40" style={{ ["--pat-color" as never]: `${theme.accent}55` }} />
      <div className="absolute left-1 top-[20%] text-xl opacity-80">✦</div>
      <div className="absolute right-2 top-[35%] text-2xl opacity-80">✧</div>
      <div className="absolute left-2 top-[55%] text-xl opacity-80">✦</div>
      <div className="absolute right-1 top-[72%] text-2xl opacity-80">✧</div>
      <div className="absolute right-2 top-[12%] max-w-[90px] font-serif text-[10px] italic leading-tight" style={{ color: theme.accent }}>
        "Para siempre"
      </div>
    </div>
  );
}

function GamerAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1 top-[18%] rounded-md border-2 px-1.5 py-0.5 font-mono text-[8px]" style={{ borderColor: theme.accent, color: theme.accent }}>P1 ♥♥♥</div>
      <div className="absolute right-1 top-[30%] rounded-md border-2 px-1.5 py-0.5 font-mono text-[8px]" style={{ borderColor: theme.accent2, color: theme.accent2 }}>x99</div>
      <div className="absolute left-2 top-[50%] font-mono text-[8px]" style={{ color: theme.accent }}>{">_"} READY</div>
      <div className="absolute right-2 top-[68%] text-xl">🕹️</div>
      <div className="absolute left-1 top-[80%] font-mono text-[8px]" style={{ color: theme.accent2 }}>1UP</div>
    </div>
  );
}

function SmartAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1 top-[22%] rounded-full border px-2 py-0.5 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>● WIFI</div>
      <div className="absolute right-1 top-[35%] rounded-full border px-2 py-0.5 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.4)" }}>● AUTO</div>
      <div className="absolute left-2 top-[55%] rounded-full border px-2 py-0.5 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>● 22°C</div>
      <div className="absolute right-1 top-[72%] rounded-full border px-2 py-0.5 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.4)" }}>● ON</div>
    </div>
  );
}
