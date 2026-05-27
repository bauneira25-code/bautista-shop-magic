import { useEffect, useRef, useState } from "react";
import { X, Send, ShieldCheck, Paperclip } from "lucide-react";
import type { MockProduct } from "@/lib/mockData";

interface Props {
  product: MockProduct;
  open: boolean;
  onClose: () => void;
}

type Msg = { from: "imp" | "me"; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function ImporterChat({ product, open, onClose }: Props) {
  const sellerName = product.sellerName || "Importador";
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "imp", text: `¡Hola! Soy ${sellerName}. ¿En qué te puedo ayudar con ${product.title}?`, time: now() },
    { from: "imp", text: `Tenemos producción propia. Mínimo ${product.minOrder ?? 100} unidades. Entrega estimada: ${product.deliveryLabel}.`, time: now() },
  ]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  if (!open) return null;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "me", text: t, time: now() }]);
    setText("");
    setTimeout(() => {
      const replies = [
        "Perfecto, lo coordinamos. ¿Querés que te pase ficha técnica?",
        "Sí, podemos personalizar con tu logo. Te paso muestras.",
        "Si confirmás hoy, entra en la próxima producción.",
        "Aceptamos transferencia y pago en partes.",
      ];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setMsgs((m) => [...m, { from: "imp", text: r, time: now() }]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[480px] flex-col rounded-t-3xl bg-white shadow-2xl"
        style={{ height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-base font-black text-white">
            🏭
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-bold leading-tight">
              {sellerName}
              {product.sellerVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
            </p>
            <p className="text-[10px] text-emerald-600">● En línea · Responde en minutos</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Producto chip */}
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl" style={{ background: product.gradient }}>
            {product.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-xs font-semibold">{product.title}</p>
            <p className="text-[10px] text-neutral-500">Consulta sobre este producto</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
            <ShieldCheck className="mr-0.5 inline h-2.5 w-2.5" /> Seguro
          </span>
        </div>

        {/* Mensajes */}
        <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-snug shadow-sm ${
                  m.from === "me"
                    ? "rounded-br-sm bg-[#e8451c] text-white"
                    : "rounded-bl-sm bg-neutral-100 text-neutral-800"
                }`}
              >
                <p>{m.text}</p>
                <p className={`mt-0.5 text-right text-[9px] ${m.from === "me" ? "text-white/70" : "text-neutral-500"}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-neutral-200 bg-white px-3 py-2 pb-4">
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1.5">
            <button className="grid h-8 w-8 place-items-center rounded-full text-neutral-400">
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribí tu mensaje…"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <button onClick={send} className="grid h-9 w-9 place-items-center rounded-full bg-[#e8451c] text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 flex items-center justify-center gap-1 text-center text-[9px] text-neutral-400">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" /> Conversación protegida por NEIBA
          </p>
        </div>
      </div>
    </div>
  );
}
