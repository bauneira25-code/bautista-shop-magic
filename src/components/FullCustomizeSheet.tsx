import { useRef } from "react";
import { X, Type, Upload, Palette, Check, Flame } from "lucide-react";

interface Props {
  productTitle: string;
  productEmoji: string;
  productGradient: string;
  text: string;
  setText: (s: string) => void;
  imageName: string | null;
  imageData?: string | null;
  onPickImage: (file: File | undefined) => void;
  colors?: string[];
  selectedColor?: string;
  onSelectColor?: (c: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  ctaLabel?: string;
}

const FALLBACK_COLORS = ["#000000", "#ffffff", "#e8451c", "#7c3aed", "#ec4899", "#10b981", "#3b82f6", "#f59e0b"];

export function FullCustomizeSheet({
  productTitle, productEmoji, productGradient,
  text, setText, imageName, imageData, onPickImage,
  colors, selectedColor, onSelectColor,
  onClose, onConfirm, ctaLabel = "GUARDAR DISEÑO",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const palette = colors && colors.length ? colors : FALLBACK_COLORS;

  return (
    <div className="fixed inset-0 z-[80] bg-white">
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black text-[#e8451c]">
            <Flame className="h-3 w-3" /> PERSONALIZAR
          </div>
          <button onClick={onConfirm} className="rounded-full bg-[#e8451c] px-3 py-1.5 text-[11px] font-black text-white">
            <Check className="mr-1 inline h-3 w-3" /> LISTO
          </button>
        </header>

        <div className="flex-1 overflow-y-auto pb-32">
          {/* Big preview */}
          <div className="relative grid aspect-square w-full place-items-center overflow-hidden" style={{ background: productGradient }}>
            {imageData ? (
              <img src={imageData} alt="custom" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            ) : (
              <span className="text-[10rem] drop-shadow-2xl">{productEmoji}</span>
            )}
            {text && (
              <span className="absolute bottom-8 z-10 rounded-2xl bg-black/70 px-5 py-2 font-display text-3xl font-black text-white drop-shadow-lg">
                {text}
              </span>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              {productTitle}
            </span>
            {selectedColor && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                <span className="h-3 w-3 rounded-full border border-white/60" style={{ background: selectedColor }} /> Color
              </span>
            )}
          </div>

          <div className="space-y-5 px-4 pt-5">
            {/* Texto */}
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <Type className="h-3.5 w-3.5" /> Texto / nombre
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 24))}
                placeholder="Tu nombre, frase, marca…"
                className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8451c]"
              />
              <p className="mt-1 text-[10px] text-neutral-400">{text.length}/24 caracteres</p>
            </div>

            {/* Imagen */}
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <Upload className="h-3.5 w-3.5" /> Imagen / logo
              </label>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPickImage(e.target.files?.[0])} />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 py-5 text-xs font-semibold text-neutral-700"
              >
                🖼 {imageName ?? "Subir / pegar imagen"}
              </button>
            </div>

            {/* Color */}
            {onSelectColor && (
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <Palette className="h-3.5 w-3.5" /> Color del producto
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {palette.map((c) => (
                    <button
                      key={c}
                      onClick={() => onSelectColor(c)}
                      className={`h-10 w-10 rounded-full border-2 transition ${selectedColor === c ? "border-[#e8451c] scale-110 shadow-lg" : "border-neutral-200"}`}
                      style={{ background: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 border-t border-orange-100 bg-white p-3">
          <button
            onClick={onConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8451c] py-4 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
          >
            <Check className="h-4 w-4" /> {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
