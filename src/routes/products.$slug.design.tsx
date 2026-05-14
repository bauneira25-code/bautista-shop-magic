import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Type, Palette, Maximize2, Save, Sparkles } from "lucide-react";
import { findProduct, formatARS } from "@/lib/mockData";
import { createOrderWithDesign, uploadDesignSVG } from "@/lib/orders";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug/design")({
  head: ({ params }) => {
    const product = findProduct(params.slug);
    const title = product ? `Diseñar ${product.title} — NEIBA` : "Diseñar — NEIBA";
    return {
      meta: [
        { title },
        { name: "description", content: "Personalizá tu producto con texto, color y tipografía. Vista previa en tiempo real." },
      ],
    };
  },
  component: DesignEditor,
});

const COLORS = ["#000000", "#ffffff", "#ef4444", "#f97316", "#eab308", "#10b981", "#3b82f6", "#a855f7"];
const FONTS = ["Bebas Neue", "Arial Black", "Fraunces", "Impact"];

function DesignEditor() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();

  const [text, setText] = useState("NEIBA");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Bebas Neue");
  const [size, setSize] = useState(48);
  const [rotation, setRotation] = useState(0);
  const [posY, setPosY] = useState(100);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const previewStyle = useMemo(
    () => ({
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      color,
      fontFamily: `'${font}', sans-serif`,
      fontSize: `${size}px`,
      fontWeight: font === "Bebas Neue" || font === "Impact" ? 400 : 900,
      letterSpacing: font === "Bebas Neue" ? "0.05em" : "0",
      lineHeight: 1,
      whiteSpace: "nowrap" as const,
    }),
    [rotation, color, font, size],
  );

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p>Producto no encontrado.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Volver</Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!customer.trim()) {
      toast.error("Ingresá tu nombre para guardar el diseño");
      return;
    }
    setSaving(true);
    try {
      const design = {
        text, color, font, size, rotationDeg: rotation, posX: 100, posY,
      };
      const order = await createOrderWithDesign({
        customer_name: customer.trim(),
        customer_phone: phone.trim() || undefined,
        product_slug: product.slug,
        product_title: product.title,
        product_emoji: product.emoji,
        product_gradient: product.gradient,
        unit_price: product.price.individual,
        design,
      });
      // Subir SVG en background
      uploadDesignSVG(order.id, design).catch((e) => console.error(e));
      toast.success("¡Diseño guardado! Pago confirmado.");
      navigate({ to: "/orders" });
    } catch (e) {
      console.error(e);
      toast.error("No pudimos guardar el diseño");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background pb-32">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur-xl">
        <Link to="/products/$slug" params={{ slug }} className="grid h-10 w-10 place-items-center rounded-full bg-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <p className="font-display text-base">Diseñá tu {product.title}</p>
        <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold text-primary">EDITOR</span>
      </header>

      {/* Preview */}
      <div className="px-4">
        <div
          className="relative mx-auto grid aspect-square w-full place-items-center overflow-hidden rounded-3xl shadow-xl"
          style={{ background: product.gradient }}
        >
          <span className="text-[8rem] opacity-50 drop-shadow-lg">{product.emoji}</span>
          <div
            className="pointer-events-none absolute"
            style={{
              left: "50%",
              top: `${posY}%`,
              ...previewStyle,
            }}
          >
            {text || " "}
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            Vista previa
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {formatARS(product.price.individual)}
          </span>
        </div>
      </div>

      <main className="space-y-5 px-4 pt-5">
        {/* Texto */}
        <Field icon={Type} label="Texto (max 15)">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 15))}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
            placeholder="Tu nombre o frase"
          />
          <p className="mt-1 text-right text-[10px] text-muted-foreground">{text.length}/15</p>
        </Field>

        {/* Fuente */}
        <Field icon={Sparkles} label="Tipografía">
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                style={{ fontFamily: `'${f}', sans-serif` }}
                className={`rounded-xl border px-3 py-3 text-sm transition ${
                  font === f
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>

        {/* Color */}
        <Field icon={Palette} label="Color">
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-10 w-10 rounded-full border-2 transition ${
                  color === c ? "border-primary scale-110 shadow-lg" : "border-border"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </Field>

        {/* Sliders */}
        <Field icon={Maximize2} label={`Tamaño · ${size}px`}>
          <input
            type="range"
            min={24} max={80} value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </Field>

        <Field icon={RotateCcw} label={`Rotación · ${rotation}°`}>
          <input
            type="range"
            min={-45} max={45} value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </Field>

        <Field icon={Maximize2} label={`Posición vertical · ${posY}%`}>
          <input
            type="range"
            min={20} max={80} value={posY}
            onChange={(e) => setPosY(parseInt(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </Field>

        {/* Datos cliente */}
        <div className="rounded-3xl border border-border bg-card p-4">
          <p className="mb-3 font-display text-sm">Datos para el envío</p>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Nombre y apellido"
            className="mb-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp (opcional)"
            inputMode="tel"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background/95 p-3 backdrop-blur-xl">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display text-sm font-black text-primary-foreground shadow-[0_10px_30px_-10px_rgba(232,69,28,0.6)] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : `CONFIRMAR Y PAGAR · ${formatARS(product.price.individual)}`}
        </button>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, children,
}: { icon: typeof Type; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {children}
    </div>
  );
}
