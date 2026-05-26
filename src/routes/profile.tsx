import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Heart, MapPin, CreditCard, Bell, HelpCircle, LogOut, Sparkles, Users, Package, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  return (
    <MobileShell>
      <header className="px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">Perfil</h1>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card"><Settings className="h-4 w-4" /></button>
        </div>
      </header>

      {/* Profile card */}
      <div className="px-5">
        <div className="rounded-3xl p-5 text-white shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20 backdrop-blur text-xl font-black">B</div>
            <div className="flex-1">
              <p className="font-display text-lg leading-tight">Bautista Fernández</p>
              <p className="text-xs opacity-90">+54 11 5555-1234</p>
            </div>
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold backdrop-blur">⚡ Pro</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat n="12" l="Pedidos" />
            <Stat n="4" l="Grupos activos" />
            <Stat n="$84k" l="Ahorrado" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-3 gap-2 px-5">
        {[
          { icon: Package, label: "Pedidos", to: "/orders" },
          { icon: Users, label: "Mis grupos", to: "/orders" },
          { icon: Heart, label: "Favoritos", to: "/orders" },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-xs">
            <a.icon className="h-4 w-4 text-primary" />
            {a.label}
          </Link>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-5 space-y-2 px-5 pb-8">
        {[
          { icon: Heart, label: "Favoritos", count: "24" },
          { icon: MapPin, label: "Direcciones" },
          { icon: CreditCard, label: "Métodos de pago", count: "Mercado Pago" },
          { icon: Bell, label: "Notificaciones" },
          { icon: HelpCircle, label: "Ayuda" },
        ].map((m) => (
          <button key={m.label} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left">
            <m.icon className="h-4 w-4 text-primary" />
            <span className="flex-1 text-sm">{m.label}</span>
            {m.count && <span className="text-xs text-muted-foreground">{m.count}</span>}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}

        <Link to="/admin-login" className="flex w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-left">
          <Settings className="h-4 w-4 text-primary" />
          <span className="flex-1 text-sm font-semibold">Panel admin</span>
          <ChevronRight className="h-4 w-4 text-primary" />
        </Link>

        <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left text-destructive">
          <LogOut className="h-4 w-4" />
          <span className="flex-1 text-sm">Cerrar sesión</span>
        </button>
      </div>
    </MobileShell>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-black/30 p-2 backdrop-blur">
      <p className="font-display text-lg">{n}</p>
      <p className="text-[10px] opacity-80">{l}</p>
    </div>
  );
}
