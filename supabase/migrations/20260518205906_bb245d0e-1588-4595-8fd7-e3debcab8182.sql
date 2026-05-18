
-- 1. Enums
DO $$ BEGIN
  CREATE TYPE public.product_category AS ENUM ('tecnologia','electrodomesticos','hogar','joyeria','moda','tech','electronica','gym','belleza');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.customization_kind AS ENUM ('laser','uv','sublimacion','bordado','estampado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.camera_machine AS ENUM ('laser','uv','sublimacion','empaquetado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add new order_status values for the operator workflow
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'picking';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'en_personalizacion';

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  price_individual numeric NOT NULL DEFAULT 0,
  price_wholesale numeric NOT NULL DEFAULT 0,
  category public.product_category NOT NULL DEFAULT 'tech',
  is_customizable boolean NOT NULL DEFAULT false,
  customization_type public.customization_kind,
  stock integer NOT NULL DEFAULT 0,
  location text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  badges text[] NOT NULL DEFAULT '{}',
  emoji text DEFAULT '✨',
  gradient text DEFAULT 'linear-gradient(135deg,#ff6b35,#ffa07a)',
  cover_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff insert products" ON public.products FOR INSERT WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Staff update products" ON public.products FOR UPDATE USING (public.has_any_role(auth.uid())) WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Product media
CREATE TABLE IF NOT EXISTS public.product_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_media" ON public.product_media FOR SELECT USING (true);
CREATE POLICY "Staff insert product_media" ON public.product_media FOR INSERT WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Staff update product_media" ON public.product_media FOR UPDATE USING (public.has_any_role(auth.uid())) WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Staff delete product_media" ON public.product_media FOR DELETE USING (public.has_any_role(auth.uid()));

-- 4. Live cameras
CREATE TABLE IF NOT EXISTS public.live_cameras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  machine public.camera_machine NOT NULL DEFAULT 'laser',
  video_url text,
  thumbnail_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.live_cameras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read live_cameras" ON public.live_cameras FOR SELECT USING (true);
CREATE POLICY "Staff insert live_cameras" ON public.live_cameras FOR INSERT WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Staff update live_cameras" ON public.live_cameras FOR UPDATE USING (public.has_any_role(auth.uid())) WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Staff delete live_cameras" ON public.live_cameras FOR DELETE USING (public.has_any_role(auth.uid()));
CREATE TRIGGER live_cameras_touch BEFORE UPDATE ON public.live_cameras FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. Orders: production timestamps + video
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_started_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_finished_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_video_url text;

-- 6. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media','product-media',true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('live-videos','live-videos',true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read product-media" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');
CREATE POLICY "Staff write product-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-media' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff update product-media" ON storage.objects FOR UPDATE USING (bucket_id = 'product-media' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff delete product-media" ON storage.objects FOR DELETE USING (bucket_id = 'product-media' AND public.has_any_role(auth.uid()));

CREATE POLICY "Public read live-videos" ON storage.objects FOR SELECT USING (bucket_id = 'live-videos');
CREATE POLICY "Staff write live-videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'live-videos' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff update live-videos" ON storage.objects FOR UPDATE USING (bucket_id = 'live-videos' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff delete live-videos" ON storage.objects FOR DELETE USING (bucket_id = 'live-videos' AND public.has_any_role(auth.uid()));

-- Make production-files writable by staff too (already public)
CREATE POLICY "Staff write production-files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'production-files' AND public.has_any_role(auth.uid()));
CREATE POLICY "Staff update production-files" ON storage.objects FOR UPDATE USING (bucket_id = 'production-files' AND public.has_any_role(auth.uid()));

-- 7. Seed live_cameras with the 3 default machines
INSERT INTO public.live_cameras (name, machine, is_active, sort_order) VALUES
  ('Láser Premium','laser',true,1),
  ('Impresión UV','uv',true,2),
  ('Sublimación','sublimacion',true,3)
ON CONFLICT DO NOTHING;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_media;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_cameras;
