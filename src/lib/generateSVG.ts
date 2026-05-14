// Genera un SVG 200mm x 200mm listo para abrir en LightBurn / RDWorks.
// Usa unidades en mm. Texto centrado en (cx, cy) con rotación.

export interface DesignSpec {
  text: string;
  color: string;       // hex
  font: string;        // "Bebas Neue" | "Arial Bold" | "Fraunces" | "Impact"
  size: number;        // px del editor (24-80)
  rotationDeg: number; // -45 a 45
  posX: number;        // 0-200 (px en preview de 200x200)
  posY: number;        // 0-200
}

export function generateSVG(d: DesignSpec): string {
  // Mapeamos px del editor (200x200) a mm reales (200x200) 1:1.
  const cx = clamp(d.posX, 0, 200);
  const cy = clamp(d.posY, 0, 200);
  // El size del editor (24-80px) lo llevamos a mm con factor ~0.35
  const fontSizeMm = Math.max(4, d.size * 0.35).toFixed(2);
  const safeText = escapeXml(d.text || "");
  const color = sanitizeHex(d.color);
  const font = escapeXml(d.font);
  const rot = clamp(d.rotationDeg, -180, 180);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="200mm" height="200mm" viewBox="0 0 200 200"
     version="1.1">
  <title>NEIBA design</title>
  <desc>text="${safeText}" color="${color}" font="${font}" size=${fontSizeMm}mm rotation=${rot}deg</desc>
  <g transform="translate(${cx} ${cy}) rotate(${rot})">
    <text x="0" y="0"
      font-family="${font}, sans-serif"
      font-size="${fontSizeMm}"
      font-weight="700"
      fill="${color}"
      text-anchor="middle"
      dominant-baseline="middle">${safeText}</text>
  </g>
</svg>`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeHex(c: string) {
  return /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : "#000000";
}

export function downloadSVG(filename: string, svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
