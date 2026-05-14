
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_customized boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.mark_order_customized()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.order_id IS NOT NULL THEN
    UPDATE public.orders SET is_customized = true WHERE id = NEW.order_id;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_mark_order_customized ON public.customizations;
CREATE TRIGGER trg_mark_order_customized
AFTER INSERT ON public.customizations
FOR EACH ROW EXECUTE FUNCTION public.mark_order_customized();

UPDATE public.orders SET is_customized = true
WHERE id IN (SELECT order_id FROM public.customizations WHERE order_id IS NOT NULL);
