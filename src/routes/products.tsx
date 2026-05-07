import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";

const searchSchema = z.object({
  tag: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catálogo — NEIBA" },
      { name: "description", content: "Explorá todo el catálogo de NEIBA: tecnología, audio, smartwatches, hogar, gym, belleza y más." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { tag } = Route.useSearch();
  const query = tag ? `tag:${tag}` : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Catálogo</span>
          <h1 className="font-display text-4xl md:text-5xl">
            {tag ? <>Categoría: <span className="text-primary capitalize">{tag}</span></> : "Todos los productos"}
          </h1>
        </div>
        <ProductGrid first={50} query={query} />
      </div>
    </div>
  );
}
