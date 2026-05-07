import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEIBA — Tecnología, hogar, gym y belleza" },
      { name: "description", content: "Tienda online de tecnología, electrónica, gym, hogar, belleza y joyería moderna. Envíos a todo el país." },
      { property: "og:title", content: "NEIBA — Tu tienda de productos modernos" },
      { property: "og:description", content: "Fundas, auriculares, smartwatches, electrodomésticos y mucho más." },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "Tecnología", emoji: "📱", tag: "tech" },
  { name: "Audio", emoji: "🎧", tag: "audio" },
  { name: "Smartwatch", emoji: "⌚", tag: "smartwatch" },
  { name: "Hogar", emoji: "🏠", tag: "hogar" },
  { name: "Gym", emoji: "💪", tag: "gym" },
  { name: "Belleza", emoji: "💄", tag: "belleza" },
  { name: "Joyería", emoji: "💍", tag: "joyeria" },
  { name: "Gamer", emoji: "🎮", tag: "gamer" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-warm)" }} />
        <div className="absolute -right-32 -top-32 -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Nuevos drops cada semana
            </span>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
              Tecnología <br />
              <span className="text-primary">que se siente moderna.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Fundas, auriculares, smartwatches, electrodomésticos, gym, hogar y joyería. Productos curados, listos para tu día a día.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/products">Ver catálogo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#categorias">Explorar categorías</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Envíos a todo el país</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Garantía en todos los productos</span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-3xl" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }} />
            <div className="relative grid h-full grid-cols-2 gap-3 p-6">
              {["📱","🎧","⌚","💄","💍","🎮"].map((e, i) => (
                <div key={i} className="grid place-items-center rounded-2xl bg-background/95 text-5xl shadow-lg backdrop-blur" style={{ aspectRatio: i % 3 === 0 ? "1/1.2" : "1/1" }}>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">Categorías</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/products"
              search={{ tag: c.tag }}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Destacados</span>
            <h2 className="font-display text-3xl md:text-4xl">Lo más nuevo</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/products">Ver todo <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <ProductGrid first={8} />
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} NEIBA. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
