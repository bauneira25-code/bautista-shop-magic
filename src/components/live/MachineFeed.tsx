import { Link } from "@tanstack/react-router";
import { Radio, Eye } from "lucide-react";
import type { LiveMachine } from "@/lib/liveMachines";
import { useLiveViewers, formatViewers } from "@/lib/liveViewers";

/**
 * "Cinematic" simulated live feed. Pure CSS/SVG — looks tech, futurista, premium.
 * Animaciones: scan line láser, partículas, pulso de máquina.
 */
export function MachineFeed({
  machine,
  big = false,
}: {
  machine: LiveMachine;
  big?: boolean;
}) {
  const { from, via, to } = machine.hue;
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
        {/* Punto de trabajo (láser / cabezal) */}
        <span
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: to, boxShadow: `0 0 24px 6px ${to}` }}
        />
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

      {/* Humo / niebla */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background: `radial-gradient(60% 60% at 50% 100%, ${via} 0%, transparent 70%)`,
          opacity: 0.5,
          animation: "neibaSmoke 6s ease-in-out infinite",
        }}
      />

      {/* Brazo robótico estilizado */}
      <svg
        className="absolute right-3 top-3 h-10 w-10 opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "neibaArm 4s ease-in-out infinite", transformOrigin: "32px 8px" }}
      >
        <circle cx="32" cy="8" r="3" fill={to} />
        <path d="M32 8 L18 22 L10 30" stroke={to} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="30" r="2.5" fill="#fff" />
      </svg>

      {/* HUD: EN VIVO + viewers */}
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          En vivo
        </span>
      </div>

      {/* Bottom HUD */}
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
        <div>
          <p className="text-[10px] font-mono uppercase opacity-70">CAM · {machine.id.toUpperCase()}-01</p>
          <p className="font-display text-base leading-tight drop-shadow">{machine.emoji} {machine.name}</p>
        </div>
      </div>

      {/* keyframes */}
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
      `}</style>
    </div>
  );
}

export function MachineCard({ machine }: { machine: LiveMachine }) {
  const viewers = useLiveViewers("machine:" + machine.id, 5000);
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
