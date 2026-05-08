import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { useUserAuth } from "@/stores/userAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/",
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const setUser = useUserAuth((s) => s.setUser);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });
  const valid =
    form.nombre.trim().length > 1 &&
    form.apellido.trim().length > 1 &&
    form.dni.trim().length > 5 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.telefono.trim().length > 5 &&
    form.direccion.trim().length > 3;

  const submit = () => {
    if (!valid) {
      toast.error("Completá todos los campos");
      return;
    }
    setUser(form);
    toast.success("¡Bienvenido a NEIBA!");
    navigate({ to: redirect as any });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white text-neutral-900">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate({ to: "/" })}
          className="grid h-10 w-10 place-items-center rounded-full bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 text-[#e8451c]" />
        </button>
        <p className="font-display text-sm">Iniciar sesión / Registrarse</p>
        <span className="w-10" />
      </header>

      <div className="space-y-4 px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl font-black text-white"
            style={{ background: "linear-gradient(135deg,#ff7a3d,#e8451c)" }}
          >
            N
          </div>
          <div>
            <h1 className="font-display text-2xl leading-tight">Creá tu cuenta</h1>
            <p className="text-xs text-neutral-500">Para sumarte a grupos y comprar.</p>
          </div>
        </div>

        <Field icon={<User className="h-4 w-4" />} label="Nombre">
          <input value={form.nombre} onChange={upd("nombre")} className={inp} placeholder="Juan" />
        </Field>
        <Field icon={<User className="h-4 w-4" />} label="Apellido">
          <input value={form.apellido} onChange={upd("apellido")} className={inp} placeholder="Pérez" />
        </Field>
        <Field icon={<CreditCard className="h-4 w-4" />} label="DNI">
          <input
            value={form.dni}
            onChange={upd("dni")}
            inputMode="numeric"
            className={inp}
            placeholder="40123456"
          />
        </Field>
        <Field icon={<Mail className="h-4 w-4" />} label="Email">
          <input
            value={form.email}
            onChange={upd("email")}
            type="email"
            className={inp}
            placeholder="vos@email.com"
          />
        </Field>
        <Field icon={<Phone className="h-4 w-4" />} label="Teléfono">
          <input
            value={form.telefono}
            onChange={upd("telefono")}
            inputMode="tel"
            className={inp}
            placeholder="+54 11 1234 5678"
          />
        </Field>
        <Field icon={<MapPin className="h-4 w-4" />} label="Dirección de envío">
          <input
            value={form.direccion}
            onChange={upd("direccion")}
            className={inp}
            placeholder="Av. Siempre Viva 742, CABA"
          />
        </Field>

        <button
          onClick={submit}
          className="mt-2 w-full rounded-2xl bg-[#e8451c] py-4 font-display text-sm font-black tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)]"
        >
          CREAR CUENTA Y CONTINUAR
        </button>
        <p className="text-center text-[10px] text-neutral-400">
          Al continuar aceptás los términos y la política de privacidad de NEIBA.
        </p>
      </div>
    </div>
  );
}

const inp =
  "w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#e8451c]";

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}
