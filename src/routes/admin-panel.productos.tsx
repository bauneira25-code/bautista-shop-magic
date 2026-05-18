import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package, Plus, Pencil, Trash2, X, Save, Upload, Image as ImageIcon, Film, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/productos")({ component: ProductosPage });

const CATS = [
  { id: "tecnologia", name: "Tecnología" },
  { id: "electrodomesticos", name: "Electrodomésticos" },
  { id: "hogar", name: "Hogar" },
  { id: "joyeria", name: "Joyería" },
  { id: "moda", name: "Moda" },
  { id: "tech", name: "Tech (legacy)" },
  { id: "electronica", name: "Electrónica (legacy)" },
  { id: "gym", name: "Gym" },
  { id: "belleza", name: "Belleza" },
];

const CUSTOM_TYPES = [
  { id: "laser", name: "Láser" },
  { id: "uv", name: "UV" },
  { id: "sublimacion", name: "Sublimación" },
  { id: "bordado", name: "Bordado" },
  { id: "estampado", name: "Estampado" },
];

const BADGES = ["destacado", "viral", "nuevo", "stock_bajo"];

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_individual: number;
  price_wholesale: number;
  category: string;
  is_customizable: boolean;
  customization_type: string | null;
  stock: number;
  location: string;
  is_active: boolean;
  badges: string[];
  emoji: string | null;
  gradient: string | null;
  cover_url: string | null;
};

const empty: Partial<Product> = {
  name: "",
  description: "",
  price_individual: 0,
  price_wholesale: 0,
  category: "tecnologia",
  is_customizable: false,
  customization_type: null,
  stock: 0,
  location: "",
  is_active: true,
  badges: [],
  emoji: "✨",
  gradient: "linear-gradient(135deg,#ff6b35,#ffa07a)",
};

