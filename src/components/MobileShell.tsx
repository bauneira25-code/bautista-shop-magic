import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, ShoppingBag, Package, User } from "lucide-react";
import type { ReactNode } from "react";
import { useLocalCart } from "@/stores/localCart";

type NavItem = { to: string; label: string; icon: typeof Home; highlight?: boolean };
const navItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/grupos", label: "Grupos", icon: Users },
  { to: "/cart", label: "Carrito", icon: ShoppingBag, highlight: true },
  { to: "/orders", label: "Pedidos", icon: Package },
  { to: "/profile", label: "Perfil", icon: User },
];

export function MobileShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const count = useLocalCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-24">
      {children}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="glass flex items-center justify-around rounded-3xl px-2 py-2 shadow-[var(--shadow-card)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            if (item.highlight) {
              return (
                <Link key={item.to} to={item.to} className="-mt-7 flex flex-col items-center">
                  <span
                    className="relative grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Icon className="h-6 w-6" />
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-warning px-1 text-[10px] font-black text-background">
                        {count}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-foreground">{item.label}</span>
                </Link>
              );
            }
            return (
              <Link key={item.to} to={item.to} className="flex flex-1 flex-col items-center gap-1 py-1.5">
                <Icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
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
