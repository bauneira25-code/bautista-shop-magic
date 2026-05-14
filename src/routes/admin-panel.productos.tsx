import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/productos")({
  component: () => <ComingSoon icon={Package} title="Productos" description="Catálogo, variantes, stock y opciones de personalización" features={["Crear, editar, activar productos","Subir imágenes y variantes","Tipo de personalización (láser, DTF, sublimación, UV, bordado)","Costo, peso, proveedor, tiempo estimado"]} />,
});
