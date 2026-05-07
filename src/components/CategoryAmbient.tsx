// Immersive ambient world for each category — visible decorations on both sides
// of the product list so the user feels they entered a different universe.
import type { CategoryTheme } from "@/lib/categoryThemes";

export function CategoryAmbient({ theme }: { theme: CategoryTheme }) {
  switch (theme.id) {
    case "tech": return <TechAmbient theme={theme} />;
    case "hogar": return <HogarAmbient theme={theme} />;
    case "belleza": return <BellezaAmbient theme={theme} />;
    case "deporte": return <DeporteAmbient theme={theme} />;
    case "gamer": return <GamerAmbient theme={theme} />;
    case "auto": return <AutoAmbient theme={theme} />;
    case "personalizados": return <PersonalizadosAmbient theme={theme} />;
    case "tendencias": return <TendenciasAmbient theme={theme} />;
    case "todo": return <TodoAmbient theme={theme} />;
    // legacy
    case "audio": return <BellezaAmbient theme={theme} />;
    case "gym": return <DeporteAmbient theme={theme} />;
    case "joyeria": return <PersonalizadosAmbient theme={theme} />;
    case "smart": return <TechAmbient theme={theme} />;
    default: return null;
  }
}

/* =================== TECH — IA / circuitos / código =================== */
function TechAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      {/* full circuit grid background */}
      <div className="absolute inset-0 opacity-[0.18] pat-circuit" style={{ ["--pat-color" as never]: theme.accent }} />
      {/* glowing AI orbs */}
      <div className="absolute -left-20 top-[30%] h-56 w-56 rounded-full opacity-50 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-24 top-[60%] h-60 w-60 rounded-full opacity-40 blur-3xl" style={{ background: theme.accent2 }} />

      {/* Floating chips - LEFT */}
      <div className="absolute left-1 top-[25%] -rotate-[8deg] rounded-md border-2 px-2 py-1 font-mono text-[9px] backdrop-blur shadow-lg" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.6)" }}>
        <div>▷ AI.boot()</div>
        <div className="opacity-70">{">"} loading...</div>
      </div>
      <div className="absolute left-2 top-[48%] rotate-[5deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>
        ●●● LIVE
      </div>
      <div className="absolute left-1 top-[68%] -rotate-[4deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.5)" }}>
        chip-x9 · 5G
      </div>
      <div className="absolute left-2 top-[85%] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>
        ⚡ 240Hz
      </div>

      {/* Floating chips - RIGHT */}
      <div className="absolute right-1 top-[28%] rotate-[6deg] rounded-md border-2 px-2 py-1 font-mono text-[9px] backdrop-blur shadow-lg" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.6)" }}>
        <div>NEURAL</div>
        <div className="opacity-70">v3.1</div>
      </div>
      <div className="absolute right-2 top-[45%] -rotate-[6deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>
        100% UP
      </div>
      <div className="absolute right-1 top-[60%] rotate-[3deg] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.5)" }}>
        BIONIC
      </div>
      <div className="absolute right-2 top-[78%] rounded-md border px-2 py-1 font-mono text-[8px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>
        AR · VR
      </div>

      {/* Vertical scan line */}
      <div className="absolute left-1/2 top-0 h-full w-px opacity-30 ticker" style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}, transparent)` }} />
    </div>
  );
}

/* =================== HOGAR — Zen / velas / plantas =================== */
function HogarAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      {/* warm light beams */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl" style={{ background: theme.accent2 }} />

      {/* LEFT side — candles & nature */}
      <div className="absolute left-1 top-[22%] flex flex-col items-center">
        <span className="text-3xl drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse">🕯️</span>
        <span className="mt-1 font-serif text-[9px] tracking-[0.3em] text-amber-200/80">ZEN</span>
      </div>
      <div className="absolute left-2 top-[40%] text-3xl rotate-[-8deg]">🌿</div>
      <div className="absolute left-1 top-[55%] text-4xl">🪴</div>
      <div className="absolute left-2 top-[72%] flex flex-col items-center">
        <span className="text-2xl">☕</span>
        <span className="mt-0.5 font-serif text-[8px] italic text-amber-100/60">cozy</span>
      </div>
      <div className="absolute left-1 top-[88%] text-2xl">🌸</div>

      {/* RIGHT side — calm & decorative */}
      <div className="absolute right-1 top-[18%] max-w-[100px] -rotate-[3deg] font-serif text-[10px] italic leading-tight text-amber-100/70">
        "tu casa, tu calma"
      </div>
      <div className="absolute right-2 top-[32%] flex flex-col items-center">
        <span className="text-3xl drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" style={{ animationDelay: "0.6s" }}>🕯️</span>
      </div>
      <div className="absolute right-1 top-[48%] text-3xl">🌷</div>
      <div className="absolute right-2 top-[62%] text-2xl">🍃</div>
      <div className="absolute right-1 top-[78%] flex flex-col items-center">
        <span className="text-2xl">🛋️</span>
        <span className="mt-0.5 font-serif text-[8px] italic text-amber-100/60">home</span>
      </div>
      <div className="absolute right-2 top-[92%] text-2xl">🌙</div>
    </div>
  );
}

/* =================== AUDIO — equalizers & beats =================== */
function AudioAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute -left-20 top-[25%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[65%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent2 }} />

      {/* Vertical EQs left */}
      <div className="absolute left-2 top-[20%] flex h-32 items-end gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="eq-bar w-1.5 rounded-full" style={{ height: `${30 + ((i * 23) % 70)}%`, background: i % 2 ? theme.accent : theme.accent2, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <div className="absolute left-2 top-[60%] flex h-32 items-end gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="eq-bar w-1.5 rounded-full" style={{ height: `${20 + ((i * 17) % 75)}%`, background: i % 2 ? theme.accent2 : theme.accent, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      {/* Right */}
      <div className="absolute right-2 top-[35%] flex h-32 items-end gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="eq-bar w-1.5 rounded-full" style={{ height: `${25 + ((i * 19) % 65)}%`, background: i % 2 ? theme.accent : theme.accent2, animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
      <div className="absolute right-2 top-[80%] flex h-24 items-end gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="eq-bar w-1.5 rounded-full" style={{ height: `${20 + ((i * 31) % 70)}%`, background: theme.accent2, animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      {/* Notes */}
      <div className="absolute left-3 top-[45%] text-2xl opacity-70" style={{ color: theme.accent }}>♪</div>
      <div className="absolute right-3 top-[15%] text-3xl opacity-70" style={{ color: theme.accent }}>♫</div>
      <div className="absolute right-4 top-[68%] text-2xl opacity-70" style={{ color: theme.accent2 }}>♩</div>
    </div>
  );
}

/* =================== BELLEZA — sparkles & flowers =================== */
function BellezaAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-40 pat-sparkle" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[20%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[70%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-1 top-[20%] text-3xl animate-pulse">✨</div>
      <div className="absolute left-2 top-[36%] text-2xl">💗</div>
      <div className="absolute left-1 top-[52%] text-3xl">🌷</div>
      <div className="absolute left-2 top-[68%] text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
      <div className="absolute left-1 top-[84%] text-2xl">🌸</div>

      <div className="absolute right-1 top-[15%] text-3xl">💄</div>
      <div className="absolute right-2 top-[32%] text-2xl animate-pulse" style={{ animationDelay: "0.3s" }}>✨</div>
      <div className="absolute right-1 top-[48%] text-2xl">💅</div>
      <div className="absolute right-2 top-[64%] text-3xl">🌺</div>
      <div className="absolute right-1 top-[80%] text-2xl">💗</div>
      <div className="absolute right-2 top-[10%] max-w-[90px] -rotate-[3deg] font-display text-[10px] italic text-pink-200/80">"glow infinito"</div>
    </div>
  );
}

/* =================== GYM — scan / strong text =================== */
function DeporteAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-25 pat-scan" style={{ ["--pat-color" as never]: theme.accent }} />
      {/* Vertical text */}
      <div className="absolute left-2 top-[25%] -rotate-90 origin-top-left translate-y-24 font-bebas text-4xl tracking-widest opacity-40" style={{ color: theme.accent }}>NO PAIN</div>
      <div className="absolute right-2 top-[55%] rotate-90 origin-top-right translate-y-2 font-bebas text-4xl tracking-widest opacity-40" style={{ color: theme.accent }}>NO GAIN</div>
      <div className="absolute left-2 top-[35%] text-3xl">🏋️</div>
      <div className="absolute right-2 top-[28%] text-2xl">💪</div>
      <div className="absolute left-3 top-[65%] text-2xl">🥇</div>
      <div className="absolute right-3 top-[78%] text-3xl">🔥</div>
      <div className="absolute left-2 top-[88%] font-bebas text-2xl tracking-wider" style={{ color: theme.accent2 }}>+24 KG</div>
      <div className="absolute right-2 top-[10%] font-bebas text-xl tracking-wider" style={{ color: theme.accent }}>BEAST</div>
    </div>
  );
}

/* =================== JOYERIA — gold shine =================== */
function PersonalizadosAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 pat-shine opacity-50" style={{ ["--pat-color" as never]: `${theme.accent}77` }} />
      <div className="absolute -left-20 top-[30%] h-48 w-48 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[70%] h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-2 top-[20%] text-3xl opacity-80" style={{ color: theme.accent }}>✦</div>
      <div className="absolute left-1 top-[40%] text-2xl">💍</div>
      <div className="absolute left-2 top-[58%] text-2xl opacity-80" style={{ color: theme.accent }}>✧</div>
      <div className="absolute left-1 top-[78%] text-2xl">💎</div>

      <div className="absolute right-2 top-[15%] max-w-[90px] font-serif text-[11px] italic leading-tight" style={{ color: theme.accent }}>"para siempre"</div>
      <div className="absolute right-1 top-[35%] text-3xl opacity-80" style={{ color: theme.accent }}>✧</div>
      <div className="absolute right-2 top-[52%] text-2xl">💎</div>
      <div className="absolute right-1 top-[70%] text-3xl opacity-80" style={{ color: theme.accent2 }}>✦</div>
      <div className="absolute right-2 top-[88%] text-2xl">💍</div>
    </div>
  );
}

/* =================== GAMER — pixel arcade =================== */
function GamerAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-20 pat-pixels" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute left-1 top-[18%] rounded-md border-2 px-2 py-1 font-mono text-[9px] shadow-lg" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.7)" }}>P1 ♥♥♥</div>
      <div className="absolute left-2 top-[35%] font-mono text-[10px] animate-pulse" style={{ color: theme.accent }}>{">_"} READY</div>
      <div className="absolute left-1 top-[55%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.7)" }}>x99 ⚔</div>
      <div className="absolute left-2 top-[75%] text-2xl">🕹️</div>
      <div className="absolute left-1 top-[90%] font-mono text-[9px]" style={{ color: theme.accent }}>1UP</div>

      <div className="absolute right-1 top-[20%] rounded-md border-2 px-2 py-1 font-mono text-[9px] shadow-lg" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.7)" }}>HI 99,999</div>
      <div className="absolute right-2 top-[40%] font-mono text-[10px]" style={{ color: theme.accent }}>● COMBO x12</div>
      <div className="absolute right-1 top-[58%] text-2xl">🎮</div>
      <div className="absolute right-2 top-[75%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.7)" }}>RGB ⚡</div>
      <div className="absolute right-1 top-[92%] font-mono text-[9px] animate-pulse" style={{ color: theme.accent2 }}>BOSS</div>
    </div>
  );
}

/* =================== SMART — connected nodes =================== */
function SmartAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-15 pat-grid" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[40%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[20%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-1 top-[22%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur shadow" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>● WIFI</div>
      <div className="absolute left-2 top-[40%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>● 22°C</div>
      <div className="absolute left-1 top-[58%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.5)" }}>● ALEXA</div>
      <div className="absolute left-2 top-[78%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>● ON</div>

      <div className="absolute right-1 top-[28%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.5)" }}>● AUTO</div>
      <div className="absolute right-2 top-[48%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent}66`, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>● CAM 4K</div>
      <div className="absolute right-1 top-[68%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur shadow" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.5)" }}>● LIGHTS</div>
      <div className="absolute right-2 top-[88%] rounded-full border px-2.5 py-1 font-mono text-[9px] backdrop-blur" style={{ borderColor: `${theme.accent2}66`, color: theme.accent2, background: "rgba(0,0,0,0.5)" }}>● LOCK</div>
    </div>
  );
}

