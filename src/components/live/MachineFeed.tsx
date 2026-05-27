import { Link } from "@tanstack/react-router";
import { Radio, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { LiveMachine } from "@/lib/liveMachines";
import { useMachineViewers, formatViewers } from "@/lib/liveViewers";

function useTimecode() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const ss = String(t.getSeconds()).padStart(2, "0");
  const ff = String(Math.floor((t.getMilliseconds() / 1000) * 30)).padStart(2, "0");
  return `${hh}:${mm}:${ss}:${ff}`;
}

/**
 * Cámara HD simulada — look "broadcast": HUD con REC, timecode, resolución,
 * crosshair, vignette de lente, scanlines y grano. Mantiene la animación
 * cinematográfica del láser/pieza/brazo.
 */
export function MachineFeed({
  machine,
  big = false,
}: {
  machine: LiveMachine;
  big?: boolean;
}) {
  const { from, via, to } = machine.hue;
  const tc = useTimecode();
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: big ? "16 / 10" : "16 / 11",
        background: `radial-gradient(120% 80% at 30% 20%, ${via} 0%, ${from} 60%, #000 100%)`,
      }}
    >
      {/* Grid tecnológica */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(120% 80% at 50% 50%, #000 35%, transparent 80%)",
        }}
      />

      {/* Núcleo / pieza siendo trabajada */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative h-24 w-24 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, #e7e5e4 0%, #a8a29e 100%)`,
            boxShadow: `0 0 80px ${to}, inset 0 0 24px rgba(0,0,0,0.4)`,
            animation: "neibaPulse 2.4s ease-in-out infinite",
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: to, boxShadow: `0 0 24px 6px ${to}` }}
        />
      </div>

      {/* Crosshair de cámara */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-70">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />
        <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute inset-0 border border-white/30 rounded-sm" />
      </div>

      {/* Haz láser / barrido */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 49%, ${to} 50%, transparent 51%)`,
          opacity: 0.55,
          animation: "neibaScan 3.2s linear infinite",
        }}
      />

      {/* Humo */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background: `radial-gradient(60% 60% at 50% 100%, ${via} 0%, transparent 70%)`,
          opacity: 0.5,
          animation: "neibaSmoke 6s ease-in-out infinite",
        }}
      />

      {/* Brazo robótico */}
      <svg
        className="absolute right-3 top-10 h-10 w-10 opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "neibaArm 4s ease-in-out infinite", transformOrigin: "32px 8px" }}
      >
        <circle cx="32" cy="8" r="3" fill={to} />
        <path d="M32 8 L18 22 L10 30" stroke={to} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="30" r="2.5" fill="#fff" />
      </svg>

      {/* Scanlines HD */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Grano / noise sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
          animation: "neibaNoise 0.6s steps(2) infinite",
        }}
      />

      {/* Vignette de lente */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* HUD top-left: REC + timecode */}
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          REC
        </span>
        <span className="rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur">
          {tc}
        </span>
      </div>

      {/* HUD top-right: resolución + señal */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <span className="rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white/90 backdrop-blur">
          HD · 1080p
        </span>
        <span className="flex items-end gap-[2px] rounded-md bg-black/50 px-1.5 py-1 backdrop-blur">
          <span className="h-1 w-[2px] bg-white/80" />
          <span className="h-1.5 w-[2px] bg-white/80" />
          <span className="h-2 w-[2px] bg-white/80" />
          <span className="h-2.5 w-[2px] bg-white animate-pulse" />
        </span>
      </div>

      {/* Bottom HUD */}
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
        <div>
          <p className="text-[10px] font-mono uppercase opacity-80">CAM · {machine.id.toUpperCase()}-01 · LIVE</p>
          <p className="font-display text-base leading-tight drop-shadow">{machine.emoji} {machine.name}</p>
        </div>
        <span className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur">
          f/2.8 · ISO 400
        </span>
      </div>

      <style>{`
        @keyframes neibaScan {
          0% { transform: translateY(-60%); }
          100% { transform: translateY(60%); }
        }
        @keyframes neibaPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.25); }
        }
        @keyframes neibaSmoke {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.45; }
          50% { transform: translateY(-6px) scale(1.05); opacity: 0.6; }
        }
        @keyframes neibaArm {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes neibaNoise {
          0% { transform: translate(0,0); }
          25% { transform: translate(-2px,1px); }
          50% { transform: translate(1px,-2px); }
          75% { transform: translate(-1px,2px); }
          100% { transform: translate(2px,1px); }
        }
      `}</style>
    </div>
  );
}

export function MachineCard({ machine }: { machine: LiveMachine }) {
  const viewers = useMachineViewers(machine.id, 5000);
  return (
    <Link
      to="/en-vivo/$machineId"
      params={{ machineId: machine.id }}
      className="block overflow-hidden rounded-3xl border border-border bg-card transition active:scale-[0.99]"
    >
      <MachineFeed machine={machine} />
      <div className="space-y-1 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">{machine.emoji} {machine.name}</h3>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {formatViewers(viewers)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{machine.short}</p>
      </div>
    </Link>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
      <Radio className="h-3 w-3 animate-pulse" /> En vivo
    </span>
  );
}
