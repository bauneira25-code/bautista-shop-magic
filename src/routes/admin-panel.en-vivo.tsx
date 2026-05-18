import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Plus, Pencil, Trash2, X, Save, Upload, Film, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-panel/en-vivo")({ component: AdminEnVivoPage });

const MACHINES = [
  { id: "laser", name: "Láser" },
  { id: "uv", name: "UV" },
  { id: "sublimacion", name: "Sublimación" },
  { id: "empaquetado", name: "Empaquetado" },
];

type Camera = {
  id: string;
  name: string;
  machine: string;
  video_url: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty: Partial<Camera> = { name: "", machine: "laser", is_active: true, sort_order: 0 };

function AdminEnVivoPage() {
  const [cams, setCams] = useState<Camera[]>([]);
  const [editing, setEditing] = useState<Partial<Camera> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("live_cameras").select("*").order("sort_order");
    setCams((data ?? []) as Camera[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-cameras")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_cameras" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar cámara?")) return;
    const { error } = await supabase.from("live_cameras").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Eliminada");
  };

  const toggleActive = async (c: Camera) => {
    await supabase.from("live_cameras").update({ is_active: !c.is_active }).eq("id", c.id);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl flex items-center gap-2">
            <Radio className="h-7 w-7 text-orange-400" /> Cámaras En Vivo
          </h1>
          <p className="text-sm text-white/50 mt-1">{cams.length} cámaras configuradas</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sort_order: cams.length })}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold">
          <Plus className="h-4 w-4" /> Nueva cámara
        </button>
      </header>

      {loading ? <p className="text-white/40 text-sm">Cargando…</p> : cams.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-white/40">
          <Radio className="h-10 w-10 mx-auto mb-3 opacity-50" />
          No hay cámaras todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cams.map(c => (
            <div key={c.id} className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
              <div className="aspect-video relative bg-black grid place-items-center">
                {c.thumbnail_url ? <img src={c.thumbnail_url} className="w-full h-full object-cover" alt={c.name} />
                  : c.video_url ? <video src={c.video_url} className="w-full h-full object-cover" muted />
                  : <Film className="h-10 w-10 text-white/20" />}
                <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.is_active ? "bg-red-500 text-white animate-pulse" : "bg-white/20 text-white/60"}`}>
                  {c.is_active ? "● EN VIVO" : "PAUSADA"}
                </span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{c.name}</p>
                    <p className="text-[11px] text-white/50 capitalize">{c.machine}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(c)} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 py-1.5 text-xs"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => toggleActive(c)} className="rounded-lg bg-white/5 hover:bg-white/10 px-3 text-xs">{c.is_active ? "Pausar" : "Activar"}</button>
                  <button onClick={() => remove(c.id)} className="grid place-items-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <CameraEditor camera={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function CameraEditor({ camera, onClose, onSaved }: { camera: Partial<Camera>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Camera>>(camera);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"video" | "thumb" | null>(null);
  const isNew = !camera.id;

  const set = (k: keyof Camera, v: any) => setForm(f => ({ ...f, [k]: v }));

  const upload = async (file: File, kind: "video" | "thumb") => {
    setUploading(kind);
    try {
      const path = `${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("live-videos").upload(path, file);
      if (up.error) throw up.error;
      const { data: { publicUrl } } = supabase.storage.from("live-videos").getPublicUrl(path);
      set(kind === "video" ? "video_url" : "thumbnail_url", publicUrl);
      toast.success("Archivo subido");
    } catch (e: any) {
      toast.error(e.message ?? "Error subiendo");
    }
    setUploading(null);
  };

  const save = async () => {
    if (!form.name?.trim()) { toast.error("Falta nombre"); return; }
    setSaving(true);
    const payload = {
      name: form.name, machine: form.machine ?? "laser",
      video_url: form.video_url ?? null, thumbnail_url: form.thumbnail_url ?? null,
      is_active: form.is_active ?? true, sort_order: form.sort_order ?? 0,
    };
    const { error } = isNew
      ? await supabase.from("live_cameras").insert(payload)
      : await supabase.from("live_cameras").update(payload).eq("id", camera.id!);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Guardado");
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-white/10 p-6">
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-display text-2xl">{isNew ? "Nueva cámara" : "Editar cámara"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <Field label="Nombre de la cámara">
            <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Ej: Láser Premium" />
          </Field>

          <Field label="Máquina">
            <select value={form.machine ?? "laser"} onChange={(e) => set("machine", e.target.value)} className={inputCls}>
              {MACHINES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>

          <Field label="Video de demostración">
            <div className="space-y-2">
              {form.video_url && <video src={form.video_url} className="w-full rounded-lg aspect-video bg-black" controls muted />}
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 hover:border-orange-400 py-4 cursor-pointer text-xs text-white/60">
                <Upload className="h-3.5 w-3.5" />
                {uploading === "video" ? "Subiendo..." : form.video_url ? "Reemplazar video" : "Subir video"}
                <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "video"); }} />
              </label>
            </div>
          </Field>

          <Field label="Miniatura">
            <div className="space-y-2">
              {form.thumbnail_url && <img src={form.thumbnail_url} className="w-full rounded-lg aspect-video object-cover" alt="" />}
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 hover:border-orange-400 py-4 cursor-pointer text-xs text-white/60">
                <ImageIcon className="h-3.5 w-3.5" />
                {uploading === "thumb" ? "Subiendo..." : form.thumbnail_url ? "Reemplazar miniatura" : "Subir miniatura"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "thumb"); }} />
              </label>
            </div>
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm font-medium">Cámara activa</span>
          </label>

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-display text-sm font-bold disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : isNew ? "Crear cámara" : "Guardar cambios"}
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