/* =================== AUTO — racing / metal =================== */
function AutoAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-25 pat-scan" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[30%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-24 top-[65%] h-60 w-60 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-2 top-[18%] -rotate-90 origin-top-left translate-y-24 font-bebas text-4xl tracking-widest opacity-50" style={{ color: theme.accent }}>TURBO</div>
      <div className="absolute right-2 top-[55%] rotate-90 origin-top-right translate-y-2 font-bebas text-4xl tracking-widest opacity-50" style={{ color: theme.accent }}>POWER</div>

      <div className="absolute left-1 top-[28%] text-3xl">🚗</div>
      <div className="absolute left-2 top-[48%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.7)" }}>12V · USB</div>
      <div className="absolute left-1 top-[70%] text-2xl">⚡</div>
      <div className="absolute left-2 top-[88%] font-bebas text-2xl tracking-wider" style={{ color: theme.accent2 }}>4WD</div>

      <div className="absolute right-1 top-[20%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.7)" }}>RPM 8K</div>
      <div className="absolute right-2 top-[38%] text-3xl">🏁</div>
      <div className="absolute right-1 top-[60%] text-2xl">🔧</div>
      <div className="absolute right-2 top-[82%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.7)" }}>RACING</div>
    </div>
  );
}

/* =================== PERSONALIZADOS — creative / mockups =================== */
function PersonalizadosAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-30 pat-dots" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[25%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[65%] h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-1 top-[18%] text-3xl">🎨</div>
      <div className="absolute left-2 top-[35%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.6)" }}>+ TEXTO</div>
      <div className="absolute left-1 top-[52%] text-3xl">🖼️</div>
      <div className="absolute left-2 top-[70%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.6)" }}>SUBIR FOTO</div>
      <div className="absolute left-1 top-[88%] text-2xl">✏️</div>

      <div className="absolute right-1 top-[15%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.6)" }}>PREVIEW</div>
      <div className="absolute right-2 top-[34%] text-3xl">👕</div>
      <div className="absolute right-1 top-[52%] text-2xl">☕</div>
      <div className="absolute right-2 top-[70%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.6)" }}>IA · STYLE</div>
      <div className="absolute right-1 top-[88%] text-2xl">🎁</div>
    </div>
  );
}

