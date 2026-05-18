import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import type { ReactNode } from "react";
import { useLocalCart } from "@/stores/localCart";

const ORANGE = "#e8451c";

const sideItems = {
  left: [
    { to: "/", label: "Inicio", icon: Home, exact: true },
    { to: "/orders", label: "Pedidos", icon: Package, exact: false },
  ],
  right: [
    { to: "/profile", label: "Perfil", icon: User, exact: false },
  ],
};

export function MobileShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const count = useLocalCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/") || pathname.startsWith(to);

  const NavLink = ({ to, label, icon: Icon, exact }: { to: string; label: string; icon: typeof Home; exact: boolean }) => {
    const active = isActive(to, exact);
    return (
      <Link to={to} className="flex flex-1 flex-col items-center justify-center gap-1 py-1.5">
        <Icon className="h-[18px] w-[18px] transition-colors" style={{ color: active ? ORANGE : "#9ca3af" }} />
        <span className="text-[10px] font-semibold leading-none" style={{ color: active ? ORANGE : "#6b7280" }}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-24">
      {children}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2">
        <div
          className="relative flex items-stretch border-t border-orange-100 bg-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5"
          style={{ boxShadow: "0 -8px 24px -12px rgba(232,69,28,0.25)" }}
        >
          {/* Lado izquierdo */}
          <div className="flex flex-1 items-stretch">
            {sideItems.left.map((it) => <NavLink key={it.to} {...it} />)}
          </div>

          {/* Hueco central reservado para el FAB del carrito */}
          <div className="w-16 shrink-0" aria-hidden />

          {/* Lado derecho */}
          <div className="flex flex-1 items-stretch">
            {sideItems.right.map((it) => <NavLink key={it.to} {...it} />)}
          </div>

          {/* FAB Carrito perfectamente centrado */}
          <Link
            to="/cart"
            className="absolute left-1/2 -top-5 flex -translate-x-1/2 flex-col items-center"
            aria-label="Carrito"
          >
            <span
              className="relative grid h-14 w-14 place-items-center rounded-full text-white ring-4 ring-white"
              style={{
                background: `linear-gradient(135deg, #ff8a4d, ${ORANGE})`,
                boxShadow: "0 10px 24px -6px rgba(232,69,28,0.55)",
              }}
            >
              <ShoppingBag className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-neutral-900 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </span>
            <span className="mt-0.5 text-[10px] font-bold leading-none" style={{ color: ORANGE }}>
              Carrito
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
