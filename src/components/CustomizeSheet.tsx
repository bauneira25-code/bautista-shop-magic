import { useEffect, useRef, useState } from "react";
import { X, Upload, Type, Image as ImageIcon, Check, Minus, Plus } from "lucide-react";
import { formatARS, type MockProduct } from "@/lib/mockData";
import { toast } from "sonner";

interface Props {
  product: MockProduct;
  open: boolean;
  onClose: () => void;
  totalQty?: number;
  initialCustomQty?: number;
  onSave?: (customQty: number) => void;
}

export function CustomizeSheet({
  product,
  open,
  onClose,
  totalQty = 1,
  initialCustomQty = 0,
  onSave,
}: Props) {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [imageData, setImageData] = useState<string | null>(null);
  const [customQty, setCustomQty] = useState(initialCustomQty || Math.min(totalQty, 1));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCustomQty((q) => {
        const init = initialCustomQty || q || Math.min(totalQty, 1);
        return Math.min(Math.max(init, 1), Math.max(totalQty, 1));
      });
    }
  }, [open, totalQty, initialCustomQty]);

  if (!open) return null;

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(f);
  };

  const fee = product.customizationFee ?? 0;
  const clampedQty = Math.min(Math.max(customQty, 1), Math.max(totalQty, 1));
  const customCost = fee * clampedQty;
  const nonCustom = Math.max(totalQty - clampedQty, 0);

  const save = () => {
    onSave?.(clampedQty);
    toast.success("Personalización guardada ✨", {
      description:
        fee > 0
          ? `${clampedQty} personalizadas · +${formatARS(customCost)}`
          : `${clampedQty} personalizadas`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-t-3xl bg-white p-4 pb-6 shadow-2xl"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-neutral-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-fuchsia-100 text-fuchsia-600">✨</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-600">Personalizar</p>
            <h2 className="font-display text-lg leading-tight">{product.title}</h2>
          </div>
        </div>

        {/* Preview */}
        <div
          className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl"
          style={{ background: product.gradient }}
        >
          <div className="absolute inset-0 grid place-items-center text-[8rem]">{product.emoji}</div>
          {imageData && (
            <img
              src={imageData}
              alt="overlay"
              className="absolute left-1/2 top-[18%] h-24 w-24 -translate-x-1/2 rounded-xl object-cover shadow-lg"
            />
          )}
          {text && (
            <p
              className="absolute bottom-6 left-0 right-0 text-center font-display text-2xl font-black drop-shadow-lg"
              style={{ color: textColor }}
            >
              {text}
            </p>
          )}
        </div>

        {/* Texto */}
        <div className="mt-4">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <Type className="h-3 w-3" /> Tu texto
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 24))}
            placeholder="Ej: Mica 💜"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-fuchsia-500 focus:outline-none"
            maxLength={24}
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-neutral-500">Color:</span>
            {["#ffffff", "#000000", "#e8451c", "#facc15", "#22c55e", "#ec4899"].map((c) => (
              <button
                key={c}
                onClick={() => setTextColor(c)}
                className={`h-6 w-6 rounded-full border-2 ${
                  textColor === c ? "border-fuchsia-600 scale-110" : "border-neutral-200"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Imagen */}
        <div className="mt-4">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <ImageIcon className="h-3 w-3" /> Tu imagen / logo
          </label>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} className="hidden" />
          <div className="mt-1.5 flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 py-3 text-xs font-bold text-neutral-600"
            >
              <Upload className="h-4 w-4" /> {imageData ? "Cambiar imagen" : "Subir imagen"}
            </button>
            {imageData && (
              <button
                onClick={() => setImageData(null)}
                className="rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-600"
              >
                Quitar
              </button>
            )}
          </div>
        </div>

        {/* Cuántas personalizar */}
        <div className="mt-4 rounded-2xl border-2 border-fuchsia-200 bg-fuchsia-50/60 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-700">
            ¿Cuántas querés personalizadas?
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-600">
            Estás comprando <b>{totalQty}</b> {totalQty === 1 ? "unidad" : "unidades"}. Elegí cuántas llevan tu diseño.
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={() => setCustomQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-10 place-items-center rounded-full bg-white border border-fuchsia-200"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="font-display text-2xl text-fuchsia-700 leading-none">{clampedQty}</p>
              <p className="text-[9px] uppercase tracking-wider text-neutral-500">personalizadas</p>
            </div>
            <button
              onClick={() => setCustomQty((q) => Math.min(totalQty, q + 1))}
              className="grid h-10 w-10 place-items-center rounded-full bg-fuchsia-600 text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[
              { l: "Todas", v: totalQty },
              { l: "La mitad", v: Math.max(1, Math.round(totalQty / 2)) },
              { l: "Solo 1", v: 1 },
            ].map((p) => (
              <button
                key={p.l}
                onClick={() => setCustomQty(p.v)}
                className="flex-1 rounded-lg border border-fuchsia-200 bg-white py-1.5 text-[10px] font-bold text-fuchsia-700"
              >
                {p.l}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-white/70 px-2.5 py-1.5 text-[11px] text-neutral-700">
            Resumen: <b>{totalQty}</b> en total · <b className="text-fuchsia-700">{clampedQty} personalizadas</b> · {nonCustom} sin personalizar
          </p>
        </div>

        {/* Resumen de costo */}
        <div className="mt-4 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600">Precio del producto</span>
            <span className="font-bold">{formatARS(product.price.individual)} c/u</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-fuchsia-700">
              Personalización ({clampedQty} × {formatARS(fee)})
              {product.sellerKind === "importer" && (
                <span className="ml-1 text-[9px] text-neutral-500">(del importador)</span>
              )}
            </span>
            <span className="font-bold text-fuchsia-700">
              {fee > 0 ? `+ ${formatARS(customCost)}` : "Sin costo extra"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-fuchsia-200 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Costo extra total
            </span>
            <span className="font-display text-base text-fuchsia-700">+{formatARS(customCost)}</span>
          </div>
        </div>

        {/* Guardar */}
        <button
          onClick={save}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 py-3.5 text-sm font-black text-white shadow-lg"
        >
          <Check className="h-4 w-4" /> Guardar personalización
        </button>
        <p className="mt-2 text-center text-[10px] text-neutral-400">
          Lo aplicamos al confirmar la compra. El costo se suma al total.
        </p>
      </div>
    </div>
  );
}
