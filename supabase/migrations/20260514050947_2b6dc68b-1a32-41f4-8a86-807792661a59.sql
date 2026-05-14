
-- 1. Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'operations', 'production', 'support', 'finance');

-- 2. user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role() security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. has_any_role() helper
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

-- RLS for user_roles
CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles readable by staff" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.has_any_role(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Extend order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pedido_creado';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pago_pendiente';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pendiente_personalizacion';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'diseno_aprobado';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'cola_produccion';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'en_produccion';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'personalizado_terminado';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'control_calidad';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'listo_empaquetar';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'rehacer';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'cancelado';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'reembolsado';

-- 7. Extend orders columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS final_photo_url text,
  ADD COLUMN IF NOT EXISTS internal_notes text;

ALTER TABLE public.order_status_history
  ADD COLUMN IF NOT EXISTS changed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 8. Tighten RLS — staff only (drop old "true" public policies)
DROP POLICY IF EXISTS orders_all_select ON public.orders;
DROP POLICY IF EXISTS orders_all_insert ON public.orders;
DROP POLICY IF EXISTS orders_all_update ON public.orders;
DROP POLICY IF EXISTS orders_all_delete ON public.orders;
DROP POLICY IF EXISTS cust_all_select ON public.customizations;
DROP POLICY IF EXISTS cust_all_insert ON public.customizations;
DROP POLICY IF EXISTS cust_all_update ON public.customizations;
DROP POLICY IF EXISTS hist_all_select ON public.order_status_history;
DROP POLICY IF EXISTS hist_all_insert ON public.order_status_history;

-- Customers can create their own orders/customizations (no auth required for now to keep checkout flow working)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read orders" ON public.orders
  FOR SELECT USING (public.has_any_role(auth.uid()));
CREATE POLICY "Staff update orders" ON public.orders
  FOR UPDATE USING (public.has_any_role(auth.uid()))
  WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Admins delete orders" ON public.orders
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create customizations" ON public.customizations
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read customizations" ON public.customizations
  FOR SELECT USING (public.has_any_role(auth.uid()));
CREATE POLICY "Staff update customizations" ON public.customizations
  FOR UPDATE USING (public.has_any_role(auth.uid()))
  WITH CHECK (public.has_any_role(auth.uid()));

CREATE POLICY "Staff read history" ON public.order_status_history
  FOR SELECT USING (public.has_any_role(auth.uid()));
CREATE POLICY "Staff insert history" ON public.order_status_history
  FOR INSERT WITH CHECK (public.has_any_role(auth.uid()));

-- 9. Storage bucket for QC photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('qc-photos', 'qc-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "QC photos public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'qc-photos');
CREATE POLICY "Staff upload QC photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'qc-photos' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff update QC photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'qc-photos' AND public.has_any_role(auth.uid()));
