import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/configuracion")({
  component: () => <ComingSoon icon={Settings} title="Configuración" description="Métodos de pago, envío, mensajes y categorías" features={["Métodos de pago y envío","Categorías de productos","Costos de personalización","Mensajes de WhatsApp y emails automáticos"]} />,
});
