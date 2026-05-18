import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import type { ReactNode } from "react";
import { useLocalCart } from "@/stores/localCart";

type NavItem = { to: string; label: string; icon: typeof Home; highlight?: boolean };
const navItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/cart", label: "Carrito", icon: ShoppingBag, highlight: true },
  { to: "/orders", label: "Pedidos", icon: Package },
  { to: "/profile", label: "Perfil", icon: User },
];

const ORANGE = "#e8451c";

export function MobileShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const count = useLocalCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-20">
      {children}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2">
        <div
          className="flex items-center justify-around border-t border-orange-100 bg-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5"
          style={{ boxShadow: "0 -6px 20px -10px rgba(232,69,28,0.25)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            if (item.highlight) {
              return (
                <Link key={item.to} to={item.to} className="-mt-5 flex flex-col items-center">
                  <span
                    className="relative grid h-11 w-11 place-items-center rounded-2xl text-white"
                    style={{
                      background: `linear-gradient(135deg, #ff7a3d, ${ORANGE})`,
                      boxShadow: "0 8px 20px -6px rgba(232,69,28,0.55)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-neutral-900 px-1 text-[9px] font-black text-white">
                        {count}
                      </span>
                    )}
                  </span>
                  <span
                    className="mt-0.5 text-[9px] font-bold"
                    style={{ color: ORANGE }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-1 flex-col items-center gap-0.5 py-1"
              >
                <Icon
                  className="h-4 w-4 transition-colors"
                  style={{ color: active ? ORANGE : "#9ca3af" }}
                />
                <span
                  className="text-[9px] font-semibold"
                  style={{ color: active ? ORANGE : "#6b7280" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