function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [filter, setFilter] = useState<"todos" | "activos" | "personalizables" | "inactivos">("todos");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const visible = useMemo(() => products.filter(p => {
    if (filter === "activos" && !p.is_active) return false;
    if (filter === "inactivos" && p.is_active) return false;
    if (filter === "personalizables" && !p.is_customizable) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [products, filter, q]);

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Eliminado");
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-2">
            <Package className="h-7 w-7 text-orange-400" /> Productos
          </h1>
          <p className="text-sm text-white/50 mt-1">{visible.length} de {products.length} productos</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold">
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..."
          className="flex-1 min-w-[200px] rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-orange-400" />
        <div className="flex gap-2">
          {(["todos","activos","personalizables","inactivos"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === f ? "bg-orange-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Cargando…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-white/40">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
          No hay productos. Tocá <strong className="text-orange-300">Nuevo producto</strong> para crear el primero.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map(p => (
            <div key={p.id} className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden flex flex-col">
              <div className="aspect-square relative grid place-items-center text-5xl" style={{ background: p.gradient ?? "#222" }}>
                {p.cover_url ? <img src={p.cover_url} alt={p.name} className="absolute inset-0 w-full h-full object-cover" /> : <span>{p.emoji}</span>}
                {!p.is_active && <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold">INACTIVO</span>}
                {p.is_customizable && <span className="absolute top-2 right-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold">PERSONALIZABLE</span>}
              </div>
              <div className="p-3 space-y-1 flex-1 flex flex-col">
                <p className="font-medium text-sm truncate">{p.name || "(sin nombre)"}</p>
                <p className="text-[11px] text-white/50 capitalize">{p.category} · stock {p.stock}{p.location ? ` · 📍${p.location}` : ""}</p>
                <p className="text-orange-300 font-bold text-sm mt-1">${Number(p.price_individual).toLocaleString("es-AR")}</p>
                {p.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.badges.map(b => <span key={b} className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider">{b.replace("_"," ")}</span>)}
                  </div>
                )}
                <div className="flex gap-2 mt-auto pt-2">
                  <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 py-1.5 text-xs"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => remove(p.id)} className="grid place-items-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <ProductEditor product={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `prod-${Date.now()}`;
}

function ProductEditor({ product, onClose, onSaved }: { product: Partial<Product>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Product>>(product);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<{ id: string; url: string; media_type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const isNew = !product.id;

  useEffect(() => {
    if (product.id) {
      supabase.from("product_media").select("*").eq("product_id", product.id).order("sort_order")
        .then(({ data }) => setMedia(data ?? []));
    }
  }, [product.id]);

  const set = (k: keyof Product, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name?.trim()) { toast.error("Falta nombre"); return; }
    setSaving(true);
    const slug = form.slug || slugify(form.name);
    const payload: any = {
      slug, name: form.name, description: form.description ?? "",
      price_individual: Number(form.price_individual) || 0,
      price_wholesale: Number(form.price_wholesale) || 0,
      category: form.category, is_customizable: !!form.is_customizable,
      customization_type: form.is_customizable ? form.customization_type ?? "laser" : null,
      stock: Number(form.stock) || 0, location: form.location ?? "",
      is_active: form.is_active ?? true, badges: form.badges ?? [],
      emoji: form.emoji ?? "✨", gradient: form.gradient ?? "linear-gradient(135deg,#ff6b35,#ffa07a)",
      cover_url: form.cover_url ?? null,
    };
    let saved: Product | null = null;
    if (isNew) {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      saved = data as Product;
      setForm(saved);
    } else {
      const { data, error } = await supabase.from("products").update(payload).eq("id", product.id!).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      saved = data as Product;
    }
    toast.success("Guardado");
    setSaving(false);
    onSaved();
    if (isNew && saved) {
      // Stay open so user can upload media
      product.id = saved.id;
    } else {
      onClose();
    }
  };

  const upload = async (files: FileList | null) => {
    if (!files || !form.id) { toast.error("Guardá primero el producto"); return; }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const path = `${form.id}/${Date.now()}-${file.name}`;
        const up = await supabase.storage.from("product-media").upload(path, file);
        if (up.error) throw up.error;
        const { data: { publicUrl } } = supabase.storage.from("product-media").getPublicUrl(path);
        const { data: m, error } = await supabase.from("product_media")
          .insert({ product_id: form.id, url: publicUrl, media_type: isVideo ? "video" : "image", sort_order: media.length })
          .select().single();
        if (error) throw error;
        setMedia(prev => [...prev, m]);
        if (!form.cover_url && !isVideo) {
          await supabase.from("products").update({ cover_url: publicUrl }).eq("id", form.id);
          setForm(f => ({ ...f, cover_url: publicUrl }));
        }
      }
      toast.success("Archivos subidos");
    } catch (e: any) {
      toast.error(e.message ?? "Error subiendo");
    }
    setUploading(false);
  };

  const removeMedia = async (m: { id: string }) => {
    await supabase.from("product_media").delete().eq("id", m.id);
    setMedia(prev => prev.filter(x => x.id !== m.id));
  };

  const setCover = async (url: string) => {
    if (!form.id) return;
    await supabase.from("products").update({ cover_url: url }).eq("id", form.id);
    setForm(f => ({ ...f, cover_url: url }));
    toast.success("Portada actualizada");
    onSaved();
  };

  const toggleBadge = (b: string) => {
    const cur = form.badges ?? [];
    set("badges", cur.includes(b) ? cur.filter(x => x !== b) : [...cur, b]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-white/10 p-6">
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-display text-2xl">{isNew ? "Nuevo producto" : "Editar producto"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <Field label="Nombre">
            <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Descripción">
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio individual ($)"><input type="number" value={form.price_individual ?? 0} onChange={(e) => set("price_individual", e.target.value)} className={inputCls} /></Field>
            <Field label="Precio mayorista ($)"><input type="number" value={form.price_wholesale ?? 0} onChange={(e) => set("price_wholesale", e.target.value)} className={inputCls} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoría">
              <select value={form.category ?? "tecnologia"} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Stock"><input type="number" value={form.stock ?? 0} onChange={(e) => set("stock", e.target.value)} className={inputCls} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ubicación física (ej: A1, Joyería-2)">
              <input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Emoji"><input value={form.emoji ?? ""} onChange={(e) => set("emoji", e.target.value)} className={inputCls} /></Field>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.is_customizable} onChange={(e) => set("is_customizable", e.target.checked)} className="h-4 w-4 accent-orange-500" />
              <span className="text-sm font-medium">Producto personalizable</span>
            </label>
            {form.is_customizable && (
              <Field label="Tipo de personalización">
                <select value={form.customization_type ?? "laser"} onChange={(e) => set("customization_type", e.target.value)} className={inputCls}>
                  {CUSTOM_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-orange-500" />
              <span className="text-sm font-medium">Producto activo (visible para clientes)</span>
            </label>
          </div>

          <Field label="Etiquetas">
            <div className="flex flex-wrap gap-2">
              {BADGES.map(b => {
                const on = form.badges?.includes(b);
                return (
                  <button key={b} type="button" onClick={() => toggleBadge(b)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${on ? "bg-orange-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                    {b.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Imágenes y videos</p>
            {!form.id ? (
              <p className="text-xs text-white/50">Guardá el producto primero para poder subir archivos.</p>
            ) : (
              <>
                <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 hover:border-orange-400 py-6 cursor-pointer text-sm text-white/60">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Subiendo..." : "Subir imágenes / videos"}
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
                </label>
                {media.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {media.map(m => (
                      <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden bg-black/40 group">
                        {m.media_type === "video"
                          ? <div className="w-full h-full grid place-items-center text-white/50"><Film className="h-6 w-6" /></div>
                          : <img src={m.url} alt="" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                          {m.media_type === "image" && (
                            <button onClick={() => setCover(m.url)} className="rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold flex items-center gap-1"><Star className="h-3 w-3" />Portada</button>
                          )}
                          <button onClick={() => removeMedia(m)} className="rounded-full bg-red-500/80 px-2 py-1 text-[10px] font-bold"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        {form.cover_url === m.url && <span className="absolute top-1 left-1 rounded bg-orange-500 px-1 text-[9px] font-bold">PORTADA</span>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-display text-sm font-bold disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : isNew ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-orange-400 outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">{label}</p>
      {children}
    </div>
  );
}
