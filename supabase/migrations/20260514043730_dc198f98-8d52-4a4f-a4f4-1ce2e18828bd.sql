
-- Enum para estados
CREATE TYPE public.order_status AS ENUM (
  'pago_confirmado',
  'enviando_maquina',
  'imprimiendo',
  'impreso',
  'empaquetado',
  'enviado',
  'entregado'
);

-- Tabla orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_emoji TEXT,
  product_gradient TEXT,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  cost NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  status public.order_status NOT NULL DEFAULT 'pago_confirmado',
  progress INTEGER NOT NULL DEFAULT 0,
  printed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  tracking_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Customizations
CREATE TABLE public.customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  text TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#000000',
  font TEXT NOT NULL DEFAULT 'Bebas Neue',
  size INTEGER NOT NULL DEFAULT 48,
  rotation_deg INTEGER NOT NULL DEFAULT 0,
  pos_x INTEGER NOT NULL DEFAULT 100,
  pos_y INTEGER NOT NULL DEFAULT 100,
  svg_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_customizations_order ON public.customizations(order_id);

-- Historial de estados
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  from_status public.order_status,
  to_status public.order_status NOT NULL,
  changed_by TEXT NOT NULL DEFAULT 'admin',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_history_order ON public.order_status_history(order_id, changed_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-log status changes
CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_history (order_id, from_status, to_status)
    VALUES (NEW.id, OLD.status, NEW.status);
    IF NEW.status = 'impreso' AND NEW.printed_at IS NULL THEN
      NEW.printed_at = now();
    END IF;
    IF NEW.status = 'enviado' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at = now();
    END IF;
    IF NEW.status = 'entregado' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at = now();
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_orders_log_status
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_status_change();

-- RLS (acceso público, gate por PIN en cliente)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_all_select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_all_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_all_update" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "orders_all_delete" ON public.orders FOR DELETE USING (true);

CREATE POLICY "cust_all_select" ON public.customizations FOR SELECT USING (true);
CREATE POLICY "cust_all_insert" ON public.customizations FOR INSERT WITH CHECK (true);
CREATE POLICY "cust_all_update" ON public.customizations FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "hist_all_select" ON public.order_status_history FOR SELECT USING (true);
CREATE POLICY "hist_all_insert" ON public.order_status_history FOR INSERT WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customizations;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('production-files', 'production-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "prod_files_read" ON storage.objects FOR SELECT
USING (bucket_id = 'production-files');
CREATE POLICY "prod_files_insert" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'production-files');
CREATE POLICY "prod_files_update" ON storage.objects FOR UPDATE
USING (bucket_id = 'production-files');
