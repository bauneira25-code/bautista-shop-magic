import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/calidad")({
  component: () => <ComingSoon icon={ShieldCheck} title="Control de calidad" description="Checklist de aprobación de cada producto antes de empaquetar" features={["Checklist de 7 puntos por producto","Aprobar / rehacer / reportar","Foto del producto final visible","Historial de QC por empleado"]} />,
});
