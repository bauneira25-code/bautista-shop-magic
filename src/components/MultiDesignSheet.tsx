import { useRef, useState } from "react";
import { X, Type, Upload, Plus, Check, Flame } from "lucide-react";
import { toast } from "sonner";
import { QtyInput } from "./QtyInput";

export interface DesignData {
  text?: string;
  imageName?: string;
  imageData?: string;
  units: number;
}

interface Props {
  productTitle: string;
  productEmoji: string;
  productGradient: string;
  totalUnits: number;
  onClose: () => void;
  /** Called once per "Añadir" tap with the design + how many units it covers. */
  onDesignAdded: (design: DesignData, index: number) => void;
  /** Called after the last design is added. Use to navigate to resumen / carrito. */
  onAllDone: () => void;
  finalCtaLabel?: string;
}

const ORANGE = "#e8451c";

export function MultiDesignSheet({
  productTitle,
  productEmoji,
  productGradient,
  totalUnits,
  onClose,
  onDesignAdded,
  onAllDone,
  finalCtaLabel = "AÑADIR Y VER RESUMEN",
}: Props) {
  const multi = totalUnits >= 2;
  const [phase, setPhase] = useState<"count" | "edit">(multi ? "count" : "edit");
  const [numDesigns, setNumDesigns] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [text, setText] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const designsCount = multi ? numDesigns : 1;
  const baseUnits = Math.floor(totalUnits / designsCount);
  const remainder = totalUnits - baseUnits * designsCount;
  const unitsForCurrent = baseUnits + (currentIdx < remainder ? 1 : 0);

  const reset = () => {
    setText("");
    setImageName(null);
    setImageData(null);
  };

  const handlePick = (file?: File) => {
    if (!file) return;
    setImageName(file.name);
    const r = new FileReader();
    r.onload = () => setImageData(typeof r.result === "string" ? r.result : null);
    r.readAsDataURL(file);
  };

  const lastDesignRef = useRef<DesignData | null>(null);
  const [askReuse, setAskReuse] = useState(false);

  const pushDesign = (d: DesignData, idx: number) => {
    onDesignAdded(d, idx);
    lastDesignRef.current = d;
  };

  const addDesign = () => {
    const design: DesignData = {
      text: text || undefined,
      imageName: imageName ?? undefined,
      imageData: imageData ?? undefined,
      units: unitsForCurrent,
    };
    pushDesign(design, currentIdx);
    if (currentIdx + 1 >= designsCount) {
      onAllDone();
    } else {
      toast.success(`Diseño ${currentIdx + 1} añadido al resumen ✨`, {
        description: `${unitsForCurrent} unidad${unitsForCurrent > 1 ? "es" : ""}`,
      });
      setCurrentIdx(currentIdx + 1);
      reset();
      setAskReuse(true);
    }
  };

  const reuseLast = () => {
    const prev = lastDesignRef.current;
    if (!prev) {
      setAskReuse(false);
      return;
    }
    const design: DesignData = { ...prev, units: unitsForCurrent };
    pushDesign(design, currentIdx);
    if (currentIdx + 1 >= designsCount) {
      setAskReuse(false);
      onAllDone();
    } else {
      toast.success(`Diseño ${currentIdx + 1} añadido (mismo diseño) ✨`);
      setCurrentIdx(currentIdx + 1);
      // keep askReuse true so they can chain reuse for next ones too
    }
  };

  const designOptions = Array.from({ length: Math.min(totalUnits, 12) }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] border-t border-orange-100 bg-white p-5 pb-8 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl text-neutral-900">
              {phase === "count"
                ? `Personalizar ${totalUnits} unidades`
                : `Diseño ${currentIdx + 1} de ${designsCount}`}
            </h3>
            <p className="text-xs text-neutral-500">
              {phase === "count"
                ? "¿Cuántos querés diseñar?"
                : `${unitsForCurrent} unidad${unitsForCurrent > 1 ? "es" : ""} con este diseño`}
            </p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {phase === "count" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {designOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumDesigns(n)}
                  className={`rounded-xl border py-3 text-sm font-bold transition ${
                    numDesigns === n
                      ? "border-[#e8451c] bg-[#e8451c] text-white"
                      : "border-orange-200 bg-white text-neutral-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                O escribilo (1 - {totalUnits})
              </label>
              <QtyInput
                value={numDesigns}
                onChange={setNumDesigns}
                min={1}
                max={totalUnits}
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-[11px] text-neutral-700">
              Vas a diseñar <b>{numDesigns}</b> {numDesigns === 1 ? "modelo" : "modelos distintos"} para tus{" "}
              <b>{totalUnits}</b> unidades. Después de cada diseño tocás <b>Añadir</b> y se suma al resumen.
            </div>
            <button
              onClick={() => setPhase("edit")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8451c] py-3.5 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              <Flame className="h-4 w-4" /> EMPEZAR A DISEÑAR
            </button>
          </div>
        )}

        {phase === "edit" && (
          <div className="space-y-4">
            {designsCount > 1 && (
              <div className="flex gap-1">
                {Array.from({ length: designsCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= currentIdx ? "bg-[#e8451c]" : "bg-orange-100"
                    }`}
                  />
                ))}
              </div>
            )}

            {askReuse && lastDesignRef.current && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3">
                <p className="mb-2 text-xs font-semibold text-neutral-800">
                  ¿Querés que el diseño {currentIdx + 1} sea igual al anterior?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={reuseLast}
                    className="flex-1 rounded-lg bg-[#e8451c] py-2 text-xs font-black text-white"
                  >
                    SÍ, MISMO DISEÑO
                  </button>
                  <button
                    onClick={() => setAskReuse(false)}
                    className="flex-1 rounded-lg border border-orange-300 bg-white py-2 text-xs font-bold text-neutral-700"
                  >
                    NO, DISEÑAR NUEVO
                  </button>
                </div>
              </div>
            )}

            <div
              className="relative grid h-44 place-items-center overflow-hidden rounded-3xl"
              style={{ background: productGradient }}
            >
              {imageData ? (
                <img
                  src={imageData}
                  alt="custom"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
              ) : (
                <span className="text-7xl drop-shadow-2xl">{productEmoji}</span>
              )}
              {text && (
                <span className="absolute bottom-4 z-10 rounded-xl bg-black/70 px-3 py-1 font-display text-lg font-black text-white">
                  {text}
                </span>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                {productTitle}
              </span>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <Type className="h-3 w-3" /> Texto / nombre
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 20))}
                placeholder="Tu nombre, frase…"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8451c]"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <Upload className="h-3 w-3" /> Imagen / logo
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handlePick(e.target.files?.[0])}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 py-3 text-xs"
              >
                🖼 {imageName ?? "Subir imagen / logo"}
              </button>
            </div>

            <button
              onClick={addDesign}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8451c] py-3.5 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
            >
              {currentIdx + 1 >= designsCount ? (
                <>
                  <Check className="h-4 w-4" /> {finalCtaLabel}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> AÑADIR Y SIGUIENTE DISEÑO
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-neutral-400">
              {currentIdx + 1 >= designsCount
                ? "Es el último diseño. Lo añadimos al resumen."
                : `Faltan ${designsCount - currentIdx - 1} diseño${
                    designsCount - currentIdx - 1 === 1 ? "" : "s"
                  } por diseñar.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
