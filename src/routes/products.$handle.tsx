import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$handle")({
  component: ProductDetail,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p className="mb-4 text-muted-foreground">{error.message}</p>
          <Button onClick={() => { router.invalidate(); reset(); }}>Reintentar</Button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="font-display text-4xl">Producto no encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Volver al inicio</Link>
      </div>
    </div>
  ),
});

function ProductDetail() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    setLoading(true);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        const p = data?.data?.product;
        setProduct(p);
        setVariantId(p?.variants?.edges?.[0]?.node?.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid place-items-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="font-display text-3xl">Producto no encontrado</h1>
          <Link to="/products" className="mt-4 inline-block text-primary underline">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges.find((v) => v.node.id === variantId)?.node ?? product.variants.edges[0].node;
  const images = product.images.edges;
  const mainImg = images[imgIdx]?.node ?? images[0]?.node;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Agregado al carrito");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              {mainImg && <img src={mainImg.url} alt={mainImg.altText ?? product.title} className="h-full w-full object-cover" />}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square overflow-hidden rounded-lg border-2 ${i === imgIdx ? "border-primary" : "border-transparent"}`}>
                    <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            {product.productType && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{product.productType}</span>}
            <h1 className="mt-1 font-display text-4xl md:text-5xl">{product.title}</h1>
            <p className="mt-4 font-display text-3xl text-primary">{formatPrice(variant.price.amount, variant.price.currencyCode)}</p>
            <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>

            {product.options.map((opt) => opt.values.length > 1 && (
              <div key={opt.name} className="mt-6">
                <p className="mb-2 text-sm font-semibold">{opt.name}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v) => {
                    const optVal = v.node.selectedOptions.find((o) => o.name === opt.name)?.value;
                    if (!optVal) return null;
                    const active = v.node.id === variantId;
                    return (
                      <button key={v.node.id} onClick={() => setVariantId(v.node.id)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                        {optVal}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-3 w-3" /></Button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty(qty + 1)}><Plus className="h-3 w-3" /></Button>
              </div>
              <Button onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="mr-2 h-4 w-4" />Agregar al carrito</>}
              </Button>
            </div>
            {!variant?.availableForSale && <p className="mt-3 text-sm text-destructive">Sin stock</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