/* =================== TENDENCIAS — viral fire =================== */
function TendenciasAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-25 pat-waves" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[20%] h-56 w-56 rounded-full opacity-40 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[70%] h-56 w-56 rounded-full opacity-40 blur-3xl" style={{ background: theme.accent2 }} />

      <div className="absolute left-1 top-[18%] text-4xl animate-pulse">🔥</div>
      <div className="absolute left-2 top-[36%] rounded-md border-2 px-2 py-1 font-mono text-[9px] animate-pulse" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.6)" }}>● VIRAL</div>
      <div className="absolute left-1 top-[55%] text-3xl">📈</div>
      <div className="absolute left-2 top-[72%] font-bebas text-2xl tracking-wider" style={{ color: theme.accent }}>+982%</div>
      <div className="absolute left-1 top-[88%] text-3xl animate-pulse" style={{ animationDelay: "0.4s" }}>🔥</div>

      <div className="absolute right-1 top-[15%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent2, color: theme.accent2, background: "rgba(0,0,0,0.6)" }}>TIKTOK</div>
      <div className="absolute right-2 top-[33%] text-3xl">⚡</div>
      <div className="absolute right-1 top-[52%] text-3xl animate-pulse" style={{ animationDelay: "0.8s" }}>🔥</div>
      <div className="absolute right-2 top-[70%] rounded-md border-2 px-2 py-1 font-mono text-[9px]" style={{ borderColor: theme.accent, color: theme.accent, background: "rgba(0,0,0,0.6)" }}>HYPE</div>
      <div className="absolute right-1 top-[88%] text-2xl">🚀</div>
    </div>
  );
}

/* =================== TODO — general sparkle =================== */
function TodoAmbient({ theme }: { theme: CategoryTheme }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[480px] overflow-hidden">
      <div className="absolute inset-0 opacity-25 pat-sparkle" style={{ ["--pat-color" as never]: theme.accent }} />
      <div className="absolute -left-20 top-[30%] h-56 w-56 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent }} />
      <div className="absolute -right-20 top-[60%] h-56 w-56 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent2 }} />
      <div className="absolute left-2 top-[20%] text-3xl animate-pulse">✨</div>
      <div className="absolute right-2 top-[40%] text-3xl">🌟</div>
      <div className="absolute left-2 top-[60%] text-3xl">💫</div>
      <div className="absolute right-2 top-[80%] text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
    </div>
  );
}
