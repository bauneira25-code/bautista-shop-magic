import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

export function ProductGrid({ first = 24, query }: { first?: number; query?: string }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    storefrontApiRequest(PRODUCTS_QUERY, { first, query: query ?? null })
      .then((data) => {
        if (cancelled) return;
        setProducts(data?.data?.products?.edges ?? []);
      })
      .catch((e) => console.error(e))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [first, query]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="font-display text-2xl">No products found</p>
        <p className="mt-2 text-muted-foreground">Pedile a Lovable que cree productos para tu tienda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
    </div>
  );
}
