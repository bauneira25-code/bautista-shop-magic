import { useEffect, useState, type ReactNode } from "react";
import { Lock, LogOut } from "lucide-react";

const PINS: Record<string, string> = {
  empaquetado: "5678",
};

const keyFor = (section: string) => `neiba.section_pin.${section}`;

export function SectionPinGate({
  section,
  label,
  children,
}: { section: keyof typeof PINS | string; label: string; children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && localStorage.getItem(keyFor(section)) === "1");
    setReady(true);
  }, [section]);

  if (!ready) return null;
  if (authed)
    return (
      <div className="relative">
        <button
          onClick={() => { localStorage.removeItem(keyFor(section)); setAuthed(false); }}
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-[10px] text-white/60"
          title="Salir de esta sección"
        >
          <LogOut className="h-3 w-3" /> {section}
        </button>
        {children}
      </div>
    );

  const expected = PINS[section] ?? "0000";

  return (
    <div className="grid min-h-[80vh] place-items-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20 text-orange-300">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg text-white">PIN · {label}</p>
            <p className="text-xs text-white/50">Acceso restringido a esta estación</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === expected) {
              localStorage.setItem(keyFor(section), "1");
              setAuthed(true);
            } else { setErr("PIN incorrecto"); setPin(""); }
          }}
        >
          <input
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
            inputMode="numeric"
            autoFocus
            placeholder="• • • •"
            className="w-full rounded-2xl border border-white/10 bg-black/40 text-white px-4 py-4 text-center font-display text-2xl tracking-[0.5em] focus:border-orange-400 focus:outline-none"
          />
          {err && <p className="mt-2 text-center text-xs text-red-400">{err}</p>}
          <button
            type="submit"
            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-display text-sm font-black text-white"
          >
            Entrar
          </button>
          <p className="mt-3 text-center text-[10px] text-white/40">
            PIN por defecto: <span className="font-mono">{expected}</span>
          </p>
        </form>
      </div>
    </div>
  );
}
