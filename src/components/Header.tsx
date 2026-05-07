import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-lg">
            N
          </span>
          <span className="font-display text-xl tracking-tight">NEIBA</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link to="/" className="text-foreground/80 transition-colors hover:text-primary">Inicio</Link>
          <Link to="/products" className="text-foreground/80 transition-colors hover:text-primary">Productos</Link>
          <a href="#categorias" className="text-foreground/80 transition-colors hover:text-primary">Categorías</a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
