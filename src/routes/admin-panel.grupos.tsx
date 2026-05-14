import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/grupos")({
  component: () => <ComingSoon icon={Layers} title="Compras grupales" description="Administrar grupos activos, cierres y conversiones" features={["Crear y cerrar grupos","Extender tiempo / cancelar","Convertir grupo en pedidos","Métricas por grupo"]} />,
});
