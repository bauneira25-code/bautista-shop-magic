import { createFileRoute } from "@tanstack/react-router";
import { Users2 } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/clientes")({
  component: () => <ComingSoon icon={Users2} title="Clientes" description="Base de clientes con historial y estadísticas" features={["Tabla con compras, total gastado, reclamos","Detalle por cliente","Notas internas","Devoluciones e historial completo"]} />,
});
