import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/empleados")({
  component: () => <ComingSoon icon={UserCog} title="Empleados" description="Roles, permisos y registro de actividad" features={["Crear / editar empleados","Asignar roles","Registro de acciones (audit log)","Activar / desactivar acceso"]} />,
});
