
-- Permitir lectura pública para que el panel admin (gateado por PIN) pueda
-- ver pedidos y personalizaciones sin necesidad de sesión Supabase.
DROP POLICY IF EXISTS "Staff read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff read customizations" ON public.customizations;
CREATE POLICY "Public read customizations" ON public.customizations FOR SELECT USING (true);

-- Permitir update público de orders (estados de producción/empaquetado)
DROP POLICY IF EXISTS "Staff update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
