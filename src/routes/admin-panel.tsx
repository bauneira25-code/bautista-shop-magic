import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar, AdminMobileBar } from "@/components/admin/Sidebar";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin-panel")({
  head: () => ({ meta: [{ title: "Admin OS — NEIBA" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const { profile, loading, hasAnyRole } = useAdminAuth();

  useEffect(() => {
    if (!loading && !profile) nav({ to: "/admin-login" });
  }, [loading, profile, nav]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-white">
        <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!hasAnyRole()) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-white px-4 text-center">
        <div className="max-w-md">
          <ShieldAlert className="h-10 w-10 text-orange-400 mx-auto mb-3" />
          <h1 className="font-display text-2xl">Cuenta sin rol asignado</h1>
          <p className="mt-2 text-sm text-white/60">
            Tu cuenta <span className="text-white">{profile.user.email}</span> no tiene acceso al panel.
            Pedile a un admin que te asigne un rol y volvé a entrar.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); nav({ to: "/admin-login" }); }}
            className="mt-5 rounded-xl border border-white/10 px-5 py-2 text-sm hover:bg-white/5"
          >Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex bg-neutral-950 text-white">
      <AdminSidebar profile={profile} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminMobileBar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
