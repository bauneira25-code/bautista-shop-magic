import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { isAdminAuthed, tryAdminLogin, DEFAULT_PIN } from "@/lib/adminAuth";

export function AdminPinGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg">Acceso admin</p>
            <p className="text-xs text-muted-foreground">Ingresá el PIN compartido</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tryAdminLogin(pin)) {
              setAuthed(true);
            } else {
              setErr("PIN incorrecto");
              setPin("");
            }
          }}
        >
          <input
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
            inputMode="numeric"
            autoFocus
            placeholder="• • • •"
            className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-center font-display text-2xl tracking-[0.5em] focus:border-primary focus:outline-none"
          />
          {err && <p className="mt-2 text-center text-xs text-destructive">{err}</p>}
          <button
            type="submit"
            className="mt-3 w-full rounded-2xl bg-primary py-3 font-display text-sm font-black text-primary-foreground"
          >
            Entrar
          </button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            PIN por defecto: <span className="font-mono">{DEFAULT_PIN}</span>
          </p>
        </form>
      </div>
    </div>
  );
}
