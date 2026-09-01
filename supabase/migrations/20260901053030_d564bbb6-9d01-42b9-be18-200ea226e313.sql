ALTER TABLE public.artworks
  ADD COLUMN IF NOT EXISTS precio_original numeric,
  ADD COLUMN IF NOT EXISTS original_vendido boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS impresiones jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS precio_marco numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS precio_marco_magnetico numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS moneda text NOT NULL DEFAULT 'USD';