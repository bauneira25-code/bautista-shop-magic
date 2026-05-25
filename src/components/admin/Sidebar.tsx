import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ShoppingBag, Factory, ShieldCheck, Layers3, PackageCheck,
  Package, Users2, CreditCard, Truck, AlertTriangle, Boxes, UserCog, Settings, LogOut, BarChart3, Radio,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL } from "@/lib/admin/statuses";
import type { AdminProfile } from "@/hooks/useAdminAuth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; primary?: boolean };
const items: NavItem[] = [
  { to: "/admin-panel", label: "Resumen", icon: LayoutDashboard, exact: true, primary: true },
  { to: "/admin-panel/analisis", label: "Análisis", icon: BarChart3, primary: true },
  { to: "/admin-panel/productos", label: "Productos", icon: Package, primary: true },
  { to: "/admin-panel/pedidos", label: "Pedidos", icon: ShoppingBag, primary: true },
  { to: "/admin-panel/produccion", label: "Producción", icon: Factory, primary: true },
  { to: "/admin-panel/en-vivo", label: "En Vivo", icon: Radio, primary: true },
  { to: "/admin-panel/stock", label: "Stock", icon: Boxes, primary: true },
  { to: "/admin-panel/todo", label: "Todo", icon: Layers3 },
  { to: "/admin-panel/calidad", label: "Control de calidad", icon: ShieldCheck },
  { to: "/admin-panel/empaquetado", label: "Empaquetado", icon: PackageCheck },
  { to: "/admin-panel/clientes", label: "Clientes", icon: Users2 },
  { to: "/admin-panel/pagos", label: "Pagos", icon: CreditCard },
  { to: "/admin-panel/envios", label: "Envíos", icon: Truck },
  { to: "/admin-panel/reclamos", label: "Reclamos", icon: AlertTriangle },
  { to: "/admin-panel/empleados", label: "Empleados", icon: UserCog },
  { to: "/admin-panel/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar({ profile }: { profile: AdminProfile }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const primaryRole = profile.roles[0];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-neutral-950 border-r border-white/5 text-white">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 font-display text-white text-sm">N</span>
          <div>
            <p className="font-display text-base leading-none">NEIBA</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">Admin OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <p className="px-3 pt-1 pb-1.5 text-[9px] uppercase tracking-widest text-white/30">Operación</p>
        {items.filter(i => i.primary).map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to as any}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition ${
                active ? "bg-orange-500/20 text-orange-200 ring-1 ring-orange-500/30" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate font-medium">{item.label}</span>
            </Link>
          );
        })}
        <p className="px-3 pt-4 pb-1.5 text-[9px] uppercase tracking-widest text-white/30">Más</p>
        {items.filter(i => !i.primary).map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to as any}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
          <p className="text-[12px] font-medium truncate">{profile.fullName ?? profile.user.email}</p>
          <p className="text-[10px] text-white/50 mt-0.5">{primaryRole ? ROLE_LABEL[primaryRole] : "Sin rol"}</p>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin-login"; }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileBar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="md:hidden sticky top-0 z-30 bg-neutral-950 border-b border-white/5 text-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 font-display text-white text-xs">N</span>
        <p className="font-display text-sm">NEIBA · Admin</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 no-scrollbar">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to as any} className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] ${active ? "bg-white/15" : "bg-white/5 text-white/60"}`}>
              <Icon className="h-3 w-3" /> {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
