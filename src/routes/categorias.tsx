import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { CATEGORY_LIST } from "@/lib/categoryThemes";

export const Route = createFileRoute("/categorias")({
  component: Categorias,
});

function Categorias() {
  return (
    <MobileShell>
      <header className="sticky top-0 z-30 px-5 pb-3 pt-4 backdrop-blur-xl" style={{ background: "oklch(0.13 0.02 295 / 0.85)" }}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">NEIBA · explorar</p>
        <h1 className="font-display text-3xl">Cada mundo,<br/>su propio vibe.</h1>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Buscar categoría o producto..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </header>

      <main className="px-5 pt-4 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {CATEGORY_LIST.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                to="/categorias/$id"
                params={{ id: c.id }}
                className="relative block overflow-hidden rounded-3xl border"
                style={{
                  background: c.bg,
                  borderColor: `${c.accent}44`,
                  boxShadow: `0 20px 60px -25px ${c.accent}88`,
                }}
              >
                <div className={`absolute inset-0 opacity-50 ${
                  c.pattern === "circuit" ? "pat-circuit" :
                  c.pattern === "waves" ? "pat-waves" :
                  c.pattern === "pixels" ? "pat-pixels" :
                  c.pattern === "sparkle" ? "pat-sparkle" :
                  c.pattern === "scan" ? "pat-scan" :
                  c.pattern === "shine" ? "pat-shine" :
                  c.pattern === "dots" ? "pat-dots" : "pat-grid"
                }`} style={{ ["--pat-color" as never]: `${c.accent}30` }} />
                <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full blur-2xl" style={{ background: c.accent, opacity: 0.4 }} />

                <div className="relative flex items-center gap-4 p-5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: c.accent }}>
                    <Icon className="h-7 w-7" style={{ color: c.textOn }} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] uppercase tracking-[0.25em] ${c.font}`} style={{ color: c.accent }}>
                      {c.vibe}
                    </p>
                    <p className={`text-2xl ${c.font === "font-mono" ? "font-orbitron" : c.font} text-white`}>
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-xs text-white/60">{c.tagline}</p>
                  </div>
                  <ArrowRight className="h-5 w-5" style={{ color: c.accent }} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </MobileShell>
  );
}
