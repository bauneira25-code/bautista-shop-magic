import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "operations" | "production" | "support" | "finance";

export interface AdminProfile {
  user: User;
  roles: AppRole[];
  fullName: string | null;
}

export function useAdminAuth() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async (user: User | null) => {
      if (!user) {
        if (!cancelled) { setProfile(null); setLoading(false); }
        return;
      }
      // Defer DB calls to avoid deadlock inside auth callback
      setTimeout(async () => {
        const [{ data: roles }, { data: prof }] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", user.id),
          supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        ]);
        if (cancelled) return;
        setProfile({
          user,
          roles: (roles ?? []).map((r) => r.role as AppRole),
          fullName: prof?.full_name ?? null,
        });
        setLoading(false);
      }, 0);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const hasRole = (r: AppRole) => profile?.roles.includes(r) ?? false;
  const hasAnyRole = () => (profile?.roles.length ?? 0) > 0;

  return { profile, loading, hasRole, hasAnyRole };
}
