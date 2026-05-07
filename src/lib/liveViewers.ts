// Live viewers: rota entre 3.000 y 18.000 según día/hora.
// Picos los fines de semana y en franjas de uso intensivo del teléfono
// (almuerzo, después del trabajo y noche). Día de semana = más regulado.
import { useEffect, useState } from "react";

const MIN = 3000;
const MAX = 18000;

// curva por hora (0-23) — peso 0..1 (uso de teléfono típico AR)
const HOUR_CURVE = [
  0.18, 0.12, 0.08, 0.06, 0.05, 0.05, 0.08, 0.18, // 0-7
  0.32, 0.42, 0.5, 0.58, 0.7, 0.65, 0.55, 0.52,   // 8-15
  0.6, 0.72, 0.85, 0.92, 0.98, 0.95, 0.78, 0.45,  // 16-23
];

// multiplicador por día (0=domingo .. 6=sábado)
const DAY_MULT = [1.18, 0.78, 0.8, 0.82, 0.88, 1.05, 1.25];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function computeLiveViewers(seed = "global", now = new Date()) {
  const hour = now.getHours();
  const day = now.getDay();
  const minute = now.getMinutes();
  // interpolación entre la hora actual y la siguiente, suaviza la curva
  const h0 = HOUR_CURVE[hour];
  const h1 = HOUR_CURVE[(hour + 1) % 24];
  const t = minute / 60;
  const hourWeight = h0 + (h1 - h0) * t;

  const dayWeight = DAY_MULT[day];
  let base = MIN + (MAX - MIN) * hourWeight * dayWeight;

  // micro-oscilación cada ~10s, determinista por seed + bucket
  const bucket = Math.floor(Date.now() / 10000);
  const noise = ((hashStr(seed + ":" + bucket) % 1000) / 1000 - 0.5) * 1200;
  base += noise;

  // bias por seed (para que cada categoría no muestre el mismo número)
  const bias = ((hashStr(seed) % 1000) / 1000 - 0.5) * 1500;
  base += bias;

  return Math.max(MIN, Math.min(MAX, Math.round(base)));
}

export function useLiveViewers(seed = "global", intervalMs = 4000) {
  // Inicia en MIN para evitar mismatch de hidratación (server vs client time)
  const [n, setN] = useState<number>(MIN);
  useEffect(() => {
    setN(computeLiveViewers(seed));
    const id = setInterval(() => setN(computeLiveViewers(seed)), intervalMs);
    return () => clearInterval(id);
  }, [seed, intervalMs]);
  return n;
}

export const formatViewers = (n: number) => n.toLocaleString("es-AR");
