import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Send, CheckCircle2, AlertTriangle, RotateCcw, Volume2, VolumeX, Loader2, Package2 } from "lucide-react";
import { AdminPinGate } from "@/components/AdminPinGate";
import { supabase } from "@/integrations/supabase/client";
import {
  ageMinutes, STATUS_META, transitionStatus, uploadDesignSVG,
  type CustomizationRow, type OrderRow,
} from "@/lib/orders";
import { downloadSVG, generateSVG, type DesignSpec } from "@/lib/generateSVG";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/machine")({ component: MachinePage });

function MachinePage() {
  return (
    <AdminPinGate>
      <Machine />
    </AdminPinGate>
  );
}

const SOUND_KEY = "neiba-machine-sound";

function Machine() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [customs, setCustoms] = useState<Record<string, CustomizationRow>>({});
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [sound, setSound] = useState<boolean>(() =>
    typeof window !== "undefined" ? localStorage.getItem(SOUND_KEY) === "1" : false,
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmReprintId, setConfirmReprintId] = useState<string | null>(null);
  const lastCountRef = useRef<number>(0);

  // Carga + realtime
  useEffect(() => {
    const load = async () => {
      const { data: o } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: true });
      const { data: c } = await supabase.from("customizations").select("*");
      if (o) setOrders(o as OrderRow[]);
      if (c) {
        const map: Record<string, CustomizationRow> = {};
        for (const cust of c as CustomizationRow[]) map[cust.order_id ?? ""] = cust;
        setCustoms(map);
      }
    };
    load();
    const ch = supabase
      .channel("machine-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        load();
        if (payload.eventType === "INSERT") {
          toast.success("Nuevo pedido en cola 🚀");
          if (sound) ding();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sound]);

  useEffect(() => {
    const cola = orders.filter((o) => o.status === "pago_confirmado").length;
    if (cola > lastCountRef.current && lastCountRef.current !== 0 && sound) ding();
    lastCountRef.current = cola;
  }, [orders, sound]);

  const printing = orders.find((o) => o.status === "imprimiendo" || o.status === "enviando_maquina");
  const cola = orders.filter((o) => o.status === "pago_confirmado");
  const done = orders.filter((o) =>
    ["impreso", "empaquetado", "enviado", "entregado"].includes(o.status),
  );
  const doneToday = done.filter((o) => o.printed_at && Date.now() - new Date(o.printed_at).getTime() < 86_400_000);

  const buildDesign = (custom: CustomizationRow | undefined): DesignSpec => ({
    text: custom?.text ?? "",
    color: custom?.color ?? "#000000",
    font: custom?.font ?? "Bebas Neue",
    size: custom?.size ?? 48,
    rotationDeg: custom?.rotation_deg ?? 0,
    posX: custom?.pos_x ?? 100,
    posY: custom?.pos_y ?? 100,
  });

  const handleSendToMachine = async (o: OrderRow) => {
    if (printing) {
      toast.error("Ya hay otra impresión en curso");
      return;
    }
    setBusyId(o.id);
    try {
      const updated = await transitionStatus(o.id, "pago_confirmado", "imprimiendo", { progress: 0 });
      if (!updated) {
        toast.error("Otro operario tomó este pedido");
        return;
      }
      const custom = customs[o.id];
      uploadDesignSVG(o.id, buildDesign(custom)).catch(() => {});
      toast.success("Enviado a máquina 🔧");
      simulateProgress(o.id);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo enviar a máquina");
    } finally {
      setBusyId(null);
    }
  };

  const handleDownloadSVG = (o: OrderRow) => {
    const custom = customs[o.id];
    const svg = generateSVG(buildDesign(custom));
    downloadSVG(`neiba-${o.id.slice(0, 8)}-${o.product_slug}`, svg);
  };

  const handleComplete = async (o: OrderRow) => {
    try {
      await transitionStatus(o.id, "imprimiendo", "impreso", { progress: 100 });
      toast.success("¡Impresión terminada! ✅");
      if (sound) ding();
    } catch {
      toast.error("No se pudo marcar como completado");
    }
  };

  const handlePack = async (o: OrderRow) => {
    try { await transitionStatus(o.id, "impreso", "empaquetado"); toast.success("Empaquetado"); }
    catch { toast.error("Error al empaquetar"); }
  };

  const handleShip = async (o: OrderRow) => {
    const code = `TR${Date.now().toString().slice(-6)}`;
    try { await transitionStatus(o.id, "empaquetado", "enviado", { tracking_code: code }); toast.success(`Enviado · ${code}`); }
    catch { toast.error("Error al enviar"); }
  };

  const simulateProgress = (orderId: string) => {
    let p = 0;
    const tick = setInterval(async () => {
      p += 5 + Math.floor(Math.random() * 10);
      if (p >= 100) { p = 100; clearInterval(tick); }
      await supabase.from("orders").update({ progress: p }).eq("id", orderId).eq("status", "imprimiendo");
      if (p === 100) clearInterval(tick);
    }, 1500);
  };

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    localStorage.setItem(SOUND_KEY, v ? "1" : "0");
  };

  const list = tab === "todo" ? cola : done;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-[480px] pb-32">
        {/* Header oscuro */}
        <header className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="font-display text-base">Estación máquina</p>
            <button onClick={toggleSound} className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800" aria-label="Sonido">
              {sound ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-neutral-400" />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4 pb-3">
            <Counter label="Cola" value={cola.length} accent="bg-emerald-500" />
            <Counter label="Imprimiendo" value={printing ? 1 : 0} accent="bg-yellow-500" />
            <Counter label="Hechos hoy" value={doneToday.length} accent="bg-neutral-500" />
          </div>
        </header>

        {/* Trabajo activo */}
        {printing && (
          <div className="mx-3 mb-3 mt-3 rounded-3xl border border-primary/40 bg-gradient-to-br from-orange-600 to-orange-700 p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: printing.product_gradient ?? "rgba(0,0,0,0.3)" }}>
                {printing.product_emoji ?? "📦"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-100">Imprimiendo ahora</p>
                <p className="line-clamp-1 font-display text-base">{printing.product_title}</p>
                <p className="text-[11px] text-orange-100">{printing.customer_name}</p>
              </div>
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            {customs[printing.id] && (
              <div className="mt-3 rounded-xl bg-black/25 px-3 py-2 text-[11px]">
                "{customs[printing.id].text}" · {customs[printing.id].font} · {customs[printing.id].color}
              </div>
            )}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${printing.progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
              <span>{printing.progress}%</span>
              <button onClick={() => handleComplete(printing)} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-orange-700">
                <CheckCircle2 className="mr-1 inline h-3 w-3" /> MARCAR COMPLETADO
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <nav className="mx-3 flex gap-1 rounded-2xl bg-neutral-900 p-1">
          <button
            onClick={() => setTab("todo")}
            className={`flex-1 rounded-xl px-3 py-2 text-[11px] font-bold ${tab === "todo" ? "bg-primary text-primary-foreground" : "text-neutral-400"}`}
          >
            Por hacer ({cola.length})
          </button>
          <button
            onClick={() => setTab("done")}
            className={`flex-1 rounded-xl px-3 py-2 text-[11px] font-bold ${tab === "done" ? "bg-primary text-primary-foreground" : "text-neutral-400"}`}
          >
            Completados ({done.length})
          </button>
        </nav>

        {/* Lista */}
        <main className="mt-3 space-y-2 px-3">
          {list.length === 0 && (
            <p className="rounded-2xl bg-neutral-900 p-6 text-center text-xs text-neutral-500">
              {tab === "todo" ? "No hay pedidos en cola" : "Sin completados aún"}
            </p>
          )}
          {list.map((o) => {
            const custom = customs[o.id];
            const meta = STATUS_META[o.status];
            const age = ageMinutes(o.created_at);
            const urgent = o.status === "pago_confirmado" && age > 60;
            const isDone = ["impreso", "empaquetado", "enviado", "entregado"].includes(o.status);
            return (
              <div
                key={o.id}
                className={`rounded-2xl border p-3 transition ${
                  isDone ? "border-neutral-800 bg-neutral-900/60 opacity-70" :
                  urgent ? "border-red-500/60 bg-red-500/5" :
                  "border-neutral-800 bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: o.product_gradient ?? "rgba(255,255,255,0.05)" }}>
                    {o.product_emoji ?? "📦"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`line-clamp-1 text-xs font-semibold ${isDone ? "line-through text-neutral-500" : ""}`}>
                      {o.product_title}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {o.customer_name} · hace {age}m {o.tracking_code && `· ${o.tracking_code}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${meta.color}`}>{meta.label}</span>
                </div>

                {custom && (
                  <div className="mt-2 rounded-lg bg-black/40 px-3 py-1.5 text-[10px] text-neutral-300">
                    "{custom.text}" · {custom.font} · <span className="font-mono">{custom.color}</span> · {custom.size}px · {custom.rotation_deg}°
                  </div>
                )}

                {urgent && (
                  <p className="mt-2 inline-block rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-300">
                    🚨 URGENTE · {age} min
                  </p>
                )}

                {/* Botones según estado */}
                {o.status === "pago_confirmado" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleDownloadSVG(o)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-800 py-2.5 text-[11px] font-bold text-white"
                    >
                      <Download className="h-3 w-3" /> SVG
                    </button>
                    <button
                      onClick={() => handleSendToMachine(o)}
                      disabled={!!printing || busyId === o.id}
                      className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[11px] font-black text-primary-foreground disabled:opacity-40"
                    >
                      <Send className="h-3 w-3" /> ENVIAR A MÁQUINA
                    </button>
                  </div>
                )}

                {o.status === "impreso" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setConfirmReprintId(o.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 py-2 text-[11px] font-bold text-red-300"
                    >
                      <RotateCcw className="h-3 w-3" /> Reimprimir
                    </button>
                    <button
                      onClick={() => handlePack(o)}
                      className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2 text-[11px] font-black text-white"
                    >
                      <Package2 className="h-3 w-3" /> EMPAQUETAR
                    </button>
                  </div>
                )}

                {o.status === "empaquetado" && (
                  <button
                    onClick={() => handleShip(o)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2.5 text-[11px] font-black text-white"
                  >
                    <Send className="h-3 w-3" /> ENVIAR AL CLIENTE
                  </button>
                )}
              </div>
            );
          })}
        </main>
      </div>

      {/* Modal confirmación reimprimir */}
      {confirmReprintId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-display text-lg">¿Reimprimir?</p>
            </div>
            <p className="mt-2 text-xs text-neutral-300">
              Este pedido ya fue impreso. Reimprimirlo va a usar material nuevo y volver a poner el pedido en cola.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmReprintId(null)}
                className="flex-1 rounded-xl bg-neutral-800 py-3 text-xs font-bold text-white"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const id = confirmReprintId;
                  setConfirmReprintId(null);
                  try {
                    await transitionStatus(id, "impreso", "pago_confirmado", { progress: 0 });
                    toast.success("Reenviado a la cola");
                  } catch { toast.error("Error"); }
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-black text-white"
              >
                Sí, reimprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Counter({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl bg-neutral-900 p-3">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${accent}`} />
        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      </div>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

function ding() {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.start(); o.stop(ctx.currentTime + 0.4);
  } catch { /* ignore */ }
}
