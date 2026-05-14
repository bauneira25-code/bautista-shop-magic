import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/stock")({
  component: () => <ComingSoon icon={Boxes} title="Stock" description="Inventario, alertas y movimientos" features={["SKU, stock actual, reservado, mínimo","Alertas automáticas de stock bajo","Ingresos y salidas","Ajustes manuales con motivo"]} />,
});
