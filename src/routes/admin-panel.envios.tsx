import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/envios")({
  component: () => <ComingSoon icon={Truck} title="Envíos" description="Etiquetas, tracking y entregas" features={["Generar etiquetas","Cargar tracking","Marcar enviado / entregado","Empresas de envío configurables"]} />,
});
