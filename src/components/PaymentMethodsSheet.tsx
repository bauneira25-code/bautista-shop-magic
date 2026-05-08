import { useState } from "react";
import { X, CreditCard, Lock, Check, Trash2, Plus } from "lucide-react";
import { formatARS } from "@/lib/mockData";
import { useSavedCards, detectCardBrand, type SavedCard } from "@/stores/savedCards";
import { toast } from "sonner";

type Method = "mercadopago" | "debito" | "credito";

interface Props {
  total: number;
  onClose: () => void;
  onPaid: (info: { method: string; cardLast4?: string }) => void;
}

const ORANGE = "#e8451c";

export function PaymentMethodsSheet({ total, onClose, onPaid }: Props) {
  const cards = useSavedCards((s) => s.cards);
  const addCard = useSavedCards((s) => s.add);
  const removeCard = useSavedCards((s) => s.remove);

  const [view, setView] = useState<"pick" | "form">("pick");
  const [method, setMethod] = useState<Method>("mercadopago");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [num, setNum] = useState("");
  const [holder, setHolder] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [save, setSave] = useState(true);

  const cleanNum = num.replace(/\s/g, "");
  const validCard =
    cleanNum.length >= 13 &&
    cleanNum.length <= 19 &&
    holder.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvv.length >= 3;

  const cardsOfType = (t: "debito" | "credito") => cards.filter((c) => c.type === t);

  const pickMethod = (m: Method) => {
    setMethod(m);
    if (m === "mercadopago") {
      onPaid({ method: "MercadoPago" });
      return;
    }
    // If has saved card of this type, allow direct selection (handled in render)
    const list = cardsOfType(m);
    if (list.length === 0) {
      setView("form");
    }
  };

  const payWithSaved = (c: SavedCard) => {
    onPaid({ method: c.type === "debito" ? "Débito" : "Crédito", cardLast4: c.last4 });
  };

  const submitCard = () => {
    if (!validCard) {
      toast.error("Revisá los datos de la tarjeta");
      return;
    }
    const last4 = cleanNum.slice(-4);
    if (save) {
      addCard({
        brand: detectCardBrand(cleanNum),
        last4,
        holder: holder.trim(),
        exp,
        type: method === "credito" ? "credito" : "debito",
      });
      toast.success("Tarjeta guardada para próximas compras");
    }
    onPaid({ method: method === "credito" ? "Crédito" : "Débito", cardLast4: last4 });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] border-t border-orange-100 bg-white p-5 pb-8 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl">{view === "pick" ? "¿Cómo querés pagar?" : "Datos de la tarjeta"}</h3>
            <p className="text-xs text-neutral-500">Total a pagar · <b className="text-[#e8451c]">{formatARS(total)}</b></p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {view === "pick" && (
          <div className="space-y-3">
            {/* MercadoPago */}
            <button
              onClick={() => pickMethod("mercadopago")}
              className="flex w-full items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 text-left active:scale-[0.99]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#009ee3] text-xl font-black text-white">M</span>
              <div className="flex-1">
                <p className="text-sm font-bold">MercadoPago</p>
                <p className="text-[11px] text-neutral-500">Link de pago · Saldo / cualquier medio</p>
              </div>
              <span className="text-[#e8451c]">›</span>
            </button>

            {(["debito", "credito"] as const).map((t) => {
              const list = cardsOfType(t);
              const label = t === "debito" ? "Débito" : "Crédito";
              const desc = t === "debito" ? "Pago inmediato" : "Hasta 12 cuotas";
              return (
                <div key={t} className="rounded-2xl border border-orange-100 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-xl">
                      {t === "debito" ? "💳" : "💎"}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{label}</p>
                      <p className="text-[11px] text-neutral-500">{desc}</p>
                    </div>
                  </div>
                  {list.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {list.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 p-2.5"
                        >
                          <button
                            onClick={() => payWithSaved(c)}
                            className="flex flex-1 items-center gap-2 text-left"
                          >
                            <CreditCard className="h-4 w-4 text-[#e8451c]" />
                            <div>
                              <p className="text-[12px] font-bold uppercase">{c.brand} •••• {c.last4}</p>
                              <p className="text-[10px] text-neutral-500">{c.holder} · {c.exp}</p>
                            </div>
                          </button>
                          <button onClick={() => removeCard(c.id)} className="text-neutral-400">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { setMethod(t); setView("form"); }}
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-[#e8451c] py-2 text-[11px] font-bold text-[#e8451c]"
                  >
                    <Plus className="h-3 w-3" /> Agregar tarjeta de {label.toLowerCase()}
                  </button>
                </div>
              );
            })}

            <p className="pt-2 text-center text-[10px] text-neutral-400">
              <Lock className="mr-1 inline h-3 w-3" /> Procesado de forma segura
            </p>
          </div>
        )}

        {view === "form" && (
          <div className="space-y-3">
            <p className="text-[11px] text-neutral-500">
              Tarjeta de <b className="uppercase text-[#e8451c]">{method}</b>. La guardamos para que tu próxima compra sea con un toque.
            </p>
            <Input
              label="Número de tarjeta"
              value={num}
              onChange={(e) =>
                setNum(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 19)
                    .replace(/(\d{4})/g, "$1 ")
                    .trim(),
                )
              }
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
            />
            <Input
              label="Titular"
              value={holder}
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
              placeholder="JUAN PEREZ"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Vencimiento"
                value={exp}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                  setExp(v);
                }}
                placeholder="MM/AA"
                inputMode="numeric"
              />
              <Input
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
              />
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/40 p-2.5 text-[11px]">
              <input
                type="checkbox"
                checked={save}
                onChange={(e) => setSave(e.target.checked)}
                className="h-4 w-4 accent-[#e8451c]"
              />
              <span>Guardar tarjeta para próximas compras</span>
              <Check className="ml-auto h-3.5 w-3.5 text-[#e8451c]" />
            </label>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setView("pick")}
                className="flex-1 rounded-xl border border-neutral-200 py-3 text-[12px] font-bold text-neutral-700"
              >
                Volver
              </button>
              <button
                onClick={submitCard}
                disabled={!validCard}
                className="flex-[2] rounded-xl bg-[#e8451c] py-3 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)] disabled:opacity-40"
              >
                <Lock className="mr-1 inline h-4 w-4" /> PAGAR {formatARS(total)}
              </button>
            </div>

            <p className="text-center text-[10px] text-neutral-400">
              Tus datos viajan cifrados. Nunca los compartimos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        {...rest}
        className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#e8451c]"
      />
    </label>
  );
}
