import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin-panel/pagos")({
  component: () => <ComingSoon icon={CreditCard} title="Pagos" description="Comprobantes, estados y conciliación" features={["Tabla de pagos con estado","Mercado Pago, transferencia, tarjeta","Comprobantes adjuntos","Reembolsos"]} />,
});
