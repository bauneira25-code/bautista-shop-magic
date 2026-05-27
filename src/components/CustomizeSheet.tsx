import { useRef, useState } from "react";
import { X, Upload, Type, Image as ImageIcon, Check } from "lucide-react";
import type { MockProduct } from "@/lib/mockData";
import { toast } from "sonner";

interface Props {
  product: MockProduct;
  open: boolean;
  onClose: () => void;
}

export function CustomizeSheet({ product, open, onClose }: Props) {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [imageData, setImageData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(f);
  };

  const save = () => {
    toast.success("Personalización guardada ✨", {
      description: text ? `Texto: "${text}"` : "Lista para agregar al carrito",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-[480px] rounded-t-3xl bg-white p-4 pb-6 shadow-2xl"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" />
        <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-neutral-100">
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
        <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl" style={{ background: product.gradient }}>
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
                className={`h-6 w-6 rounded-full border-2 ${textColor === c ? "border-fuchsia-600 scale-110" : "border-neutral-200"}`}
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

        {/* Guardar */}
        <button
          onClick={save}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 py-3.5 text-sm font-black text-white shadow-lg"
        >
          <Check className="h-4 w-4" /> Guardar personalización
        </button>
        <p className="mt-2 text-center text-[10px] text-neutral-400">
          Esto es una vista previa. Lo aplicamos cuando confirmes el pedido.
        </p>
      </div>
    </div>
  );
}
