import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/reclamos")({
  component: () => <ComingSoon icon={AlertTriangle} title="Reclamos" description="Atención al cliente y resolución de incidencias" features={["Tipos: error, rotura, demora, envío, devolución","Estados: abierto, revisión, resuelto, rechazado","Asignar a empleado","Historial por reclamo"]} />,
});
