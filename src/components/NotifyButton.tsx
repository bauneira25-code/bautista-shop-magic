import { useEffect, useState } from "react";
import { Bell, BellRing, Check } from "lucide-react";
import { toast } from "sonner";

type Permission = "default" | "granted" | "denied" | "unsupported";

function getPermission(): Permission {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as Permission;
}

export function NotifyButton({ className = "" }: { className?: string }) {
  const [perm, setPerm] = useState<Permission>("default");

  useEffect(() => {
    setPerm(getPermission());
  }, []);

  const enable = async () => {
    if (perm === "unsupported") {
      toast.error("Tu navegador no soporta notificaciones");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPerm(result as Permission);
      if (result === "granted") {
        toast.success("✅ Notificaciones activadas");
        new Notification("NEIBA", { body: "Te avisaremos cuando cierre tu grupo 🎉" });
      } else if (result === "denied") {
        toast.error("Permiso denegado. Activalo desde la configuración del navegador.");
      }
    } catch {
      toast.error("No pudimos activar las notificaciones");
    }
  };

  if (perm === "granted") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success ${className}`}>
        <Check className="h-3 w-3" /> Notificaciones activas
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={enable}
      className={`inline-flex items-center gap-1 rounded-full bg-[#e8451c] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm active:scale-95 ${className}`}
    >
      {perm === "denied" ? <BellRing className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
      Activar notificaciones
    </button>
  );
}
