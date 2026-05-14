import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin · NEIBA" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin-panel" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin-panel" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin-login`,
            data: { full_name: name || email },
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisá tu email para confirmar.");
        setMode("signin");
      }
    } catch (e: any) {
      toast.error(e.message || "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-white px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center text-[11px] text-white/40 mb-6 hover:text-white/70">← Volver al sitio</Link>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 font-display">N</span>
            <div>
              <p className="font-display text-lg leading-none">NEIBA · Admin OS</p>
              <p className="text-[11px] text-white/50 mt-1">{mode === "signin" ? "Ingresá con tu cuenta" : "Crear cuenta de empleado"}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                placeholder="Nombre y apellido" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-orange-400 outline-none"
              />
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="email" required placeholder="email@neiba.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-sm focus:border-orange-400 outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="password" required placeholder="Contraseña" value={password}
                onChange={(e) => setPassword(e.target.value)} minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-sm focus:border-orange-400 outline-none"
              />
            </div>
            <button
              type="submit" disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-display text-sm font-bold disabled:opacity-60"
            >
              {busy ? "..." : mode === "signin" ? "Entrar al panel" : "Crear cuenta"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-[12px] text-white/50 hover:text-white"
          >
            {mode === "signin" ? "¿Primer empleado? Crear cuenta" : "Ya tengo cuenta — entrar"}
          </button>
        </div>
        <p className="mt-4 text-center text-[10px] text-white/30">
          Después de crear tu cuenta avisame y te asigno el rol de admin.
        </p>
      </div>
    </div>
  );
}
