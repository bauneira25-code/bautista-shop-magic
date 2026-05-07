import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Sparkles, Check, AlertCircle, Image as ImageIcon } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useBrands, isGenericPhrase, BRAND_REGISTRATION_PRICE } from "@/stores/brands";
import { formatARS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/registrar-marca")({
  head: () => ({
    meta: [
      { title: "Registrá tu marca con NEIBA" },
      { name: "description", content: "Protegé tu logo y nombre de marca dentro de NEIBA." },
    ],
  }),
  component: RegisterBrand,
});

function RegisterBrand() {
  const nav = useNavigate();
  const { register, isTaken, brands } = useBrands();
  const [name, setName] = useState("");
  const [logoName, setLogoName] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "pago" | "ok">("form");

  const trimmed = name.trim();
  const taken = trimmed.length > 0 && isTaken(trimmed);
  const generic = trimmed.length > 0 && isGenericPhrase(trimmed);
  const valid = trimmed.length >= 3 && !taken && !generic;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setLogoName(f.name);
  };

  const submit = () => {
    if (!valid) return;
    setStep("pago");
  };

  const pay = () => {
    register({ name: trimmed, owner: "vos", logoName: logoName ?? undefined });
    setStep("ok");
    toast.success("🛡 Marca registrada en NEIBA");
  };

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={() => nav({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Para emprendedores</p>
          <h1 className="font-display text-xl">Registrá tu marca</h1>
        </div>
      </header>

      <main className="space-y-4 px-5 pt-3">
        {step === "form" && (
          <>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-sm font-bold">Protegé tu marca dentro de NEIBA</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Si registrás tu nombre o logo, nadie más en NEIBA va a poder usarlo para personalizar productos.
                Si alguien intenta copiarlo, la app lo bloquea.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Nombre de la marca
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lunari, Kairo, NB Studio…"
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-3 text-sm outline-none focus:border-primary"
              />
              {taken && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-rose-500">
                  <AlertCircle className="h-3 w-3" /> Esta marca ya está registrada por otra persona. Modificá tu diseño.
                </p>
              )}
              {generic && !taken && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-600">
                  <AlertCircle className="h-3 w-3" /> No se permiten frases genéricas o muy comunes.
                </p>
              )}
              {valid && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-600">
                  <Check className="h-3 w-3" /> Disponible para registrar
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Logo (opcional)
              </label>
              <label className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card py-5 text-xs text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                {logoName ?? "Subir PNG / JPG"}
                <input type="file" accept="image/*" hidden onChange={onFile} />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-card p-4">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Costo único</p>
                <p className="font-display text-2xl">{formatARS(BRAND_REGISTRATION_PRICE)}</p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <button
              onClick={submit}
              disabled={!valid}
              className="w-full rounded-2xl py-4 font-display text-sm text-white shadow-[var(--shadow-glow)] disabled:opacity-40"
              style={{ background: "var(--gradient-primary)" }}
            >
              Continuar al pago
            </button>

            {brands.length > 0 && (
              <div className="pt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Marcas ya registradas en NEIBA ({brands.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {brands.slice(0, 12).map((b) => (
                    <span key={b.id} className="rounded-full bg-secondary px-2.5 py-1 text-[10px]">
                      🛡 {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === "pago" && (
          <>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resumen</p>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between"><span>Marca</span><span className="font-bold">{trimmed}</span></div>
                {logoName && <div className="flex justify-between"><span>Logo</span><span className="text-muted-foreground">{logoName}</span></div>}
                <div className="flex justify-between"><span>Vigencia</span><span>Indefinida</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-display text-lg">
                  <span>Total</span><span>{formatARS(BRAND_REGISTRATION_PRICE)}</span>
                </div>
              </div>
            </div>
            <button onClick={pay} className="w-full rounded-2xl py-4 font-display text-sm text-white" style={{ background: "var(--gradient-primary)" }}>
              Pagar y registrar
            </button>
            <button onClick={() => setStep("form")} className="w-full text-xs text-muted-foreground">
              Volver
            </button>
          </>
        )}

        {step === "ok" && (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl text-white" style={{ background: "var(--gradient-primary)" }}>
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="mt-3 font-display text-2xl">¡{trimmed} es tuya!</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tu marca quedó registrada en NEIBA. Si alguien intenta copiarla, la app lo bloquea automáticamente.
            </p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground">
              Volver al inicio
            </Link>
          </div>
        )}
      </main>
    </MobileShell>
  );
}
